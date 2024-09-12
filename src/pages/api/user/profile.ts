import { NextApiRequest, NextApiResponse } from 'next';
import { db, auth } from '../../../config/firebaseAdmin'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const userRef = db.collection('users').doc(userId); 
    const userDoc = await userRef.get(); 

    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = userDoc.data();

    res.status(200).json({
      uid: userData?.uid,
      email: userData?.email,
      photoURL: userData?.photoURL,
      grade: userData?.grade,
      department: userData?.department,
      techStackTags: userData?.techStackTags,
    });
  }catch (error) {
    console.error('Error fetching user profile:', error);
    
    if (error instanceof Error) {
      res.status(500).json({ message: `Internal server error: ${error.message}` });
    } else {
      res.status(500).json({ message: 'Internal server error: An unknown error occurred.' });
    }
  }
}   