export type TechStack = 'JavaScript' | 'TypeScript' | 'React' | 'Node.js' | 'Firebase'| 'Java' | 'Python' | 'C' | 'Figma' 
| 'Next.js'| 'Flutter' | 'MongoDb' | 'Kotlin' | 'Rust' | 'PhotoShop';


export interface User {
  uid: string;
  email: string;
  grade: number; 
  department: string; 
  techStackTags: TechStack[]; 
  photoURL?: string; 
  createdAt: Date; 
}
