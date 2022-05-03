import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationFieldComponent } from './information-field.component';

describe('InformationFieldComponent', () => {
  let component: InformationFieldComponent;
  let fixture: ComponentFixture<InformationFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformationFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
