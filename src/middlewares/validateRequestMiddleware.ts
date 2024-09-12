import { NextApiRequest, NextApiResponse } from 'next';

export function validateRegisterData(req: NextApiRequest, res: NextApiResponse, next: Function) {
  const { email, password, grade, department, techStackTags } = req.body;

  if (!email || !password || !grade || !department || !Array.isArray(techStackTags)) {
    return res.status(400).json({ message: 'Invalid request data' });
  }

  next();
}