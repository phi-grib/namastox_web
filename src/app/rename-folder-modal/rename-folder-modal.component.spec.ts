import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenameFolderModalComponent } from './rename-folder-modal.component';

describe('RenameFolderModalComponent', () => {
  let component: RenameFolderModalComponent;
  let fixture: ComponentFixture<RenameFolderModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RenameFolderModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RenameFolderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
