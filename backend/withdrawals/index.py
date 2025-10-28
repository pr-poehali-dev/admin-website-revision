'''
Business: API for managing withdrawal requests - list, approve, reject
Args: event - dict with httpMethod, body, queryStringParameters
      context - object with attributes: request_id, function_name
Returns: HTTP response dict with withdrawals data or operation result
'''
import json
import os
from typing import Dict, Any, List
import psycopg2
from psycopg2.extras import RealDictCursor
import jwt

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
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
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
        status_filter = params.get('status', 'all')
        
        conn = psycopg2.connect(database_url)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if status_filter == 'all':
            cur.execute("""
                SELECT w.id, w.amount, w.status, w.method, w.payment_details, 
                       w.created_at, w.notes, w.processed_at,
                       u.name as user_name, u.email as user_email
                FROM withdrawals w
                JOIN users u ON w.user_id = u.id
                ORDER BY w.created_at DESC
            """)
        else:
            cur.execute("""
                SELECT w.id, w.amount, w.status, w.method, w.payment_details,
                       w.created_at, w.notes, w.processed_at,
                       u.name as user_name, u.email as user_email
                FROM withdrawals w
                JOIN users u ON w.user_id = u.id
                WHERE w.status = %s
                ORDER BY w.created_at DESC
            """, (status_filter,))
        
        withdrawals = cur.fetchall()
        
        result = []
        for w in withdrawals:
            result.append({
                'id': w['id'],
                'user': w['user_name'],
                'email': w['user_email'],
                'amount': float(w['amount']),
                'status': w['status'],
                'method': w['method'],
                'paymentDetails': w['payment_details'],
                'date': w['created_at'].strftime('%Y-%m-%d'),
                'notes': w['notes'],
                'processedAt': w['processed_at'].strftime('%Y-%m-%d %H:%M') if w['processed_at'] else None
            })
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'withdrawals': result})
        }
    
    if method == 'PUT':
        body_data = json.loads(event.get('body', '{}'))
        withdrawal_id = body_data.get('id')
        new_status = body_data.get('status')
        notes = body_data.get('notes', '')
        
        if not withdrawal_id or not new_status:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Missing required fields'})
            }
        
        if new_status not in ['pending', 'approved', 'rejected']:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Invalid status'})
            }
        
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        
        cur.execute("""
            UPDATE withdrawals 
            SET status = %s, 
                notes = %s,
                processed_at = CURRENT_TIMESTAMP,
                processed_by = %s,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
        """, (new_status, notes, token_check['user_id'], withdrawal_id))
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'success': True, 'message': 'Withdrawal updated'})
        }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Method not allowed'})
    }
