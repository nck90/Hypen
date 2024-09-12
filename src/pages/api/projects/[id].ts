import { projectController } from '../../../controllers/projectController';

export default (req: any, res: any) => {
  if (req.method === 'GET') {
    return projectController.getProjectById(req, res);
  }
  res.status(405).json({ message: 'Method Not Allowed' });
};