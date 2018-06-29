import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpTemplatesAddComponent } from './sp-templates-add.component';

describe('SpTemplatesAddComponent', () => {
  let component: SpTemplatesAddComponent;
  let fixture: ComponentFixture<SpTemplatesAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpTemplatesAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpTemplatesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
