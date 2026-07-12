let API_KEY = '';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// 1. .env 파일에서 API 키 불러오기
async function loadApiKey() {
    try {
        const response = await fetch('.env');
        const text = await response.text();
        
        const keyLine = text.split('\n').find(line => line.startsWith('TMDB_API_KEY'));
        if (keyLine) {
            API_KEY = keyLine.split('=')[1].trim();
            console.log("API 키 로드 성공!");

            fetchPopularMovies(); 
        } else {
            throw new Error("키를 찾을 수 없습니다.");
        }
    } catch (error) {
        console.error(".env 파일 읽기 에러:", error);
    }
}

// 2. 영화 목록 가져오기 함수 (예시)
async function fetchPopularMovies() {
    // TMDB API 주소에 발급받은 API_KEY를 넣어서 완성된 요청 주소를 만듭니다.
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=ko-KR`;
    
    try {
        // 서버에 데이터를 요청하고, 성공하면 JSON 형태로 변환합니다.
        const response = await fetch(url);
        const data = await response.json();
        
        // 가져온 영화 목록 데이터(data.results)를 화면에 그리는 함수로 넘겨줍니다.
        displayMovies(data.results);
    } catch (error) {
        console.error("영화 데이터를 가져오는데 실패했습니다.", error);
    }
}

// 앱 실행 시 가장 먼저 API 키부터 불러오기
loadApiKey();