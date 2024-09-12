export interface Project {
    id: string;
    title: string;
    description: string;
    techStackTags: string[];
    duration: string;
    maxMembers: number;
    currentMembers: number;
    createdBy: string;
    createdAt: Date;
  }