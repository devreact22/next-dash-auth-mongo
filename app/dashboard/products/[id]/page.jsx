import { updateProduct } from "@/app/lib/actions";
import { fetchProduct } from "@/app/lib/data";
import styles from "@/app/ui/dashboard/products/singleProduct/singleProduct.module.css";
import Image from "next/image";
//import { createSupabaseClient } from "@/app/supabase/client";

const SingleProductPage = async ({ params }) => {
  
  const { id } = params;
  const product = await fetchProduct(id);

  console.log('ecco id ', id);
 // console.log('ecco product', product);

 

  return (
    <div className="gap-2 grid md:grid-cols-[1fr,2fr] justify-items-center w-full h-full p-2 mt-3 ">
      <div className="w-full ">
        <div className="flex justify-center items-center  p-4 bg-[#182236] rounded-xl">
          <div className="relative w-[250px] h-[250px] rounded-xl items-center ">
            {product.imageUrl && product.imageUrl.length > 0 ? (
              <Image
                src={product.imageUrl[0]} // primo URL nell'array
                alt={product.title || "Product image"}
                fill
                 className="object-cover rounded-lg "
                //sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div>No image available</div>
            )}
          </div>
        </div>
        {/* <form action={updateProductPhoto} className="mt-4">
          <input type="file" name="imageUrl" accept="image/*" />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Update Photo
          </button>
        </form> */}
      </div>

      <div className=" p-4 bg-[#182236] rounded-xl w-full">
        <form action={updateProduct} className={styles.form}>
        <input type="hidden" name="id" value={product._id.toString()} />
          <label>Title</label>
          <input type="text" name="title" placeholder={product.title} />
          <label>Price</label>
          <input type="number" name="price" placeholder={product.price} />
          <label>Stock</label>
          <input type="number" name="stock" placeholder={product.stock} />
          <label>Data</label>
          <input type="text" name="data" placeholder={product.data || "data"} />
          <label>Porzioni</label>
          <textarea
            type="text"
            name="size"
            placeholder={product.size || "Porzioni"}
          />
          <label>Cat</label>
          <select name="cat" id="cat">
            <option value="kitchen">Kitchen</option>
            <option value="computers">Computers</option>
          </select>
          <label>Description</label>
          <textarea
            name="desc"
            id="desc"
            rows="10"
            placeholder={product.desc}
          ></textarea>
          <button>Update</button>
        </form>
      </div>
    </div>
  );
};

export default SingleProductPage;
