import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config(); // .env를 서버(node)에서만 읽음. 브라우저에는 절대 안 보냄

const app = express();
const PORT = 3000;
const API_KEY = process.env.TMDB_API_KEY;

// public 폴더(html, css, js)는 정적 파일로 서빙
app.use(express.static('public'));

// 인기 영화 프록시
app.get('/api/popular', async (req, res) => {
    try {
        const url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=ko-KR`;
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: '영화 데이터를 가져오지 못했습니다.' });
    }
});

// 검색 프록시
app.get('/api/search', async (req, res) => {
    const query = req.query.query;
    try {
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=ko-KR&query=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: '검색에 실패했습니다.' });
    }
});

app.listen(PORT, () => {
    console.log(`서버 실행 중: http://localhost:${PORT}`);
});