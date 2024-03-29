"use client"
import React from 'react'
import Link from "next/link";
import styles from "./cardProduct.module.css";

function AddButton() {
  return (
    <div className={styles.top}>       
          <Link href="/dashboard/products/add">
            <button className={styles.addButton}>Add New</button>
          </Link>
        </div> 
  )
}

export default AddButton