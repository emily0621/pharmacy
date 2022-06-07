import { Location } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { FindOrderComponent } from "../admin/find-order/find-order.component";
import { BaseErrorComponent, ErrorMessage } from "../components/base-error/base-error.component";
import { InputFieldComponent } from "../components/input-field/input-field.component";

@Component({template: ''})
export class TestComponent {}

describe('Find order testing', () => {
  let findOrderComponent: FindOrderComponent;
  let router: Router;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FindOrderComponent, InputFieldComponent, TestComponent],
      imports: [
        RouterTestingModule.withRoutes(
          [{path: 'orders/1', component: TestComponent}]
        ),
        HttpClientTestingModule,
        FormsModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents()

    const component = TestBed.createComponent(FindOrderComponent)
    findOrderComponent = component.componentInstance
    router = TestBed.inject(Router)
    location = TestBed.inject(Location)
    router.initialNavigation()
    component.detectChanges()
  })

  describe ('validate date', () => {

    it('valid date', () => {
      findOrderComponent.date = '01-01-2001'.split('~')
      expect(findOrderComponent.validateDate()).toBe(true)
    })

    it('invalid date', () => {
      findOrderComponent.date = 'invalid date'.split('~')
      expect(findOrderComponent.validateDate()).toBe(false)
    })

    it('valid period', () => {
      findOrderComponent.date = '01-01-2001 ~ 01-01-2004'.split('~')
      expect(findOrderComponent.validateDate()).toBe(true)
    })
  })

  describe('validate price', () => {

    it('valid price less then', () => {
      findOrderComponent.price = '<10'.split(' - ')
      expect(findOrderComponent.validatePrice()).toBe(true)
    })

    it('valid price bigger then', () => {
      findOrderComponent.price = '>10'.split(' - ')
      expect(findOrderComponent.validatePrice()).toBe(true)
    })

    it('invalid price', () => {
      const expectedMessage = {
        message: 'Use correct price format: ">{number}", "<{number}" or "{number1}" - "{number2}"',
        type: false
      }

      findOrderComponent.price = 'invalid price'.split(' - ')
      expect(findOrderComponent.validatePrice()).toBe(false)

      expect(findOrderComponent.hasError).toBe(true)
      expect(findOrderComponent.errorComponent).toBe(BaseErrorComponent)
      expect(findOrderComponent.errorInjector.get(ErrorMessage)).toEqual(expectedMessage)
    })

    it('valid price range', () => {
      findOrderComponent.price = '100 - 200'.split(' - ')
      expect(findOrderComponent.validatePrice()).toBe(true)
    })

    it('invalid price range', () => {
      const expectedMessage = {
        message: 'Price 2 must be greater then price 1',
        type: false
      }

      findOrderComponent.price = '200 - 100'.split(' - ')
      expect(findOrderComponent.validatePrice()).toBe(false)

      expect(findOrderComponent.hasError).toBe(true)
      expect(findOrderComponent.errorComponent).toBe(BaseErrorComponent)
      expect(findOrderComponent.errorInjector.get(ErrorMessage)).toEqual(expectedMessage)
    })

    it('unknown price format', () => {
      const expectedMessage = {
        message: 'Use correct price format: ">{number}", "<{number}" or "{number1}" - "{number2}"',
        type: false
      }

      findOrderComponent.price = '200 - 100 - 20'.split(' - ')
      expect(findOrderComponent.validatePrice()).toBe(false)

      expect(findOrderComponent.hasError).toBe(true)
      expect(findOrderComponent.errorComponent).toBe(BaseErrorComponent)
      expect(findOrderComponent.errorInjector.get(ErrorMessage)).toEqual(expectedMessage)
    })
  })

  describe('is date', () => {

    it('is valid date with correct order', () => {
      expect(findOrderComponent.isDate('2001-01-01')).toBe(true)
      expect(findOrderComponent.validDate).toEqual(['2001-01-01'])
    })

    it('is valid date with incorrect order', () => {
      expect(findOrderComponent.isDate('01-01-2001')).toBe(true)
      expect(findOrderComponent.validDate).toEqual(['2001-01-01'])
    })

    it('is invalid date with incorrect order', () => {
      expect(findOrderComponent.isDate('01-30-2001')).toBe(false)
    })

    it('is invalid date with correct order', () => {
      expect(findOrderComponent.isDate('2001-30-01')).toBe(false)
    })


  })

  describe('full validation', () => {

    it('all data is valid', () => {
      findOrderComponent.date = '01-01-2001 ~ 01-01-2004'.split(' ~ ')
      findOrderComponent.price = '<100'.split(' - ')
      expect(findOrderComponent.validation()).toBe(true)
    })

    it('date is invalid', () => {
      findOrderComponent.date = 'invalid date'.split(' ~ ')
      findOrderComponent.price = '<100'.split(' - ')
      expect(findOrderComponent.validation()).toBe(false)
    })

    it('price is invalid', () => {
      findOrderComponent.date = '01-01-2001 ~ 01-01-2004'.split(' ~ ')
      findOrderComponent.price = 'invalid price'.split(' - ')
      expect(findOrderComponent.validation()).toBe(false)
    })
  })

  describe('find order method', () => {

    it('correct data', fakeAsync(() => {
      const expectedPath: string = '/orders/1?date=2001-01-01&username=username&medicine=1&price=%3C&price=100&status=canceled&status=complete&status=delivered&status=in%20the%20process%20of%20delivery&status=is%20being%20prepared&status=ready%20to%20ship'
      findOrderComponent.input!.get(0)!.value! = '01-01-2001'
      findOrderComponent.input!.get(1)!.value! = 'username'
      findOrderComponent.input!.get(2)!.value! = '1'
      findOrderComponent.input!.get(3)!.value! = '<100'
      findOrderComponent.find()
      tick()
      expect(location.path()).toBe(expectedPath)
    }))

    it('with null values', fakeAsync(() => {
      const expectedPath: string = '/orders/1?status=canceled&status=complete&status=delivered&status=in%20the%20process%20of%20delivery&status=is%20being%20prepared&status=ready%20to%20ship'
      findOrderComponent.input!.get(0)!.value! = null
      findOrderComponent.input!.get(1)!.value! = null
      findOrderComponent.input!.get(2)!.value! = null
      findOrderComponent.input!.get(3)!.value! = null
      findOrderComponent.find()
      tick()
      expect(location.path()).toBe(expectedPath)
    }))
  })
})
