import type { NextPage } from "next";
import React from 'react';
import Breadcrumbs from "../../../components/common/breadcrumbs";
import AppLayout from "../../../components/layout/layout";
import Students from "../../../pages/dashboard/manager/students"

const Home: NextPage = () => {

  return (
    <AppLayout>
        <Breadcrumbs/>
      Overview
    </AppLayout>
  );
};

export default Home;