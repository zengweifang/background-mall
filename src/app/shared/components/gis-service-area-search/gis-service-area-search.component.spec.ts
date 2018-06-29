import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GisServiceAreaSearchComponent } from './gis-service-area-search.component';

describe('GisServiceAreaSearchComponent', () => {
  let component: GisServiceAreaSearchComponent;
  let fixture: ComponentFixture<GisServiceAreaSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GisServiceAreaSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GisServiceAreaSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
