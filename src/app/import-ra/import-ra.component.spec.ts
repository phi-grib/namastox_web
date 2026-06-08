import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportRaComponent } from './import-ra.component';

describe('ImportRaComponent', () => {
  let component: ImportRaComponent;
  let fixture: ComponentFixture<ImportRaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportRaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImportRaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
