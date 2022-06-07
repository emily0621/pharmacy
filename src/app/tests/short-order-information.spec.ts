import { Location } from "@angular/common";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { OrderInformation, ShortOrderInformationComponent } from "../components/short-order-information/short-order-information.component";
import { TestComponent } from "./find-order.spec";

describe('Order information testing', () => {
  let fixture: ComponentFixture<ShortOrderInformationComponent>
  let shortOrderInformationComponent: ShortOrderInformationComponent
  let httpTestingController: HttpTestingController
  let orderInformation: OrderInformation
  let location: Location

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShortOrderInformationComponent],
      imports: [
        RouterTestingModule.withRoutes([
          {path: 'not_found', component: TestComponent},
          {path: 'order_page/:id', component: TestComponent}
        ]),
        HttpClientTestingModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: OrderInformation, useValue: {id: 1, date: '2001-01-01', status: 'canceled'} }
      ]
    })
    .compileComponents()
  })

  describe('build order component', () => {

    describe('', () => {
      beforeEach(() => {
        orderInformation = TestBed.inject(OrderInformation)
        fixture = TestBed.createComponent(ShortOrderInformationComponent)
        shortOrderInformationComponent = fixture.componentInstance
        httpTestingController = TestBed.inject(HttpTestingController)
        location = TestBed.inject(Location)
      })

      it('successful build', fakeAsync(() => {
        orderInformation = TestBed.inject(OrderInformation)
        const orderResponse = {
          medicine: ['medicine1', 'medicine2'],
          count: [10, 5]
        }
        const request = httpTestingController.expectOne('/medicine_from_order_with_count/1')
        expect(request.request.method).toBe('GET')
        expect(request.request.url).toBe('/medicine_from_order_with_count/1')

        request.flush(orderResponse)
        tick()

        expect(shortOrderInformationComponent.medicines).toBe('medicine1x10, medicine2x5')
      }))

      it('successful build with long medicine name', fakeAsync(() => {
        orderInformation = TestBed.inject(OrderInformation)
        const orderResponse = {
          medicine: ['medicine1', 'medicine2', 'medicine3', 'medicine4', 'medicine5'],
          count: [10, 5, 11, 3, 5]
        }
        const request = httpTestingController.expectOne('/medicine_from_order_with_count/1')
        expect(request.request.method).toBe('GET')
        expect(request.request.url).toBe('/medicine_from_order_with_count/1')

        request.flush(orderResponse)
        tick()

        expect(shortOrderInformationComponent.medicines).toBe('medicine1x10, medicine2x5, medicine3x11, medici...')
      }))

      it('navigate to medicine', fakeAsync(() => {
        shortOrderInformationComponent.navigateToMedicine()
        tick()
        expect(location.path()).toBe('/order_page/1')
      }))
    })

    describe('order not found', () => {
      beforeEach(() => {
        TestBed.overrideProvider(OrderInformation, {useValue: {id: 1000, date: '2001-01-01', status: 'canceled'}})
        orderInformation = TestBed.inject(OrderInformation)
        fixture = TestBed.createComponent(ShortOrderInformationComponent)
        shortOrderInformationComponent = fixture.componentInstance
        httpTestingController = TestBed.inject(HttpTestingController)
        location = TestBed.inject(Location)
      })

      it('', fakeAsync(() => {

        const request = httpTestingController.expectOne('/medicine_from_order_with_count/1000')
        expect(request.request.method).toBe('GET')
        expect(request.request.url).toBe('/medicine_from_order_with_count/1000')

        request.flush({message: 'Order not found'}, {status: 404, statusText: 'Not found'})
        tick()

        expect(location.path()).toBe('/not_found')

        fixture.detectChanges()

      }))
    })
  })
})
