import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FirebaseFormService {

  private baseUrl =
    'https://firestore.googleapis.com/v1/projects/multi-agenda-f642d/databases/(default)/documents/formulario';

  constructor() {
    console.log("Servicio Firestore REST inicializado");
  }

  private getLocalDateISO(): string {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - offset)
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');
  }

  async guardarFormulario(data: any) {
    console.log("Enviando datos a Firestore REST:", data);

    const fields: any = {
      nombre: { stringValue: data.nombre || '' },
      cedula: { stringValue: data.cedula || '' },
      fechaRegistro: { stringValue: this.getLocalDateISO() }
    };

    if (data.identificador && data.identificador.trim() !== '') {
      fields.identificador = { stringValue: data.identificador };
    }

    const payload = { fields };

    try {
      const res = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const error = await res.text();
        console.error("Error en Firestore REST:", error);
        throw new Error(error);
      }

      const json = await res.json();
      console.log("Documento insertado:", json);

      return json;

    } catch (error) {
      console.error("Error fatal:", error);
      throw error;
    }
  }
}
