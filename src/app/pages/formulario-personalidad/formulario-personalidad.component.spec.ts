import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioPersonalidadComponent } from './formulario-personalidad.component';

describe('FormularioPersonalidadComponent', () => {
  let component: FormularioPersonalidadComponent;
  let fixture: ComponentFixture<FormularioPersonalidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioPersonalidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioPersonalidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
