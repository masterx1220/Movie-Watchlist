const movieListEl = document.getElementById("movie-list")
const watchlist = JSON.parse(localStorage.getItem("movieStorage")) || [];

function renderEssentials(){
    if(watchlist.length < 1){
        movieListEl.innerHTML = `
            <div class="watchlist-message">
                <p class="emptyWatchlist">Your Essentials list is empty.</p>
                <a href="index.html"><i class="fa-solid fa-circle-plus" data-plus="" ></i>Let's add some <span class="underline">movies</span> shall we</a>
            </div>
            `
    }else{
    for(id of watchlist){
        fetch(`https://www.omdbapi.com/?apikey=2698ff92&i=${id}&plot=short&type=movie`)
        .then(res => res.json())
        .then(data => {
            if(data.Title){
                if(watchlist.includes(`${data.imdbID}`)){
                    document.addEventListener("click", function(e){
                        if((e.target.dataset.btn || e.target.dataset.minus) === data.imdbID){
                            let idToDelete = watchlist.indexOf(data.imdbID)
                            watchlist.splice(idToDelete,1)
                            localStorage.setItem("movieStorage", JSON.stringify(watchlist))
                            location.reload()
                        }
                    })
                }
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
                                        <button id="${data.imdbID}" data-btn="${data.imdbID}" class="watchlist"><i class="fa-solid fa-circle-minus" data-minus="${data.imdbID}" style="color: #ffff;"></i>Remove</button>
                                    </div>
                                </div>
                                `                                   
        })
    }
    }
}
renderEssentials()
