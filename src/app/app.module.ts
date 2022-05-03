import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LoginComponent } from './guest/login/login.component';
import { LoginNavComponent } from './components/nav/login-nav/login-nav.component';
import { AdminNavComponent } from './components/nav/admin-nav/admin-nav.component';
import { GuestNavComponent } from './components/nav/guest-nav/guest-nav.component';
import { InputFieldComponent } from './components/input-field/input-field.component';
import { FooterComponent } from './components/footer/footer.component';
import { RegistrationComponent } from './guest/registration/registration.component';
import { BaseErrorComponent, ErrorMessage } from './components/base-error/base-error.component';
import { UserProfileComponent } from './loginUser/user-profile/user-profile.component';
import { NavComponent } from './components/nav/nav.component';
import { InformationFieldComponent } from './components/information-field/information-field.component';
import { User } from './user';
import { AuthService } from './auth.service';
import { InputValuesIntoSimpleMedicine, MainPageComponent} from './guest/main-page/main-page.component';
import { SimpleMedicineComponent } from './components/medicine/simple-medicine/simple-medicine.component';
import { ProductsComponent } from './guest/products/products.component';
import { ChangePasswordComponent } from './loginUser/change-password/change-password.component';
import { EditProfileComponent } from './loginUser/edit-profile/edit-profile.component';
import { FindUserComponent } from './admin/find-user/find-user.component';
import { UsersComponent } from './admin/users/users.component';
import { UserInformationComponent } from './components/user_information/user-information/user-information.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoginNavComponent,
    AdminNavComponent,
    GuestNavComponent,
    InputFieldComponent,
    FooterComponent,
    RegistrationComponent,
    BaseErrorComponent,
    UserProfileComponent,
    NavComponent,
    InformationFieldComponent,
    MainPageComponent,
    SimpleMedicineComponent,
    ProductsComponent,
    ChangePasswordComponent,
    EditProfileComponent,
    FindUserComponent,
    UsersComponent,
    UserInformationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [User, AuthService],
  bootstrap: [AppComponent],
  entryComponents: [LoginNavComponent, AdminNavComponent]
})
export class AppModule { }
