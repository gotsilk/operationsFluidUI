import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableLookupComponent } from './table-lookup.component';

describe('TableLookupComponent', () => {
  let component: TableLookupComponent;
  let fixture: ComponentFixture<TableLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableLookupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
