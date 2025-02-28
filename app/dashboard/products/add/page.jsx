"use client";

import { addProduct } from "@/app/lib/actions";
import styles from "@/app/ui/dashboard/products/addProduct/addProduct.module.css";
import { uploadImage } from "@/app/supabase/storage/client";
import { useRef, useState, useTransition } from "react";
import { convertBlobUrlToFile } from "@/app/lib/utils";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddProductPage = () => {
  const [imageUrls, setImageUrls] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);

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

        console.log("File caricato:", imageFile);

        const { imageUrl, error } = await uploadImage({
          file: imageFile,
          bucket: "listingImages",
        });

        console.log("Risposta da Supabase:", { imageUrl, error });

        if (error) {
          console.error(error);
          return;
        }

        urls.push(imageUrl);
      }
      setUploadedImageUrls(urls); // Salva gli URL delle immagini caricate
      setImageUrls([]);
      console.log("URL caricati:", urls);
      // try {
      //   await addProduct(urls);
      //   toast.success("Foto caricata con successo!"); // Mostra la notifica di successo
      // } catch (error) {
      //   toast.error("Errore nel caricamento della foto!"); // Mostra la notifica di errore
      // }
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Previeni l'invio predefinito del modulo

    // Verifica che uploadedImageUrls sia effettivamente popolato
    if (uploadedImageUrls.length === 0) {
      toast.error("Devi prima caricare le immagini!");
      return;
    }

    // Raccogli i dati del modulo
    const formData = new FormData(e.target);
    formData.append("imageUrl", JSON.stringify(uploadedImageUrls)); // Aggiungi gli URL delle immagini caricate ai dati del modulo

    console.log(
      "Dati del modulo prima dell'invio:",
      Object.fromEntries(formData)
    );

    try {
      // Chiama la funzione addProduct con formData
      await addProduct(formData);
      toast.success("Prodotto caricato con successo!"); // Mostra la notifica di successo
    } catch (error) {
      toast.error("Errore nel caricamento del prodotto!"); // Mostra la notifica di errore
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer />
      <form onSubmit={handleFormSubmit} className={styles.form}>
        <input type="text" placeholder="titolo" name="title" required />
        <select name="cat" id="cat">
          <option value="general">Scegli una Categoria</option>
          <option value="compleanno">uno</option>
          <option value="matrimonio">due</option>
          <option value="cresima">tre</option>
        </select>
        <input type="number" placeholder="prezzo" name="price" required />
        <input type="number" placeholder="stock" name="stock" />
        <input type="text" placeholder="Per quando?" name="data" />
        <input type="text" placeholder="Taglia?" name="size" />

        <div className="bg-slate-600 flex justify-center items-center flex-col gap-4 p-2 mb-4">
          <input
            type="file"
            hidden
            multiple
            ref={imageInputRef}
            onChange={handleImageChange}
            disabled={isPending}
            name="imageUrl"
          />

          <button
            type="button"
            className=""
            onClick={() => imageInputRef.current?.click()}
            disabled={isPending}
          >
            Seleziona Immagini
          </button>

          <div className="flex gap-4 ">
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
            type="button"
            onClick={handleClickUploadImagesButton}
            className="bg-slate-600 py-2 w-40 rounded-lg"
            disabled={isPending}
          >
            {isPending ? "Caricamento in corso..." : "Carica Immagini"}
          </button>
        </div>

        <textarea
          required
          name="desc"
          id="desc"
          rows="16"
          placeholder="Descrizione"
        ></textarea>
        <button type="submit">Invia</button>
      </form>
    </div>
  );
};

export default AddProductPage;
