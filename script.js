const globalPage = {
  currentPage: window.location.pathname,
};
console.log(window.location.pathname);
// init app
function init() {
  switch (globalPage.currentPage) {
    case "/flixx%20app/index.html":
      displayPopularMovies();
      upcoming(); // Call the upcoming function
      break;
    case "/flixx%20app/shows.html":
      console.log("shows");
      document.querySelector(".head a:nth-child(2)").style.color = "#04376b";
      displayPopularTvShows()
      break;
    case "/flixx%20app/movies.html":
      console.log("Movies");
      document.querySelector(".head a:nth-child(1)").style.color = "#04376b";
      displayPopularMovies()
      break;
    case "/flixx%20app/movie-details.html":
      console.log("Movie details");
      break;
    case "/flixx%20app/tv-details.html":
      console.log("tv details");
      break;
    case "/flixx%20app/search.html":
      console.log("search");
      break;
  }
}
document.addEventListener("DOMContentLoaded", init);
// display popular movies - take the data from the fetchAPIData function
async function displayPopularMovies() {
  let { results } = await fetchApiData("movie/popular");
  console.log(results);
  results.forEach((movie) => {
    let movieEL = document.createElement("div");
    movieEL.classList.add("card");
    movieEL.innerHTML = `
          <a href="movie-details.html?id=${movie.id}">
           ${
             movie.poster_path
               ? `<img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="${movie.title}"
            />`
               : `<img
            src="../images/no-image.jpg"
            class="card-img-top"
            alt="${movie.title}"
          />`
           }
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${movie.release_date}</small>
            </p>
          </div>
`;
    document.getElementById("popular-movies").appendChild(movieEL);
  });
}
displayPopularMovies();
async function displayPopularTvShows() {
  let { results } = await fetchApiData("tv/popular");
  console.log(results);
  results.forEach((show) => {
    let tvShowEl = document.createElement("div");
    tvShowEl.classList.add("card");
    tvShowEl.innerHTML = `
          <a href="tv-details.html?id=${show.id}">
           ${
             show.poster_path
               ? `<img
              src="https://image.tmdb.org/t/p/w500${show.poster_path}"
              class="card-img-top"
              alt="${show.name}"
            />`
               : `<img
            src="../images/no-image.jpg"
            class="card-img-top"
            alt="${show.name}"
          />`
           }
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${show.first_air_date}</small>
            </p>
          </div>
`;
    document.getElementById("popular-shows").appendChild(tvShowEl);
  });
}
async function upcoming() {
  console.log("Loading upcoming movies...");
  try {
    let { results } = await fetchApiData("movie/upcoming");
    console.log("Upcoming movies data:", results);

    if (!results || results.length === 0) {
      console.error("No results from API");
      return;
    }

    // Limit to 10 movies for better swiper experience
    const limitedResults = results.slice(0, 10);
    console.log("Limited results:", limitedResults);

    limitedResults.forEach((movie) => {
      let slide = document.createElement("div");
      slide.classList.add("swiper-slide");
      slide.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.original_title}"/>
      <div class="movie-info">
        <h5>${movie.original_title}</h5>
        <p>Release: ${movie.release_date}</p>
      </div>
    `;
      document
        .querySelector(".upcoming-swiper .swiper-wrapper")
        .appendChild(slide);
    });

    // Initialize the upcoming movies swiper
    console.log("Initializing Swiper...");
    const upcomingSwiper = new Swiper(".upcoming-swiper", {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: ".upcoming-nav-next",
        prevEl: ".upcoming-nav-prev",
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 30,
        },
      },
    });
  } catch (error) {
    console.error("Error loading upcoming movies:", error);
  }
}
// fetch API data from TMDB
async function fetchApiData(endpoint) {
  let API_key = "846276ddd9cf2f9445f1d45ea77cf293";
  let API_url = "https://api.themoviedb.org/3/";
  spinnerShow()
  const response = await fetch(
    `${API_url}${endpoint}?api_key=${API_key}&language=en-US`
  );
  const data = await response.json();
  spinnerHide()
  return data;
}

// Call upcoming function to load the carousel
upcoming();

function spinnerShow() {
  document.querySelector('.spinner').classList.add('show')
}
function spinnerHide() {
  document.querySelector('.spinner').classList.remove('show')
}