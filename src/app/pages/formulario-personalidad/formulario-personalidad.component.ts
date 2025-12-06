import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirebaseFormService } from '../../services/firebase-form.service';

@Component({
  selector: 'app-formulario-personalidad',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formulario-personalidad.component.html',
  styleUrls: ['./formulario-personalidad.component.scss']
})
export class FormularioPersonalidadComponent {

  // Formulario principal
  formulario: FormGroup;

  // Archivo cargado por el usuario
  archivo: File | null = null;

  // Datos de vista previa
  previewUrl: string | null = null;
  isImage = false;
  isVideo = false;

  // Control del modal
  mostrarModal = false;

  // Mensaje aleatorio seleccionado
  mensajeFinal = '';

  // Para que el formulario no se pierda al abrir el modal
  formSnapshot: any = null;

  // Lista de frases posibles
  frases = [
    "Fiel pero con pinta de sospechoso profesional",
    "Infiel imaginario, fiel en la vida real",
    "Fiel certificado, tentaciones rechazadas",
    "Infiel de chiste, leal de corazón",
    "Fiel 99%, el 1% es puro meme",
    "Infiel en teorías, fiel en prácticas",
    "Fiel aprobado por la vida, reprobado por los chismes",
    "Infiel en los test, fiel en la realidad",
    "Fiel pero mal interpretado por las estadísticas",
    "Infiel según los rumores, fiel según tu alma",
    "Fiel con historial limpio",
    "Infiel nivel broma, nada serio",
    "Fiel con corazón blindado",
    "Infiel con cero pruebas, solo risas",
    "Fiel modo experto activado",
    "Infiel fallido, fiel por destino",
    "Fiel con exceso de ternura",
    "Infiel descartado por el sistema",
    "Fiel reconocido internacionalmente",
    "Infiel en caricaturas, fiel en la vida cotidiana"
  ];

  constructor(private fb: FormBuilder, private firebaseSrv: FirebaseFormService) {

    // Estructura del formulario
    this.formulario = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      cedula: ['', [
        Validators.required,
        Validators.pattern(/^\d{10}$/)  // 10 números exactos
      ]],
      correo: ['', [
        Validators.required,
        Validators.email
      ]],
      celular: ['', [
        Validators.required,
        Validators.pattern(/^\d{10}$/) // 10 dígitos para celular
      ]],
    });
  }

  // Manejar archivo seleccionado
  cargarArchivo(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.archivo = file;

    // Crear vista previa local
    this.previewUrl = URL.createObjectURL(file);

    // Identificar tipo
    this.isImage = file.type.startsWith('image');
    this.isVideo = file.type.startsWith('video');
  }

  // Enviar datos + asignar frase aleatoria
  async enviarFormulario() {
    // Validación completa
    if (this.formulario.invalid) {
      alert("Por favor completa todos los campos correctamente antes de continuar.");
      this.formulario.markAllAsTouched();
      return;
    }

    // Validación de archivo (si deseas hacerlo obligatorio)
    if (!this.archivo) {
      alert("Por favor carga una imagen o video.");
      return;
    }

    // Elegir frase aleatoria
    const index = Math.floor(Math.random() * this.frases.length);
    this.mensajeFinal = this.frases[index];

    // Guardar snapshot del form
    this.formSnapshot = { ...this.formulario.value };

    // Mostrar modal
    this.mostrarModal = true;

    // Combinar datos
    const data = {
      ...this.formulario.value,
      mensajeFinal: this.mensajeFinal
    };

    try {
      await this.firebaseSrv.guardarFormulario(data, this.archivo ?? undefined);
      console.log('Formulario guardado en Firebase');
      this.formulario.reset();
      this.archivo = null;
      this.previewUrl = null;
      this.isImage = false;
      this.isVideo = false;

      alert("Formulario enviado correctamente.");

    } catch (error) {
      console.error('Error al guardar en Firebase', error);
      alert("Ocurrió un error al enviar el formulario. Inténtalo nuevamente.");
    }
  }


  // Limpiar formulario y vista previa
  limpiar() {
    this.formulario.reset();
    this.previewUrl = null;
    this.archivo = null;
  }

  // Cerrar modal y restaurar datos si es necesario
  cerrarModal() {
    this.mostrarModal = false;

    // Si Angular borró el form, recuperarlo
    if (this.formSnapshot) {
      this.formulario.patchValue(this.formSnapshot);
    }
  }
}
