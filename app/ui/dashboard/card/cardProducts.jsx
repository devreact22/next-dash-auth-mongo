import { MdSupervisedUserCircle } from "react-icons/md";
import { fetchProducts } from "@/app/lib/data";
import { deleteProduct } from "@/app/lib/actions";
import Search from "@/app/ui/dashboard/search/search";
import Link from "next/link";
import styles from "./cardProduct.module.css";

const CardProduct = async ({ searchParams }) => {
  const q = searchParams?.q || "";
  const page = searchParams?.page || 1;
  const { products } = await fetchProducts(q, page);

  return (
    <div className={styles.container}>
      {products.map((product) => (
        <div className={styles.cards}>
          <div key={product.id}>
            <div className={styles.allinside}>
            {/* <div className={styles.user}>
              <MdSupervisedUserCircle size={24} />
              </div> */}
              <div className={styles.texts}>
                <MdSupervisedUserCircle size={24} />
                <h2 className={styles.title}>{product.title}</h2>
                <h5 className={styles.createAt}>
                {product.data}
                </h5>
                {/* <h5 className={styles.createAt}>
                  {product.createdAt?.toString().slice(4, 16)}
                </h5> */}
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
        </div>
      ))}
    </div>
  );
};

export default CardProduct;
