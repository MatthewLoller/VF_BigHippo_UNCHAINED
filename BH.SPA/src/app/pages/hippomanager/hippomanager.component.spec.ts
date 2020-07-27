import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HippomanagerComponent } from './hippomanager.component';

describe('HippomanagerComponent', () => {
  let component: HippomanagerComponent;
  let fixture: ComponentFixture<HippomanagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HippomanagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HippomanagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
