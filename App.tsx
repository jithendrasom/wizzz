import React, { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { SchedulePickup } from './components/SchedulePickup';
import { OrderHistory } from './components/OrderHistory';
import { LaundryAssistant } from './components/LaundryAssistant';
import { User, ViewState, Order } from './types';
import { MockAPI } from './services/mockBackend';
import { LayoutDashboard, History, Sparkles, LogOut, Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewState>('DASHBOARD');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load initial data if logged in
  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    const data = await MockAPI.getOrders();
    setOrders(data);
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setView('DASHBOARD');
  };

  const handleLogout = () => {
    setUser(null);
    setOrders([]);
    setView('DASHBOARD');
  };

  const NavItem = ({ target, icon: Icon, label }: { target: ViewState; icon: any; label: string }) => (
    <button
      onClick={() => {
        setView(target);
        setIsSidebarOpen(false);
      }}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        view === target 
          ? 'bg-indigo-50 text-indigo-600 font-medium' 
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-slate-200 z-30 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-lg">WL</span>
            Wizzzz Laundry
          </h1>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-500">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="p-4 space-y-2">
          <NavItem target="DASHBOARD" icon={LayoutDashboard} label="Dashboard" />
          <NavItem target="HISTORY" icon={History} label="My Orders" />
          <NavItem target="ASSISTANT" icon={Sparkles} label="Laundry AI" />
        </nav>

        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0">
        <header className="bg-white border-b border-slate-200 p-4 md:hidden flex justify-between items-center sticky top-0 z-10">
          <h1 className="font-bold text-slate-900">Wizzzz Laundry</h1>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600">
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <div className="p-4 md:p-8 max-w-5xl mx-auto">
          {view === 'DASHBOARD' && (
            <Dashboard 
              user={user} 
              orders={orders} 
              onChangeView={setView} 
            />
          )}
          
          {view === 'SCHEDULE' && (
            <SchedulePickup 
              onCancel={() => setView('DASHBOARD')}
              onSuccess={() => {
                loadOrders();
                setView('HISTORY');
              }}
            />
          )}
          
          {view === 'HISTORY' && (
            <OrderHistory 
              orders={orders} 
              onRefresh={loadOrders} 
            />
          )}
          
          {view === 'ASSISTANT' && (
            <div className="space-y-4">
               <h2 className="text-2xl font-bold text-slate-900">Laundry Assistant</h2>
               <p className="text-slate-500">Ask Suds regarding stain removal, fabric care, or washing instructions.</p>
               <LaundryAssistant />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;