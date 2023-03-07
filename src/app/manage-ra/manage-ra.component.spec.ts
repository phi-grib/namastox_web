import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRaComponent } from './manage-ra.component';

describe('ManageRaComponent', () => {
  let component: ManageRaComponent;
  let fixture: ComponentFixture<ManageRaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageRaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageRaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
