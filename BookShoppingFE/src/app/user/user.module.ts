import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UserRoutingModule} from './user-routing.module';
import {HomepageComponent} from './homepage/homepage.component';
import {ViewDetailComponent} from './view-detail/view-detail.component';
import {ViewInfoUserComponent} from './view-info-user/view-info-user.component';
import {ViewCartComponent} from './view-cart/view-cart.component';
import {ViewSearchComponent} from './view-search/view-search.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {ReactiveFormsModule} from '@angular/forms';
import {FormDirective} from '../commons/form.directive';
import {ShareModuleModule} from '../share-module/share-module.module';


@NgModule({
  declarations: [
    HomepageComponent,
    ViewDetailComponent,
    ViewInfoUserComponent,
    ViewCartComponent,
    ViewSearchComponent,
    ChangePasswordComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    ReactiveFormsModule,
    ShareModuleModule
  ]
})
export class UserModule {
}
