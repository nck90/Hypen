import { NextApiRequest, NextApiResponse } from 'next';
import { projectService } from '../services/projectService';

export const projectController = {
  createProject: async (req: NextApiRequest, res: NextApiResponse) => {
    const { title, description, techStackTags, duration, maxMembers } = req.body;
    const userId = (req as any).userId; 

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: Missing userId' });
    }

    if (!title || !description || !techStackTags || !duration || !maxMembers) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
      const project = await projectService.createProject({
        title,
        description,
        techStackTags,
        duration,
        maxMembers,
        createdBy: userId,
      });
      return res.status(201).json(project);
    } catch (error) {
      console.error('Error creating project:', error);
      return res.status(500).json({ message: 'Internal Server Error', error });
    }
  },

  searchProjects: async (req: NextApiRequest, res: NextApiResponse) => {
    const { techStack, title } = req.query;
    try {
      const projects = await projectService.searchProjects(String(techStack), String(title));
      return res.status(200).json({ projects });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error', error });
    }
  },

  getProjectById: async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;
    try {
      const project = await projectService.getProjectById(String(id));
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      return res.status(200).json(project);
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error', error });
    }
  },
};