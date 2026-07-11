// app.js 맨 위에 작성

// 1. 여기에 TMDB API 키를 직접 넣어줍니다! (테스트용)
const API_KEY = "00792821837676f54cf5cff2ad158a4d"; 


// 2. 기존 loadApiKey() 함수가 있었다면 호출 부분 대신 바로 영화 목록을 부르도록 변경!
fetchPopularMovies();

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// DOM 요소 가져오기
const movieGrid = document.getElementById('movie-grid');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const showPopularBtn = document.getElementById('show-popular-btn');
const showWishlistBtn = document.getElementById('show-wishlist-btn');

// 1. .env 파일에서 API 키 불러오기
async function loadApiKey() {
    try {
        const response = await fetch('.env');
        const text = await response.text();
        // TMDB_API_KEY=값 에서 Key 추출
        API_KEY = text.split('=')[1].trim();
        fetchPopularMovies(); // 키를 가져온 후 인기 영화 로드
    } catch (error) {
        console.error('.env 파일에서 API 키를 읽을 수 없습니다.', error);
        movieGrid.innerHTML = '<p>.env 파일의 API 키를 확인해주세요.</p>';
    }
}

// 2. 인기 영화 목록 가져오기
async function fetchPopularMovies() {
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=ko-KR&page=1`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        renderMovies(data.results);
    } catch (err) {
        console.error('영화 목록 로드 실패:', err);
    }
}

// 3. 영화 검색 기능
async function searchMovies(query) {
    if (!query) return;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=ko-KR`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        renderMovies(data.results);
    } catch (err) {
        console.error('검색 실패:', err);
    }
}

// 4. LocalStorage에서 찜 목록 관리하기
function getWishlist() {
    return JSON.parse(localStorage.getItem('wishlist')) || [];
}

function toggleWishlist(movie) {
    let wishlist = getWishlist();
    const index = wishlist.findIndex(item => item.id === movie.id);

    if (index > -1) {
        wishlist.splice(index, 1); // 이미 있으면 삭제 (찜 취소)
    } else {
        wishlist.push(movie); // 없으면 추가 (찜)
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// 5. 화면에 영화 카드 출력하기
function renderMovies(movies) {
    movieGrid.innerHTML = '';
    const wishlist = getWishlist();

    if (!movies || movies.length === 0) {
        movieGrid.innerHTML = '<p>결과가 없습니다.</p>';
        return;
    }

    movies.forEach(movie => {
        const isWished = wishlist.some(item => item.id === movie.id);
        const posterPath = movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image';

        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <img src="${posterPath}" alt="${movie.title}">
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <p>평점: ⭐ ${movie.vote_average}</p>
                <button class="wish-btn ${isWished ? 'wished' : ''}">
                    ${isWished ? '❤️ 찜됨' : '🤍 찜하기'}
                </button>
            </div>
        `;

        // 찜 버튼 클릭 이벤트
        const wishBtn = card.querySelector('.wish-btn');
        wishBtn.addEventListener('click', () => {
            toggleWishlist(movie);
            // 만약 현재 '찜한 영화' 탭을 보고 있다면 즉시 화면 갱신
            if (showWishlistBtn.classList.contains('active')) {
                renderMovies(getWishlist());
            } else {
                renderMovies(movies);
            }
        });

        movieGrid.appendChild(card);
    });
}

// 6. 이벤트 리스너 등록
searchBtn.addEventListener('click', () => searchMovies(searchInput.value));
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchMovies(searchInput.value);
});

showPopularBtn.addEventListener('click', () => {
    showPopularBtn.classList.add('active');
    showWishlistBtn.classList.remove('active');
    fetchPopularMovies();
});

showWishlistBtn.addEventListener('click', () => {
    showWishlistBtn.classList.add('active');
    showPopularBtn.classList.remove('active');
    renderMovies(getWishlist());
});

// 앱 시작점
loadApiKey();