// Importar funciones de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, push, get, orderByChild } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

// ---------------- CONFIGURACIÓN BASE DE DATOS ----------------
const firebaseConfig = {
  apiKey: "AIzaSyB8uXZJkYgF9xQZ7yR2s3W4e5T6u7I8o9pA",
  authDomain: "inventario-refacciones.firebaseapp.com",
  databaseURL: "https://inventario-refacciones-default-rtdb.firebaseio.com",
  projectId: "inventario-refacciones",
  storageBucket: "inventario-refacciones.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456ghi789jkl0"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db, "refacciones"); // NOMBRE DE LA TABLA (1 sola tabla)

// ---------------- ELEMENTOS DEL DOM ----------------
const form = document.getElementById("formRefacciones");
const btnConsultar = document.getElementById("btnConsultar");
const mensajeDiv = document.getElementById("mensaje");
const seccionConsulta = document.getElementById("seccionConsulta");
const tablaContenedor = document.getElementById("tablaRegistros");

// ---------------- FUNCIÓN: GUARDAR REGISTRO ----------------
form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Obtener valores
    const nombre = document.getElementById("nombre").value.trim();
    const categoria = document.getElementById("categoria").value.trim();
    const dato = document.getElementById("dato").value.trim();
    const observaciones = document.getElementById("observaciones").value.trim();
    const fechaRegistro = new Date().toLocaleString(); // Fecha y hora automática

    // Validación: no dejar campos vacíos
    if (!nombre || !categoria || !dato) {
        mostrarMensaje("❌ Error: Los campos Nombre, Categoría y Dato son obligatorios", "error");
        return;
    }

    // Crear objeto con datos
    const nuevoRegistro = {
        nombre: nombre,
        categoria: categoria,
        dato_adicional: dato,
        observaciones: observaciones,
        fecha_registro: fechaRegistro
    };

    // Guardar en base de datos
    push(dbRef, nuevoRegistro)
        .then(() => {
            mostrarMensaje("✅ Registro guardado correctamente", "exito");
            form.reset(); // Limpiar formulario
        })
        .catch((error) => {
            mostrarMensaje("❌ Error al guardar: " + error.message, "error");
        });
});

// ---------------- FUNCIÓN: CONSULTAR TODOS LOS REGISTROS ----------------
btnConsultar.addEventListener("click", () => {
    get(dbRef, orderByChild("fecha_registro"))
        .then((snapshot) => {
            if (snapshot.exists()) {
                const datos = snapshot.val();
                let registros = [];

                // Convertir objeto a arreglo
                Object.keys(datos).forEach(key => {
                    registros.push({ id: key, ...datos[key] });
                });

                // Generar tabla HTML
                let tablaHTML = `
                <table>
                    <tr>
                        <th>ID</th>
                        <th>Nombre / Descripción</th>
                        <th>Categoría</th>
                        <th>Dato adicional</th>
                        <th>Observaciones</th>
                        <th>Fecha Registro</th>
                    </tr>
                `;

                registros.forEach(reg => {
                    tablaHTML += `
                    <tr>
                        <td>${reg.id.substring(0,6)}</td>
                        <td>${reg.nombre}</td>
                        <td>${reg.categoria}</td>
                        <td>${reg.dato_adicional}</td>
                        <td>${reg.observaciones || "Sin observaciones"}</td>
                        <td>${reg.fecha_registro}</td>
                    </tr>
                    `;
                });

                tablaHTML += `</table>`;
                tablaContenedor.innerHTML = tablaHTML;
                seccionConsulta.style.display = "block";
                seccionConsulta.scrollIntoView({ behavior: "smooth" });

            } else {
                tablaContenedor.innerHTML = "<p>⚠️ No hay registros almacenados</p>";
                seccionConsulta.style.display = "block";
            }
        })
        .catch((error) => {
            mostrarMensaje("❌ Error al consultar: " + error.message, "error");
        });
});

// ---------------- FUNCIÓN: MOSTRAR MENSAJES ----------------
function mostrarMensaje(texto, tipo) {
    mensajeDiv.textContent = texto;
    mensajeDiv.className = "mensaje " + tipo;
    mensajeDiv.style.display = "block";

    // Ocultar después de 4 segundos
    setTimeout(() => {
        mensajeDiv.style.display = "none";
    }, 4000);
}
