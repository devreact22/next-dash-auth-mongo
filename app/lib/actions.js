"use server";

import { revalidatePath } from "next/cache";
import { Product, User } from "./models";
import { connectToDB } from "./utils";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { signIn } from "../auth";

export const addUser = async (formData) => {
  const { username, email, password, phone, address, isAdmin, isActive } =
    Object.fromEntries(formData);

  try {
    await connectToDB();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phone,
      address,
      isAdmin,
      isActive,
    });

    await newUser.save();
  } catch (err) {
    console.log(err);
    throw new Error("Failed to create user!");
  }

  revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
};

export const updateUser = async (formData) => {
  const { id, username, email, password, phone, address, isAdmin, isActive } =
    Object.fromEntries(formData);

  try {
    connectToDB();

    const updateFields = {
      username,
      email,
      password,
      phone,
      address,
      isAdmin,
      isActive,
    };

    Object.keys(updateFields).forEach(
      (key) =>
        (updateFields[key] === "" || undefined) && delete updateFields[key]
    );

    await User.findByIdAndUpdate(id, updateFields);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to update user!");
  }

  revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
};

export const addProduct = async (formData) => {
  try {
    await connectToDB();

    // Estrarre i dati dal formData
    const { title, desc, price, stock, data, size, imageUrl } = Object.fromEntries(formData);
    const parsedImageUrl = JSON.parse(imageUrl); // Analizza l'array JSON

    // Passo 2: Creare il nuovo prodotto, includendo l'URL dell'immagine caricata
    const newProduct = new Product({
      title,
      desc,
      price: Number(price),
      stock: Number(stock),
      data,
      size,
      imageUrl: parsedImageUrl, // Associa l'array di URL delle immagini
    });

    console.log("Nuovo prodotto prima del salvataggio:", newProduct);

    // Passo 3: Salvare il nuovo prodotto nel database
    const savedProduct = await newProduct.save();
    console.log("Prodotto salvato:", savedProduct);
    // Passo 4: Revalidare la cache
    revalidatePath("/dashboard/products");
  } catch (err) {
    console.error("Errore dettagliato:", err);
    //throw new Error("Failed to create product: " + err.message);
  }
  // Esegui il redirect dopo 5 secondi
  setTimeout(() => {
    redirect("/dashboard/products");
  }, 5000); // 5000 millisecondi = 5 secondi
};

export async function updateProduct(formData) {
  try {
    await connectToDB();

    const { id, title, desc, price, stock, data, size, imageUrl } = Object.fromEntries(formData);

    const parsedImageUrl = JSON.parse(imageUrl); // Analizza l'array JSON

    const updateFields = {
      title,
      desc,
      price: price ? Number(price) : undefined,
      stock: stock ? Number(stock) : undefined,
      data,
      size,
      imageUrl: parsedImageUrl, // Associa l'array di URL delle immagini
    };

    console.log("update prodotto prima del salvataggio:", updateFields);

    // Rimuovi i campi vuoti o undefined
    Object.keys(updateFields).forEach(
      (key) =>
        (updateFields[key] === "" || updateFields[key] === undefined) &&
        delete updateFields[key]
    );

    const updatedProduct = await Product.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    console.log("Prodotto update ok! :", updatedProduct);

    if (!updatedProduct) {
      throw new Error("Product not found");
    }

    revalidatePath("/dashboard/products");
  } catch (err) {
    console.error("Errore durante l'aggiornamento del prodotto:", err);
    return { error: "Failed to update product: " + err.message };
  }
  // Esegui il redirect fuori dal blocco try-catch
  redirect("/dashboard/products");
}

// delete User
export const deleteUser = async (formData) => {
  const { id } = Object.fromEntries(formData);

  try {
    connectToDB();
    await User.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to delete user!");
  }

  revalidatePath("/dashboard/products");
};

// delete Product
export const deleteProduct = async (formData) => {
  const { id } = Object.fromEntries(formData);

  try {
    connectToDB();
    await Product.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to delete product!");
  }

  revalidatePath("/dashboard/products");
};

export const authenticate = async (prevState, formData) => {
  const { username, password } = Object.fromEntries(formData);
  // console.log('authenticate')
  //console.log(formData)
  try {
    await signIn("credentials", { username, password });
    console.log("vediamo prova");
    console.log(username);
    console.log(password);
  } catch (err) {
    if (err.message.includes("CredentialsSignin")) {
      return "Wrong Credentials !!";
    }
    throw err;
  }
};
