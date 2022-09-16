import {CartItem} from './cart-item';

export interface Cart {
  id?: number;
  cartItems?: CartItem[];
}
