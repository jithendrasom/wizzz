export enum OrderStatus {
  PENDING = 'Pending',
  SCHEDULED = 'Scheduled',
  PICKED_UP = 'Picked Up',
  PROCESSING = 'Processing',
  READY = 'Ready',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled',
}

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  category: 'garment' | 'household';
}

export interface CartItem extends ServiceItem {
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  items: CartItem[];
  totalAmount: number;
  pickupDate: string; // ISO String
  deliveryDate: string; // ISO String
  createdAt: string;
  address: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  isVerified: boolean;
}

export type ViewState = 'DASHBOARD' | 'SCHEDULE' | 'HISTORY' | 'PROFILE' | 'ASSISTANT';
