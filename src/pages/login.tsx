import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { useRouter } from 'next/router';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    console.log('로그인 버튼 클릭됨');  

    if (!email || !password) {
      alert('이메일과 비밀번호를 입력하세요.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('로그인 성공:', userCredential.user);

      router.push('/');
    } catch (error: unknown) {
      console.error('로그인 중 오류 발생:', error);
      if (error instanceof Error) {
        alert('로그인 실패: ' + error.message);
      } else {
        alert('로그인 실패: 알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="login-form">
      <h2>로그인</h2>
      <div>
        <label>이메일</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일을 입력하세요"
        />
      </div>

      <div>
        <label>비밀번호</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호를 입력하세요"
        />
      </div>

      <button onClick={handleLogin}>로그인</button>
    </div>
  );
};

export default Login;