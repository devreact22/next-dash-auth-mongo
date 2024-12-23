"use client";
import { useState } from "react";
import { updateProduct } from "@/app/lib/actions";
import { uploadImage } from "@/app/supabase/storage/client";
//import { redirect } from "next/navigation";
import Image from "next/image";
import imageCompression from "browser-image-compression";

const ProductFotoForm = ({ productId, product }) => {
  const [newImage, setNewImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(product.imageUrl[0] || null);


  const handleUpdateImage =  async (event) => {
    event.preventDefault();
    if (!newImage) {
      alert("Please select an image to upload.");
      return;
    }

    const bucket = "listingImages";
    const fileName = newImage.name;
    const path = `${fileName}`;

    console.log("File:", newImage);
    console.log("Bucket:", bucket);
    console.log("Path:", path);

    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(newImage, options);

      console.log("Compressed File:", compressedFile);

      try {
        const uploadResult = await uploadImage({ file: compressedFile, bucket, path });

        if (!uploadResult) {
          console.error("Unexpected error during upload: uploadResult is undefined");
          alert("Unexpected error during upload: uploadResult is undefined");
          return;
        }

        console.log("Upload Result:", uploadResult);

        if (uploadResult.error) {
          console.error("Image upload failed:", uploadResult.error);
          alert("Image upload failed: " + uploadResult.error);
          return;
        }

        const updatedProduct = { id: productId, imageUrl: [uploadResult.imageUrl] };
        const updateResult = await updateProduct(updatedProduct);

        if (!updateResult) {
          console.error("Unexpected error during update: updateResult is undefined");
          alert("Unexpected error during update: updateResult is undefined");
          return;
        }
      
        console.log("Update Result:", updateResult);
      
        if (updateResult && updateResult.error) {
          console.error("Product update failed:", updateResult.error);
          alert("Product update failed: " + updateResult.error);
          return;
        }

        setImageUrl(uploadResult.imageUrl);
        alert("Image updated successfully!");
        //redirect(`/product/${productId}`);
      } catch (error) {
        console.error("Unexpected error during upload:", error);
        alert("Unexpected error during upload: " + error);
      }
    } catch (error) {
      console.error("Image compression failed:", error);
      alert("Image compression failed: " + error);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-center items-center p-4 bg-[#1c2833] rounded-xl">
        <div className="relative w-[250px] h-[250px] rounded-xl items-center">
          {imageUrl? (
            <Image
              src={imageUrl}
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
    </div>
  );
};

export default ProductFotoForm;