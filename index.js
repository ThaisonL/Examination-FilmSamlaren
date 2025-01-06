const API_URL = "http://www.omdbapi.com/?apikey=c4b15176";

// Create and set up the DOM structure
document.body.innerHTML = "";

const head = document.createElement("head");
const titleTag = document.createElement("title");
titleTag.textContent = "Movie Collector - Movie Search";
head.appendChild(titleTag);
document.head = head;

const header = document.createElement("header");
const title = document.createElement("h1");
title.textContent = "Movie Collector - Movie Search";
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

const detailsTitle = document.createElement("h2");
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

// Function: Fetch movies from API
const fetchMovies = async (query = "Movies") => {
  try {
    const response = await fetch(`${API_URL}&s=${query}`);
    const data = await response.json();
    if (data.Response === "True") {
      displayMovies(data.Search);
    } else {
      movieList.innerHTML = `<p style="text-align: center;">No movies were found for "${query}".</p>`;
    }
  } catch (error) {
    console.error("Error fetching movies:", error);
    movieList.innerHTML = `<p style="text-align: center; color: red;">Could not fetch data. Please check your connection.</p>`;
  }
};

const displayMovies = (movies) => {
  movieList.innerHTML = "";
  const limitedMovies = movies.slice(0, 10);
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
      <h3>${movie.Title}</h3>
      <p>${movie.Year}</p>
    `;

    movieCard.appendChild(poster);
    movieCard.appendChild(info);
    movieList.appendChild(movieCard);
  });
};

const fetchMovieDetails = async (imdbID) => {
  try {
    const response = await fetch(`${API_URL}&i=${imdbID}`);
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
  detailsTitle.textContent = movie.Title || "Movie Details";
  detailsYear.textContent = `Year: ${movie.Year}`;
  detailsGenre.textContent = `Genre: ${movie.Genre}`;
  detailsDescription.textContent = `Description: ${movie.Plot}`;
  detailsPoster.src = movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg";

  const content = document.createElement("div");
  content.classList.add("content");

  content.appendChild(detailsTitle);
  content.appendChild(detailsYear);
  content.appendChild(detailsGenre);
  content.appendChild(detailsDescription);
  content.appendChild(detailsPoster);

  movieDetails.innerHTML = '';
  movieDetails.appendChild(closeDetails);
  movieDetails.appendChild(content);

  movieDetails.style.display = "flex";
};

closeDetails.addEventListener("click", () => {
  movieDetails.style.display = "none";
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (query === "") {
    searchInput.setAttribute("placeholder", "Input field cannot be empty.");
    console.log("Error, input is empty");
  } else {
    fetchMovies(query);
    searchInput.value = "";
    console.log("Search successful:", query);
  }
});

fetchMovies();
