import {Cart} from './cart';

export interface User {
  id?: number;
  name?: string;
  email?: string;
  imageUrl?: string;
  gender?: string;
  phone?: string;
  birthday?: Date;
  address?: string;
  cart?: Cart;
  provider?: string;
}
