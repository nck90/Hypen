import { createServer } from 'http';
import next from 'next';
import setupWebSocket from './socket'; // WebSocket 서버 설정 함수 불러오기

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Next.js 서버를 위한 HTTP 서버 생성
  const server = createServer((req, res) => {
    handle(req, res);
  });

  // WebSocket 서버 설정
  setupWebSocket(); // WebSocket 서버는 별도 포트에서 실행됨

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`> Next.js server is running on http://localhost:${port}`);
  });
});