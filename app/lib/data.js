import { Product, User } from "./models";
import { connectToDB } from "./utils";

// fetch data  users lista from MongoDB 

export const fetchUsers = async (q, page) => {
  const regex = new RegExp(q, "i");
  const ITEM_PER_PAGE = 2;
  try {
    console.log("Connecting to DB...");
    await connectToDB();
    console.log("Connected to DB, running query...");
    const count = await User.find({ username: { $regex: regex } }).countDocuments();
    const users = await User.find({ username: { $regex: regex } })
      .limit(ITEM_PER_PAGE)
      .skip(ITEM_PER_PAGE * (page - 1));
    return { count, users };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch users!");
  }
};

// fetch data  user singolo lista from MongoDB 

export const fetchUser = async (id) => {
  console.log(id);
  try {
    await connectToDB();
    const user = await User.findById(id);
    return user;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch user!");
  }
};


// fetch data  products lista from MongoDB 

export const fetchProducts = async (q, page) => {
  //console.log(q);
  const regex = new RegExp(q, "i");

  const ITEM_PER_PAGE = 10;

  try {
    connectToDB();
    const count = await Product.find({ title: { $regex: regex } }).countDocuments();
    const products = await Product.find({ title: { $regex: regex } })
      .limit(ITEM_PER_PAGE)
      .skip(ITEM_PER_PAGE * (page - 1));
    return { count, products };
  } catch (err) {
    console.error("Error fetching products y:", err);
    return { products: [] }; // In caso di errore, restituisci un array vuoto
    //console.log(err);
    //throw new Error("Failed to fetch products!");
  }
};


// fetch data single product from MongoDB

export const fetchProduct = async (id) => {
  console.log('fetchProduct called with id:', id);
  try {
    console.log('Attempting to connect to DB...');
    await connectToDB();
    console.log('DB connection successful');

    console.log('Searching for product with id:', id);
    const product = await Product.findById(id);
   // console.log(' product List data:', product);
    
    if (!product) {
      console.log(`Product with id ${id} not found`);
      return null;
    }
    
    // Convert mongoose document to plain JavaScript object
    const productObject = product.toObject();
    //console.log('Processed product data:', productObject);
    
    return productObject;
  } catch (err) {
    console.error('Error in fetchProduct:', err);
    throw new Error(`Failed to fetch product: ${err.message}`);
  }
};

