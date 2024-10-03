// Variable global para almacenar los datos de las películas
let peliculas = [];

// Función para cargar el listado de películas
async function cargarPeliculas() {
    const respuesta = await fetch('https://japceibal.github.io/japflix_api/movies-data.json');
    peliculas = await respuesta.json();
}

// Función para mostrar las películas filtradas
function mostrarPeliculas(filtradas) {
    const listaPeliculas = document.getElementById('listaPeliculas');
    if (!listaPeliculas) {
        console.error("No se encontró el elemento con ID 'listaPeliculas'");
        return; // Salir si no se encuentra el elemento
    }
    
    listaPeliculas.innerHTML = ''; // Limpiar la lista

    if (filtradas.length === 0) {
        listaPeliculas.innerHTML = '<li>No se encontraron películas.</li>';
        return;
    }

    filtradas.forEach(pelicula => {
        const li = document.createElement('li');
        li.classList.add('list-group-item'); // Para estilos de Bootstrap
        li.textContent = `${pelicula.title} (${pelicula.vote_average} ⭐)`;
        li.onclick = () => mostrarEnOffcanvas(pelicula);
        listaPeliculas.appendChild(li);
    });
}

// Función para filtrar las películas según la búsqueda
function buscarPeliculas() {
    const inputBuscar = document.getElementById('inputBuscar').value.toLowerCase();
    const peliculasFiltradas = peliculas.filter(pelicula => {
        return (
            pelicula.title.toLowerCase().includes(inputBuscar) ||
            (pelicula.genres && pelicula.genres.some(genre => genre.name.toLowerCase().includes(inputBuscar))) ||
            (pelicula.tagline && pelicula.tagline.toLowerCase().includes(inputBuscar)) ||
            (pelicula.overview && pelicula.overview.toLowerCase().includes(inputBuscar))
        );
    });

    mostrarPeliculas(peliculasFiltradas);
}

// Función para mostrar los detalles de la película en el contenedor
function mostrarEnOffcanvas(pelicula) {
    const offcanvasTitle = document.getElementById('offcanvasTitle');
    const offcanvasOverview = document.getElementById('offcanvasOverview');
    const offcanvasGenres = document.getElementById('offcanvasGenres');
    const offcanvasDetails = document.getElementById('offcanvasDetails');

    // Asignar el contenido de la película al contenedor
    offcanvasTitle.textContent = pelicula.title;
    offcanvasOverview.textContent = pelicula.overview || "Sin descripción disponible";

    // Verifica si 'genres' es un array de objetos y extrae el 'name' de cada género
    if (Array.isArray(pelicula.genres)) {
        const genreNames = pelicula.genres.map(genre => genre.name || "Sin nombre");
        offcanvasGenres.innerHTML = genreNames.map(name => `<li>${name}</li>`).join("");
    } else {
        offcanvasGenres.innerHTML = "<li>No hay géneros disponibles</li>";
    }

    // Agregar detalles adicionales
    offcanvasDetails.innerHTML = `
        <ul>
            <li>Año de lanzamiento: ${pelicula.release_date.split('-')[0]}</li>
            <li>Duración: ${pelicula.runtime} minutos</li>
            <li>Presupuesto: $${pelicula.budget.toLocaleString()}</li>
            <li>Ganancias: $${pelicula.revenue.toLocaleString()}</li>
        </ul>
    `;

    // Mostrar el contenedor (offcanvas)
    const offcanvasElement = new bootstrap.Offcanvas(document.getElementById("offcanvasTop"));
    offcanvasElement.show(); // Despliega el offcanvas
}

// Evento de carga de la página
window.onload = async () => {
    await cargarPeliculas();

    // Evento del botón de búsqueda
    document.getElementById('btnBuscar').onclick = buscarPeliculas;
};
