import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValigatorFieldComponent } from './valigator-field.component';

describe('ValigatorFieldComponent', () => {
  let component: ValigatorFieldComponent;
  let fixture: ComponentFixture<ValigatorFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValigatorFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValigatorFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
