import { Location } from "@angular/common";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { ActivatedRoute, convertToParamMap, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { BehaviorSubject, Observable, of } from "rxjs";
import { OrdersResultComponent } from "../admin/orders-result/orders-result.component";
import { BaseErrorComponent, ErrorMessage } from "../components/base-error/base-error.component";
import { OrderInformation, ShortOrderInformationComponent } from "../components/short-order-information/short-order-information.component";
import { RedirectingService } from "../redirecting.service";

describe('Order search result testing', () => {

  const allParams = {
    date: new Array<string>('2001-01-01', '2005-05-05'),
    username: new Array<string>('user1', 'user2'),
    medicine: new Array<string>('medicine1', 'medicine2'),
    price: new Array<string>('100', '200'),
    status: new Array<string>("canceled", "complete", "delivered", "in the process of delivery", "is being prepared", "ready to ship")
  }


  let fixture: ComponentFixture<OrdersResultComponent>
  let ordersResultComponent: OrdersResultComponent
  let router: Router
  let location: Location
  let activatedRoute: ActivatedRoute
  let httpTestingController: HttpTestingController
  let redirectingService: RedirectingService

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [OrdersResultComponent],
      imports: [
        RouterTestingModule.withRoutes([
          {path: 'orders/:id', component: OrdersResultComponent}
        ]),
        HttpClientTestingModule
      ],
      providers: [RedirectingService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents()

    fixture = TestBed.createComponent(OrdersResultComponent)
    ordersResultComponent = fixture.componentInstance
    router = TestBed.inject(Router)
    location = TestBed.inject(Location)
    activatedRoute = TestBed.inject(ActivatedRoute)
    httpTestingController = TestBed.inject(HttpTestingController)
    redirectingService = TestBed.inject(RedirectingService)
    redirectingService.page = 1

    router.initialNavigation()
  })

  afterAll(() => {
    httpTestingController.verify()
  })

  describe('resolve params', () => {
    it('using all params', () => {
      activatedRoute.queryParams = new BehaviorSubject(allParams)
      ordersResultComponent.resolveParams()
      expect(ordersResultComponent.date).toBe(allParams.date)
      expect(ordersResultComponent.username).toBe(allParams.username)
      expect(ordersResultComponent.medicine).toBe(allParams.medicine)
      expect(ordersResultComponent.price).toBe(allParams.price)
      expect(ordersResultComponent.status).toBe(allParams.status)
    })

    it('without params', () => {
      const params = {
        status: new Array<string>("canceled", "complete", "delivered", "in the process of delivery", "is being prepared", "ready to ship")
      }
      activatedRoute.queryParams = new BehaviorSubject(params)
      ordersResultComponent.resolveParams()
      expect(ordersResultComponent.date).toEqual(new Array<string>())
      expect(ordersResultComponent.username).toEqual(new Array<string>())
      expect(ordersResultComponent.medicine).toEqual(new Array<string>())
      expect(ordersResultComponent.price).toEqual(new Array<string>())
      expect(ordersResultComponent.status).toEqual(params.status)
    })
  })

  describe('init result', () => {

    it('at least one order exists', fakeAsync(() => {
      const orderResponse = {count: 2, orders: [
          {
            id_order: 1,
            date_order: '2001-01-01',
            status: 'canceled'
          },
          {
            id_order: 2,
            date_order: '2002-02-02',
            status: 'complete'
          },
          {
            id_order: 3,
            date_order: '2003-03-03',
            status: 'delivered'
          }
        ]
      }

      const expectedInjectors = [
          {
            id: 1,
            date: '2001-01-01',
            status: 'canceled'
          },
          {
            id: 2,
            date: '2002-02-02',
            status: 'complete'
          },
          {
            id: 3,
            date: '2003-03-03',
            status: 'delivered'
          }
        ]

      activatedRoute.queryParams = new BehaviorSubject(allParams)
      fixture.detectChanges()

      let request = httpTestingController.expectOne('/find_order/1')
      expect(request.request.body).toEqual(allParams)
      expect(request.request.method).toBe('POST')
      expect(request.request.url).toBe('/find_order/1')

      request.flush(orderResponse)

      tick()

      expect(ordersResultComponent.hasError).toBe(false)
      expect(ordersResultComponent.orderComponent).toBe(ShortOrderInformationComponent)
      for (let i = 0; i < expectedInjectors.length; i++){
        expect(ordersResultComponent.orderInjectors[i].get(OrderInformation)).toEqual(expectedInjectors[i])
      }
    }))

    it('orders not found', fakeAsync(() => {
      activatedRoute.queryParams = new BehaviorSubject(allParams)
      fixture.detectChanges()

      let request = httpTestingController.expectOne('/find_order/1')
      expect(request.request.body).toEqual(allParams)
      expect(request.request.method).toBe('POST')
      expect(request.request.url).toBe('/find_order/1')

      request.flush({message: 'Order not found'}, {status: 404, statusText: 'Not found'})

      tick()

      expect(ordersResultComponent.hasError).toBe(true)
      expect(ordersResultComponent.errorComponent).toBe(BaseErrorComponent)
      expect(ordersResultComponent.errorInjector.get(ErrorMessage)).toEqual({message: 'Order not found', type: false})
    }))
  })
})
