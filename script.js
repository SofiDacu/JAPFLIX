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
        li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center'); // Para estilos de Bootstrap

        // Si no tiene tagline, mostrar un texto predeterminado
        const tagline = pelicula.tagline ? pelicula.tagline : "No hay descripción disponible";

        // Título, tagline y estrellas
        li.innerHTML = `
            <div>
                <strong>${pelicula.title}</strong>
                <p>${tagline}</p>
                <div>${getStarRating(pelicula.vote_average)}</div> <!-- Estrellas -->
            </div>
        `;

        li.onclick = () => mostrarEnOffcanvas(pelicula); // Hacer clic para mostrar detalles en el offcanvas
        listaPeliculas.appendChild(li);
    });
}

// Función para convertir la calificación de la película en estrellas
function getStarRating(vote) {
    const stars = Math.round(vote / 2); // Convierte el promedio a estrellas sobre 5
    let starHtml = "";
    for (let i = 0; i < 5; i++) {
        if (i < stars) {
            starHtml += '<i class="fa fa-star text-warning"></i>';  // Estrella llena
        } else {
            starHtml += '<i class="fa fa-star-o text-secondary"></i>';  // Estrella vacía
        }
    }
    return starHtml;
}

// Función para filtrar las películas según la búsqueda
function buscarPeliculas() {
    const inputBuscar = document.getElementById('inputBuscar').value.toLowerCase(); // Obtener valor del campo de búsqueda
    const peliculasFiltradas = peliculas.filter(pelicula => {
        return (
            pelicula.title.toLowerCase().includes(inputBuscar) ||
            (pelicula.genres && pelicula.genres.some(genre => genre.name.toLowerCase().includes(inputBuscar))) ||
            (pelicula.tagline && pelicula.tagline.toLowerCase().includes(inputBuscar)) ||
            (pelicula.overview && pelicula.overview.toLowerCase().includes(inputBuscar))
        );
    });

    mostrarPeliculas(peliculasFiltradas); // Mostrar películas filtradas
}

// Evento de carga de la página
window.onload = async () => {
    await cargarPeliculas();

    // Evento del botón de búsqueda
    document.getElementById('btnBuscar').onclick = buscarPeliculas;
};

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



// Para las estrellas 
// Función para mostrar los resultados
function displayResults(results) {
    const lista = document.getElementById("lista");
    lista.innerHTML = ""; // Limpiar la lista anterior

    if (results.length === 0) {
      lista.innerHTML = "<li class='list-group-item'>No se encontraron resultados.</li>";
      return;
    }

    results.forEach(movie => {
      const starRating = getStarRating(movie.vote_average);
      const listItem = document.createElement("li");
      listItem.className = "list-group-item";
      listItem.innerHTML = `
        <h5 class="movie-title">${movie.title}</h5>
        <p>${movie.tagline}</p>
        <p>${starRating}</p>
      `;
      
      // Añadir evento de clic para mostrar detalles
      listItem.querySelector('.movie-title').addEventListener("click", () => showMovieDetails(movie, listItem));
      
      lista.appendChild(listItem);
    });
  };



