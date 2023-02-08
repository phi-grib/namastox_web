import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralInfomrationComponent } from './general-infomration.component';

describe('GeneralInfomrationComponent', () => {
  let component: GeneralInfomrationComponent;
  let fixture: ComponentFixture<GeneralInfomrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralInfomrationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralInfomrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
