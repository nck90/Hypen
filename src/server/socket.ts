import { WebSocketServer } from 'ws';

export default function setupWebSocket() {
  const wss = new WebSocketServer({ port: 8080 }); // WebSocket은 8080 포트에서 실행

  wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message: string) => {
      console.log('Received message:', message);
      ws.send('Hello, Client!'); // 클라이언트에게 응답 전송
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  console.log('WebSocket server is running on ws://localhost:8080');
}

