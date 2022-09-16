import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInfoUserComponent } from './view-info-user.component';

describe('ViewInfoUserComponent', () => {
  let component: ViewInfoUserComponent;
  let fixture: ComponentFixture<ViewInfoUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewInfoUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewInfoUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
