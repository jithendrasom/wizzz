import React, { useState, useEffect } from 'react';
import { Order, OrderStatus, ViewState, User } from '../types';
import { Package, Truck, Clock, CalendarPlus, BellRing } from 'lucide-react';
import { Button } from './Button';
import { requestNotificationPermission } from '../services/notificationService';

interface DashboardProps {
  user: User;
  orders: Order[];
  onChangeView: (view: ViewState) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, orders, onChangeView }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationsEnabled(granted);
  };

  const activeOrders = orders.filter(o => 
    o.status !== OrderStatus.DELIVERED && o.status !== OrderStatus.CANCELLED
  );
  
  const recentOrders = orders.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Hello, {user.name}</h2>
          <p className="text-slate-500">Here's what's happening with your laundry.</p>
        </div>
        <Button onClick={() => onChangeView('SCHEDULE')}>
          <CalendarPlus className="w-4 h-4 mr-2" />
          Schedule Pickup
        </Button>
      </div>

      {!notificationsEnabled && (
        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600 shrink-0">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-indigo-900">Enable Notifications</h3>
              <p className="text-sm text-indigo-700">Get real-time updates when your laundry is picked up or delivered.</p>
            </div>
          </div>
          <Button onClick={handleEnableNotifications} variant="secondary" className="whitespace-nowrap bg-white">
            Enable Alerts
          </Button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Active Orders</p>
            <p className="text-2xl font-bold text-slate-900">{activeOrders.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-green-100 rounded-lg text-green-600">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Deliveries</p>
            <p className="text-2xl font-bold text-slate-900">
              {orders.filter(o => o.status === OrderStatus.DELIVERED).length}
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Saved Time</p>
            <p className="text-2xl font-bold text-slate-900">12 hrs</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-semibold text-slate-900">Recent Activity</h3>
          <button 
            onClick={() => onChangeView('HISTORY')}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            View All
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {recentOrders.length > 0 ? (
            recentOrders.map(order => (
              <div key={order.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-slate-900">{order.id}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-800' :
                        order.status === OrderStatus.PROCESSING ? 'bg-blue-100 text-blue-800' :
                        order.status === OrderStatus.CANCELLED ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">
                      {order.items.length} items • Total: ${order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900">
                      {order.status === OrderStatus.DELIVERED 
                        ? `Delivered on ${new Date(order.deliveryDate).toLocaleDateString()}`
                        : `Pickup: ${new Date(order.pickupDate).toLocaleDateString()}`
                      }
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500">
              No orders yet. Schedule your first pickup!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
