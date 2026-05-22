// ============================================
// CAPA DE PRESENTACIÓN Y EVENTOS
// ============================================
// Este archivo maneja:
// - Renderizado del DOM
// - Event listeners
// - Interacción del usuario
// ============================================

// ========== SELECTORES DEL DOM ==========
const contenedorTareas = document.getElementById('contenedor-tareas');
const formularioTarea = document.getElementById('formulario-tarea');
const inputTitulo = document.getElementById('input-titulo');
const inputResponsable = document.getElementById('input-responsable');
const inputFecha = document.getElementById('input-fecha');
const modalEditar = document.getElementById('modal-editar');
const formularioEditar = document.getElementById('formulario-editar');
const btnCerrarModal = document.getElementById('btn-cerrar-modal');

// Variable para rastrear qué tarea se está editando
let tareaEditandoId = null;

// ========== FUNCIÓN PRINCIPAL DE RENDERIZADO ==========
/**
 * Renderiza todas las tareas en el DOM
 * Actualiza la visualización cada vez que cambia el estado
 */
function render() {
    // Limpiar contenedor
    contenedorTareas.innerHTML = '';
    
    // Mensaje si no hay tareas
    if (tareas.length === 0) {
        contenedorTareas.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
                <p style="font-size: 1.1rem;">📝 No hay tareas registradas.</p>
                <p style="font-size: 0.95rem; margin-top: 10px;">¡Agrega una nueva tarea para comenzar!</p>
            </div>
        `;
        return;
    }
    
    // Renderizar cada tarea
    tareas.forEach(tarea => {
        const tarjeta = crearTarjetaTarea(tarea);
        contenedorTareas.appendChild(tarjeta);
    });
    
    console.log(` DOM actualizado - ${tareas.length} tarea(s) renderizada(s)`);
}

/**
 * Crea el elemento HTML de una tarjeta de tarea
 * @param {object} tarea - Objeto con datos de la tarea
 * @returns {HTMLElement} Elemento div con la tarjeta
 */
function crearTarjetaTarea(tarea) {
    const div = document.createElement('div');
    div.className = `tarjeta-tarea estado-${tarea.estado}`;
    div.dataset.id = tarea.id;
    
    // Determinar texto del estado
    const estadosTexto = {
        'pendiente': 'Pendiente',
        'en-progreso': 'En Progreso',
        'completada': 'Completada'
    };
    
    const textoEstado = estadosTexto[tarea.estado] || 'Desconocido';
    
    // Formatear fecha para mejor legibilidad
    let fechaFormato = tarea.fecha;
    if (tarea.fecha) {
        const [año, mes, día] = tarea.fecha.split('-');
        fechaFormato = `${día}/${mes}/${año}`;
    }
    
    // Crear HTML de la tarjeta
    div.innerHTML = `
        <div class="tarea-header">
            <h3>${escapeHTML(tarea.titulo)}</h3>
            <span class="etiqueta-estado">${textoEstado}</span>
        </div>
        <div class="tarea-body">
            <p><strong> Responsable:</strong> ${escapeHTML(tarea.responsable)}</p>
            <p><strong> Fecha límite:</strong> ${fechaFormato}</p>
        </div>
        <div class="tarea-acciones">
            <button class="btn-accion btn-cambiar-estado" data-id="${tarea.id}" title="Cambiar estado">
                 Estado
            </button>
            <button class="btn-accion btn-editar" data-id="${tarea.id}" title="Editar tarea">
                 Editar
            </button>
            <button class="btn-accion btn-eliminar" data-id="${tarea.id}" title="Eliminar tarea">
                 Eliminar
            </button>
        </div>
    `;
    
    return div;
}

/**
 * Escapa caracteres HTML para evitar inyecciones
 * @param {string} texto - Texto a escapar
 * @returns {string} Texto escapado
 */
function escapeHTML(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

// ========== EVENT LISTENERS - FORMULARIO DE CREACIÓN ==========
formularioTarea.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const titulo = inputTitulo.value.trim();
    const responsable = inputResponsable.value.trim();
    const fecha = inputFecha.value;
    
    // Validaciones
    if (!titulo) {
        alert('⚠️ Por favor ingresa un título para la tarea');
        inputTitulo.focus();
        return;
    }
    
    if (!responsable) {
        alert('⚠️ Por favor ingresa el responsable de la tarea');
        inputResponsable.focus();
        return;
    }
    
    if (!fecha) {
        alert('⚠️ Por favor selecciona una fecha límite');
        inputFecha.focus();
        return;
    }
    
    // Crear tarea y actualizar UI
    crearTarea(titulo, responsable, fecha);
    formularioTarea.reset();
    render();
    inputTitulo.focus();
});

// ========== EVENT LISTENERS - ACCIONES DE TAREAS ==========
contenedorTareas.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    
    const id = parseInt(btn.dataset.id);
    
    if (btn.classList.contains('btn-eliminar')) {
        manejarEliminar(id);
    } else if (btn.classList.contains('btn-cambiar-estado')) {
        manejarCambiarEstado(id);
    } else if (btn.classList.contains('btn-editar')) {
        manejarEditar(id);
    }
});

/**
 * Maneja la eliminación de una tarea con confirmación
 * @param {number} id - ID de la tarea a eliminar
 */
function manejarEliminar(id) {
    const tarea = obtenerTarea(id);
    if (!tarea) return;
    
    if (confirm(`¿Estás seguro de eliminar la tarea "${tarea.titulo}"?`)) {
        eliminarTarea(id);
        render();
        console.log(' Tarea eliminada desde UI');
    }
}

/**
 * Maneja el cambio de estado (pendiente → en-progreso → completada → pendiente)
 * @param {number} id - ID de la tarea
 */
function manejarCambiarEstado(id) {
    const tarea = obtenerTarea(id);
    if (!tarea) return;
    
    const estadosSecuencia = ['pendiente', 'en-progreso', 'completada'];
    const indiceActual = estadosSecuencia.indexOf(tarea.estado);
    const proximoIndice = (indiceActual + 1) % 3;
    const nuevoEstado = estadosSecuencia[proximoIndice];
    
    actualizarTarea(id, { estado: nuevoEstado });
    render();
    console.log(`✅ Estado actualizado: ${tarea.estado} → ${nuevoEstado}`);
}

/**
 * Abre el modal de edición con los datos de la tarea
 * @param {number} id - ID de la tarea a editar
 */
function manejarEditar(id) {
    const tarea = obtenerTarea(id);
    if (!tarea) return;
    
    tareaEditandoId = id;
    
    // Llenar formulario con datos actuales
    document.getElementById('edit-id').value = tarea.id;
    document.getElementById('edit-titulo').value = tarea.titulo;
    document.getElementById('edit-responsable').value = tarea.responsable;
    document.getElementById('edit-fecha').value = tarea.fecha;
    
    // Mostrar modal
    modalEditar.classList.remove('oculto');
    document.getElementById('edit-titulo').focus();
}

// ========== EVENT LISTENERS - MODAL DE EDICIÓN ==========
formularioEditar.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const id = parseInt(document.getElementById('edit-id').value);
    const nuevoTitulo = document.getElementById('edit-titulo').value.trim();
    const nuevoResponsable = document.getElementById('edit-responsable').value.trim();
    const nuevaFecha = document.getElementById('edit-fecha').value;
    
    // Validaciones
    if (!nuevoTitulo || !nuevoResponsable || !nuevaFecha) {
        alert('⚠️ Todos los campos son requeridos');
        return;
    }
    
    // Actualizar tarea
    actualizarTarea(id, {
        titulo: nuevoTitulo,
        responsable: nuevoResponsable,
        fecha: nuevaFecha
    });
    
    // Cerrar modal y actualizar UI
    cerrarModal();
    render();
    console.log(' Tarea actualizada desde modal');
});

btnCerrarModal.addEventListener('click', cerrarModal);

// Cerrar modal al presionar ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modalEditar.classList.contains('oculto')) {
        cerrarModal();
    }
});

// Cerrar modal al hacer clic fuera del contenido
modalEditar.addEventListener('click', (e) => {
    if (e.target === modalEditar) {
        cerrarModal();
    }
});

/**
 * Cierra el modal de edición y limpia los datos
 */
function cerrarModal() {
    modalEditar.classList.add('oculto');
    tareaEditandoId = null;
    formularioEditar.reset();
}

// ========== INICIALIZACIÓN ==========
// Renderizar tareas cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Aplicación iniciada');
    console.log(`📊 Tareas cargadas: ${tareas.length}`);
    render();
});

console.log('✅ ui.js cargado - Renderizado y eventos disponibles');
// ============================================
// LÓGICA DE FILTROS BÚSQUEDA Y ESTADO
// ============================================

const inputBusqueda = document.getElementById('input-busqueda');
const selectEstado = document.getElementById('select-estado');

function aplicarFiltros() {
    const textoBusqueda = inputBusqueda.value.toLowerCase();
    const estadoFiltro = selectEstado.value;
    
    // Seleccionamos todas las tarjetas que Copilot ya renderizó
    const tarjetas = document.querySelectorAll('.tarjeta-tarea');

    tarjetas.forEach(tarjeta => {
        const id = parseInt(tarjeta.dataset.id);
        const tarea = tareas.find(t => t.id === id); // Busca en el array global
        
        if (!tarea) return;

        // Validamos si coincide con el texto o responsable
        const coincideTexto = tarea.titulo.toLowerCase().includes(textoBusqueda) || 
                              tarea.responsable.toLowerCase().includes(textoBusqueda);
                              
        // Validamos si coincide con el select de estado
        const coincideEstado = estadoFiltro === "" || tarea.estado === estadoFiltro;

        // Ocultamos o mostramos manipulando el CSS directamente
        if (coincideTexto && coincideEstado) {
            tarjeta.style.display = 'flex'; 
        } else {
            tarjeta.style.display = 'none';
        }
    });
}

// Escuchamos cuando el usuario escribe o cambia el selector
if (inputBusqueda) inputBusqueda.addEventListener('input', aplicarFiltros);
if (selectEstado) selectEstado.addEventListener('change', aplicarFiltros);

// Interceptamos la función render() original para que aplique los filtros 
// automáticamente si eliminas o cambias de estado una tarea mientras buscas
const renderOriginal = render;
render = function() {
    renderOriginal(); // Ejecuta el código intacto de Copilot
    if (inputBusqueda && selectEstado) {
        aplicarFiltros(); // Aplica nuestra capa de filtros encima
    }
};