"use client";

import { useEffect } from "react";

const Error = () => {

  useEffect(() => {
    const timeout = setTimeout(() => {
      window.location.reload();
    }, 500000000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    //The error layout
    <div style={{ display: "flex", justifyContent: "center", margin: 100 }}>
      <h2>Error !! something is wrong!!!</h2>
    </div>
  );
};

export default Error;
