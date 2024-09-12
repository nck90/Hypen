import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { auth } from '../config/firebaseConfig'; 
import { onAuthStateChanged } from 'firebase/auth'; 

interface User {
  email: string | null;
  getIdToken: (forceRefresh: boolean) => Promise<string>;
}

const HomePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null); 
  const [token, setToken] = useState<string | null>(null); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        try {
          const idToken = await currentUser.getIdToken(true); 
          setToken(idToken); 
        } catch (error) {
          console.error('Error getting ID token:', error);
        }
      } else {
        setUser(null); 
        setToken(null); 
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null); 
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleCreateProject = async () => {
    if (!token) {
      console.error('ID Token is missing');
      return;
    }

    try {
      const response = await fetch('/api/projects/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: 'New Project',
          description: 'This is a test project',
          techStackTags: ['JavaScript', 'React'],
          duration: 4,
          maxMembers: 5,
        }),
      });

      if (response.ok) {
        console.log('Project created successfully');
      } else {
        const result = await response.json();
        console.error('Error creating project:', result.message);
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <div>
      <h1>Welcome to the Project Platform</h1>
      {user ? (
        <div>
          <p>Logged in as: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
          <button onClick={handleCreateProject}>Create Project</button>
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