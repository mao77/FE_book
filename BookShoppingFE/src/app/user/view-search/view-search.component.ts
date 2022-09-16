import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BookService} from '../service/book.service';
import {PageBook} from '../../models/page-book';
import {Location} from '@angular/common';

@Component({
  selector: 'app-view-search',
  templateUrl: './view-search.component.html',
  styleUrls: ['./view-search.component.css']
})
export class ViewSearchComponent implements OnInit {
  searchValue: string;
  page: PageBook;
  indexPage = 1;
  numberRatings: number[] = [1, 2, 3, 4, 5];
  arrayNumberPage: number[] = [];
  constructor(private route: ActivatedRoute, private bookService: BookService,
              private location: Location) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(p => {
      this.searchValue = p.q;
      this.search();
    });

  }

  search() {
    window.scroll({
      top: 0,
      behavior: 'smooth'
    });
    this.bookService.search(this.searchValue, this.indexPage - 1).subscribe(page => {
      this.page = page;
      this.setPagination();
    });
  }

  previousPage() {
    if (this.indexPage > 1) {
      this.indexPage--;
    }
    this.search();
  }

  nextPage() {
    if (this.indexPage < this.page.totalPages) {
      this.indexPage++;
    }
    this.search();
  }

  private setPagination() {
    if (this.page.totalPages <= 5) {
      this.arrayNumberPage = [];
      for (let i = 1; i <= this.page.totalPages; i++) {
        this.arrayNumberPage[i - 1] = i;
      }
    } else if (this.indexPage + 2 <= this.page.totalPages) {
      if (this.indexPage > 3) {
        this.arrayNumberPage[0] = this.indexPage - 2;
        this.arrayNumberPage[1] = this.indexPage - 1;
        this.arrayNumberPage[2] = this.indexPage;
        this.arrayNumberPage[3] = this.indexPage + 1;
        this.arrayNumberPage[4] = this.indexPage + 2;
      } else {
        this.arrayNumberPage[0] = 1;
        this.arrayNumberPage[1] = 2;
        this.arrayNumberPage[2] = 3;
        this.arrayNumberPage[3] = 4;
        this.arrayNumberPage[4] = 5;
      }
    } else {
      this.arrayNumberPage[0] = this.page.totalPages - 4;
      this.arrayNumberPage[1] = this.page.totalPages - 3;
      this.arrayNumberPage[2] = this.page.totalPages - 2;
      this.arrayNumberPage[3] = this.page.totalPages - 1;
      this.arrayNumberPage[4] = this.page.totalPages;
    }
  }

  setIndexPage(p: number) {
    this.indexPage = p;
    this.search();
  }
}
