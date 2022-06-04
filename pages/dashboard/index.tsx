import type { NextPage } from "next";
import React from 'react';
import AppLayout from "../../components/layout/layout";
import Students from "../../pages/dashboard/manager/students"

const Home: NextPage = () => {

  return (
    <AppLayout>
      <Students/>
    </AppLayout>
  );
};

export default Home;
