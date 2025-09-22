import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from "fs";

initializeApp({
  credential: applicationDefault(),
});

const db = getFirestore();

async function seed() {
  const moviesPath = new URL('./movies.json', import.meta.url);
  const movies = JSON.parse(fs.readFileSync(moviesPath, "utf8"));

  let successCount = 0;
  let failureCount = 0;
  for (const movie of movies) {
    try {
      await db.collection("movies").doc(String(movie.id)).set(movie, { merge: true });
      console.log(`Added ${movie.title}`);
      successCount++;
    } catch (error) {
      failureCount++;
      console.error(`Failed to add ${movie.title}:`, error && error.message ? error.message : error);
    }
  }
  console.log(`Seeding complete. Success: ${successCount}, Failed: ${failureCount}`);
}

seed();
