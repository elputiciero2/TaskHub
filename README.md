# TaskHub
1. Descripción General del Proyecto
TaskHub es una aplicación web de gestión de tareas desarrollada con tecnologías web estándar (HTML, CSS y JavaScript puro). Permite a los usuarios crear, visualizar, editar, filtrar y eliminar tareas de manera intuitiva, con persistencia de datos en el navegador mediante localStorage.

Campo
Detalle
Nombre del proyecto
TaskHub
Tipo de aplicación
Aplicación web (SPA - Single Page Application)
Tecnologías utilizadas
HTML5, CSS3, JavaScript (ES6+)
Almacenamiento
localStorage del navegador
Versión
1.0
Año
2026


1.1 Objetivo del proyecto
Proporcionar una herramienta sencilla y visual para la gestión de tareas personales o de equipo, sin necesidad de backend ni base de datos externa, funcionando completamente en el navegador del usuario.
1.2 Funcionalidades principales
Crear tareas con título, responsable y fecha límite
Cambiar el estado de una tarea: Pendiente → En Progreso → Completada
Editar los datos de una tarea existente mediante un modal
Eliminar tareas con confirmación
Buscar tareas por nombre o responsable en tiempo real
Filtrar tareas por estado
Persistencia automática de datos en localStorage



2. Arquitectura del Proyecto
El proyecto sigue una arquitectura de dos capas claramente separadas, inspirada en el patrón MVC (Modelo - Vista - Controlador), adaptada a un entorno sin frameworks:

Archivo
Responsabilidad
tasks.js
Capa de datos: contiene el array de tareas, las funciones CRUD y la lógica de persistencia en localStorage. No toca el DOM en ningún momento.
ui.js
Capa de presentación: maneja el renderizado de tarjetas, los event listeners del formulario, el modal de edición y el sistema de filtros. Consume las funciones de tasks.js.
index.html
Estructura semántica de la página. Define las secciones, el formulario, el contenedor de tarjetas y el modal. No contiene lógica.
style.css
Estilos visuales: diseño glassmorphism, paleta de colores con variables CSS, animaciones y diseño responsivo con CSS Grid y Flexbox.


2.1 Flujo de datos
El flujo de la aplicación sigue siempre el mismo patrón unidireccional:

Usuario interactúa (formulario / botón)
    ↓
ui.js captura el evento
    ↓
ui.js llama a una función de tasks.js  (crearTarea, actualizarTarea, eliminarTarea)
    ↓
tasks.js modifica el array 'tareas' y lo persiste en localStorage
    ↓
ui.js llama a render() para actualizar el DOM
    ↓
render() llama a aplicarFiltros() para mantener búsqueda/filtro activo


2.2 Estructura de archivos

taskhub/
├── index.html      → Estructura HTML de la aplicación
├── style.css       → Estilos y diseño visual
├── tasks.js        → Lógica de datos y CRUD
└── ui.js           → Renderizado, eventos y filtros




3. Modelo de Datos
Cada tarea es un objeto JavaScript con la siguiente estructura:

{
  id:           number,   // Timestamp único (Date.now())
  titulo:       string,   // Título descriptivo de la tarea
  responsable:  string,   // Nombre de la persona responsable
  fecha:        string,   // Fecha límite en formato YYYY-MM-DD
  estado:       string    // 'pendiente' | 'en-progreso' | 'completada'
}


El conjunto de tareas se almacena como un array serializado en JSON dentro de localStorage bajo la clave 'tareas':

// Guardar
localStorage.setItem('tareas', JSON.stringify(tareas));

// Recuperar al iniciar
let tareas = JSON.parse(localStorage.getItem('tareas')) || [];


3.1 Estados de una tarea

Estado
Descripción
pendiente
Estado inicial al crear la tarea. Indicador visual rojo neón.
en-progreso
Tarea en curso. Indicador visual naranja neón.
completada
Tarea finalizada. Indicador visual verde neón.




4. Componentes de la Interfaz
4.1 Formulario de nueva tarea
Sección superior de la aplicación. Contiene tres campos obligatorios y un botón de envío:
Título de la tarea (texto libre)
Responsable (nombre de la persona asignada)
Fecha límite (selector de fecha nativo del navegador)
Al enviar el formulario se validan los tres campos. Si alguno está vacío, se muestra una alerta nativa y el foco vuelve al campo correspondiente. Al crear la tarea, el formulario se limpia automáticamente.
4.2 Panel de filtros
Ubicado debajo del formulario, contiene dos controles de filtrado que actúan en tiempo real:
Campo de búsqueda: filtra por coincidencia en título o responsable (sin distinguir mayúsculas)
Selector de estado: muestra solo las tareas del estado seleccionado, o todas si se elige 'Todos los estados'
Ambos filtros se combinan entre sí y se re-aplican automáticamente cada vez que el DOM se actualiza.
4.3 Tarjetas de tarea
Cada tarea se representa como una tarjeta en un grid responsivo. La tarjeta incluye:
Encabezado con el título y una etiqueta de estado con color neón según el estado actual
Cuerpo con el nombre del responsable y la fecha límite formateada (DD/MM/AAAA)
Barra de acciones con tres botones: cambiar estado, editar y eliminar
La barra superior de la tarjeta cambia de color según el estado: rojo (pendiente), naranja (en progreso) o verde (completada).
4.4 Modal de edición
Se activa al presionar el botón 'Editar' de cualquier tarjeta. El modal pre-carga los datos actuales de la tarea en sus campos. El usuario puede:
Modificar el título, responsable o fecha
Guardar los cambios con el botón principal
Cancelar y cerrar sin guardar (botón Cancelar, tecla ESC o clic fuera del modal)



5. Funciones Clave del Sistema
5.1 tasks.js — Capa de datos

Función
Descripción
crearTarea(titulo, responsable, fecha)
Crea un nuevo objeto tarea con ID único, lo agrega al array y persiste en localStorage.
eliminarTarea(id)
Busca la tarea por ID usando findIndex, la elimina con splice y guarda el array actualizado.
actualizarTarea(id, datos)
Fusiona los nuevos datos con el objeto existente usando spread operator (...) y guarda.
obtenerTarea(id)
Devuelve el objeto tarea correspondiente al ID, o null si no existe.
guardarTareas()
Serializa el array completo a JSON y lo almacena en localStorage.


5.2 ui.js — Capa de presentación

Función
Descripción
render()
Limpia el contenedor de tareas, genera una tarjeta por cada tarea del array y llama a aplicarFiltros() al finalizar.
crearTarjetaTarea(tarea)
Crea y retorna el elemento HTMLElement de una tarjeta con todos sus datos y botones de acción.
aplicarFiltros()
Recorre las tarjetas del DOM, obtiene sus datos del array y muestra u oculta según los filtros activos.
manejarCambiarEstado(id)
Calcula el siguiente estado en la secuencia circular y llama a actualizarTarea.
manejarEditar(id)
Rellena el modal con los datos de la tarea y lo hace visible.
manejarEliminar(id)
Solicita confirmación nativa antes de llamar a eliminarTarea.
escapeHTML(texto)
Previene inyección de HTML en el DOM escapando caracteres especiales.




6. Diseño Visual y Estilos
6.1 Paleta de colores
El proyecto utiliza un sistema de variables CSS centralizado en :root para garantizar consistencia:

:root {
  --bg-gradient:   linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  --glass-bg:      rgba(255, 255, 255, 0.05);
  --glass-border:  rgba(255, 255, 255, 0.1);
  --text-main:     #f8f9fa;
  --text-muted:    #adb5bd;
  --primary:       #00f2fe;
  --neon-danger:   #ff4b4b;   /* Pendiente  */
  --neon-warning:  #fca311;   /* En progreso */
  --neon-success:  #00ff87;   /* Completada  */
}


6.2 Técnica Glassmorphism
Los paneles y tarjetas utilizan la técnica glassmorphism, que combina:
Fondo semitransparente (rgba con opacidad baja)
Efecto de desenfoque de fondo (backdrop-filter: blur)
Borde semitransparente sutil
Sombra difuminada para profundidad
6.3 Diseño responsivo
El grid de tarjetas usa CSS Grid con auto-fill y minmax(320px, 1fr), lo que permite que se adapte automáticamente a cualquier ancho de pantalla sin media queries explícitas.
6.4 Animaciones
Las tarjetas se muestran con una animación fadeIn (opacidad 0→1 + desplazamiento vertical) al renderizarse, y tienen una transición de elevación (translateY) al pasar el cursor sobre ellas.



7. Consideraciones de Seguridad
7.1 Prevención de XSS
Todos los datos ingresados por el usuario (título y responsable) se insertan en el DOM usando la función escapeHTML(), que convierte caracteres especiales como <, >, & y comillas en sus entidades HTML equivalentes, previniendo inyecciones de código malicioso.

function escapeHTML(texto) {
  const div = document.createElement('div');
  div.textContent = texto;   // textContent escapa automáticamente
  return div.innerHTML;
}

7.2 Validación de formularios
El formulario de creación y el modal de edición validan que todos los campos estén completos antes de procesar los datos. Las validaciones se realizan tanto a nivel HTML (atributo required) como a nivel JavaScript (comprobación de valor vacío tras trim()).
7.3 Limitaciones conocidas
Los datos se almacenan en localStorage, que es accesible desde cualquier script de la misma página.
No existe autenticación de usuarios: cualquier persona con acceso al navegador puede ver y modificar las tareas.
El almacenamiento está limitado a aproximadamente 5 MB por origen en la mayoría de navegadores.



8. Guía de Uso
8.1 Crear una tarea
Escribe el título de la tarea en el primer campo.
Ingresa el nombre del responsable.
Selecciona la fecha límite con el selector de fecha.
Haz clic en '+ Agregar Tarea'. La tarjeta aparecerá en el grid.
8.2 Cambiar el estado
Haz clic en el botón ' Estado' de la tarjeta. El estado avanza en la secuencia: Pendiente → En Progreso → Completada → Pendiente. El color de la tarjeta cambia automáticamente.
8.3 Editar una tarea
Haz clic en ' Editar'. Se abrirá un modal con los datos actuales pre-cargados. Modifica los campos necesarios y haz clic en 'Guardar Cambios'. Para cancelar: botón Cancelar, tecla ESC o clic fuera del modal.
8.4 Eliminar una tarea
Haz clic en ' Eliminar'. El navegador mostrará una confirmación con el nombre de la tarea. Confirma para eliminarla permanentemente.
8.5 Buscar y filtrar
Escribe en el campo de búsqueda para filtrar por título o responsable en tiempo real. Usa el selector de estado para ver solo las tareas de un estado específico. Ambos filtros se pueden usar simultáneamente.



9. Instalación y Ejecución
TaskHub no requiere instalación de dependencias ni servidor backend. Al estar construido con tecnologías web estándar, basta con abrir el archivo HTML en un navegador moderno.

9.1 Requisitos
Navegador web moderno (Chrome 88+, Firefox 85+, Edge 88+, Safari 14+)
No requiere conexión a Internet (excepto para la fuente Inter de Google Fonts)
No requiere Node.js, npm ni ninguna dependencia externa
9.2 Pasos para ejecutar
Descarga o clona los 4 archivos del proyecto (index.html, style.css, tasks.js, ui.js) en una misma carpeta.
Abre el archivo index.html directamente en el navegador (doble clic o arrastrar al navegador).
La aplicación cargará y mostrará las tareas guardadas previamente (si las hay).

Nota: Para evitar restricciones de CORS en algunos navegadores al cargar scripts externos, se recomienda usar la extensión Live Server de VS Code o cualquier servidor local simple.

