import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FirebaseFormService {

  private baseUrl =
    'https://firestore.googleapis.com/v1/projects/multi-agenda-f642d/databases/(default)/documents/formulario';

  constructor() {
    console.log("🔥 Servicio Firestore REST inicializado");
  }

  async guardarFormulario(data: any) {
    console.log("📌 Enviando datos a Firestore REST:", data);

    const payload = {
      fields: {
        nombre: { stringValue: data.nombre || '' },
        cedula: { stringValue: data.cedula || '' },
        identificador: { stringValue: data.identificador || '' },
        fechaRegistro: { stringValue: new Date().toISOString() }
      }
    };

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
        console.error("❌ Error en Firestore REST:", error);
        throw new Error(error);
      }

      const json = await res.json();
      console.log("✅ Documento insertado:", json);

      return json;

    } catch (error) {
      console.error("🔥 ERROR fatal:", error);
      throw error;
    }
  }
}
