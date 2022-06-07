import { Location } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { MEDICINE_SIZE, RedirectingService } from "../redirecting.service"
import { TestComponent } from "./find-order.spec";

describe("Redirecting service testing", () => {
  let redirectingService: RedirectingService
  let location: Location
  let router: Router

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RedirectingService],
      imports: [
        RouterTestingModule.withRoutes([
          {path: 'test_path/:id', component: TestComponent},
          {path: 'not_found', component: TestComponent}
        ])
      ]
    });

    redirectingService = TestBed.inject(RedirectingService)
    router = TestBed.inject(Router)
    location = TestBed.inject(Location)
    router.initialNavigation()
  })

  it ('init pages', () => {
    redirectingService.initPages(1)
    expect(redirectingService.page).toBe(1)
    expect(redirectingService.hasPages).toBe(true)
  })

  describe('check if previous page exists', () => {
    it('no previous page', () => {
      redirectingService.page = 1
      redirectingService.hasPrevPage()
      expect(redirectingService.hasPrev).toBe(false)
    })

    it('previous page exists', () => {
      redirectingService.page = 2
      redirectingService.hasPrevPage()
      expect(redirectingService.hasPrev).toBe(true)
    })
  })

  describe('check if next page exists', () => {
    it('no next page', () => {
      redirectingService.page = 1
      redirectingService.hasNextPage(MEDICINE_SIZE, MEDICINE_SIZE, MEDICINE_SIZE)
      expect(redirectingService.hasNext).toBe(false)
    })

    it('next page exists', () => {
      redirectingService.page = 1
      redirectingService.hasNextPage(MEDICINE_SIZE, 4 * MEDICINE_SIZE, MEDICINE_SIZE)
      expect(redirectingService.hasNext).toBe(true)
    })
  })

  describe('switch pages', () => {
    it('go to previous page', fakeAsync(() => {
      redirectingService.baseUrl = '/test_path/2'
      redirectingService.page = 2
      redirectingService.previousPage()
      tick()
      expect(location.path()).toBe('/test_path/1')
    }))

    it('go to next page', fakeAsync(() => {
      redirectingService.baseUrl = '/test_path/1'
      redirectingService.page = 1
      redirectingService.nextPage()
      tick()
      expect(location.path()).toBe('/test_path/2')
    }))
  })

  describe('check if all pages exists', () => {
    it('has prev, but don`t has next', () => {
      redirectingService.page = 3
      redirectingService.checkPagesExists(3, MEDICINE_SIZE * 2 + 3, MEDICINE_SIZE)
      expect(redirectingService.hasPrev).toBe(true)
      expect(redirectingService.hasNext).toBe(false)
    })

    it('has next, but don`t has prev', () => {
      redirectingService.page = 1
      redirectingService.checkPagesExists(MEDICINE_SIZE, MEDICINE_SIZE * 2 + 3, MEDICINE_SIZE)
      expect(redirectingService.hasPrev).toBe(false)
      expect(redirectingService.hasNext).toBe(true)
    })

    it('has next and has prev', () => {
      redirectingService.page = 2
      redirectingService.checkPagesExists(MEDICINE_SIZE, MEDICINE_SIZE * 2 + 3, MEDICINE_SIZE)
      expect(redirectingService.hasPrev).toBe(true)
      expect(redirectingService.hasNext).toBe(true)
    })

    it('no next and no prev', () => {
      redirectingService.page = 1
      redirectingService.checkPagesExists(3, 3, MEDICINE_SIZE)
      expect(redirectingService.hasPrev).toBe(false)
      expect(redirectingService.hasNext).toBe(false)
    })
  })

  describe('redirect', () => {
    it('successful redirect', fakeAsync(() => {
      redirectingService.redirect('/test_path/1', null)
      tick()
      expect(location.path()).toBe('/test_path/1')
    }))

    it('successful redirect with params', fakeAsync(() => {
      redirectingService.redirect('/test_path/1', {param1: 1, param2: 2})
      tick()
      expect(location.path()).toBe('/test_path/1?param1=1&param2=2')
    }))
  })

  it('send not found', fakeAsync(() => {
    redirectingService.sendNotFound()
    tick()
    expect(location.path()).toBe('/not_found')
  }))

  it('return router', () => {
    expect(redirectingService.getRouter()).toBe(router)
  })
})
