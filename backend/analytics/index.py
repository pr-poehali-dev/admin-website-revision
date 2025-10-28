'''
Business: Analytics API with Excel export for withdrawal statistics
Args: event - dict with httpMethod, queryStringParameters
      context - object with attributes: request_id, function_name
Returns: HTTP response dict with analytics data or Excel file
'''
import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
import jwt
from datetime import datetime, timedelta
import base64
from io import BytesIO

def verify_token(token: str) -> Dict[str, Any]:
    secret_key = os.environ.get('JWT_SECRET', 'default-secret-key-change-in-production')
    try:
        decoded = jwt.decode(token, secret_key, algorithms=['HS256'])
        return {'valid': True, 'user_id': decoded['user_id']}
    except:
        return {'valid': False}

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    auth_token = event.get('headers', {}).get('X-Auth-Token', '')
    token_check = verify_token(auth_token)
    
    if not token_check['valid']:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Unauthorized'})
        }
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Database configuration error'})
        }
    
    if method == 'GET':
        params = event.get('queryStringParameters', {}) or {}
        export_format = params.get('format', 'json')
        
        conn = psycopg2.connect(database_url)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute("""
            SELECT 
                COUNT(*) as total_withdrawals,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_count,
                SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_count,
                SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected_count,
                SUM(amount) as total_amount,
                SUM(CASE WHEN status = 'approved' THEN amount ELSE 0 END) as approved_amount,
                AVG(amount) as avg_amount
            FROM withdrawals
        """)
        stats = cur.fetchone()
        
        cur.execute("""
            SELECT 
                TO_CHAR(created_at, 'YYYY-MM') as month,
                COUNT(*) as count,
                SUM(amount) as total
            FROM withdrawals
            WHERE created_at >= NOW() - INTERVAL '6 months'
            GROUP BY TO_CHAR(created_at, 'YYYY-MM')
            ORDER BY month DESC
        """)
        monthly = cur.fetchall()
        
        cur.execute("""
            SELECT 
                method,
                COUNT(*) as count,
                SUM(amount) as total
            FROM withdrawals
            GROUP BY method
            ORDER BY count DESC
        """)
        by_method = cur.fetchall()
        
        cur.execute("""
            SELECT 
                u.name,
                u.email,
                COUNT(w.id) as withdrawal_count,
                SUM(w.amount) as total_amount
            FROM users u
            LEFT JOIN withdrawals w ON u.id = w.user_id
            GROUP BY u.id, u.name, u.email
            ORDER BY total_amount DESC
            LIMIT 10
        """)
        top_users = cur.fetchall()
        
        cur.close()
        conn.close()
        
        result = {
            'stats': {
                'totalWithdrawals': stats['total_withdrawals'],
                'pendingCount': stats['pending_count'],
                'approvedCount': stats['approved_count'],
                'rejectedCount': stats['rejected_count'],
                'totalAmount': float(stats['total_amount']) if stats['total_amount'] else 0,
                'approvedAmount': float(stats['approved_amount']) if stats['approved_amount'] else 0,
                'avgAmount': float(stats['avg_amount']) if stats['avg_amount'] else 0
            },
            'monthly': [{'month': m['month'], 'count': m['count'], 'total': float(m['total'])} for m in monthly],
            'byMethod': [{'method': m['method'], 'count': m['count'], 'total': float(m['total'])} for m in by_method],
            'topUsers': [{'name': u['name'], 'email': u['email'], 'withdrawalCount': u['withdrawal_count'], 'totalAmount': float(u['total_amount']) if u['total_amount'] else 0} for u in top_users]
        }
        
        if export_format == 'excel':
            try:
                import xlsxwriter
                
                output = BytesIO()
                workbook = xlsxwriter.Workbook(output)
                
                stats_sheet = workbook.add_worksheet('Статистика')
                stats_sheet.write(0, 0, 'Показатель')
                stats_sheet.write(0, 1, 'Значение')
                stats_sheet.write(1, 0, 'Всего заявок')
                stats_sheet.write(1, 1, result['stats']['totalWithdrawals'])
                stats_sheet.write(2, 0, 'Ожидают')
                stats_sheet.write(2, 1, result['stats']['pendingCount'])
                stats_sheet.write(3, 0, 'Одобрено')
                stats_sheet.write(3, 1, result['stats']['approvedCount'])
                stats_sheet.write(4, 0, 'Отклонено')
                stats_sheet.write(4, 1, result['stats']['rejectedCount'])
                stats_sheet.write(5, 0, 'Общая сумма')
                stats_sheet.write(5, 1, result['stats']['totalAmount'])
                
                monthly_sheet = workbook.add_worksheet('По месяцам')
                monthly_sheet.write(0, 0, 'Месяц')
                monthly_sheet.write(0, 1, 'Количество')
                monthly_sheet.write(0, 2, 'Сумма')
                for i, m in enumerate(result['monthly'], 1):
                    monthly_sheet.write(i, 0, m['month'])
                    monthly_sheet.write(i, 1, m['count'])
                    monthly_sheet.write(i, 2, m['total'])
                
                users_sheet = workbook.add_worksheet('Топ пользователей')
                users_sheet.write(0, 0, 'Имя')
                users_sheet.write(0, 1, 'Email')
                users_sheet.write(0, 2, 'Заявок')
                users_sheet.write(0, 3, 'Сумма')
                for i, u in enumerate(result['topUsers'], 1):
                    users_sheet.write(i, 0, u['name'])
                    users_sheet.write(i, 1, u['email'])
                    users_sheet.write(i, 2, u['withdrawalCount'])
                    users_sheet.write(i, 3, u['totalAmount'])
                
                workbook.close()
                output.seek(0)
                excel_data = base64.b64encode(output.read()).decode('utf-8')
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        'Content-Disposition': f'attachment; filename="analytics_{datetime.now().strftime("%Y%m%d")}.xlsx"',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': True,
                    'body': excel_data
                }
            except ImportError:
                return {
                    'statusCode': 500,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Excel export not available'})
                }
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps(result)
        }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Method not allowed'})
    }
