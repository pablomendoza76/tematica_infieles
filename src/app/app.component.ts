import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { FirebaseFormService } from './services/firebase-form.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'pagina_personalidad';

  private firebaseService = inject(FirebaseFormService);
  formulario: FormGroup;

  mostrarIntroModal = true;
  mostrarResultado = false;
  cargando = false;
  mostrarCupon = false;
  progresoCarga = 0;

  mensajeFinal = '';
  tituloResultado = '';

  enviando = false;

  frases = [
    "Dicen que tu amor es tan bonito que hasta los celos te quedan tiernos.",
    "Que cuando quieres, quieres tan fuerte que hasta el Wi-Fi se pone estable.",
    "Hablan de ti como alguien fiel… pero también como alguien que se roba el último pedazo de comida.",
    "Dicen que amas tan rico que hasta los domingos parecen viernes.",
    "Que contigo el corazón late bonito… y a veces más rápido cuando sonríes así sin aviso.",
    "Dicen que tu forma de amar da paz… excepto cuando te da por extrañarme de golpe.",
    "Que eres tan estable que hasta mi ansiedad te quiere.",
    "Dicen que contigo no hay dudas… solo ganas.",
    "Hablan de ti como alguien que no juega… pero sí enamora sin querer.",
    "Dicen que tu lealtad es tan seria que hasta mis inseguridades descansan.",
    "Que cuando abrazas, el mundo se arregla… aunque sea solo por 7 segundos.",
    "Dicen que tu amor es suavecito, pero pega.",
    "Que contigo el drama no existe… solo besos pendientes.",
    "Dicen que tu corazón es fiel… y que tu mirada debería tener advertencia.",
    "Hablan de ti como alguien que cuida… y que también conquista sin proponérselo.",
    "Dicen que tu amor es tan real que da miedo.",
    "Que contigo no hay juegos… solo ternura.",
    "Dicen que cuando te enamoras, te vuelves poesía.",
    "Que tu manera de querer es tan honesta que provoca quedarse.",
    "Dicen que con tus besos hasta las preocupaciones descansan."
  ];

  titulos = [
    "Sobre ti se escucha esto:",
    "Esto es lo que se sabe de ti:",
    "Lo que se habla de ti es esto:",
    "Tu fama anda diciendo que:",
    "Lo que tienes a la gente hablando es esto:",
    "Tu reputación sentimental dice que:"
  ];

  constructor(private fb: FormBuilder) {
    this.formulario = this.fb.group({
      nombre: [''],
      cedula: [''],
      identificador: ['']
    });
  }

  private validarAlMenosUno(): boolean {
    const nombre = this.formulario.get('nombre')?.value?.trim();
    const cedula = this.formulario.get('cedula')?.value?.trim();
    return !!nombre || !!cedula;
  }

  cerrarIntroModal() {
    this.mostrarIntroModal = false;
  }

  async enviarFormulario() {

    if (this.enviando) return;
    this.enviando = true;

    if (!this.validarAlMenosUno()) {
      alert("Ingresa nombre o cédula.");
      this.enviando = false;
      return;
    }

    try {
      await this.firebaseService.guardarFormulario({
        nombre: this.formulario.get('nombre')?.value || '',
        cedula: this.formulario.get('cedula')?.value || '',
        identificador: this.formulario.get('identificador')?.value || ''
      });
    } catch (error) {
      console.error("Error al guardar:", error);
    }

    const idx = Math.floor(Math.random() * this.frases.length);
    this.mensajeFinal = this.frases[idx];

    const t = Math.floor(Math.random() * this.titulos.length);
    this.tituloResultado = this.titulos[t];

    this.mostrarResultado = true;
    this.mostrarCupon = false;

    this.enviando = false;
  }

  iniciarDescubrimiento() {
    this.cargando = true;
    this.progresoCarga = 0;

    const intervalo = setInterval(() => {
      this.progresoCarga += 1.5;

      if (this.progresoCarga >= 100) {
        clearInterval(intervalo);
        this.cargando = false;
        this.mostrarCupon = true;
      }
    }, 80);
  }

  soloNumeros(event: any) {
    const valor = event.target.value.replace(/[^0-9]/g, '');
    this.formulario.get('cedula')?.setValue(valor, { emitEvent: false });
  }

  esSoloNumerosInvalid(): boolean {
    const val = this.formulario.get('cedula')?.value;
    if (!val) return false;
    return /[^0-9]/.test(val);
  }

  cedulaTamanoIncorrecto(): boolean {
    const val = this.formulario.get('cedula')?.value;
    if (!val) return false;
    return val.length < 10 || val.length > 13;
  }

  resetResultado() {
    this.mostrarResultado = false;
    this.mostrarCupon = false;
    this.cargando = false;
    this.progresoCarga = 0;
    this.formulario.reset();
  }

}
