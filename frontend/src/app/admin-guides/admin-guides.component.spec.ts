import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGuidesComponent } from './admin-guides.component';

describe('AdminGuidesComponent', () => {
  let component: AdminGuidesComponent;
  let fixture: ComponentFixture<AdminGuidesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminGuidesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminGuidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
