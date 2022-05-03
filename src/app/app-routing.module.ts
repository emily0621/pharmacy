import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './guest/login/login.component'
import { RegistrationComponent } from './guest/registration/registration.component';
import { UserProfileComponent } from './loginUser/user-profile/user-profile.component';
import { RoleGuard } from './role.guard';
import { Role } from './role'
import { MainPageComponent } from './guest/main-page/main-page.component';
import { ProductsComponent } from './guest/products/products.component';
import { SimpleMedicineComponent } from './components/medicine/simple-medicine/simple-medicine.component';
import { ChangePasswordComponent } from './loginUser/change-password/change-password.component';
import { EditProfileComponent } from './loginUser/edit-profile/edit-profile.component';
import { FindUserComponent } from './admin/find-user/find-user.component';
import { UserInformationComponent } from './components/user_information/user-information/user-information.component';
import { UsersComponent } from './admin/users/users.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent, canActivate: [RoleGuard], data: { roles: [Role.guest]}},
  {path: 'registration', component: RegistrationComponent, canActivate: [RoleGuard], data: { roles: [Role.guest]}},
  {path: 'profile', component: UserProfileComponent, canActivate:[RoleGuard], data: { roles: [Role.loginUser, Role.provisor]}},
  {path: 'change_password', component: ChangePasswordComponent, canActivate:[RoleGuard], data: { roles: [Role.loginUser, Role.provisor]}},
  {path: 'edit_profile', component: EditProfileComponent, canActivate:[RoleGuard], data: { roles: [Role.loginUser, Role.provisor]}},
  {path: 'main_page', component: MainPageComponent},
  {path: 'products', component: ProductsComponent},
  {path: 'find_user', component: FindUserComponent, canActivate:[RoleGuard], data: { roles: [Role.provisor]}},
  {path: 'users', component: UsersComponent, canActivate:[RoleGuard], data: { roles: [Role.provisor]}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
