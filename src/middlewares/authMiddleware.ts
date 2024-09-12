import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '../config/firebaseAdmin';

declare module 'next' {
  interface NextApiRequest {
    userId?: string;
  }
}

export const authMiddleware = async (req: NextApiRequest, res: NextApiResponse, next: Function) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No or invalid token provided' });
    }
  
    const token = authHeader.split(' ')[1];
  
    try {
      const decodedToken = await auth.verifyIdToken(token);
      req.userId = decodedToken.uid;
      next(); 
    } catch (error) {
      console.error('Error verifying token:', error);
      return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
  };