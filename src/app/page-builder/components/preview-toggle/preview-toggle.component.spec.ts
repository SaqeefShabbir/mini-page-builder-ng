import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewToggleComponent } from './preview-toggle.component';

describe('PreviewToggleComponent', () => {
  let component: PreviewToggleComponent;
  let fixture: ComponentFixture<PreviewToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreviewToggleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
