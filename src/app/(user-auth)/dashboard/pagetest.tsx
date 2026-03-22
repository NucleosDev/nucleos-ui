"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/dados", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
      setData(json);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>

      {data.map((item, index) => (
        <div key={index}>{JSON.stringify(item)}</div>
      ))}
    </div>
  );
}