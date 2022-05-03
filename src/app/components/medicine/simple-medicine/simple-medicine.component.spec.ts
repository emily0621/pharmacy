import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleMedicineComponent } from './simple-medicine.component';

describe('SimpleMedicineComponent', () => {
  let component: SimpleMedicineComponent;
  let fixture: ComponentFixture<SimpleMedicineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleMedicineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleMedicineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
