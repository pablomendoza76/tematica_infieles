import { initializeApp } from "firebase/app";
import { getFirestore, getDocs, collection } from "firebase/firestore";
import XLSX from "xlsx";

const firebaseConfig = {
  apiKey: "AIzaSyAXjGSc2Oa5iZpaoWZP--I4_hPvs5OP8lA",
  authDomain: "multi-agenda-f642d.firebaseapp.com",
  projectId: "multi-agenda-f642d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function exportToXLSX() {
  const snap = await getDocs(collection(db, "formulario"));
  const rows = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "formulario");
  XLSX.writeFile(wb, "formulario.xlsx");
}

exportToXLSX();
