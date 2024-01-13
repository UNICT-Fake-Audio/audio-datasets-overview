import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetVariationsComponent } from './dataset-variations.component';

describe('DatasetVariationsComponent', () => {
  let component: DatasetVariationsComponent;
  let fixture: ComponentFixture<DatasetVariationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatasetVariationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetVariationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
