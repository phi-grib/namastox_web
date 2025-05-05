import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowOptionsComponent } from './workflow-options.component';

describe('WorkflowOptionsComponent', () => {
  let component: WorkflowOptionsComponent;
  let fixture: ComponentFixture<WorkflowOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowOptionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkflowOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
