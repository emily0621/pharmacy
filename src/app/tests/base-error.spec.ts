import { TestBed } from "@angular/core/testing";
import { BaseErrorComponent, ErrorMessage } from "../components/base-error/base-error.component";

describe('Error component testing', () => {
  let baseErrorComponent: BaseErrorComponent;
  let message: ErrorMessage;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BaseErrorComponent],
      providers: [
        {
          provide: ErrorMessage,
          useValue: {message: 'Error message', type: false}
        }
      ]
    })
    .compileComponents()
  })

  describe('', () => {
    beforeEach(() => {
      const component = TestBed.createComponent(BaseErrorComponent)
      baseErrorComponent = component.componentInstance
      component.detectChanges()
      message = TestBed.inject(ErrorMessage)
    })

    it('check error constructor', () => {
      expect(baseErrorComponent.message).toBe('Error message')
      expect(baseErrorComponent.class).toBe('error')
    })
  })

  describe('', () => {
    beforeEach(() => {
      TestBed.overrideProvider(ErrorMessage, {useValue: {message: 'Success message', type: true}})
      const component = TestBed.createComponent(BaseErrorComponent)
      baseErrorComponent = component.componentInstance
      component.detectChanges()
      message = TestBed.inject(ErrorMessage)
    })
    it('check success constructor', () => {
      message.message = 'Success message'
      message.type = true
      expect(baseErrorComponent.message).toBe('Success message')
      expect(baseErrorComponent.class).toBe('success')
    })
  })
})

describe('Check message constructor', () => {
  it('correct message', () => {
    const message = new ErrorMessage('message', false)
    expect(message.message).toBe('message')
    expect(message.type).toBe(false)
  })
})
