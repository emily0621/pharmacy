import { TestBed } from "@angular/core/testing";
import { InputFieldComponent } from "../components/input-field/input-field.component";

describe('Input field testing', () => {
  let inputFieldComponent: InputFieldComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InputFieldComponent]
    })
    .compileComponents()

    const component = TestBed.createComponent(InputFieldComponent)
    inputFieldComponent = component.componentInstance
    component.detectChanges()
  })

  it('check input as placeholder field', () => {
    inputFieldComponent.placeholder = 'placeholder value'
    expect(inputFieldComponent.numberValue()).toBe('placeholder value')
  })

  it('check input as value field', () => {
    inputFieldComponent.placeholder = 'placeholder value'
    inputFieldComponent.value = 'value'
    expect(inputFieldComponent.numberValue()).toBe('value')
  })
})
