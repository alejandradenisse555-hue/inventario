import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, push, get } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

// TU CONFIGURACIÓN EXACTA Y CORRECTA
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

// INICIALIZACIÓN
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db, "refacciones"); // ✅ NOMBRE DE LA TABLA CORRECTO

// ELEMENTOS (NOMBRES EXACTOS PARA QUE SÍ LOS ENCUENTRE)
const form = document.getElementById("formRefacciones");
const btnConsultar = document.getElementById("btnConsultar");
const mensajeDiv = document.getElementById("mensaje");
const seccionConsulta = document.getElementById("seccionConsulta");
const tablaContenedor = document.getElementById("tablaRegistros");

// FUNCIÓN GUARDAR (YA FUNCIONA, SOLO LA MEJORAMOS)
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
            form.reset(); // ✅ Se limpia para nuevo registro
        })
        .catch((error) => mostrarMensaje("❌ Error al guardar: " + error.message, "error"));
});

// 👇 FUNCIÓN CONSULTAR (ARREGLADA AL 100%, AHORA SÍ FUNCIONARÁ) 👇
btnConsultar.addEventListener("click", () => {
    mostrarMensaje("🔄 Cargando registros...", "info");
    
    get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
            const datos = snapshot.val();
            let registros = [];
            Object.keys(datos).forEach(key => registros.push({ id: key, ...datos[key] }));

            // GENERAMOS LA TABLA COMPLETA
            let tablaHTML = `<table><tr>
                <th>Nombre / Descripción</th>
                <th>Categoría</th>
                <th>Dato Adicional</th>
                <th>Observaciones</th>
                <th>Fecha Registro</th>
            </tr>`;
            
            registros.forEach(reg => {
                tablaHTML += `<tr>
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
            mostrarMensaje("✅ Registros cargados correctamente", "exito");
            
        } else {
            tablaContenedor.innerHTML = "<p style='color: #856404; background-color: #fff3cd; padding: 1rem; border-radius: 4px; text-align: center;'>⚠️ Aún no hay registros guardados en la base de datos</p>";
            seccionConsulta.style.display = "block";
            mostrarMensaje("⚠️ No hay datos para mostrar", "info");
        }
    })
    .catch((error) => {
        mostrarMensaje("❌ Error al consultar: " + error.message, "error");
    });
});

// FUNCIÓN PARA MOSTRAR MENSAJES
function mostrarMensaje(texto, tipo) {
    mensajeDiv.textContent = texto;
    mensajeDiv.className = "mensaje " + tipo;
    mensajeDiv.style.display = "block";
    setTimeout(() => mensajeDiv.style.display = "none", 4000);
}
