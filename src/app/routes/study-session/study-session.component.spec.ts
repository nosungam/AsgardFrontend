import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudySessionComponent } from './study-session.component';

describe('StudySessionComponent', () => {
  let component: StudySessionComponent;
  let fixture: ComponentFixture<StudySessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudySessionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudySessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
