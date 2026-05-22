// ============================================
// CAPA DE DATOS Y LÓGICA CRUD
// ============================================
// Este archivo maneja:
// - Persistencia en localStorage
// - Funciones CRUD
// - Estado central de tareas
// ============================================

// Inicializar array de tareas desde localStorage o vacío
let tareas = JSON.parse(localStorage.getItem('tareas')) || [];

/**
 * Guarda el array completo de tareas en localStorage
 */
function guardarTareas() {
    localStorage.setItem('tareas', JSON.stringify(tareas));
}

/**
 * Crea una nueva tarea y la añade al array
 * @param {string} titulo - Título de la tarea
 * @param {string} responsable - Persona responsable
 * @param {string} fecha - Fecha límite (formato YYYY-MM-DD)
 * @returns {object} La tarea creada
 */
function crearTarea(titulo, responsable, fecha) {
    const nuevaTarea = {
        id: Date.now(),
        titulo: titulo.trim(),
        responsable: responsable.trim(),
        fecha: fecha,
        estado: 'pendiente' // Estados: pendiente, en-progreso, completada
    };
    
    tareas.push(nuevaTarea);
    guardarTareas();
    console.log(' Tarea creada:', nuevaTarea);
    return nuevaTarea;
}

/**
 * Elimina una tarea por su ID
 * @param {number} id - ID de la tarea a eliminar
 */
function eliminarTarea(id) {
    const index = tareas.findIndex(t => t.id === id);
    if (index !== -1) {
        const tareaEliminada = tareas[index];
        tareas.splice(index, 1);
        guardarTareas();
        console.log('🗑️ Tarea eliminada:', tareaEliminada.titulo);
    } else {
        console.warn(' Tarea no encontrada con ID:', id);
    }
}

/**
 * Actualiza los datos de una tarea existente
 * @param {number} id - ID de la tarea a actualizar
 * @param {object} datos - Objeto con las propiedades a actualizar
 */
function actualizarTarea(id, datos) {
    const index = tareas.findIndex(t => t.id === id);
    if (index !== -1) {
        tareas[index] = { ...tareas[index], ...datos };
        guardarTareas();
        console.log(' Tarea actualizada:', tareas[index]);
    } else {
        console.warn(' Tarea no encontrada con ID:', id);
    }
}

/**
 * Obtiene una tarea por su ID
 * @param {number} id - ID de la tarea
 * @returns {object|null} La tarea encontrada o null
 */
function obtenerTarea(id) {
    return tareas.find(t => t.id === id) || null;
}

/**
 * Obtiene todas las tareas filtradas por estado (opcional)
 * @param {string} estado - Estado a filtrar (pendiente, en-progreso, completada)
 * @returns {array} Array de tareas filtradas
 */
function obtenerTareasPorEstado(estado) {
    if (!estado) return tareas;
    return tareas.filter(t => t.estado === estado);
}

/**
 * Obtiene tareas que contengan un texto en el título o responsable
 * @param {string} texto - Texto a buscar
 * @returns {array} Array de tareas coincidentes
 */
function buscarTareas(texto) {
    const textoLower = texto.toLowerCase();
    return tareas.filter(t => 
        t.titulo.toLowerCase().includes(textoLower) || 
        t.responsable.toLowerCase().includes(textoLower)
    );
}

console.log(' tasks.js cargado - Funciones CRUD disponibles');
