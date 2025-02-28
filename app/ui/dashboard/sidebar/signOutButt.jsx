"use client"

import { useEffect, useState } from 'react'
import {MdLogout } from "react-icons/md";
import styles from "./sidebar.module.css";

const SignOutButton = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    handleResize(); // Check initial screen size

    return () => window.removeEventListener('resize', handleResize);
  }, []);

    return(
      <button className={styles.logout}>
      { isMobile ? (
      <MdLogout />) :
     ( 
     <>
     <MdLogout />
     Logout
     </>
      ) }
    </button>
        

    )
}

export default SignOutButton;