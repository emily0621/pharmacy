import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortOrderInformationComponent } from './short-order-information.component';

describe('ShortOrderInformationComponent', () => {
  let component: ShortOrderInformationComponent;
  let fixture: ComponentFixture<ShortOrderInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShortOrderInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortOrderInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
