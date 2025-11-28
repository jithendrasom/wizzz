import React, { useState } from 'react';
import { SERVICES, MockAPI } from '../services/mockBackend';
import { CartItem, ViewState } from '../types';
import { Button } from './Button';
import { Input } from './Input';
import { Plus, Minus, CreditCard, Calendar, ShoppingBag, ArrowLeft, Check } from 'lucide-react';

interface SchedulePickupProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export const SchedulePickup: React.FC<SchedulePickupProps> = ({ onCancel, onSuccess }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [pickupDate, setPickupDate] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [address, setAddress] = useState('123 Main St, Apt 4B'); // Pre-filled for demo
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Payment state
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const addToCart = (serviceId: string) => {
    const service = SERVICES.find(s => s.id === serviceId);
    if (!service) return;

    setCart(prev => {
      const existing = prev.find(item => item.id === serviceId);
      if (existing) {
        return prev.map(item => item.id === serviceId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...service, quantity: 1 }];
    });
  };

  const removeFromCart = (serviceId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === serviceId);
      if (existing && existing.quantity > 1) {
        return prev.map(item => item.id === serviceId ? { ...item, quantity: item.quantity - 1 } : item);
      }
      return prev.filter(item => item.id !== serviceId);
    });
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await MockAPI.createOrder({
        userId: 'user-1', // Mock user
        items: cart,
        totalAmount,
        pickupDate: new Date(pickupDate).toISOString(),
        deliveryDate: new Date(deliveryDate).toISOString(),
        address
      });
      // Simulate Payment Processing
      await new Promise(r => setTimeout(r, 1500)); 
      onSuccess();
    } catch (e) {
      alert("Failed to create order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Header with Steps */}
      <div className="bg-slate-50 border-b border-slate-100 p-4">
        <div className="flex items-center justify-between">
           <button onClick={onCancel} className="text-slate-500 hover:text-slate-800 flex items-center text-sm">
             <ArrowLeft className="w-4 h-4 mr-1" /> Cancel
           </button>
           <div className="flex space-x-2">
             {[1, 2, 3].map(s => (
               <div key={s} className={`w-2.5 h-2.5 rounded-full ${step >= s ? 'bg-indigo-600' : 'bg-slate-300'}`} />
             ))}
           </div>
           <span className="text-sm font-medium text-slate-600">
             Step {step} of 3
           </span>
        </div>
      </div>

      <div className="p-6">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
              <ShoppingBag className="w-5 h-5 mr-2 text-indigo-600" />
              Select Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SERVICES.map(service => {
                const inCart = cart.find(i => i.id === service.id);
                return (
                  <div key={service.id} className="border border-slate-200 rounded-lg p-4 hover:border-indigo-300 transition-colors flex justify-between items-center">
                    <div>
                      <p className="font-medium text-slate-900">{service.name}</p>
                      <p className="text-slate-500 text-sm">${service.price.toFixed(2)} / item</p>
                    </div>
                    {inCart ? (
                      <div className="flex items-center space-x-3 bg-slate-100 rounded-lg p-1">
                        <button onClick={() => removeFromCart(service.id)} className="p-1 hover:bg-white rounded-md transition-colors"><Minus className="w-4 h-4" /></button>
                        <span className="font-medium text-sm w-4 text-center">{inCart.quantity}</span>
                        <button onClick={() => addToCart(service.id)} className="p-1 hover:bg-white rounded-md transition-colors"><Plus className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <Button size="sm" variant="secondary" onClick={() => addToCart(service.id)}>Add</Button>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <div className="text-right mr-6">
                <p className="text-sm text-slate-500">Estimated Total</p>
                <p className="text-xl font-bold text-indigo-600">${totalAmount.toFixed(2)}</p>
              </div>
              <Button disabled={cart.length === 0} onClick={() => setStep(2)}>
                Next: Schedule
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
              Pickup & Delivery
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Pickup Date & Time"
                type="datetime-local"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
              <Input
                label="Delivery Date & Time"
                type="datetime-local"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                min={pickupDate || new Date().toISOString().slice(0, 16)}
              />
            </div>
            
            <Input
              label="Pickup Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Full address with apartment number"
            />

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
              <Button disabled={!pickupDate || !deliveryDate || !address} onClick={() => setStep(3)}>
                Next: Payment
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-indigo-600" />
              Secure Payment
            </h2>

            <div className="bg-slate-50 p-4 rounded-lg space-y-2 mb-6">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Subtotal ({cart.reduce((a, b) => a + b.quantity, 0)} items)</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Service Fee</span>
                <span>$2.00</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total</span>
                <span>${(totalAmount + 2).toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-4">
              <Input
                label="Card Number"
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                maxLength={19}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Expiry"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  maxLength={5}
                />
                <Input
                  label="CVC"
                  placeholder="123"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  maxLength={3}
                />
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-slate-100">
              <Button variant="secondary" onClick={() => setStep(2)}>Back</Button>
              <Button 
                onClick={handleSubmit} 
                isLoading={isSubmitting}
                disabled={!cardNumber || !expiry || !cvc}
              >
                Pay & Schedule
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
