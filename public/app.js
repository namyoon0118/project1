const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

let currentView = 'popular'; // 'popular' 또는 'wishlist'

// ---------- 데이터 가져오기 ----------

// 인기 영화 목록
async function fetchPopularMovies() {
    try {
        const response = await fetch('/api/popular');
        const data = await response.json();
        currentView = 'popular';
        displayMovies(data.results);
    } catch (error) {
        console.error("영화 데이터를 가져오는데 실패했습니다.", error);
    }
}

// 검색
async function searchMovies(query) {
    try {
        const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        currentView = 'search';
        displayMovies(data.results);
    } catch (error) {
        console.error("검색 실패", error);
    }
}

// ---------- 찜 목록 (localStorage) ----------

function getWishlist() {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
}

function saveWishlist(list) {
    localStorage.setItem('wishlist', JSON.stringify(list));
}

function isWished(movieId) {
    return getWishlist().some(movie => movie.id === movieId);
}

function toggleWish(movie) {
    let list = getWishlist();
    if (isWished(movie.id)) {
        list = list.filter(m => m.id !== movie.id);
    } else {
        list.push(movie);
    }
    saveWishlist(list);
}

function showWishlist() {
    currentView = 'wishlist';
    displayMovies(getWishlist());
}

// ---------- 화면에 그리기 ----------

function displayMovies(movies) {
    const grid = document.getElementById('movie-grid');
    grid.innerHTML = '';

    if (!movies || movies.length === 0) {
        grid.innerHTML = '<p style="text-align:center; grid-column:1/-1;">표시할 영화가 없습니다.</p>';
        return;
    }

    movies.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'movie-card';

        const posterPath = movie.poster_path
            ? `${IMAGE_BASE_URL}${movie.poster_path}`
            : 'https://via.placeholder.com/200x300?text=No+Image';

        const wished = isWished(movie.id);

        card.innerHTML = `
            <img src="${posterPath}" alt="${movie.title}">
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <p>⭐ ${movie.vote_average ? movie.vote_average.toFixed(1) : '평점 없음'}</p>
                <button class="wish-btn ${wished ? 'wished' : ''}">
                    ${wished ? '❤️ 찜 완료' : '🤍 찜하기'}
                </button>
            </div>
        `;

        const wishBtn = card.querySelector('.wish-btn');
        wishBtn.addEventListener('click', () => {
            toggleWish(movie);
            // 찜 목록 화면에서 해제하면 바로 목록에서 사라지게
            if (currentView === 'wishlist') {
                showWishlist();
            } else {
                wishBtn.classList.toggle('wished');
                wishBtn.textContent = isWished(movie.id) ? '❤️ 찜 완료' : '🤍 찜하기';
            }
        });

        grid.appendChild(card);
    });
}

// ---------- 이벤트 리스너 ----------

document.getElementById('search-btn').addEventListener('click', () => {
    const query = document.getElementById('search-input').value.trim();
    if (query) {
        searchMovies(query);
        setActiveButton(null);
    }
});

document.getElementById('search-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('search-btn').click();
    }
});

document.getElementById('show-popular-btn').addEventListener('click', () => {
    fetchPopularMovies();
    setActiveButton('show-popular-btn');
});

document.getElementById('show-wishlist-btn').addEventListener('click', () => {
    showWishlist();
    setActiveButton('show-wishlist-btn');
});

function setActiveButton(activeId) {
    document.getElementById('show-popular-btn').classList.remove('active');
    document.getElementById('show-wishlist-btn').classList.remove('active');
    if (activeId) {
        document.getElementById(activeId).classList.add('active');
    }
}

// ---------- 앱 시작 ----------
fetchPopularMovies();