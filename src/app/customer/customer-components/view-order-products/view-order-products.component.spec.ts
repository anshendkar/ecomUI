import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOrderProductsComponent } from './view-order-products.component';

describe('ViewOrderProductsComponent', () => {
  let component: ViewOrderProductsComponent;
  let fixture: ComponentFixture<ViewOrderProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewOrderProductsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewOrderProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
