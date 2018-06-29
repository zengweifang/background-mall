import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreAddSpTemplatesComponent } from './store-add-sp-templates.component';

describe('StoreAddSpTemplatesComponent', () => {
  let component: StoreAddSpTemplatesComponent;
  let fixture: ComponentFixture<StoreAddSpTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreAddSpTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreAddSpTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
