import { updateProduct } from "@/app/lib/actions";
import { fetchProduct } from "@/app/lib/data";
import styles from "@/app/ui/dashboard/products/singleProduct/singleProduct.module.css";
import Image from "next/image";

const SingleProductPage = async ({ params }) => {
  const { id } = params;
  const product = await fetchProduct(id);

  return (
    <div className="grid lg:grid-cols-2 justify-items-center w-full h-full p-2 mt-3 ">
      <div className="h-[200px]  p-4 bg-[#182236] rounded-xl mb-2">
        <div className="relative w-[150px] h-[150px] rounded-xl">
          {product.imageUrl && product.imageUrl.length > 0 ? (
            <Image
              src={product.imageUrl[0]} // Usa il primo URL nell'array
              alt={product.title || "Product image"}
              fill
              style={{ objectFit: "cover" }}            
              //sizes="(max-width: 768px) 100vw, 50vw"
            />
   
          ) : (
            <div>No image available</div>
          )}
        </div>
        {product.title}
      </div>

      <div className=" p-4 bg-[#182236] rounded-xl w-full">
        <form action={updateProduct} className={styles.form}>
          <input type="hidden" name="id" value={product.id} />
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
