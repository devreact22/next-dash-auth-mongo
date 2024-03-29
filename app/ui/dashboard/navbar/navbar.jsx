"use client";
import { usePathname } from "next/navigation";
import styles from "./navbar.module.css";
import { useEffect, useState } from 'react'
import {
  MdNotifications,
  MdOutlineChat,
  MdPublic,
  MdSearch,
} from "react-icons/md";

const Navbar = () => {
  const pathname = usePathname();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    handleResize(); // Check initial screen size

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.title}>{pathname.split("/").pop()}</div>
      <div className={styles.menu}>
        {/* <div className={styles.search}>
          <MdSearch />
          <input type="text" placeholder="Search..." className={styles.input} />
        </div> */}
        {isMobile ? (
        ""
        )
       :
       (
       <>
       <div className={styles.icons}>
          <MdOutlineChat size={20} />
          <MdNotifications size={20} />
          <MdPublic size={20} />
        </div>
        </>
        )}
      </div>
    </div>
  );
};

export default Navbar;