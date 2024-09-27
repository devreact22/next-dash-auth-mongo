import styles from "./footer.module.css";

const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>Software gestionale</div>
      <div className={styles.text}>© All rights reserved.</div>
      <div className={styles.logo}>Try</div>
    </div>
  );
};

export default Footer;