import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig'; // Firebase 설정 파일 import
import { useRouter } from 'next/router';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [grade, setGrade] = useState<number | null>(null);
  const [department, setDepartment] = useState('');
  const [techStackTags, setTechStackTags] = useState<string[]>([]);
  const [photoURL, setPhotoURL] = useState('');
  const router = useRouter();

  const handleSignUp = async () => {
    if (!email || !password || grade === null || !department || techStackTags.length === 0) {
      alert('모든 필드를 입력하세요.');
      return;
    }

    try {
      // Firebase Auth에 사용자 생성
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      // Firestore에 추가 사용자 정보 저장
      await setDoc(doc(db, 'users', userId), {
        uid: userId,
        email,
        grade,
        department,
        techStackTags,
        photoURL: photoURL || '',
        createdAt: new Date(),
      });

      // 회원가입이 성공하면 로그인 페이지로 이동
      router.push('/login');
    } catch (error: unknown) {
      console.error('회원가입 중 오류가 발생했습니다:', error);
      
      // error가 Error 객체인지 확인한 후 message에 접근
      if (error instanceof Error) {
        alert('회원가입 실패: ' + error.message);
      } else {
        alert('회원가입 실패: 알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tag = e.target.value;
    if (techStackTags.includes(tag)) {
      setTechStackTags(techStackTags.filter((t) => t !== tag));
    } else {
      setTechStackTags([...techStackTags, tag]);
    }
  };

  return (
    <div className="signup-form">
      <h2>회원가입</h2>
      <div>
        <label>이메일</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="학교 이메일을 입력하세요"
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

      <div>
        <label>학년</label>
        <input
          type="number"
          value={grade !== null ? grade : ''}
          onChange={(e) => setGrade(Number(e.target.value))}
          placeholder="학년을 입력하세요"
        />
      </div>

      <div>
        <label>학과</label>
        <input
          type="text"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          placeholder="학과를 입력하세요"
        />
      </div>

      <div>
        <label>기술 스택</label>
        <div>
          <input
            type="checkbox"
            value="JavaScript"
            checked={techStackTags.includes('JavaScript')}
            onChange={handleTagChange}
          />
          JavaScript
        </div>
        <div>
          <input
            type="checkbox"
            value="React"
            checked={techStackTags.includes('React')}
            onChange={handleTagChange}
          />
          React
        </div>
        <div>
          <input
            type="checkbox"
            value="Node.js"
            checked={techStackTags.includes('Node.js')}
            onChange={handleTagChange}
          />
          Node.js
        </div>
        <div>
          <input
            type="checkbox"
            value="Firebase"
            checked={techStackTags.includes('Firebase')}
            onChange={handleTagChange}
          />
          Firebase
        </div>
      </div>

      <div>
        <label>프로필 사진 URL</label>
        <input
          type="text"
          value={photoURL}
          onChange={(e) => setPhotoURL(e.target.value)}
          placeholder="프로필 사진 URL을 입력하세요"
        />
      </div>

      <button onClick={handleSignUp}>회원가입</button>
    </div>
  );
};

export default SignUp;