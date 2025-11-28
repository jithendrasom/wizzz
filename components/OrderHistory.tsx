import React from 'react';
import { Order, OrderStatus } from '../types';
import { Button } from './Button';
import { MockAPI } from '../services/mockBackend';
import { Archive, XCircle } from 'lucide-react';

interface OrderHistoryProps {
  orders: Order[];
  onRefresh: () => void;
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({ orders, onRefresh }) => {
  const handleCancel = async (orderId: string) => {
    if (confirm('Are you sure you want to cancel this order?')) {
      try {
        await MockAPI.cancelOrder(orderId);
        onRefresh();
      } catch (e: any) {
        alert(e);
      }
    }
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Archive className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900">No orders yet</h3>
        <p className="text-slate-500">Your order history will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Your Orders</h2>
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {orders.map((order) => {
            const canCancel = order.status === OrderStatus.PENDING || order.status === OrderStatus.SCHEDULED;
            
            return (
              <div key={order.id} className="p-6">
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-lg text-slate-900">{order.id}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide ${
                        order.status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-800' :
                        order.status === OrderStatus.PROCESSING ? 'bg-blue-100 text-blue-800' :
                        order.status === OrderStatus.CANCELLED ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-sm text-slate-500 space-y-1">
                      <p>Created: {new Date(order.createdAt).toLocaleDateString()}</p>
                      <p>Pickup: {new Date(order.pickupDate).toLocaleString()}</p>
                      <p>Delivery: {new Date(order.deliveryDate).toLocaleString()}</p>
                    </div>
                    <div className="mt-4">
                      <p className="font-medium text-slate-700 text-sm mb-2">Items:</p>
                      <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                        {order.items.map((item, idx) => (
                          <li key={`${order.id}-${idx}`}>
                            {item.quantity}x {item.name} (${item.price.toFixed(2)})
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-4">
                     <div className="text-right">
                       <p className="text-sm text-slate-500">Total Amount</p>
                       <p className="text-xl font-bold text-slate-900">${order.totalAmount.toFixed(2)}</p>
                     </div>
                     {canCancel && (
                       <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleCancel(order.id)}
                        className="flex items-center text-sm"
                       >
                         <XCircle className="w-4 h-4 mr-1" /> Cancel Order
                       </Button>
                     )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
