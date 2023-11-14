import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTableModalComponent } from './select-table-modal.component';

describe('SelectTableModalComponent', () => {
  let component: SelectTableModalComponent;
  let fixture: ComponentFixture<SelectTableModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectTableModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectTableModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
