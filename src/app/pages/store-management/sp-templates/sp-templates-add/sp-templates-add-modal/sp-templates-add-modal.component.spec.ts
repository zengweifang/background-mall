import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpTemplatesAddModalComponent } from './sp-templates-add-modal.component';

describe('SpTemplatesAddModalComponent', () => {
  let component: SpTemplatesAddModalComponent;
  let fixture: ComponentFixture<SpTemplatesAddModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpTemplatesAddModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpTemplatesAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
