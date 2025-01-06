const API_URL = "http://www.omdbapi.com/?apikey=c4b15176";

// Set up the DOM structure
document.body.innerHTML = "";

const head = document.createElement("head");
const titleTag = document.createElement("title");
titleTag.textContent = "Filmsamlaren - Movie Search";
head.appendChild(titleTag);
document.head = head;

const header = document.createElement("header");
const title = document.createElement("h1");
title.textContent = "Filmsamlaren - Movie Search";
header.appendChild(title);

const searchForm = document.createElement("form");
searchForm.id = "search-form";

const searchLabel = document.createElement("label");
searchLabel.setAttribute("for", "search");
searchLabel.textContent = "Search for a movie or series:";

const searchInput = document.createElement("input");
searchInput.id = "search";
searchInput.type = "text";
searchInput.placeholder = "Type here";
searchInput.name = "search";

const searchButton = document.createElement("button");
searchButton.id = "search-button";
searchButton.type = "submit";
searchButton.textContent = "Search";

searchForm.appendChild(searchLabel);
searchForm.appendChild(searchInput);
searchForm.appendChild(searchButton);

header.appendChild(searchForm);
document.body.appendChild(header);

const movieList = document.createElement("main");
movieList.id = "movie-list";
document.body.appendChild(movieList);

const movieDetails = document.createElement("div");
movieDetails.id = "movie-details";
movieDetails.style.display = "none";

const closeDetails = document.createElement("button");
closeDetails.id = "close-details";
closeDetails.textContent = "×";
movieDetails.appendChild(closeDetails);

const detailsTitle = document.createElement("p");
detailsTitle.id = "details-title";
movieDetails.appendChild(detailsTitle);

const detailsYear = document.createElement("p");
detailsYear.id = "details-year";
movieDetails.appendChild(detailsYear);

const detailsGenre = document.createElement("p");
detailsGenre.id = "details-genre";
movieDetails.appendChild(detailsGenre);

const detailsDescription = document.createElement("p");
detailsDescription.id = "details-description";
movieDetails.appendChild(detailsDescription);

const detailsPoster = document.createElement("img");
detailsPoster.id = "details-poster";
detailsPoster.alt = "Poster";
movieDetails.appendChild(detailsPoster);

document.body.appendChild(movieDetails);

// Handle HTTP response status codes
function responseMessage(response) {
  switch (response.status) {
    case 400:
      throw new Error("400: Bad Request: Please check your request.");
    case 401:
      throw new Error("401: Unauthorized: You do not have access.");
    case 403:
      throw new Error("403: Forbidden: Access denied.");
    case 404:
      throw new Error("404: Not Found: The resource could not be found.");
    case 429:
      throw new Error("429: Too Many Requests: Please try again later.");
    case 500:
      throw new Error("500: Internal Server Error: Please try again later.");
    default:
      throw new Error(`HTTP error! Status: ${response.status}`);
  }
}

// Fetch movies from the API
const fetchMovies = async (query = "Movies") => {
  try {
    const response = await fetch(`${API_URL}&s=${query}`);
    if (!response.ok) {
      responseMessage(response); // Call responseMessage on error
    }
    const data = await response.json();
    if (data.Response === "True") {
      displayMovies(data.Search);
    } else {
      movieList.innerHTML = `<p class="no-results">No movies found for "${query}". Please try a different search.</p>`;
      console.log(`No movies found for "${query}".`);
    }
  } catch (error) {
    console.error("Error fetching movies:", error);
    movieList.innerHTML = `<p class="fetch-error">Could not fetch data. Please check your connection.</p>`;
  }
};

// Display the fetched movies
const displayMovies = (movies) => {
  movieList.innerHTML = "";
  const limitedMovies = movies.slice(0, 10); // Limit the displayed movies to 10
  limitedMovies.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");

    movieCard.addEventListener("click", () => fetchMovieDetails(movie.imdbID));

    const poster = document.createElement("img");
    poster.src = movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg";
    poster.alt = `Poster for ${movie.Title}`;

    const info = document.createElement("div");
    info.classList.add("info");
    info.innerHTML = `
      <h2>${movie.Title}</h2>
      <p>${movie.Year}</p>
    `;

    movieCard.appendChild(poster);
    movieCard.appendChild(info);
    movieList.appendChild(movieCard);
  });
};

// Fetch movie details
const fetchMovieDetails = async (imdbID) => {
  try {
    const response = await fetch(`${API_URL}&i=${imdbID}`);
    if (!response.ok) {
      responseMessage(response);
    }
    const data = await response.json();
    if (data.Response === "True") {
      showMovieDetails(data);
    } else {
      alert("Could not fetch movie details.");
    }
  } catch (error) {
    console.error("Error fetching movie details:", error);
  }
};

const showMovieDetails = (movie) => {
  console.log('Movie Title:', movie.Title);  // Log the movie title for debugging purposes

  // Set fallback for missing data
  detailsTitle.textContent = (movie.Title && movie.Title.trim() !== "") ? movie.Title : "Movie Details";
  detailsYear.textContent = `Year: ${movie.Year || "Unknown"}`;
  detailsGenre.textContent = `Genre: ${movie.Genre || "Unknown"}`;
  detailsDescription.textContent = `Description: ${movie.Plot || "No description available."}`;
  detailsPoster.src = movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg";

  const content = document.createElement("div");
  content.classList.add("content");

  content.appendChild(detailsTitle);
  content.appendChild(detailsYear);
  content.appendChild(detailsGenre);
  content.appendChild(detailsDescription);
  content.appendChild(detailsPoster);

  movieDetails.innerHTML = ''; // Clear previous content
  movieDetails.appendChild(closeDetails);
  movieDetails.appendChild(content);

  movieDetails.style.display = "flex";
};

// Close the movie details view
closeDetails.addEventListener("click", () => {
  movieDetails.style.display = "none";
});

// Handle search form submission
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (query === "") {
    searchInput.setAttribute("placeholder", "Input field cannot be empty.");
    console.log("Error, input is empty");
  } else {
    fetchMovies(query);
    searchInput.value = "";
    console.log("Searching for:", query);
  }
});

// Fetch movies on page load
fetchMovies();
