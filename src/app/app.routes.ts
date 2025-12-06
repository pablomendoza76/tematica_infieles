import { Routes } from '@angular/router';
import { FormularioPersonalidadComponent } from './pages/formulario-personalidad/formulario-personalidad.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'formulario',
    pathMatch: 'full'
  },
  {
    path: 'formulario',
    component: FormularioPersonalidadComponent
  }
];
