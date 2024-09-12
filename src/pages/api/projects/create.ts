import { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware } from '../../../middlewares/authMiddleware';
import { projectController } from '../../../controllers/projectController';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await authMiddleware(req, res, () => projectController.createProject(req, res));
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}