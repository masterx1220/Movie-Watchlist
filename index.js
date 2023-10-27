const search = document.getElementById("titleSearch")
const movieListEl = document.getElementById("movie-list")
const searchBtnEl = document.getElementById("searchBtn")
const watchlist = JSON.parse(localStorage.getItem("movieStorage")) || [];
let movieIdArray = []

searchBtnEl.addEventListener("click", function(e){
    e.preventDefault()
    const userSearch = search.value
    fetch(`https://www.omdbapi.com/?apikey=2698ff92&s=${userSearch}&type=movie`)
        .then(res => res.json())
        .then(data => {
            if(data.Search){
                for(let ids of data.Search){
                    movieIdArray.push(ids.imdbID)
                }
            }else{
                movieListEl.innerHTML = `
                    <div class="search-error"
                        <p class="error-message">Sorry, "${userSearch}" did not return any results. Please try again</p>
                    <div>`
            }               
        })
        .then(() => {
            for(let movie of movieIdArray){
                fetch(`https://www.omdbapi.com/?apikey=2698ff92&i=${movie}&plot=short&type=movie`)
                    .then(res => res.json())
                    .then(data => {
                        movieIdArray = []
                        if(data.Title){
                                document.addEventListener("click", function(e){
                                    if((e.target.dataset.btn || e.target.dataset.plus) === `${data.imdbID}`){
                                        document.getElementById(`${data.imdbID}`).classList.add("added")
                                        watchlist.push(e.target.dataset.btn)
                                        sortedWatchlist = [...new Set(watchlist)]
                                        document.getElementById(`${data.imdbID}`).innerHTML = "Added!"
                                        localStorage.setItem("movieStorage", JSON.stringify(sortedWatchlist))
                                    }
                                })
                        }
                            movieListEl.innerHTML += `
                                <div class="movie-details">
                                    <div class="posterContainer">
                                        <img src="${data.Poster != "N/A" ? data.Poster : `images/no-preview.jpg`}">
                                    </div>
                                    <div class="movie-overview">
                                        <h2 class="title">${data.Title} <span class="value">⭐${data.imdbRating}</span></h2>
                                        <p class="runtime-genre">${data.Runtime}; ${data.Genre}; Released: ${data.Year}</p>
                                        <p class="plot">${data.Plot != "N/A" ? data.Plot : "No plot available"}</p>
                                        <button id="${data.imdbID}" data-btn="${data.imdbID}" class="watchlist"><i class="fa-solid fa-circle-plus" data-plus="${data.imdbID}" ></i>It's Essential</button>
                                    </div>
                                </div>
                                `                                                
                })             
            }
        })
        clearMovieList()
})


function clearMovieList(){
    if(movieListEl){
        movieListEl.innerHTML = ""
        search.value = ""
    }
}


