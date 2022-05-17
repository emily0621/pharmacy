import { TestBed } from "@angular/core/testing"
import { AuthService } from "../auth.service"
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { User } from "../user";
import { Role } from "../role";
import { HttpClient } from "@angular/common/http";

// ng test --include src\app\tests\admin-behavior.spec.ts --code-coverage

describe("Auth service", () => {
  let authService: AuthService
  let httpTestingController: HttpTestingController
  let user: User
  let http: HttpClient

  beforeEach(() => {
    window.onbeforeunload = jasmine.createSpy();
    TestBed.configureTestingModule({
      providers: [AuthService],
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])]
    });

    authService = TestBed.inject(AuthService)
    httpTestingController = TestBed.inject(HttpTestingController)
    user = TestBed.inject(User)
    http = TestBed.inject(HttpClient)
  })

  it('exists', () => {
    expect(authService).toBeTruthy();
  })

  // it('login', () => {
  //   expect(authService.getUser().role).toBe(Role.guest)
  //   authService.loginRequest('provisor1', 'password1').then((response: any) => {
  //     expect(response.length).toBe(2)
  //   })
  // })

  // it('login with wrong email', () => {
  //   authService.loginRequest('provisor', 'password1').then((response: any) => {
  //     expect(response.status).toBe(400)
  //   })
  // })

})
