import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL,ref, uploadBytes } from "firebase/storage";

import { db,storage } from "../../../lib/firebase";

export async function uploadImage(file: File, movieTitle: string) {
  const storageRef = ref(storage, `movies/${file.name}`);
  await uploadBytes(storageRef, file);
  
  // Get public URL
  const imageUrl = await getDownloadURL(storageRef);

  // Save in Firestore
  await setDoc(doc(db, "movies", movieTitle), {
    title: movieTitle,
    imageUrl,
  });

  console.log("Uploaded and saved:", imageUrl);
}
