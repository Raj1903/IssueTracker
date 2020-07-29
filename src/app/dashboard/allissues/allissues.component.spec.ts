import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllissuesComponent } from './allissues.component';

describe('AllissuesComponent', () => {
  let component: AllissuesComponent;
  let fixture: ComponentFixture<AllissuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllissuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllissuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
