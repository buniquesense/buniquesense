import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryTestimonialsComponent } from './gallery-testimonials.component';

describe('GalleryTestimonialsComponent', () => {
  let component: GalleryTestimonialsComponent;
  let fixture: ComponentFixture<GalleryTestimonialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryTestimonialsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalleryTestimonialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
