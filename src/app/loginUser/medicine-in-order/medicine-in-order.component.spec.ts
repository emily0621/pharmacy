import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicineInOrderComponent } from './medicine-in-order.component';

describe('MedicineInOrderComponent', () => {
  let component: MedicineInOrderComponent;
  let fixture: ComponentFixture<MedicineInOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicineInOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicineInOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
