const API_KEY = '5bb4b9dce6371aafad40e0eeb83c70cd'; // Your TMDb API KEY
const COLLECTION_ID = 1241; // Harry Potter Collection ID
const BASE_URL = `https://api.themoviedb.org/3/collection/${COLLECTION_ID}?api_key=${API_KEY}&language=en-US`;
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

let movies = []; // Store the list of movies globally

// Fetch the collection of multiple movies from the API
async function fetchCollection() {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch data from the API');
    }
    const data = await response.json();
    movies = data.parts;
    displayMovies(movies);
  } catch (error) {
    console.error('Error fetching data:', error);
    document.getElementById('movie-list').innerHTML = `<p>Error loading movies and details.</p>`;
  }
}

// Display all movies in a list with clickable cards
function displayMovies(movies) {
  const container = document.getElementById('movie-list');
  container.innerHTML = '';

  movies.forEach(movie => {
    const card = document.createElement('div');
    card.className = 'movie-card';

    const image = movie.poster_path
      ? `${IMAGE_BASE_URL}${movie.poster_path}`
      : 'https://via.placeholder.com/200x300?text=No+Image';

    const year = movie.release_date ? movie.release_date.split('-')[0] : 'Unknown';

    card.innerHTML = `
      <img src="${image}" alt="${movie.title}">
      <div class="movie-info">
        <div class="movie-title">${movie.title}</div>
        <div class="movie-date"><b>Year:</b> ${year}</div>
        <div class="movie-lang"><b>Language:</b> ${movie.original_language.toUpperCase()}</div>
        <div class="overview"><b>Overview:</b> ${movie.overview || "No overview available."}</div>
      </div>
    `;


    // click event to fetch and show single movie details in a largescreen
    card.addEventListener('click', () => fetchMovieDetails(movie.id));
    container.appendChild(card);
  });
}

// Fetch details of a single movie by movie ID
async function fetchMovieDetails(movieId) {
  try {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en-US`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch movie details');
    const details = await response.json();
    displayMovieDetails(details);
  } catch (error) {
    console.error('Error fetching movie details:', error);
  
  }
}

// Display detailed information  of a clicked movie
function displayMovieDetails(details) {
  const container = document.getElementById('movie-list');
  container.innerHTML = `
    <div class="movie-detail-card">
      <img src="${details.poster_path ? IMAGE_BASE_URL + details.poster_path : 'https://via.placeholder.com/200x300?text=No+Image'}" alt="${details.title}" class="image">
      <h2>${details.title} (${details.release_date ? details.release_date.split('-')[0] : 'Unknown'})</h2>
      <p><b>Language:</b> ${details.original_language.toUpperCase()}</p>
      <p><b>Overview:</b><br> ${details.overview || "No overview available."}</p>
      <p><b>Runtime:</b> ${details.runtime ? details.runtime + ' minutes' : 'N/A'}</p>
      <p><b>Genres:</b> ${details.genres.map(g => g.name).join(', ')}</p>
      <button id="back-btn">Back to list</button>
    </div>
  `;

  // Back button to return to the movies list
  document.getElementById('back-btn').addEventListener('click', () => {
    displayMovies(movies);
  });
}

// Initial fetch to load collection
fetchCollection();
