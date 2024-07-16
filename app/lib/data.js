import { Product, User } from "./models";
import { connectToDB } from "./utils";
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import { ObjectId } from 'bson';

export const fetchUsers = async (q, page) => {
  const regex = new RegExp(q, "i");

  const ITEM_PER_PAGE = 2;

  try {
    connectToDB();
    const count = await User.find({ username: { $regex: regex } }).count();
    const users = await User.find({ username: { $regex: regex } })
      .limit(ITEM_PER_PAGE)
      .skip(ITEM_PER_PAGE * (page - 1));
    return { count, users };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch users!");
  }
};

export const fetchUser = async (id) => {
  console.log(id);
  try {
    connectToDB();
    const user = await User.findById(id);
    return user;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch user!");
  }
};


// fetch data  products lista from MongoDB 

export const fetchProducts = async (q, page) => {
  console.log(q);
  const regex = new RegExp(q, "i");

  const ITEM_PER_PAGE = 10;

  try {
    connectToDB();
    const count = await Product.find({ title: { $regex: regex } }).count();
    const products = await Product.find({ title: { $regex: regex } })
      .limit(ITEM_PER_PAGE)
      .skip(ITEM_PER_PAGE * (page - 1));
    return { count, products };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch products!");
  }
};


// fetch data single product from MongoDB

export const fetchProduct = async (id) => {
  try {
    connectToDB();
    const product = await Product.findById(id);
    console.log('ecco il solo id', id);

    const db = mongoose.connection.db;
    const bucket =  new GridFSBucket(db, {
      bucketName: "productImages"
    });
    console.log('Bucket creato con nome di default:', bucket ? 'Sì' : 'No');
    console.log('GridFSBucket disponibile:', typeof GridFSBucket);
    console.log("ID dell'immagine cercata:", product.image);


    if (product && product.image) {

      const db = mongoose.connection.db;
      const bucket =  new GridFSBucket(db, {
        bucketName: "productImages"
      });
      console.log('Bucket creato:', bucket ? 'Sì' : 'No');
      console.log('GridFSBucket disponibile:', typeof GridFSBucket);
      console.log('ecco il bucket', bucket);
      
      console.log("ID dell'immagine cercata:", product.image);

      const file = await bucket.find({ _id: ObjectId(product.image) }).toArray();
      console.log("Risultato della ricerca:", file);

      if (file.length > 0) {
        const stream = bucket.openDownloadStream( ObjectId(product.image));
        const chunks = [];
        console.log("L'immagine esiste nel bucket");
        
        for await (const chunk of stream) {
          chunks.push(chunk);
        }
        
        const buffer = Buffer.concat(chunks);
        const base64Image = buffer.toString('base64');

        product.imageDetails = {
          filename: file[0].filename,
          type: file[0].type || file[0].contentType,
          data: `data:${file[0].type || file[0].contentType};base64,${base64Image}`
        };
      }
    }
    else {
      // Il file non esiste nel bucket
      console.log("L'immagine non esiste nel bucket", );
      product.imageDetails = { error: "Immagine non trovata" };
    }
    return product;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch product!");
  }
};

