let API_KEY = '';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// 1. .env 파일에서 API 키 불러오기
async function loadApiKey() {
    try {
        const response = await fetch('.env');
        const text = await response.text();
        
        // 'TMDB_API_KEY=내키' 형태에서 키 값만 쏙 빼오기
        const keyLine = text.split('\n').find(line => line.startsWith('TMDB_API_KEY'));
        if (keyLine) {
            API_KEY = keyLine.split('=')[1].trim();
            console.log("API 키 로드 성공!");
            
            // 키를 정상적으로 불러온 후 영화 목록 요청
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
    // 여기에 원래 쓰던 API fetch 코드 작성
    // 예: const url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`;
}

// 앱 실행 시 가장 먼저 API 키부터 불러오기
loadApiKey();