/* eslint-disable @next/next/no-async-client-component */
"use client";

import { signIn, signOut, useSession } from "next-auth/react";

const Home = () => {
  const { data, status } = useSession();

  const handleLogout = async () => {
    await signOut();
  };

  const handleLogin = async () => {
    await signIn();
  };

  return (
    <div>
      <p>{JSON.stringify(data)}</p>
      <p>{JSON.stringify(status)}</p>
      {status === "unauthenticated" && <button onClick={handleLogin}>Login</button>}
      {status === "authenticated" && <button onClick={handleLogout}>Logout</button>}
    </div>
  );
};

export default Home;
