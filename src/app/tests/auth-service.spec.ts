import { fakeAsync, TestBed, tick } from "@angular/core/testing"
import { AuthService } from "../auth.service"
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { User } from "../user";
import { Role } from "../role";

describe("Auth service testing", () => {
  let authService: AuthService
  let httpTestingController: HttpTestingController
  let user: User

  const correctAdminLogin = {
    access_token: "access_token",
    refresh_token: "refresh_token",
    provisor: true
  }

  const wrongPasswordAdminLogin = {
    message: "Wrong password"
  }

  const userNotFound = {
    message: "User not found"
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ]
    });

    authService = TestBed.inject(AuthService)
    httpTestingController = TestBed.inject(HttpTestingController)
    user = TestBed.inject(User)
  })

  afterEach(() => {
    httpTestingController.verify()
  })

  describe('login request testing', () => {
    it ('login request', () => {
      authService.loginRequest("provisor1", "password1").then((response: any) => {
        expect(response).toBe(correctAdminLogin)
      })

      const request = httpTestingController.expectOne("/login")
      expect(request.request.method).toBe('POST')
      request.flush(correctAdminLogin)
    })

    it ('login with wrong password', () => {
      authService.loginRequest("provisor1", "wrongPassword").then(() => {}, (error) => {
        expect(error.status).toBe(401)
        expect(error.error.message).toBe("Wrong password")
      })

      const request = httpTestingController.expectOne("/login")
      expect(request.request.method).toBe('POST')
      request.flush(wrongPasswordAdminLogin, {status: 401, statusText: 'Unauthorized'})
    })

    it ('login with non-existent username', () => {
      authService.loginRequest("nonExistentUser", "password").then(() => {}, (error) => {
        expect(error.status).toBe(404)
        expect(error.error.message).toBe("User not found")
      })

      const request = httpTestingController.expectOne("/login")
      expect(request.request.method).toBe('POST')
      request.flush(userNotFound, {status: 404, statusText: 'Not found'})
    })
  })

  describe('get role testing', () => {
    it('get role for login user', () => {
      user.access_token = "access_token_login_user"
      user.refresh_token = "refresh_token_login_user"

      authService.getRole().then((response: any) => {
        expect(response).toBe(false)
      })

      const request = httpTestingController.expectOne("/role")
      expect(request.request.headers.get("Authorization")).toBe(`Bearer ${user.access_token}`)
      expect(request.request.method).toBe("GET")
      request.flush(false)
    })

    it('get role for admin', () => {
      user.access_token = "access_token_admin"
      user.refresh_token = "refresh_token_admin"

      authService.getRole().then((response: any) => {
        expect(response).toBe(true)
      })

      const request = httpTestingController.expectOne("/role")
      expect(request.request.headers.get("Authorization")).toBe(`Bearer ${user.access_token}`)
      expect(request.request.method).toBe("GET")
      request.flush(true)
    })

    it('get role for guest', () => {
      authService.getRole().then(() => {}, (error) => {
        expect(error.status).toBe(403)
      })

      const request = httpTestingController.expectOne("/role")
      expect(request.request.headers.get("Authorization")).toBe(`Bearer ${user.access_token}`)
      expect(request.request.method).toBe("GET")
      request.flush(null , {status: 403, statusText: "Forbidden"})
    })
  })

  describe('get user method', () => {
    it('get default user', () => {
      expect(authService.getUser()).toBe(user)
    })

    it('get login user', () => {
      user.access_token = "access_token_login_user"
      user.refresh_token = "refresh_token_login_user"
      expect(authService.getUser()).toBe(user)
    })
  })

  describe('logout testing', () => {

    it('logout', () => {
      localStorage.setItem('access_token', "access_token_login_user")
      localStorage.setItem('refresh_token', "refresh_token_login_user")
      authService.logout()
      expect(localStorage.getItem('access_token')).toBeNull()
      expect(localStorage.getItem('refresh_token')).toBeNull()
    })
  })

  describe('refresh access token', () => {
    it('refresh valid token', () => {
      user.access_token = "access_token_login_user"
      user.refresh_token = "refresh_token_login_user"

      authService.refreshAccessToken(user.refresh_token, user.access_token).then((response: any) => {
        expect(response).toBe("")
      })

      const request = httpTestingController.expectOne('/access_token')
      expect(request.request.body).toEqual({access_token: "access_token_login_user"})
      expect(request.request.headers.get("Authorization")).toBe(`Bearer ${user.refresh_token}`)
      expect(request.request.method).toBe("POST")
      request.flush("")
    })

    it('refresh expired token', () => {
      user.access_token = "expired_access_token_login_user"
      user.refresh_token = "refresh_token_login_user"

      authService.refreshAccessToken(user.refresh_token, user.access_token).then((response: any) => {
        expect(response.access_token).toBe("new_access_token")
      })

      const request = httpTestingController.expectOne('/access_token')
      expect(request.request.body).toEqual({access_token: "expired_access_token_login_user"})
      expect(request.request.headers.get("Authorization")).toBe(`Bearer ${user.refresh_token}`)
      expect(request.request.method).toBe("POST")
      request.flush({access_token: "new_access_token"})
    })

    it('unauthorized user refresh', () => {

      authService.refreshAccessToken(user.refresh_token, user.access_token).then(() => {}, (error: any) => {
        expect(error.status).toBe(403)
      })

      const request = httpTestingController.expectOne('/access_token')
      expect(request.request.body).toEqual({access_token: undefined})
      expect(request.request.headers.get("Authorization")).toBe(`Bearer ${user.refresh_token}`)
      expect(request.request.method).toBe("POST")
      request.flush(null, {status: 403, statusText: "Unauthorized"})
    })
  })

  describe('check user role', () => {

    it('check guest role', async () => {
      authService.checkRole().then((response: any) => {
        expect(response).toBe(Role.guest)
      })
    })

    it('check login user role', async () => {
      user.access_token = "access_token_login_user"
      user.refresh_token = "refresh_token_login_user"
      authService.checkRole().then((response: any) => {
        expect(response).toBe(Role.loginUser)
      })
      let request = httpTestingController.expectOne('/role')
      expect(request.request.method).toBe("GET")
      request.flush({role: false})
    })

    it('check admin role', async () => {
      user.access_token = "access_token_admin"
      user.refresh_token = "refresh_token_admin"
      authService.checkRole().then((response: any) => {
        expect(response).toBe(Role.provisor)
      })
      let request = httpTestingController.expectOne('/role')
      expect(request.request.method).toBe("GET")
      request.flush({role: true})
    })

    it('check role unexpected token', async () => {
      user.access_token = "access_token_invalid"
      user.refresh_token = "refresh_token_invalid"
      authService.checkRole().then(() => {}, (error) => {
        expect(error.status).toBe(403)
      })
      let request = httpTestingController.expectOne('/role')
      expect(request.request.method).toBe("GET")
      request.flush(null, {status: 403, statusText: "Unauthorized"})
    })
})

  describe('check user', () => {
    it('guest user', async () => {
      authService.logout()
      authService.checkUser().then((response: any) => {
        expect(response).toBe(user)
      })
    })

    it('check login user', fakeAsync(() => {
      const expectedUser: User = new User()
      expectedUser.access_token = "new_access_token"
      expectedUser.refresh_token = "refresh_token_login_user"
      expectedUser.role = Role.loginUser

      localStorage.setItem('access_token', "access_token_login_user")
      localStorage.setItem('refresh_token', "refresh_token_login_user")

      authService.checkUser().then((response: any) => {
        expect(response).toEqual(expectedUser)
      })

      let request = httpTestingController.expectOne('/access_token')
      expect(request.request.method).toBe("POST")
      request.flush({access_token: "new_access_token"})

      tick()

      request = httpTestingController.expectOne('/role')
      expect(request.request.method).toBe("GET")
      request.flush({role: false})
    }))

    it('check admin', fakeAsync(() => {
      const expectedUser: User = new User()
      expectedUser.access_token = "access_token_admin"
      expectedUser.refresh_token = "refresh_token_admin"
      expectedUser.role = Role.provisor

      localStorage.setItem('access_token', "access_token_admin")
      localStorage.setItem('refresh_token', "refresh_token_admin")

      authService.checkUser().then((response: any) => {
        expect(response).toEqual(expectedUser)
      })

      let request = httpTestingController.expectOne('/access_token')
      expect(request.request.method).toBe("POST")
      request.flush(null)

      tick()

      request = httpTestingController.expectOne('/role')
      expect(request.request.method).toBe("GET")
      request.flush({role: true})
    }))
  })
})
