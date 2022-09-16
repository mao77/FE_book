import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CartStorageService} from './services/cart-storage.service';
import {render} from 'creditcardpayments/creditCardPayments';

declare var paypal;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('paypal', { static: true }) paypalElement: ElementRef;
  title = 'BookShopping';
  paidFor = false;
  money = '20000';

  product = {
    price: 20000,
    description: 'used couch, decent condition',
    img: 'assets/couch.jpg'
  };

  constructor(private cartStorageService: CartStorageService) {
  }

  ngOnInit(): void {
    this.cartStorageService.loadCart();
    // this.payment();
  }

  payment() {
    paypal
      .Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                description: this.product.description,
                amount: {
                  currency_code: 'USD',
                  value: this.product.price
                }
              }
            ]
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          this.paidFor = true;
          console.log(order);
        },
        onError: err => {
          console.log(err);
        }
      })
      .render(this.paypalElement.nativeElement);
  }
}
