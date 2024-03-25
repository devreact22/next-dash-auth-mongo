import { MdSupervisedUserCircle } from "react-icons/md";
import { fetchProducts } from "@/app/lib/data";
import { deleteProduct } from "@/app/lib/actions";
import Link from "next/link";
import styles from "./cardProduct.module.css";

const CardProduct = async ({ searchParams }) => {
  const q = searchParams?.q || "";
  //const page = searchParams?.page || 1;
  const { products } = await fetchProducts(q);

  return (
    <>
      {products.map((product) => (
        <div className={styles.container}>
          <div key={product.id}>
            <MdSupervisedUserCircle size={24} />
            <div className={styles.texts}>
              <h2 className={styles.title}>{product.title}</h2>
              <h5 className={styles.createAt} >{product.createdAt?.toString().slice(4, 16)}</h5>
            </div>
            <div className={styles.buttons}>
                  <Link href={`/dashboard/products/${product.id}`}>
                    <button className={`${styles.button} ${styles.view}`}>
                      View
                    </button>
                  </Link>
                  <form action={deleteProduct}>
                    <input type="hidden" name="id" value={product.id} />
                    <button className={`${styles.button} ${styles.delete}`}>
                      Delete
                    </button>
                  </form>
                </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default CardProduct;
