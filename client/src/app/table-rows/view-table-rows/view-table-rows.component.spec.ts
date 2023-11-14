import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTableRowsComponent } from './view-table-rows.component';

describe('ViewTableRowsComponent', () => {
  let component: ViewTableRowsComponent;
  let fixture: ComponentFixture<ViewTableRowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTableRowsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTableRowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
