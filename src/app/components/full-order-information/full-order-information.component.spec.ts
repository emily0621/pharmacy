import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullOrderInformationComponent } from './full-order-information.component';

describe('FullOrderInformationComponent', () => {
  let component: FullOrderInformationComponent;
  let fixture: ComponentFixture<FullOrderInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullOrderInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FullOrderInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
