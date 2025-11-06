import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroMovimento } from './registro-movimento';

describe('RegistroMovimento', () => {
  let component: RegistroMovimento;
  let fixture: ComponentFixture<RegistroMovimento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroMovimento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroMovimento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
