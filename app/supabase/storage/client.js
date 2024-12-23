import { createSupabaseClient } from "@/app/supabase/client";
//import { v4 as uuidv4 } from "uuid";
import imageCompression from "browser-image-compression";

function getStorage() {
  const { storage } = createSupabaseClient();
  return storage;
  
}


export const uploadImage = async ({ file, bucket }) => {
  const fileName = file.name;
  const path = `${fileName}`; // Assicurati che il percorso sia lo stesso per la vecchia e la nuova immagine

  console.log("File:", file);
  console.log("Bucket:", bucket);
  console.log("Path:", path);

  try {
    // Comprimi l'immagine
    const compressedFile = await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    });

    console.log("Compressed File:", compressedFile);

    const storage = getStorage();

    // Carica il file compresso nel bucket di storage
    const { data, error } = await storage.from(bucket).upload(path, compressedFile, {
      upsert: true, // Sovrascrive il file se esiste già
    });

    console.log("Upload data:", data);
    console.log("Upload error:", error);

    if (error) {
      console.error("Image upload failed:", error);
      return { imageUrl: "", error: "Image upload failed" };
    }

    if (!data || !data.path) {
      console.error("Image upload failed: Data or path is undefined");
      return { imageUrl: "", error: "Image upload failed: Data or path is undefined" };
    }

    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${data.path}`;

    console.log("ImageUrl:", imageUrl);

    return { imageUrl, error: "" };
  } catch (error) {
    console.error("Unexpected error during upload:", error);
    return { imageUrl: "", error: "Unexpected error during upload" };
  }
};



