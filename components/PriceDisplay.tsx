"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function PriceDisplay() {
  const [ethPrice, setEthPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await axios.get("/api/check-price");
        setEthPrice(response.data.price);
      } catch (error) {
        console.error("Failed to fetch ETH price:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 60000); // Update every 60 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center p-4">
      <h2 className="text-2xl font-bold text-blue-500">Ethereum Price</h2>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <p className="text-3xl font-semibold text-blue-500">${ethPrice}</p>
      )}
    </div>
  );
}
