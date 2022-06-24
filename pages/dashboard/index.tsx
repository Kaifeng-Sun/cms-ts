import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from 'react';
import storage from "../../lib/services/storage";

const Home: NextPage = () => {
  const router = useRouter()
  useEffect(()=>{
    router.push('/dashboard/' +  storage.role)
  })
  return null;
};

export default Home;