import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, push, get } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

// TU CONFIGURACIÓN (YA ESTÁ BIEN ✅)
const firebaseConfig = {
  apiKey: "AIzaSySyBG-Q440v7oe0seAVS1sgvp0dVotb4MSRM",
  authDomain: "inventario-refacciones-5afc3.firebaseapp.com",
  databaseURL: "https://inventario-refacciones-5afc3-default-rtdb.firebaseio.com",
  projectId: "inventario-refacciones-5afc3",
  storageBucket: "inventario-refacciones-5afc3.firebasestorage.app",
  messagingSenderId: "810331993251",
  appId: "1:810331993251:web:e5fbf73f65cb09c32b7b16",
  measurementId: "G-4G9PW0YFNK"
};

// INICIALIZAR FIREBASE
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db, "refacciones");

// ELEMENTOS DEL HTML
const form = document.getElementById("formRefacciones");
const btnConsultar = document.getElementById("btnConsultar");
const mensajeDiv = document.getElementById("mensaje");
const seccionConsulta = document.getElementById("seccionConsulta");
const tablaContenedor = document.getElementById("tablaRegistros");

// FUNCIÓN GUARDAR
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value.trim();
    const categoria = document.getElementById("categoria").value.trim();
    const dato = document.getElementById("dato").value.trim();
    const observaciones = document.getElementById("observaciones").value.trim();
    const fechaRegistro = new Date().toLocaleString();

    if (!nombre || !categoria || !dato) {
        mostrarMensaje("❌ Error: Los campos Nombre, Categoría y Dato son obligatorios", "error");
        return;
    }

    const nuevoRegistro = { nombre, categoria, dato_adicional: dato, observaciones, fecha_registro: fechaRegistro };

    push(dbRef, nuevoRegistro)
        .then(() => {
            mostrarMensaje("✅ Registro guardado correctamente", "exito");
            form.reset();
        })
        .catch((error) => mostrarMensaje("❌ Error al guardar: " + error.message, "error"));
});

// FUNCIÓN CONSULTAR
btnConsultar.addEventListener("click", () => {
    get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
            const datos = snapshot.val();
            let registros = [];
            Object.keys(datos).forEach(key => registros.push({ id: key, ...datos[key] }));

            let tablaHTML = `<table><tr><th>ID</th><th>Nombre</th><th>Categoría</th><th>Dato</th><th>Observaciones</th><th>Fecha</th></tr>`;
            registros.forEach(reg => {
                tablaHTML += `<tr>
                    <td>${reg.id.substring(0,6)}</td>
                    <td>${reg.nombre}</td>
                    <td>${reg.categoria}</td>
                    <td>${reg.dato_adicional}</td>
                    <td>${reg.observaciones || "Sin observaciones"}</td>
                    <td>${reg.fecha_registro}</td>
                </tr>`;
            });
            tablaHTML += `</table>`;
            tablaContenedor.innerHTML = tablaHTML;
            seccionConsulta.style.display = "block";
        } else {
            tablaContenedor.innerHTML = "<p>⚠️ No hay registros</p>";
            seccionConsulta.style.display = "block";
        }
    });
});

// MOSTRAR MENSAJES
function mostrarMensaje(texto, tipo) {
    mensajeDiv.textContent = texto;
    mensajeDiv.className = "mensaje " + tipo;
    mensajeDiv.style.display = "block";
    setTimeout(() => mensajeDiv.style.display = "none", 4000);
}
