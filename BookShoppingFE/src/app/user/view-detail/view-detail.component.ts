import {Component, ElementRef, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Book} from '../../models/book';
import {BookService} from '../service/book.service';
import {CartService} from '../service/cart.service';
import {TokenStorageService} from '../../services/token-storage.service';
import {ToastrService} from 'ngx-toastr';
import {CartItem} from '../../models/cart-item';
import {CartStorageService} from '../../services/cart-storage.service';

@Component({
  selector: 'app-view-detail',
  templateUrl: './view-detail.component.html',
  styleUrls: ['./view-detail.component.css']
})
export class ViewDetailComponent implements OnInit {
  id: number;
  book: Book;
  descriptions: string[];
  isViewDesc = false;
  sliderBooksCategory: Book[];
  sliderBooksAuthor: Book[];
  indexSliderBooksCategory = 0;
  // indexSliderBooksAuthor = 0;
  numberRatings: number[] = [1, 2, 3, 4, 5];

  constructor(private route: ActivatedRoute, private bookService: BookService,
              private el: ElementRef, private router: Router, private cartService: CartService,
              private storageService: TokenStorageService, private toastrService: ToastrService,
              private cartStorageService: CartStorageService) { }

  ngOnInit(): void {
    this.reset();

    this.route.paramMap.subscribe((param: ParamMap) => {
      this.id = Number(param.get('id'));
      this.bookService.findById(this.id).subscribe(b => {
        this.book = b;
        this.descriptions = b.description.split('\n');
        this.bookService.findBooksSameCategoryLimit('Sách ngoại ngữ').subscribe(bs => {
          this.sliderBooksCategory = bs;
        });
        this.bookService.findBooksSameAuthor('Trang Anh').subscribe(bs => {
          this.sliderBooksAuthor = bs;
          this.el.nativeElement.querySelector('.row-same-author').scrollTop = 0;
        });
      });
    });
  }

  reset() {
    this.el.nativeElement.querySelector('.input-change-quantity').value = 1;
    this.indexSliderBooksCategory = 0;
    window.scroll({
      top: 0,
      behavior: 'smooth'
    });

    const products = this.el.nativeElement.querySelectorAll('.row-same-category .product-item-wrapper');
    for (const p of products) {
      p.style.left = 0 + 'px';
    }
  }

  changeView() {
    this.isViewDesc = !this.isViewDesc;
  }

  previousBooksCategory() {
    if (this.indexSliderBooksCategory > 0) {
      this.indexSliderBooksCategory--;
      const products = this.el.nativeElement.querySelectorAll('.row-same-category .product-item-wrapper');
      const width = products[0].offsetWidth + 16.2;

      for (const p of products) {
        const result = Number((p.style.left).replace('px', '')) + width;
        p.style.left = result + 'px';
      }
    }
  }

  nextBooksCategory() {
    if (this.indexSliderBooksCategory < this.sliderBooksCategory.length - 6) {
      this.indexSliderBooksCategory++;
      const products = this.el.nativeElement.querySelectorAll('.row-same-category .product-item-wrapper');
      const width = products[0].offsetWidth + 16.2;

      for (const p of products) {
        const result = Number((p.style.left).replace('px', '')) - width;
        p.style.left = result + 'px';
      }
    }
  }

  viewAnotherBook(id: number) {
    this.router.navigateByUrl('/detail/' + id);
    this.ngOnInit();
  }

  addToCart() {
    const inputQuantity = this.el.nativeElement.querySelector('.input-change-quantity');
    const amount = inputQuantity.value;
    if (amount > 0) {
      if (this.storageService.checkIsLogin()) {
        this.cartService.addToCart(amount, this.storageService.getUser().cart.id , this.book?.id).subscribe(
          next => {
            this.toastrService.success('Thêm vào giỏ hàng thành công !!!');
            this.cartService.reloadCartItems();
          }
        );
      } else {
        const cartItem: CartItem = {
          amount: Number(amount),
          book: this.book
        };
        this.cartStorageService.addToCart(cartItem);
      }
    }
  }

  subQuantity() {
    const inputQuantity = this.el.nativeElement.querySelector('.input-change-quantity');
    if (inputQuantity.value > 1) {
      inputQuantity.value--;
    }
  }

  addQuantity() {
    const inputQuantity = this.el.nativeElement.querySelector('.input-change-quantity');
    inputQuantity.value++;
  }
}
