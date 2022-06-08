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
import { MainPageComponent} from './guest/main-page/main-page.component';
import { SimpleMedicineComponent } from './components/medicine/simple-medicine/simple-medicine.component';
import { ProductsComponent } from './guest/products/products.component';
import { ChangePasswordComponent } from './loginUser/change-password/change-password.component';
import { EditProfileComponent } from './loginUser/edit-profile/edit-profile.component';
import { FindUserComponent } from './admin/find-user/find-user.component';
import { UsersComponent } from './admin/users/users.component';
import { UserInformationComponent } from './components/user_information/user-information/user-information.component';
import { SingleMedicineComponent } from './components/medicine/single-medicine/single-medicine.component';
import { MedicinePageComponent } from './guest/medicine-page/medicine-page.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { WishListComponent } from './loginUser/wish-list/wish-list.component';
import { OrdersComponent } from './loginUser/orders/orders.component';
import { ShortOrderInformationComponent } from './components/short-order-information/short-order-information.component';
import { OrderMedicineComponent } from './components/order-medicine/order-medicine.component';
import { ShoppingCartComponent } from './loginUser/shopping-cart/shopping-cart.component';
import { OrderComponent } from './loginUser/order/order.component';
import { FullOrderInformationComponent } from './components/full-order-information/full-order-information.component';
import { SocketComponent } from './socket/socket.component';
import { MessageComponent } from './components/message/message.component';
import { MedicineInOrderComponent } from './loginUser/medicine-in-order/medicine-in-order.component';
import { UserPageComponent } from './admin/user-page/user-page.component';
import { FindOrderComponent } from './admin/find-order/find-order.component';
import { OrdersResultComponent } from './admin/orders-result/orders-result.component';

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
    SingleMedicineComponent,
    MedicinePageComponent,
    NotFoundComponent,
    WishListComponent,
    OrdersComponent,
    ShortOrderInformationComponent,
    OrderMedicineComponent,
    ShoppingCartComponent,
    OrderComponent,
    FullOrderInformationComponent,
    SocketComponent,
    MessageComponent,
    MedicineInOrderComponent,
    UserPageComponent,
    FindOrderComponent,
    OrdersResultComponent
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
