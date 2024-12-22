
"use client";
import { useState } from "react";
import { updateProduct } from "@/app/lib/actions";
import { uploadImage, deleteImage } from "@/app/supabase/storage/client";
import { redirect } from "next/navigation";
import Image from "next/image";
import imageCompression from "browser-image-compression";
//import styles from "@/app/ui/dashboard/products/singleProduct/singleProduct.module.css";

const ProductFotoForm = ({ productId, product, imageUrl}) => {

  const [newImage, setNewImage] = useState(null);

  const handleUpdateImage = async (event) => {
    event.preventDefault();
    if (!newImage) {
      alert("Please select an image to upload.");
      return;
    }

    const bucket = "listingImages"; // il bucket si chiama "listingImages"
    const fileName = newImage.name;
    const path = `images/${fileName}`; // Assicurati che il percorso sia lo stesso per la vecchia e la nuova immagine

    console.log("File:", newImage);
    console.log("Bucket:", bucket);
    console.log("Path:", path);

    try {
      // Opzioni di compressione dell'immagine
      const options = {
        maxSizeMB: 1, // Massima dimensione del file in MB
        maxWidthOrHeight: 1920, // Massima larghezza o altezza in pixel
        useWebWorker: true, // Usa un Web Worker per la compressione
      };

      // Comprimi l'immagine
      const compressedFile = await imageCompression(newImage, options);

      console.log("Compressed File:", compressedFile);

      try {
        // Carica il file compresso nel bucket di storage
        const uploadResult = await uploadImage({ file: compressedFile, bucket, path });

        console.log("Upload Result:", uploadResult);

        if (uploadResult.error) {
          console.error("Image upload failed:", uploadResult.error);
          alert("Image upload failed: " + uploadResult.error);
          return;
        }

        // Aggiorniamo il prodotto con il nuovo URL dell'immagine
        const updatedProduct = { id: productId, imageUrl: [uploadResult.imageUrl] };
        const updateResult = await updateProduct(updatedProduct);

        console.log("Update Result:", updateResult);

        if (updateResult.error) {
          console.error("Product update failed:", updateResult.error);
          alert("Product update failed: " + updateResult.error);
          return;
        }

        alert("Image updated successfully!");
        redirect(`/product/${productId}`);
      } catch (error) {
        console.error("Unexpected error during upload:", error);
        alert("Unexpected error during upload: " + error);
      }
    } catch (error) {
      console.error("Image compression failed:", error);
      alert("Image compression failed: " + error);
    }
  };



  const handleDeleteImage = async (event) => {
    event.preventDefault();

    if (!imageUrl) {
      alert("No image to delete.");
      return;
    }

    const {  error } = await deleteImage(imageUrl);

    if (error) {
      alert("Image deletion failed: " + error);
      return;
    }

    // Aggiorniamo il prodotto rimuovendo l'URL dell'immagine
    const updatedProduct = { id: productId, imageUrl: [] };
    const updateResult = await updateProduct(updatedProduct);

    if (updateResult.error) {
      alert("Product update failed: " + updateResult.error);
      return;
    }

    alert("Image deleted successfully!");
    redirect(`/product/${productId}`);
  };

  return (
    <div className="w-full">
      <div className="flex justify-center items-center p-4 bg-[#182236] rounded-xl">
        <div className="relative w-[250px] h-[250px] rounded-xl items-center">
          {product.imageUrl && product.imageUrl.length > 0 ? (
            <Image
              src={product.imageUrl[0]} // primo URL nell'array
              alt="Product image"
              fill
              className="object-cover rounded-lg"
            />
          ) : (
            <div>No image available</div>
          )}
        </div>
      </div>
      <form onSubmit={handleUpdateImage} className="mt-4">
        <input type="file" name="imageUrl" accept="image/*" onChange={(e) => setNewImage(e.target.files[0])} />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Update Photo
        </button>
      </form>
      <form onSubmit={handleDeleteImage} className="mt-4">
        <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded">
          Delete Photo
        </button>
      </form>
    </div>
  );
};

export default ProductFotoForm;