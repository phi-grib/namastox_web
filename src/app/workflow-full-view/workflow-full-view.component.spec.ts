import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowFullViewComponent } from './workflow-full-view.component';

describe('WorkflowFullViewComponent', () => {
  let component: WorkflowFullViewComponent;
  let fixture: ComponentFixture<WorkflowFullViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowFullViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkflowFullViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
