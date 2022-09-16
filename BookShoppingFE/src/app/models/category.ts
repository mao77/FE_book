import {Book} from './book';

export interface Category {
  id?: number;
  name?: string;
  imageUrl?: string;
  books?: Book[];
}
