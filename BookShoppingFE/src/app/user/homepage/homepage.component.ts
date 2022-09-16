import {AfterContentInit, AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren} from '@angular/core';
import {TokenStorageService} from '../../services/token-storage.service';
import {User} from '../../models/user';
import {BookService} from '../service/book.service';
import {Category} from '../../models/category';
import {Book} from '../../models/book';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})

export class HomepageComponent implements OnInit, AfterViewInit  {
  @ViewChildren('slides', {read: ElementRef})
  public slidesElement!: QueryList<ElementRef<HTMLLIElement>>;
  user: User;
  categories: Category[] = [];
  books: Book[] = [];
  imageUrl: string;
  numberRecord: number;
  numberRatings: number[] = [1, 2, 3, 4, 5];

  indexSlide = 0;
  images = [
    {path: 'https://cdn0.fahasa.com/media/magentothem/banner7/840x320_VTCNQD.jpg'},
    {path: 'https://cdn0.fahasa.com/media/magentothem/banner7/dongamamxanh_resize_840x320.jpg'},
    {path: 'https://cdn0.fahasa.com/media/magentothem/banner7/MOCA-T09.2022_840x320.jpg'},
    {path: 'https://cdn0.fahasa.com/media/magentothem/banner7/MOCA-T09.2022_840x320.jpg'},
    {path: 'https://cdn0.fahasa.com/media/magentothem/banner7/Flower_840x320.png'},
    {path: 'https://cdn0.fahasa.com/media/magentothem/banner7/bktrithuct9_840x320.jpg'},
    {path: 'https://cdn0.fahasa.com/media/magentothem/banner7/VPP_Main_banner_T9_840x320.jpg'}
  ];

  constructor(private tokenStorageService: TokenStorageService, private bookService: BookService,
              private toastrService: ToastrService, private router: Router, private el: ElementRef) {

  }

  ngOnInit(): void {
    this.user = {
      name: ''
    };
    if (this.tokenStorageService.checkIsLogin()) {
      this.user = this.tokenStorageService.getUser();
    }
    const numberRecord = window.sessionStorage.getItem('numberRecord');
    if (numberRecord) {
      this.numberRecord = Number(numberRecord);
    } else {
      this.numberRecord = 36;
      window.sessionStorage.setItem('numberRecord', '36');
    }
    this.getCategories();
    this.getBooks();
  }

  ngAfterViewInit(): void {
    this.sliderAdvertisement();
  }

  getCategories() {
    this.bookService.getAllCategories().subscribe(categories => {
      this.categories = categories;
    });
  }
  getBooks() {
    this.bookService.getBooksByNumberRecord(this.numberRecord).subscribe(books => {
      if (books.length === this.books.length) {
        this.numberRecord -= 36;
        console.log(this.numberRecord);
        window.sessionStorage.setItem('numberRecord', this.numberRecord.toString());
        this.toastrService.warning('Hết sản phẩm tìm kiếm', 'Thông báo');
      } else {
        this.books = books;
      }
    });
  }
  viewMore() {
    this.numberRecord += 36;
    window.sessionStorage.setItem('numberRecord', this.numberRecord.toString());
    this.getBooks();
  }

  sliderAdvertisement() {
    const slides = this.slidesElement.toArray().map(x => x.nativeElement);
    const sizeSlides = slides.length;

    slides.forEach(e => {
      e.style.display = 'none';
      e.style.opacity = '0';
    });
    slides[0].style.display = 'block';
    slides[0].style.opacity = '1';

    window.setInterval(() => {
      if (this.indexSlide === sizeSlides) {
        this.indexSlide = 0;
      }
      if (this.indexSlide === -1) {
        this.indexSlide = sizeSlides - 1;
      }
      for (let i = 0; i < sizeSlides; i++) {
        slides[i].style.display = 'none';
        slides[i].style.opacity = '0';
      }
      slides[this.indexSlide].style.display = 'block';
      slides[this.indexSlide].style.opacity = '1';
      this.indexSlide++;
    }, 3000);
  }

  search(q: string) {
    this.router.navigateByUrl('/search?q=' + q + '&page=1');
  }
}
