import { db } from '../config/firebaseAdmin';
import { Project } from '../models/projectModel';
import { Query, QuerySnapshot, DocumentData } from 'firebase-admin/firestore';
const { v4: uuidv4 } = require('uuid');

export const projectService = {
  createProject: async (data: Omit<Project, 'id' | 'createdAt' | 'currentMembers'>): Promise<Project> => {
    const newProject: Project = {
      id: uuidv4(),
      ...data,
      currentMembers: 1,
      createdAt: new Date(),
    };

    await db.collection('projects').doc(newProject.id).set(newProject);
    return newProject;
  },

  searchProjects: async (techStack: string, title: string): Promise<Project[]> => {
    let query: Query<DocumentData> = db.collection('projects') as Query<DocumentData>;

    if (techStack) {
      query = query.where('techStackTags', 'array-contains', techStack);
    }

    if (title) {
      query = query.where('title', '==', title);
    }

    const snapshot: QuerySnapshot<DocumentData> = await query.get();
    return snapshot.docs.map(doc => doc.data() as Project);
  },

  getProjectById: async (id: string): Promise<Project | null> => {
    const docSnapshot = await db.collection('projects').doc(id).get();
    
    if (!docSnapshot.exists) {
      return null;
    }
  
    return docSnapshot.data() as Project;
  },

  getAllProjects: async (): Promise<Project[]> => {
    const snapshot: QuerySnapshot<DocumentData> = await db.collection('projects').get();
    return snapshot.docs.map(doc => doc.data() as Project);
  },
};

