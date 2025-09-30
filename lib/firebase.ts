import { initializeApp } from "firebase/app";
import type { FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore";
import { collection, documentId, getDocs, getFirestore, query, where } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  projectId: process.env.FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

export interface FirestoreMovieDoc {
  id: string;
  title: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  rating?: number;
  year?: number;
  description?: string;
}

const movieConverter: FirestoreDataConverter<FirestoreMovieDoc> = {
  toFirestore(movie: FirestoreMovieDoc) {
    return {
      title: movie.title,
      thumbnailUrl: movie.thumbnailUrl,
      imageUrl: movie.imageUrl,
      rating: movie.rating,
      year: movie.year,
      description: movie.description,
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): FirestoreMovieDoc {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      title: data.title,
      thumbnailUrl: data.thumbnailUrl ?? data.imageUrl,
      imageUrl: data.imageUrl,
      rating: data.rating,
      year: data.year,
      description: data.description,
    };
  },
};

export async function fetchMoviesByIds(ids: string[]): Promise<Record<string, FirestoreMovieDoc>> {
  if (!ids || ids.length === 0) return {};

  const uniqueIds = Array.from(new Set(ids)).filter(Boolean);
  const moviesRef = collection(db, "movies").withConverter(movieConverter);

  const batches: string[][] = [];
  for (let i = 0; i < uniqueIds.length; i += 10) {
    batches.push(uniqueIds.slice(i, i + 10));
  }

  const idToDoc: Record<string, FirestoreMovieDoc> = {};

  for (const batch of batches) {
    const q = query(moviesRef, where(documentId(), "in", batch));
    const snapshot = await getDocs(q);
    snapshot.forEach((docSnap) => {
      const doc = docSnap.data();
      idToDoc[docSnap.id] = doc;
    });
  }

  return idToDoc;
}
