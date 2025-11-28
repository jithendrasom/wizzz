import { Order, OrderStatus, User, ServiceItem } from '../types';
import { sendNotification } from './notificationService';

// Mock Data Storage
let currentUser: User | null = null;
let orders: Order[] = [
  {
    id: 'ORD-1001',
    userId: 'user-1',
    status: OrderStatus.DELIVERED,
    items: [
      { id: '1', name: 'Shirt (Wash & Press)', price: 3.50, category: 'garment', quantity: 5 },
      { id: '3', name: 'Trousers', price: 6.00, category: 'garment', quantity: 2 }
    ],
    totalAmount: 29.50,
    pickupDate: new Date(Date.now() - 86400000 * 5).toISOString(),
    deliveryDate: new Date(Date.now() - 86400000 * 3).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    address: '123 Main St, Apt 4B'
  },
  {
    id: 'ORD-1002',
    userId: 'user-1',
    status: OrderStatus.PROCESSING,
    items: [
      { id: '4', name: 'Comforter (Queen)', price: 25.00, category: 'household', quantity: 1 }
    ],
    totalAmount: 25.00,
    pickupDate: new Date(Date.now() - 3600000).toISOString(),
    deliveryDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    address: '123 Main St, Apt 4B'
  }
];

export const SERVICES: ServiceItem[] = [
  { id: '1', name: 'Shirt (Wash & Press)', price: 3.50, category: 'garment' },
  { id: '2', name: 'Shirt (Dry Clean)', price: 5.00, category: 'garment' },
  { id: '3', name: 'Trousers', price: 6.00, category: 'garment' },
  { id: '4', name: 'Comforter (Queen)', price: 25.00, category: 'household' },
  { id: '5', name: 'Wash & Fold (per lb)', price: 1.75, category: 'garment' },
  { id: '6', name: 'Suit (2-piece)', price: 15.00, category: 'garment' },
];

// Helper to update status and notify
const updateOrderStatus = (orderId: string, status: OrderStatus, message: string) => {
  const order = orders.find(o => o.id === orderId);
  // Only update if not cancelled
  if (order && order.status !== OrderStatus.CANCELLED) {
    order.status = status;
    sendNotification(`Order Update: ${orderId}`, message);
  }
};

// Helper to simulate lifecycle
const simulateOrderProgress = (orderId: string) => {
  // Simulate Pick Up after 5 seconds
  setTimeout(() => {
    updateOrderStatus(orderId, OrderStatus.PICKED_UP, "Your laundry has been picked up by our driver.");
  }, 5000);

  // Simulate Processing after 10 seconds
  setTimeout(() => {
    updateOrderStatus(orderId, OrderStatus.PROCESSING, "Your laundry is now being washed and pressed.");
  }, 10000);

  // Simulate Delivery after 15 seconds
  setTimeout(() => {
    updateOrderStatus(orderId, OrderStatus.DELIVERED, "Your laundry has been delivered. Enjoy!");
  }, 15000);
};

// Mock API Methods
export const MockAPI = {
  login: async (email: string): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        currentUser = { id: 'user-1', email, name: email.split('@')[0], isVerified: true };
        resolve(currentUser);
      }, 800);
    });
  },

  register: async (email: string): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, 800));
  },

  verifyCode: async (code: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(code === '123456'), 1000);
    });
  },

  getOrders: async (): Promise<Order[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...orders]), 500));
  },

  createOrder: async (orderData: Omit<Order, 'id' | 'status' | 'createdAt'>): Promise<Order> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newOrder: Order = {
          ...orderData,
          id: `ORD-${Math.floor(Math.random() * 10000)}`,
          status: OrderStatus.PENDING,
          createdAt: new Date().toISOString(),
        };
        orders.unshift(newOrder);
        
        // Start simulation
        simulateOrderProgress(newOrder.id);
        
        resolve(newOrder);
      }, 1500);
    });
  },

  cancelOrder: async (orderId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const orderIndex = orders.findIndex(o => o.id === orderId);
        if (orderIndex === -1) {
          reject('Order not found');
          return;
        }
        if (orders[orderIndex].status === OrderStatus.PROCESSING || orders[orderIndex].status === OrderStatus.DELIVERED) {
          reject('Cannot cancel order at this stage');
          return;
        }
        orders[orderIndex].status = OrderStatus.CANCELLED;
        resolve();
      }, 800);
    });
  }
};
