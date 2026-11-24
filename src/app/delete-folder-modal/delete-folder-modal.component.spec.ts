import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenameRaModalComponent } from './delete-folder-modal.component';

describe('RenameRaModalComponent', () => {
  let component: RenameRaModalComponent;
  let fixture: ComponentFixture<RenameRaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RenameRaModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RenameRaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
