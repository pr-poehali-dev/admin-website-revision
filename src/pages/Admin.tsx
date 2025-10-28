import { useState } from 'react';
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

const Admin = () => {
  const [withdrawals, setWithdrawals] = useState([
    { id: 1, user: 'Иван Петров', amount: 5000, status: 'pending', date: '2025-10-28', email: 'ivan@example.com', method: 'Карта' },
    { id: 2, user: 'Мария Сидорова', amount: 12000, status: 'pending', date: '2025-10-27', email: 'maria@example.com', method: 'QIWI' },
    { id: 3, user: 'Алексей Иванов', amount: 3500, status: 'approved', date: '2025-10-26', email: 'alex@example.com', method: 'ЮMoney' },
  ]);

  const statsData = [
    { month: 'Июнь', withdrawals: 45, revenue: 125000 },
    { month: 'Июль', withdrawals: 52, revenue: 148000 },
    { month: 'Август', withdrawals: 61, revenue: 167000 },
    { month: 'Сентябрь', withdrawals: 58, revenue: 159000 },
    { month: 'Октябрь', withdrawals: 69, revenue: 189000 },
  ];

  const handleApprove = (id: number) => {
    setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: 'approved' } : w));
  };

  const handleReject = (id: number) => {
    setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: 'rejected' } : w));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Ожидает</Badge>;
      case 'approved': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Одобрено</Badge>;
      case 'rejected': return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Отклонено</Badge>;
      default: return null;
    }
  };

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
            <Button variant="outline" size="sm">
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
            <TabsTrigger value="users" className="gap-2">
              <Icon name="Users" size={16} />
              Пользователи
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
                  <CardDescription>Всего пользователей</CardDescription>
                  <CardTitle className="text-3xl font-bold">1,247</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Icon name="TrendingUp" size={16} />
                    <span>+12% за месяц</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Заявки на вывод</CardDescription>
                  <CardTitle className="text-3xl font-bold">23</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-yellow-600">
                    <Icon name="Clock" size={16} />
                    <span>Ожидают обработки</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Выведено средств</CardDescription>
                  <CardTitle className="text-3xl font-bold">₽189K</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Icon name="TrendingUp" size={16} />
                    <span>+8% за месяц</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Активных операций</CardDescription>
                  <CardTitle className="text-3xl font-bold">69</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Icon name="Activity" size={16} />
                    <span>За октябрь</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Динамика выводов</CardTitle>
                  <CardDescription>Количество заявок по месяцам</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={statsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                      <Line type="monotone" dataKey="withdrawals" stroke="#0ea5e9" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Общий объем выводов</CardTitle>
                  <CardDescription>В рублях по месяцам</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={statsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                      <Bar dataKey="revenue" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="withdrawals">
            <Card>
              <CardHeader>
                <CardTitle>Заявки на вывод средств</CardTitle>
                <CardDescription>Обработайте запросы пользователей на вывод денежных средств</CardDescription>
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
                                onClick={() => handleApprove(withdrawal.id)}
                              >
                                <Icon name="Check" size={16} className="mr-1" />
                                Одобрить
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => handleReject(withdrawal.id)}
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

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Управление пользователями</CardTitle>
                <CardDescription>Просмотр и управление аккаунтами пользователей</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-slate-500">
                  <Icon name="Users" size={48} className="mx-auto mb-4 text-slate-300" />
                  <p>Модуль управления пользователями</p>
                </div>
              </CardContent>
            </Card>
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
                        <div className="space-y-2">
                          <Label htmlFor="cta-text">Текст кнопки</Label>
                          <Input id="cta-text" placeholder="Например: Начать сейчас" />
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
                        <div className="space-y-2">
                          <Label htmlFor="keywords">Ключевые слова</Label>
                          <Input id="keywords" placeholder="слово1, слово2, слово3" />
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
