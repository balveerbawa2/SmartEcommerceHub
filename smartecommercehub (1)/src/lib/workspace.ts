import { db } from './firebase';
import { collection, query, where, getDocs, doc, setDoc, deleteDoc, orderBy, Timestamp, getDoc } from 'firebase/firestore';

export type WorkspaceProject = {
  id: string;
  userId: string;
  name: string;
  description: string;
  createdAt: number;
  updatedAt: number;
};

export type DatabaseChatSession = {
  id: string;
  userId: string;
  projectId?: string;
  title: string;
  messages: any[];
  updatedAt: number;
  sharedId?: string;
};

export type DatabaseTeam = {
  id: string;
  name: string;
  ownerId: string;
  members: { userId: string; role: 'owner' | 'admin' | 'editor' | 'viewer'; email: string }[];
  createdAt: number;
};

export type DatabaseActivity = {
  id: string;
  teamId?: string;
  projectId?: string;
  userId: string;
  action: string;
  details: string;
  createdAt: number;
};

export type DatabaseNote = {
  id: string;
  userId: string;
  projectId?: string;
  text: string;
  createdAt: number;
};

export type DatabaseTask = {
  id: string;
  userId: string;
  projectId?: string;
  text: string;
  completed: boolean;
  createdAt: number;
};

export type DatabasePrompt = {
  id: string;
  userId: string;
  title: string;
  prompt: string;
  createdAt: number;
};

// Error handling helper
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}
interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
}
function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const getProjects = async (userId: string) => {
  try {
    const q = query(collection(db, 'projects'), where('userId', '==', userId), orderBy('updatedAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WorkspaceProject));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'projects');
    return [];
  }
};

export const saveProject = async (project: WorkspaceProject) => {
  try {
    await setDoc(doc(db, 'projects', project.id), project);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `projects/${project.id}`);
  }
};

export const deleteProject = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'projects', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `projects/${id}`);
  }
};

export const getSharedChat = async (sharedId: string) => {
  try {
    const q = query(collection(db, 'chats'), where('sharedId', '==', sharedId));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as DatabaseChatSession;
    }
    return null;
  } catch (error) {
    console.error("Error getting shared chat", error);
    return null;
  }
};

export const getChats = async (userId: string) => {
  try {
    const q = query(collection(db, 'chats'), where('userId', '==', userId), orderBy('updatedAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DatabaseChatSession));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'chats');
    return [];
  }
};

export const saveChat = async (chat: DatabaseChatSession) => {
  try {
    await setDoc(doc(db, 'chats', chat.id), chat);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `chats/${chat.id}`);
  }
};

export const deleteChatFromDb = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'chats', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `chats/${id}`);
  }
};

export const getNotes = async (userId: string) => {
  try {
    const q = query(collection(db, 'notes'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DatabaseNote));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'notes');
    return [];
  }
};

export const saveNoteToDb = async (note: DatabaseNote) => {
  try {
    await setDoc(doc(db, 'notes', note.id), note);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `notes/${note.id}`);
  }
};

export const deleteNoteFromDb = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'notes', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `notes/${id}`);
  }
};

export const getTasks = async (userId: string) => {
  try {
    const q = query(collection(db, 'tasks'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DatabaseTask));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'tasks');
    return [];
  }
};

export const saveTaskToDb = async (task: DatabaseTask) => {
  try {
    await setDoc(doc(db, 'tasks', task.id), task);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `tasks/${task.id}`);
  }
};

export const deleteTaskFromDb = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'tasks', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `tasks/${id}`);
  }
};
