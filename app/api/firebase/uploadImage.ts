import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, db } from "../../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";

async function uploadImage(file: File, movieTitle: string) {
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
