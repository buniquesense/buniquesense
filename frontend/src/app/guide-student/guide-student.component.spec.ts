import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideStudentComponent } from './guide-student.component';

describe('GuideStudentComponent', () => {
  let component: GuideStudentComponent;
  let fixture: ComponentFixture<GuideStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuideStudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuideStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
