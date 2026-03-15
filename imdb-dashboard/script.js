const moviesContainer = document.getElementById('movies-container');
const refreshBtn = document.getElementById('refresh-btn');

function renderMovies(movies) {
  moviesContainer.innerHTML = '';
  movies.forEach(movie => {
    const card = document.createElement('div');
    card.className = 'movie-card';

    card.innerHTML = `
      <div class="movie-title">${movie.title}</div>
      <div class="movie-info">Year: ${movie.year} | Rating: ${movie.rating}</div>
      <div class="movie-link"><a href="${movie.imdb_link}" target="_blank">View on IMDB</a></div>
    `;
    moviesContainer.appendChild(card);
  });
}

function fetchMovies() {
  fetch('/api/movies')
    .then(response => response.json())
    .then(data => {
      renderMovies(data);
    })
    .catch(() => {
      moviesContainer.innerHTML = '<p style="color:red;">Failed to fetch movies.</p>';
    });
}

refreshBtn.addEventListener('click', fetchMovies);

// Fetch movies when page loads
fetchMovies();
