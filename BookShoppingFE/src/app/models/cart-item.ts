import {Book} from './book';

export interface CartItem {
  id?: number;
  amount?: number;
  book?: Book;
}
