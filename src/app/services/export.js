import { initializeApp } from "firebase/app";
import { getFirestore, getDocs, collection } from "firebase/firestore";
import XLSX from "xlsx";

const firebaseConfig = {
  apiKey: "AIzaSyAXjGSc2Oa5iZpaoWZP--I4_hPvs5OP8lA",
  authDomain: "multi-agenda-f642d.firebaseapp.com",
  projectId: "multi-agenda-f642d",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function exportToXLSX() {
  const snapshot = await getDocs(collection(db, "formulario"));

  const rows = snapshot.docs.map(doc => {
    const { identificador, ...dataSinIdentificador } = doc.data();
    return dataSinIdentificador;
  });

  if (rows.length === 0) {
    console.warn("No hay datos para exportar");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "formulario");
  XLSX.writeFile(workbook, "formulario.xlsx");
}

exportToXLSX().catch(err => console.error("Error exportando XLSX:", err));
