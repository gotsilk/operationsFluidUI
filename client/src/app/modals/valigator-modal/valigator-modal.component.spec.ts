import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValigatorModalComponent } from './valigator-modal.component';

describe('ValigatorModalComponent', () => {
  let component: ValigatorModalComponent;
  let fixture: ComponentFixture<ValigatorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValigatorModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValigatorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
