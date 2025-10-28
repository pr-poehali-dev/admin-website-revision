import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <Icon name="Wallet" className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">PayFlow</h1>
                <p className="text-xs text-slate-500">Платформа для выводов</p>
              </div>
            </div>
            <Button onClick={() => navigate('/login')} variant="outline">
              <Icon name="LogIn" size={16} className="mr-2" />
              Вход
            </Button>
          </div>
        </div>
      </header>

      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <Icon name="Zap" size={16} />
              Быстрые выплаты
            </div>
            <h2 className="text-5xl font-bold text-slate-900 mb-6">
              Управляйте выводами <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                проще и быстрее
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
              Современная платформа для обработки заявок на вывод средств с полной аналитикой и автоматизацией
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/login')} className="text-lg px-8">
                <Icon name="Rocket" size={20} className="mr-2" />
                Начать работу
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                <Icon name="Play" size={20} className="mr-2" />
                Демо
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 blur-3xl" />
            <Card className="relative border-2 shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-1">
                <div className="bg-white rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop" 
                    alt="Dashboard Preview" 
                    className="w-full rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">Возможности платформы</h3>
            <p className="text-lg text-slate-600">Все инструменты для эффективного управления</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Wallet" className="text-blue-600" size={24} />
                </div>
                <CardTitle>Управление заявками</CardTitle>
                <CardDescription>
                  Обрабатывайте заявки на вывод в несколько кликов. Одобрение, отклонение и история операций.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="BarChart3" className="text-green-600" size={24} />
                </div>
                <CardTitle>Детальная аналитика</CardTitle>
                <CardDescription>
                  Графики, статистика и отчеты по всем операциям. Отслеживайте динамику в реальном времени.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Download" className="text-purple-600" size={24} />
                </div>
                <CardTitle>Экспорт в Excel</CardTitle>
                <CardDescription>
                  Выгружайте полные отчеты в Excel для дальнейшего анализа и бухгалтерии.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Shield" className="text-red-600" size={24} />
                </div>
                <CardTitle>Безопасность</CardTitle>
                <CardDescription>
                  JWT-аутентификация, защищенные API и полное логирование всех действий.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Users" className="text-yellow-600" size={24} />
                </div>
                <CardTitle>База пользователей</CardTitle>
                <CardDescription>
                  Управляйте пользователями, просматривайте историю операций и баланс счетов.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Zap" className="text-cyan-600" size={24} />
                </div>
                <CardTitle>Быстродействие</CardTitle>
                <CardDescription>
                  Мгновенная загрузка данных, оптимизированные запросы и отзывчивый интерфейс.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">
                <Icon name="TrendingUp" size={16} />
                Статистика
              </div>
              <h3 className="text-4xl font-bold text-slate-900 mb-6">
                Полный контроль над финансами
              </h3>
              <p className="text-lg text-slate-600 mb-8">
                Отслеживайте все показатели: от общего объема выводов до средней суммы транзакции. 
                Визуализация данных помогает принимать правильные решения.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon name="Check" className="text-blue-600" size={20} />
                  </div>
                  <span className="text-slate-700 font-medium">Графики динамики по месяцам</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon name="Check" className="text-blue-600" size={20} />
                  </div>
                  <span className="text-slate-700 font-medium">Распределение по методам вывода</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon name="Check" className="text-blue-600" size={20} />
                  </div>
                  <span className="text-slate-700 font-medium">Топ пользователей по объему</span>
                </div>
              </div>
            </div>
            <div>
              <Card className="border-2 shadow-xl">
                <CardHeader>
                  <CardTitle>Основные показатели</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Icon name="TrendingUp" className="text-blue-600" size={24} />
                      <span className="font-medium text-slate-700">Всего выводов</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">1,247</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Icon name="DollarSign" className="text-green-600" size={24} />
                      <span className="font-medium text-slate-700">Выведено</span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">₽2.4M</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Icon name="Clock" className="text-yellow-600" size={24} />
                      <span className="font-medium text-slate-700">Ожидают</span>
                    </div>
                    <span className="text-2xl font-bold text-yellow-600">23</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-br from-blue-600 to-cyan-500">
        <div className="container mx-auto max-w-4xl text-center">
          <h3 className="text-4xl font-bold text-white mb-6">
            Готовы начать?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Войдите в систему и получите доступ ко всем возможностям платформы
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            className="text-lg px-8"
            onClick={() => navigate('/login')}
          >
            <Icon name="ArrowRight" size={20} className="mr-2" />
            Войти в систему
          </Button>
        </div>
      </section>

      <footer className="border-t bg-white py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Icon name="Wallet" className="text-white" size={16} />
                </div>
                <span className="font-bold text-slate-900">PayFlow</span>
              </div>
              <p className="text-sm text-slate-600">
                Современная платформа для управления выводами средств
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Продукт</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>Возможности</li>
                <li>Цены</li>
                <li>Безопасность</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Компания</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>О нас</li>
                <li>Блог</li>
                <li>Контакты</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Поддержка</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>Документация</li>
                <li>API</li>
                <li>Помощь</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-slate-600">
            © 2025 PayFlow. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
