import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {authInterceptorProviders} from './helpers/auth.interceptor';
import { HeaderComponent } from './commons/header/header.component';
import { FooterComponent } from './commons/footer/footer.component';
import {UserModule} from './user/user.module';
import {ToastrModule} from 'ngx-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormDirective} from './commons/form.directive';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AuthenticationComponent } from './commons/authentication/authentication.component';
import {ShareModuleModule} from './share-module/share-module.module';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        AuthenticationComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        UserModule,
        BrowserAnimationsModule,
        ShareModuleModule,
        ToastrModule.forRoot({
            timeOut: 2000,
            progressBar: true,
            progressAnimation: 'increasing',
            preventDuplicates: true
        })
    ],
    providers: [authInterceptorProviders],
    exports: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
