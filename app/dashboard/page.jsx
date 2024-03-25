import { cards } from "../lib/data";
import Card from "../ui/dashboard/card/card";
import CardProduct from "../ui/dashboard/card/cardProducts";
//import Chart from "../ui/dashboard/chart/chart";
import ProductsPage from "./products/page";
import styles from "../ui/dashboard/dashboard.module.css";
// import Rightbar from "../ui/dashboard/rightbar/rightbar";
//import Transactions from "../ui/dashboard/transactions/transactions";

const Dashboard = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        {/* <div className={styles.cards}>
          {cards.map((item) => (
            <Card item={item} key={item.id} />
          ))}
        </div> */}
        <div className={styles.cards}>
            <CardProduct  />   
        </div>
        <ProductsPage />
        {/* <Transactions /> */}
        {/* <Chart /> */}
      </div>
      {/* <div className={styles.side}>
        <Rightbar /> 
      </div> */}
    </div>
  );
};

export default Dashboard;