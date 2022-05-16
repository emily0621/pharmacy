import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersResultComponent } from './orders-result.component';

describe('OrdersResultComponent', () => {
  let component: OrdersResultComponent;
  let fixture: ComponentFixture<OrdersResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdersResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
