// Arreglo para almacenar las tareas
let tareas = JSON.parse(localStorage.getItem('tareas')) || [];

// Selección de elementos del DOM (Asegúrate de que tu HTML tenga estos IDs o ajustalos)
// Ejemplo de HTML esperado: <form id="form-tarea">, <input id="input-titulo">, etc.
const formTarea = document.querySelector('form'); 
const inputTitulo = document.querySelector('input[type="text"]'); 
const inputFecha = document.querySelector('input[type="date"]');
const gridTareas = document.querySelector('.grid-tareas');

// Elementos del Modal
const modal = document.querySelector('.modal');
const btnConfirmarEliminar = document.getElementById('btn-confirmar-eliminar');
const btnCancelarEliminar = document.querySelector('.btn-secundario');
let tareaAEliminarId = null;

// Event Listener para el formulario
formTarea.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const titulo = inputTitulo.value.trim();
    const fecha = inputFecha ? inputFecha.value : '';

    if (titulo === '') return;

    const nuevaTarea = {
        id: Date.now(), // ID único basado en el tiempo
        titulo: titulo,
        fecha: fecha,
        estado: 'pendiente' // Estados: pendiente, en-progreso, completada
    };

    tareas.push(nuevaTarea);
    guardarEnLocalStorage();
    renderizarTareas();
    formTarea.reset();
});

// Función para mostrar las tareas en pantalla
function renderizarTareas() {
    gridTareas.innerHTML = ''; // Limpiar el grid

    tareas.forEach(tarea => {
        // Determinar la clase CSS y texto según el estado
        let claseEstado = '';
        let textoEstado = '';

        if (tarea.estado === 'pendiente') {
            claseEstado = 'estado-pendiente';
            textoEstado = 'Pendiente';
        } else if (tarea.estado === 'en-progreso') {
            claseEstado = 'estado-en-progreso';
            textoEstado = 'En Progreso';
        } else {
            claseEstado = 'estado-completada';
            textoEstado = 'Completada';
        }

        // Crear la tarjeta (usando exactamente las clases de tu CSS)
        const tarjeta = document.createElement('div');
        tarjeta.className = `tarjeta-tarea ${claseEstado}`;
        
        tarjeta.innerHTML = `
            <div class="tarea-header">
                <h3>${tarea.titulo}</h3>
                <span class="etiqueta-estado">${textoEstado}</span>
            </div>
            <div class="tarea-body">
                ${tarea.fecha ? `<p><strong>Fecha límite:</strong> ${tarea.fecha}</p>` : ''}
            </div>
            <div class="tarea-acciones">
                <button class="btn-accion btn-cambiar-estado" onclick="avanzarEstado(${tarea.id})">
                    ${tarea.estado === 'completada' ? '↻ Reiniciar' : ' Avanzar'}
                </button>
                <button class="btn-accion btn-eliminar" onclick="abrirModal(${tarea.id})">
                    🗑️ Eliminar
                </button>
            </div>
        `;

        gridTareas.appendChild(tarjeta);
    });
}

// Función para cambiar el estado de la tarea
window.avanzarEstado = function(id) {
    const tareaIndex = tareas.findIndex(t => t.id === id);
    if (tareaIndex > -1) {
        const estadoActual = tareas[tareaIndex].estado;
        
        if (estadoActual === 'pendiente') {
            tareas[tareaIndex].estado = 'en-progreso';
        } else if (estadoActual === 'en-progreso') {
            tareas[tareaIndex].estado = 'completada';
        } else {
            tareas[tareaIndex].estado = 'pendiente'; // Vuelve a empezar si estaba completada
        }
        
        guardarEnLocalStorage();
        renderizarTareas();
    }
};

// Lógica del Modal para Eliminar
window.abrirModal = function(id) {
    tareaAEliminarId = id;
    if (modal) {
        modal.classList.remove('oculto');
    } else {
        // Si no tienes el modal en tu HTML, la elimina directamente con un confirm nativo
        if(confirm('¿Estás seguro de eliminar esta tarea?')) {
            eliminarTarea(id);
        }
    }
};

function cerrarModal() {
    if (modal) {
        modal.classList.add('oculto');
        tareaAEliminarId = null;
    }
}

function eliminarTarea(id) {
    tareas = tareas.filter(t => t.id !== id);
    guardarEnLocalStorage();
    renderizarTareas();
}

// Event Listeners del Modal (Si existen en el DOM)
if (btnCancelarEliminar) {
    btnCancelarEliminar.addEventListener('click', cerrarModal);
}

if (btnConfirmarEliminar) {
    btnConfirmarEliminar.addEventListener('click', () => {
        if (tareaAEliminarId !== null) {
            eliminarTarea(tareaAEliminarId);
            cerrarModal();
        }
    });
}

// Cerrar modal al hacer clic afuera
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) cerrarModal();
    });
}

// Función auxiliar para persistencia de datos
function guardarEnLocalStorage() {
    localStorage.setItem('tareas', JSON.stringify(tareas));
}

// Cargar tareas al iniciar
document.addEventListener('DOMContentLoaded', renderizarTareas);