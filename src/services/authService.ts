import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../config/firebaseConfig'; 
import { NextApiRequest, NextApiResponse } from 'next';
import { doc, setDoc } from 'firebase/firestore'; 
import { User, TechStack } from '../models/userModel'; 

export const authService = {
  register: async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    const { email, password, techStackTags = [], grade, department, photoURL } = req.body;

    console.log("Received techStackTags from request:", techStackTags);

    if (!Array.isArray(techStackTags)) {
      return res.status(400).json({ message: 'techStackTags must be an array.' });
    }

    const validTags = validateTechStackTags(techStackTags);
    console.log("Validated techStackTags:", validTags);

    if (!validTags) {
      return res.status(400).json({ message: 'Invalid tech stack tags. Allowed tags: JavaScript, TypeScript, React, Node.js, Firebase.' });
    }

    if (!validateSchoolEmail(email)) {
      return res.status(400).json({ message: 'Invalid school email format.' });
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      const newUser: User = {
        uid: userId,
        email,
        grade,
        department,
        techStackTags: validTags,
        photoURL: photoURL || '',
        createdAt: new Date(),
      };

      await setDoc(doc(db, 'users', userId), newUser);

      return res.status(201).json(newUser);
    } catch (error: any) {
      console.error("Error during registration:", error);
      return res.status(500).json({ message: error.message || 'Error while creating user.' });
    }
  },

  login: async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    const { email, password } = req.body;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      return res.status(200).json({ uid: userCredential.user.uid, email, idToken });
    } catch (error: any) {
      console.error("Error during login:", error);
      return res.status(400).json({ message: 'Invalid credentials or user does not exist.' });
    }
  },
};

function validateTechStackTags(tags: string[]): TechStack[] | null {
  const allowedTags: TechStack[] = ['JavaScript', 'TypeScript' , 'React', 'Node.js', 'Firebase', 'Java', 'Python', 'C', 'Figma', 'Next.js', 'Flutter', 'MongoDb', 'Kotlin', 'Rust', 'PhotoShop'];
  console.log("Validating tags:", tags);
  const isValid = tags.every(tag => allowedTags.includes(tag as TechStack));

  return isValid ? (tags as TechStack[]) : null;
}

function validateSchoolEmail(email: string): boolean {
  const schoolEmailDomain = '@e-mirim.hs.kr';
  if (!email.endsWith(schoolEmailDomain)) {
    return false;
  }

  const emailPrefix = email.split('@')[0];
  const gradePattern = /^[sd](\d{2})(\d{2})$/;
  const match = emailPrefix.match(gradePattern);

  if (!match) {
    return false;
  }

  const year = parseInt(match[1], 10);
  const number = parseInt(match[2], 10);

  return year >= 22 && year <= 24 && number >= 1 && number <= 99;
}