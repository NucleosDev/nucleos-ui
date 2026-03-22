"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const email = localStorage.getItem("email");

    setUser({ email });
  }, []);

  if (!user) return <p>Carregando...</p>;

  return (
    <div>
      <h1>Perfil</h1>
      <p>Email: {user.email}</p>
    </div>
  );
}