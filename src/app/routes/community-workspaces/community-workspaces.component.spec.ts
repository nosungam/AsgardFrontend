import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityWorkspacesComponent } from './community-workspaces.component';

describe('CommunityWorkspacesComponent', () => {
  let component: CommunityWorkspacesComponent;
  let fixture: ComponentFixture<CommunityWorkspacesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunityWorkspacesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommunityWorkspacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
