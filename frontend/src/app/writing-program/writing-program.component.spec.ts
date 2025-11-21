import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WritingProgramComponent } from './writing-program.component';

describe('WritingProgramComponent', () => {
  let component: WritingProgramComponent;
  let fixture: ComponentFixture<WritingProgramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WritingProgramComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WritingProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
