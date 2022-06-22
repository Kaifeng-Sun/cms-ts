import React, { useEffect, useState } from "react";
import { Table, Pagination, Button, Input, Space, Popconfirm, Form } from "antd";
import type { ColumnsType } from "antd/lib/table";
import { formatDistanceToNow } from 'date-fns';
import { Student } from '../../../../lib/model/student'
import ModalForm from "../../../../components/common/modal-form";
import apiService from "../../../../lib/services/api-service";
import Link from 'next/link';
import Layout from "../../../../components/layout/layout";
import { useRouter } from "next/router";
import Breadcrumb from "../../../../components/common/breadcrumb";

export default function Students() {
  const router = useRouter();
  const [data, setData] = useState<Student[]>([]);
  const [paginator, setPaginator] = useState({ limit: 20, page: 1 });
  const [total, setTotal] = useState(0);
  const [name, setName] = useState('');
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form] = Form.useForm();
  const { Search } = Input;
  const slug = router.pathname;
  const studentType = [
    { text: 'developer', value: 'developer' },
    { text: 'tester', value: 'tester' },
  ]

  const columns: ColumnsType<Student> = [
    {
      title: "No.",
      dataIndex: "id",
      fixed: "left",
    },
    {
      title: "Name",
      dataIndex: "name",
      fixed: 'left',
      sorter: (pre: Student, next: Student) => {
        const preCode = pre.name.charCodeAt(0);
        const nextCode = next.name.charCodeAt(0);
        return preCode > nextCode ? 1 : preCode === nextCode ? 0 : -1;
      },
      render:(_, record: Student)=>(
        <Link href={`/dashboard/manager/students/${record.id}`}>{record.name}</Link>
      )
    },
    {
      title: "Area",
      dataIndex: "country",
      fixed: "left",
      width: '10%',
      filters: ['China', 'New Zealand', 'Canada', 'Australia'].map((item) => ({ text: item, value: item })),
      onFilter: (value: any, record: Student) => record.country.includes(value),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Selected Curriculum",
      dataIndex: "courses",
      width: '25%',
      render: (courses) => courses?.map((course: any) => course.name).join(", "),
    },
    {
      title: "Student Type",
      dataIndex: "type",
      filters: studentType,
      onFilter: (value: any, record: Student) => record.type.name === value,
      render: (type) => type?.name,
    },
    {
      title: "Join time",
      dataIndex: "createdAt",
      render: (value: string) => formatDistanceToNow(new Date(value), { addSuffix: true })
    },
    {
      title: "Action",
      fixed: "right",
      render: (_, record: Student) => (
        <Space>
          <a
            onClick={async () => {
              setVisible(true)
              setEditingStudent(record)
            }}
          >Edit</a>
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={async () => {
              const studentId: number = record.id
              const deleteResponse = await apiService.deleteStudent(studentId);
              if (!!deleteResponse.data) {
                const index = data.findIndex((student) => student.id === record.id)
                const updatedData = [...data]
                updatedData.splice(index, 1)
                setData(updatedData)
                setTotal(total - 1)
                if (data.length === 0) {
                  const updatedPaginator = {
                    limit: paginator.limit,
                    page: paginator.page - 1
                  }
                  setPaginator(updatedPaginator)
                }
              }
            }}
            okText="Confirm"
          >
            <a>
              Delete
            </a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    form.setFieldsValue({
      name: editingStudent?.name,
      email: editingStudent?.email,
      country: editingStudent?.country,
      typeId: editingStudent?.type?.id,
    })
  }, [editingStudent])

  useEffect(() => {
    getData(paginator, name);
  }, [paginator, name])

  const getData = async (paginator: any, name: string) => {

    const { data } = await apiService.getStudents({
      limit: paginator.limit,
      page: paginator.page,
      query: name
    });

    if (data) {
      setData(data.students);
      setTotal(data.total);
    }
  }

  const handlePaginationChange = (page: any, pageSize: any) => {
    if (paginator.limit !== pageSize) {
      setPaginator({ limit: pageSize, page: 1 })
    } else {
      setPaginator({ limit: pageSize, page: page })
    }
  }

  const onCreate = async (values: any) => {
    setConfirmLoading(true)
    const localData = localStorage.getItem("cms");
    console.log(values);
    
    if (!!editingStudent) {
      
      const editResponse = await apiService.updateStudent({
        ...values,
        id: editingStudent.id,
      })
      
      if (!!editResponse.data) {
        getData(paginator, name);
        setVisible(false)
      }
    } else {
      const addResponse = await apiService.addStudent(values)
      console.log(addResponse);
      if (!!addResponse.data) {
        setVisible(false)
        setTotal(total + 1)
        setVisible(false)
        form.setFieldsValue({})
        getData(paginator, name);
      }
    }
    setConfirmLoading(false)
  }

  return (
    <>
    <Layout>
      <Breadcrumb slug={slug}/>
      <div className="flex justify-between mb-6">
        <Button type="primary" onClick={() => { setVisible(true) }}>Add</Button>
        <Search
          placeholder="search by name"
          onSearch={(e: any) => { setName(e) }}
          style={{ width: 300 }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey="id"
        sticky
      />

      <Pagination
        current={paginator.page}
        defaultPageSize={paginator.limit}
        total={total}
        style={{ marginTop: '20px' }}
        showSizeChanger
        onChange={handlePaginationChange}
      />

      <ModalForm
        visible={visible}
        onCreate={onCreate}
        onCancel={() => {
          setVisible(false);
          setEditingStudent(null);
        }}
        confirmLoading={confirmLoading}
        editingStudent={editingStudent}
        form={form}
        loading={confirmLoading}
      />
    </Layout>
      
    </>

  );
}
