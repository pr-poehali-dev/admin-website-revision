import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useToast } from '@/hooks/use-toast';

const WITHDRAWALS_API = 'https://functions.poehali.dev/07adb59e-e0e5-4f80-99f6-ac78adc5fac3';
const ANALYTICS_API = 'https://functions.poehali.dev/484f6806-a14d-47d2-8f7d-e231df22b685';

interface Withdrawal {
  id: number;
  user: string;
  email: string;
  amount: number;
  status: string;
  method: string;
  paymentDetails: string;
  date: string;
  notes?: string;
}

interface Analytics {
  stats: {
    totalWithdrawals: number;
    pendingCount: number;
    approvedCount: number;
    rejectedCount: number;
    totalAmount: number;
    approvedAmount: number;
    avgAmount: number;
  };
  monthly: Array<{ month: string; count: number; total: number }>;
  byMethod: Array<{ method: string; count: number; total: number }>;
  topUsers: Array<{ name: string; email: string; withdrawalCount: number; totalAmount: number }>;
}

const Admin = () => {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [exportingExcel, setExportingExcel] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const getAuthToken = () => localStorage.getItem('authToken');

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      navigate('/login');
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      setLoading(true);
      
      const [withdrawalsRes, analyticsRes] = await Promise.all([
        fetch(WITHDRAWALS_API, {
          headers: { 'X-Auth-Token': token }
        }),
        fetch(ANALYTICS_API, {
          headers: { 'X-Auth-Token': token }
        })
      ]);

      if (withdrawalsRes.ok) {
        const data = await withdrawalsRes.json();
        setWithdrawals(data.withdrawals);
      }

      if (analyticsRes.ok) {
        const data = await analyticsRes.json();
        setAnalytics(data);
      }
    } catch (error) {
      toast({
        title: 'Ошибка загрузки',
        description: 'Не удалось загрузить данные',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, status: string) => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await fetch(WITHDRAWALS_API, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token,
        },
        body: JSON.stringify({ id, status }),
      });

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: `Заявка ${status === 'approved' ? 'одобрена' : 'отклонена'}`,
        });
        loadData();
      } else {
        toast({
          title: 'Ошибка',
          description: 'Не удалось обновить статус',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка сети',
        description: 'Не удалось подключиться к серверу',
        variant: 'destructive',
      });
    }
  };

  const handleExportExcel = async () => {
    const token = getAuthToken();
    if (!token) return;

    setExportingExcel(true);
    try {
      const response = await fetch(`${ANALYTICS_API}?format=excel`, {
        headers: { 'X-Auth-Token': token }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
          title: 'Успешно',
          description: 'Отчет экспортирован в Excel',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка экспорта',
        description: 'Не удалось экспортировать данные',
        variant: 'destructive',
      });
    } finally {
      setExportingExcel(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Ожидает</Badge>;
      case 'approved': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Одобрено</Badge>;
      case 'rejected': return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Отклонено</Badge>;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Icon name="Loader2" className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <Icon name="LayoutDashboard" className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">Панель управления</h1>
                <p className="text-sm text-slate-500">Управление сайтом и заявками</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <Icon name="LogOut" size={16} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="bg-white border">
            <TabsTrigger value="dashboard" className="gap-2">
              <Icon name="BarChart3" size={16} />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="withdrawals" className="gap-2">
              <Icon name="Wallet" size={16} />
              Заявки на вывод
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <Icon name="LineChart" size={16} />
              Аналитика
            </TabsTrigger>
            <TabsTrigger value="builder" className="gap-2">
              <Icon name="Wrench" size={16} />
              Конструктор
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Всего заявок</CardDescription>
                  <CardTitle className="text-3xl font-bold">
                    {analytics?.stats.totalWithdrawals || 0}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Icon name="FileText" size={16} />
                    <span>За все время</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Ожидают обработки</CardDescription>
                  <CardTitle className="text-3xl font-bold text-yellow-600">
                    {analytics?.stats.pendingCount || 0}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-yellow-600">
                    <Icon name="Clock" size={16} />
                    <span>Требуют действий</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Одобрено заявок</CardDescription>
                  <CardTitle className="text-3xl font-bold text-green-600">
                    {analytics?.stats.approvedCount || 0}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Icon name="CheckCircle2" size={16} />
                    <span>Успешно выведено</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Общая сумма выводов</CardDescription>
                  <CardTitle className="text-3xl font-bold">
                    ₽{(analytics?.stats.approvedAmount || 0).toLocaleString()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Icon name="TrendingUp" size={16} />
                    <span>Одобренные выплаты</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {analytics && analytics.monthly.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Динамика заявок по месяцам</CardTitle>
                  <CardDescription>Количество и объем выводов</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics.monthly}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                      <Line type="monotone" dataKey="count" stroke="#0ea5e9" strokeWidth={2} name="Количество" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="withdrawals">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Заявки на вывод средств</CardTitle>
                    <CardDescription>Обработайте запросы пользователей</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={loadData}>
                    <Icon name="RefreshCw" size={16} className="mr-2" />
                    Обновить
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Пользователь</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Сумма</TableHead>
                      <TableHead>Метод</TableHead>
                      <TableHead>Дата</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {withdrawals.map((withdrawal) => (
                      <TableRow key={withdrawal.id}>
                        <TableCell className="font-medium">{withdrawal.user}</TableCell>
                        <TableCell className="text-slate-600">{withdrawal.email}</TableCell>
                        <TableCell className="font-semibold">₽{withdrawal.amount.toLocaleString()}</TableCell>
                        <TableCell>{withdrawal.method}</TableCell>
                        <TableCell className="text-slate-600">{withdrawal.date}</TableCell>
                        <TableCell>{getStatusBadge(withdrawal.status)}</TableCell>
                        <TableCell className="text-right">
                          {withdrawal.status === 'pending' && (
                            <div className="flex gap-2 justify-end">
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-green-600 border-green-200 hover:bg-green-50"
                                onClick={() => handleStatusUpdate(withdrawal.id, 'approved')}
                              >
                                <Icon name="Check" size={16} className="mr-1" />
                                Одобрить
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => handleStatusUpdate(withdrawal.id, 'rejected')}
                              >
                                <Icon name="X" size={16} className="mr-1" />
                                Отклонить
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Детальная аналитика</CardTitle>
                      <CardDescription>Расширенные отчеты и статистика</CardDescription>
                    </div>
                    <Button onClick={handleExportExcel} disabled={exportingExcel}>
                      {exportingExcel ? (
                        <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                      ) : (
                        <Icon name="Download" size={16} className="mr-2" />
                      )}
                      Экспорт в Excel
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {analytics && (
                    <>
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Топ пользователей по объему выводов</h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Имя</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Заявок</TableHead>
                              <TableHead>Сумма</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {analytics.topUsers.map((user, idx) => (
                              <TableRow key={idx}>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.withdrawalCount}</TableCell>
                                <TableCell className="font-semibold">₽{user.totalAmount.toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {analytics.byMethod.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Распределение по методам вывода</h3>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analytics.byMethod}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                              <XAxis dataKey="method" stroke="#64748b" fontSize={12} />
                              <YAxis stroke="#64748b" fontSize={12} />
                              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                              <Bar dataKey="total" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="builder">
            <Card>
              <CardHeader>
                <CardTitle>Конструктор страниц</CardTitle>
                <CardDescription>Редактируйте контент и структуру вашего сайта</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 border-dashed">
                        <CardHeader className="text-center">
                          <Icon name="FileText" size={48} className="mx-auto mb-3 text-blue-600" />
                          <CardTitle className="text-lg">Главная страница</CardTitle>
                          <CardDescription>Редактировать hero, блоки, контент</CardDescription>
                        </CardHeader>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Редактирование главной страницы</DialogTitle>
                        <DialogDescription>Измените заголовки, тексты и описания</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="hero-title">Заголовок Hero</Label>
                          <Input id="hero-title" placeholder="Введите заголовок" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="hero-desc">Описание Hero</Label>
                          <Textarea id="hero-desc" placeholder="Введите описание" rows={4} />
                        </div>
                        <Button className="w-full">
                          <Icon name="Save" size={16} className="mr-2" />
                          Сохранить изменения
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 border-dashed">
                        <CardHeader className="text-center">
                          <Icon name="Settings" size={48} className="mx-auto mb-3 text-slate-600" />
                          <CardTitle className="text-lg">Настройки сайта</CardTitle>
                          <CardDescription>SEO, мета-теги, конфигурация</CardDescription>
                        </CardHeader>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Настройки сайта</DialogTitle>
                        <DialogDescription>Управление SEO и базовыми параметрами</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="site-title">Название сайта</Label>
                          <Input id="site-title" placeholder="Мой сайт" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="meta-desc">Meta описание</Label>
                          <Textarea id="meta-desc" placeholder="Описание для поисковых систем" rows={3} />
                        </div>
                        <Button className="w-full">
                          <Icon name="Save" size={16} className="mr-2" />
                          Сохранить настройки
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
