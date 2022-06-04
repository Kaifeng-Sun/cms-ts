import React, { useEffect, useState } from "react";
import { Table, Switch, Pagination } from "antd";
import type { ColumnsType } from "antd/lib/table";
import axios from "axios";

interface Student {
  key: number;
  name: string;
  area: string;
  email: string;
  courses: string;
  type: string;
  createdAt: string;
}

const columns: ColumnsType<Student> = [
  {
    title: "No.",
    dataIndex: "id",
    key: "col-id",
    fixed: "left",
    width: 50,
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "col-name",
    fixed : 'left',
    width: 130,
  },
  {
    title: "Area",
    width: 100,
    dataIndex: "country",
    key: "col-country",
    fixed: "left",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "col-email",
    width: 200,
  },
  {
    title: "Selectied Curriculum",
    dataIndex: "courses",
    key: "col-courses",
    render: (courses)=> courses?.map((course:any)=>course.name).join(", "),
    width: 150,
  },
  {
    title: "Student Type",
    dataIndex: "type",
    key: "col-type",
    render: (type)=>type.name,
    width: 100,
  },
  {
    title: "Join time",
    dataIndex: "createdAt",
    key: "col-jointime",
    width: 100,
  },
  {
    title: "Action",
    key: "col-operation",
    fixed: "right",
    width: 100,
    render: () => <span><a>Edit</a><br/><a>Delete</a></span>,
  },
];

export default function Students() {
  const [data, setData] = useState([]);
  const [paginator, setPaginator] = useState({ limit: 20, page: 1 });
  const [total,setTotal] = useState(0);
  let timer:any = null
  
  useEffect(() => {
    clearTimeout(timer);
    timer =setTimeout(()=>{
      getData();
    },0)
  },[paginator])

  const getData = () => {
    const localData = localStorage.getItem("cms");
    axios
    .get('http://cms.chtoma.com/api/students',{
      params: paginator,
      headers: {Authorization: 'Bearer ' + JSON.parse(localData || "").token,}
    })
    .then((res)=>{
      const { data: {students, total}} = res.data;
      console.log(res);
      setData(students);
      setTotal(total)
    })
  }

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        sticky
      />
      <Pagination
        defaultCurrent={1}
        defaultPageSize={paginator.limit}
        total={total}
        style={{marginTop:'20px'}}
        showSizeChanger
        onChange={(page,pageSize)=>{setPaginator({limit:pageSize,page:page})}}
      />
    </>
    
  );
}
