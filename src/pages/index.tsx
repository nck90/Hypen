// src/pages/index.tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { auth } from '../config/firebaseConfig'; // Firebase auth 가져오기
import { onAuthStateChanged, getIdToken } from 'firebase/auth'; // auth 상태 변화 감지

interface User {
  email: string | null;
  idToken: string | null;
}

const HomePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null); // 초기 상태는 null
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태 추가

  useEffect(() => {
    // Firebase 인증 상태를 확인하고 사용자 정보를 가져오는 로직
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const idToken = await currentUser.getIdToken(); // ID 토큰 획득
        setUser({ email: currentUser.email, idToken });
      } else {
        setUser(null);
      }
      setLoading(false); // 로딩 종료
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null); // 로그아웃 후 상태 초기화
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>; // 로딩 중일 때 로딩 메시지 표시
  }

  return (
    <div>
      <h1>Welcome to the Project Platform</h1>
      {user ? (
        <div>
          <p>Logged in as: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
          <button onClick={() => router.push('/createProject')}>Create Project</button>
          <button onClick={() => router.push('/projects')}>View Projects</button>
        </div>
      ) : (
        <div>
          <p>You are not logged in.</p>
          <button onClick={() => router.push('/login')}>Login</button>
          <button onClick={() => router.push('/signup')}>Sign Up</button>
        </div>
      )}
    </div>
  );
};

export default HomePage;