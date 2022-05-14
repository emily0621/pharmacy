import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './guest/login/login.component'
import { RegistrationComponent } from './guest/registration/registration.component';
import { UserProfileComponent } from './loginUser/user-profile/user-profile.component';
import { RoleGuard } from './role.guard';
import { Role } from './role'
import { MainPageComponent } from './guest/main-page/main-page.component';
import { ProductsComponent } from './guest/products/products.component';
import { ChangePasswordComponent } from './loginUser/change-password/change-password.component';
import { EditProfileComponent } from './loginUser/edit-profile/edit-profile.component';
import { FindUserComponent } from './admin/find-user/find-user.component';
import { UsersComponent } from './admin/users/users.component';
import { MedicinePageComponent } from './guest/medicine-page/medicine-page.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { WishListComponent } from './loginUser/wish-list/wish-list.component';
import { OrdersComponent } from './loginUser/orders/orders.component';
import { OrderMedicineComponent } from './components/order-medicine/order-medicine.component';
import { ShoppingCartComponent } from './loginUser/shopping-cart/shopping-cart.component';
import { OrderComponent } from './loginUser/order/order.component';
import { MedicineInOrderComponent } from './loginUser/medicine-in-order/medicine-in-order.component';
import { UserPageComponent } from './admin/user-page/user-page.component';
import { FindOrderComponent } from './admin/find-order/find-order.component';
import { OrdersResultComponent } from './admin/orders-result/orders-result.component';

const routes: Routes = [
  {path: 'not_found', component: NotFoundComponent},
  {path: 'login', component: LoginComponent, canActivate: [RoleGuard], data: { roles: [Role.guest]}},
  {path: 'registration', component: RegistrationComponent, canActivate: [RoleGuard], data: { roles: [Role.guest]}},
  {path: 'profile', component: UserProfileComponent, canActivate:[RoleGuard], data: { roles: [Role.loginUser, Role.provisor]}},
  {path: 'change_password', component: ChangePasswordComponent, canActivate:[RoleGuard], data: { roles: [Role.loginUser, Role.provisor]}},
  {path: 'edit_profile', component: EditProfileComponent, canActivate:[RoleGuard], data: { roles: [Role.loginUser, Role.provisor]}},
  {path: 'main_page', component: MainPageComponent},
  {path: 'products', component: ProductsComponent},
  {path: 'find_user', component: FindUserComponent, canActivate:[RoleGuard], data: { roles: [Role.provisor]}},
  {path: 'users', component: UsersComponent, canActivate:[RoleGuard], data: { roles: [Role.provisor]}},
  {path: 'medicine_page/:id', component: MedicinePageComponent, canActivate: [RoleGuard], data: { roles: [Role.guest, Role.loginUser, Role.provisor]}},
  {path: 'wish_list', component: WishListComponent, canActivate: [RoleGuard], data: { roles: [Role.loginUser]}},
  {path: 'test_route', component: OrderMedicineComponent},
  {path: 'user_orders/:page', component: OrdersComponent, canActivate:[RoleGuard], data: { roles: [Role.loginUser]}},
  {path: 'user_orders/:username/:page', component: OrdersComponent, canActivate:[RoleGuard], data: { roles: [Role.provisor]}},
  {path: 'shopping_cart', component: ShoppingCartComponent, canActivate:[RoleGuard], data: { roles: [Role.loginUser]}},
  {path: 'order_page/:id', component: OrderComponent, canActivate:[RoleGuard], data: { roles: [Role.loginUser, Role.provisor]}},
  {path: 'medicine/order/:id', component: MedicineInOrderComponent, canActivate:[RoleGuard], data: { roles: [Role.loginUser, Role.provisor]}},
  {path: 'user_page/:username', component: UserPageComponent, canActivate:[RoleGuard], data: { roles: [Role.provisor]}},
  {path: 'find_order', component: FindOrderComponent, canActivate:[RoleGuard], data: { roles: [Role.provisor]}},
  {path: 'orders/:page', component: OrdersResultComponent, canActivate:[RoleGuard], data: { roles: [Role.provisor]}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
