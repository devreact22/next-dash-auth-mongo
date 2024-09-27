"use client";

import { addProduct } from "@/app/lib/actions";
import styles from "@/app/ui/dashboard/products/addProduct/addProduct.module.css";
import { uploadImage } from "@/app/supabase/storage/client";
import { useRef, useState, useTransition } from "react";
import { convertBlobUrlToFile } from "@/app/lib/utils";
import Image from "next/image";

const AddProductPage = () => {
  const [imageUrls, setImageUrls] = useState([]);

  const imageInputRef = useRef(null);

  const handleImageChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImageUrls = filesArray.map((file) => URL.createObjectURL(file));

      setImageUrls([...imageUrls, ...newImageUrls]);
      
    }
  };

  const [isPending, startTransition] = useTransition();

  const handleClickUploadImagesButton = async () => {
    startTransition(async () => {
      let urls = [];
      for (const url of imageUrls) {
        const imageFile = await convertBlobUrlToFile(url);

        console.log("File uploaded:", imageFile);

        const { imageUrl, error } = await uploadImage({
          file: imageFile,
          bucket: "listingImages",
        });

        console.log("Response from Supabase:", { imageUrl, error });

        if (error) {
          console.error(error);
          return;
        }

        urls.push(imageUrl);
      }
  
      setImageUrls([]);
      console.log("vedo url",urls);
    });
  };

  return (
    <div className={styles.container}>
      <form action={addProduct} className={styles.form} >
        <input type="text" placeholder="title" name="title" required />
        <select name="cat" id="cat">
          <option value="general">Choose a Category</option>
          <option value="compleanno"> one</option>
          <option value="matrimonio"> two</option>
          <option value="cresima">threee</option>
        </select>
        <input type="number" placeholder="price" name="price" required />
        <input type="number" placeholder="stock" name="stock" />
        <input type="text" placeholder="Per quando?" name="data" />
        <input type="text" placeholder="Size?" name="size" />    
        {/* <input type="file" name="imageFile" accept="image/*" /> */}
        <div className="bg-slate-500 min-h-screen flex justify-center items-center flex-col gap-8">
      <Image
        src="https://bcdwxyqbvupekpnncaeo.supabase.co/storage/v1/object/public/listingImages/"
        width={300}
        height={300}
        alt={`img-dank`}
      />

      <input
        type="file"
        hidden
        multiple
        ref={imageInputRef}
        onChange={handleImageChange}
        disabled={isPending}
      />

      <button
        className="bg-slate-600 py-2 w-40 rounded-lg"
        onClick={() => imageInputRef.current?.click()}
        disabled={isPending}
      >
        Select Images
      </button>

      <div className="flex gap-4">
        {imageUrls.map((url, index) => (
          <Image
            key={url}
            src={url}
            width={300}
            height={300}
            alt={`img-${index}`}
          />
        ))}
      </div>

      <button
        onClick={handleClickUploadImagesButton}
        className="bg-slate-600 py-2 w-40 rounded-lg"
        disabled={isPending}
      >
        {isPending ? "Uploading..." : "Upload Images"}
      </button>
    </div>

        <textarea
          required
          name="desc"
          id="desc"
          rows="16"
          placeholder="Description"
        ></textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddProductPage;