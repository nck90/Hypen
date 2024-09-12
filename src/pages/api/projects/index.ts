// pages/api/projects/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { projectService } from '../../../services/projectService'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const projects = await projectService.getAllProjects();
      res.status(200).json({ projects });
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}