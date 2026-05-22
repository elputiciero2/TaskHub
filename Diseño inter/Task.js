let tareas = JSON.parse(localStorage.getItem('tareas')) || [];

function guardarTareas() {
    localStorage.setItem('tareas', JSON.stringify(tareas));
}

function crearTarea(titulo, responsable, fecha) {
    const nueva = {
        id: Date.now(),
        titulo: titulo,
        responsable: responsable,
        fecha: fecha,
        estado: 'pendiente'
    };
    tareas.push(nueva);
    guardarTareas();
    return nueva;
}

function eliminarTarea(id) {
    const index = tareas.findIndex(t => t.id === id);
    if (index !== -1) {
        tareas.splice(index, 1);
        guardarTareas();
    }
}

function actualizarTarea(id, datos) {
    const index = tareas.findIndex(t => t.id === id);
    if (index !== -1) {
        tareas[index] = { ...tareas[index], ...datos };
        guardarTareas();
    }
}