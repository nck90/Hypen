import { NextApiRequest, NextApiResponse } from 'next';
import { authService } from '../../services/authService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST' && req.query.action === 'register') {
    return authService.register(req, res);
  } else if (req.method === 'POST' && req.query.action === 'login') {
    return authService.login(req, res);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}