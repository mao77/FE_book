import {Component, ElementRef, OnInit} from '@angular/core';
import redirect from '../../contants/redirect';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {TokenStorageService} from '../../services/token-storage.service';
import {UserService} from '../../user/service/user.service';
import {User} from '../../models/user';
import {ToastrService} from 'ngx-toastr';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CartItem} from '../../models/cart-item';
import {CartService} from '../../user/service/cart.service';
import {CartStorageService} from '../../services/cart-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLogin = false;
  user: User;
  isOpenModal: boolean;
  typeForm: string;
  formSearch: FormGroup;
  cartItems: CartItem[];
  totalPriceCart = 0;

  constructor(private route: ActivatedRoute, private toastrService: ToastrService,
              private tokenStorageService: TokenStorageService, private userService: UserService,
              private router: Router, private cartService: CartService, private cartStorageService: CartStorageService) {
  }

  ngOnInit(): void {
    this.formSearch = new FormGroup({
      searchValue: new FormControl('', Validators.required)
    });

    this.user = {
      name: ''
    };
    this.route.queryParams.subscribe(params => {
      const token = params.token;
      const error = params.error;

      if (token) {
          this.tokenStorageService.saveToken(token);
          this.userService.getInfo(token).subscribe(user => {
            console.log(user);
            this.user = user;
            this.tokenStorageService.saveUser(user);
            this.tokenStorageService.isLogin();
            this.isLogin = true;
            this.resetUrl();
          });
          this.synchronizedCart();
      } else if (error) {
        if (error.toLowerCase() === 'emailregistered') {
          this.toastrService.warning('Email của bạn đã được liên kết trước đó', 'Thông báo');
        }
      }
    });

    if (this.tokenStorageService.checkIsLogin()) {
      this.user = this.tokenStorageService.getUser();
      this.isLogin = this.tokenStorageService.checkIsLogin().toLowerCase() === 'true';
      this.synchronizedCart();
    } else {
      this.cartItems = this.cartStorageService.getItems();
      this.cartItems.forEach(c => this.totalPriceCart += c.amount * c.book.price);
    }

    this.cartService.cartItems$.subscribe(cartItems => {
      this.cartItems = cartItems;
      this.totalPriceCart = 0;
      cartItems.forEach(c => this.totalPriceCart += c.amount * c.book.price);
    });
  }

  logout() {
    this.isLogin = false;
    this.user = {
      name: ''
    };
    this.tokenStorageService.signOut();
    this.resetUrl();
  }

  openModal(typeForm: string) {
    this.isOpenModal = true;
    this.typeForm = typeForm;
  }

  closeModal() {
    this.isOpenModal = false;
  }

  resetUrl() {
    window.location.href = 'http://localhost:4200';
  }

  search() {
    console.log(this.formSearch.value);
    this.router.navigateByUrl('/search?q=' + this.formSearch.get('searchValue').value + '&page=1');
  }

  getCartItemsByUserId() {
    this.cartService.getCartItemByUserId(this.tokenStorageService.getUser().id).subscribe(items => {
      this.cartItems = items;
      items.forEach(t => this.totalPriceCart += t.amount * t?.book.price);
      this.cartService.cartItems$.next(items);
    });
  }

  viewCart() {
    window.location.href = '/cart';
  }

  viewDetailItem(id: number | undefined) {
    window.location.href = '/detail/' + id;
  }

  synchronizedCart() {
    this.cartItems = this.cartStorageService.getItems();
    const cartItemRequests = [];
    if (this.cartItems.length > 0) {
      this.cartItems.forEach(c => cartItemRequests.push({
        bookId: c.book.id,
        amount: c.amount
      }));
      this.cartService.synchronizedCart(this.user.cart.id, cartItemRequests).subscribe(
        () => {
          this.cartStorageService.clearCart();
          this.getCartItemsByUserId();
        }
      );
    } else {
      this.getCartItemsByUserId();
    }
  }
}
