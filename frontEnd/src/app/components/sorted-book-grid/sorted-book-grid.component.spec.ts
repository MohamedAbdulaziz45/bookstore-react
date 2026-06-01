import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortedBookGridComponent } from './sorted-book-grid.component';

describe('SortedBookGridComponent', () => {
  let component: SortedBookGridComponent;
  let fixture: ComponentFixture<SortedBookGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SortedBookGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SortedBookGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
