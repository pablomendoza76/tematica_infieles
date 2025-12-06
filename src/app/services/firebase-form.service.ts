import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

@Injectable({ providedIn: 'root' })
export class FirebaseFormService {

  constructor(
    private firestore: Firestore,
    private storage: Storage
  ) {}

  async guardarFormulario(data: any, archivo?: File) {
    let archivoUrl = null;

    // Subir imagen/video si existe
    if (archivo) {
      const archivoRef = ref(this.storage, `formularios/${Date.now()}_${archivo.name}`);
      await uploadBytes(archivoRef, archivo);
      archivoUrl = await getDownloadURL(archivoRef);
    }

    // Guardar en Firestore
    const col = collection(this.firestore, 'formularios');

    return addDoc(col, {
      ...data,
      archivoUrl,
      fecha: new Date()
    });
  }
}
