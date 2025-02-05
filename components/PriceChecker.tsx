"use client";
import { useEffect } from "react";
import axios from "axios";

export default function PriceChecker() {
  useEffect(() => {
    const interval = setInterval(async () => {
      await axios.get("/api/check-price");
    }, 60000); // Runs every 60 seconds

    return () => clearInterval(interval);
  }, []);

  return <></>; // No UI needed
}
