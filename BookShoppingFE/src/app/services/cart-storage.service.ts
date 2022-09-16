import { Injectable } from '@angular/core';
import {CartItem} from '../models/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartStorageService {
  cartItems: CartItem[] = [];
  constructor() { }

  addToCart(cartItem: CartItem) {
    const cartItem1 = this.cartItems.find(c => c.book.id === cartItem.book.id);
    if (cartItem1 === undefined) {
      this.cartItems.push(cartItem);
    } else {
      cartItem1.amount = Number(cartItem1.amount) +  Number(cartItem.amount);
    }
    this.saveCart();
  }

  updateCart(cartItem: CartItem) {
    const cartItem1 = this.cartItems.find(c => c.book.id === cartItem.book.id);
    cartItem1.amount = Number(cartItem.amount);
    this.saveCart();
  }

  getItems(): CartItem[] {
    return this.cartItems;
  }

  setItems(cartItems) {
    this.cartItems = cartItems;
  }

  loadCart(): void {
    this.cartItems = JSON.parse(localStorage.getItem('cart_items')) ?? [];
  }

  saveCart(): void {
    localStorage.setItem('cart_items', JSON.stringify(this.cartItems));
  }

  clearCart() {
    this.cartItems = [];
    localStorage.removeItem('cart_items');
  }

  removeItem(item) {
    const index = this.cartItems.findIndex(o => o.id === item.id);

    if (index > -1) {
      this.cartItems.splice(index, 1);
      this.saveCart();
    }
  }

  itemInCart(item): boolean {
    return this.cartItems.findIndex(o => o.id === item.id) > -1;
  }
}
