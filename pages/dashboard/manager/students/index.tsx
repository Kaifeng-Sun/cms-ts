import React, { useEffect, useState } from "react";
import { Table, Pagination, Button, Input, Modal, Space, Typography, Popconfirm, Form, Select, message } from "antd";
import type { ColumnsType } from "antd/lib/table";
import axios from "axios";
import { formatDistanceToNow } from 'date-fns';
import { Student } from '../../../../lib/model/student'
import ModalForm from "../../../../components/common/modal-form";
import apiService from "../../../../lib/services/api-service";

export default function Students() {
  const [data, setData] = useState<Student[]>([]);
  const [paginator, setPaginator] = useState({ limit: 20, page: 1 });
  const [total, setTotal] = useState(0);
  const [name, setName] = useState('');
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form] = Form.useForm();
  const { Search } = Input;
  const { Link } = Typography;
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
          <Link
            onClick={() => {
              form.resetFields()
              setVisible(true)
              setEditingStudent(record)
              console.log(editingStudent);
            }}
          >Edit</Link>
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => {
              const localData = localStorage.getItem("cms");
              axios
                .delete(
                  'http://cms.chtoma.com/api/students/' + record.id,
                  { headers: { Authorization: 'Bearer ' + JSON.parse(localData || "").token } }
                )
                .then((res) => {
                  if (res.data) {
                    const index = data.findIndex((student) => student.id === record.id)
                    const updatedData = [...data]
                    //remove the deleted record from data
                    updatedData.splice(index, 1)
                    setData(updatedData)
                    setTotal(total - 1)
                  }
                }).catch((err) => {

                });
            }}
            okText="Confirm"
          >
            <Link>
              Delete
            </Link>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getData(paginator, name);
  }, [paginator, name])

  const getData = async (paginator: any, name: string) => {
    const { data } = await apiService.getStudents({
      limit: paginator.limit,
      page: paginator.page,
      query: name
    });

    setData(data.students);
    setTotal(data!.total);
  }

  const handlePaginationChange = (page: any, pageSize: any) => {
    if (paginator.limit !== pageSize) {
      setPaginator({ limit: pageSize, page: 1 })
    } else {
      setPaginator({ limit: pageSize, page: page })
    }
  }

  const onSearch = (e: any) => {
    setName(e)
  }

  const onCreate = (values: any) => {
    console.log('Received values of form: ', values);
    console.log(editingStudent);

    // setVisible(false);
    const localData = localStorage.getItem("cms");

    !!editingStudent ?
      axios
        .put('http://cms.chtoma.com/api/students', {
          ...values,
          id: editingStudent.id,
        }, {
          headers: { Authorization: 'Bearer ' + JSON.parse(localData || "").token }
        })
        .then((res) => {
          console.log(res);
        }).catch((err) => {
          message.error('Submit failed')
        }).finally(() => {
          setEditingStudent(null)
          setVisible(false)
        })
      :
      axios
        .post('http://cms.chtoma.com/api/students', {
          ...values
        },
          { headers: { Authorization: 'Bearer ' + JSON.parse(localData || "").token } }
        )
        .then((res) => {
          console.log(res);

        }).catch((err) => {
          message.error('Submit failed')
        }).finally(() => {
          setEditingStudent(null)
          setVisible(false)
        })
  }

  const onCancel = () => {
    setVisible(false);
    setEditingStudent(null);
    console.log(editingStudent);
  };

  return (
    <>
      <div className="flex justify-between mb-6">
        <Button type="primary" onClick={() => { setVisible(true) }}>Add</Button>
        <Search
          placeholder="search by name"
          onSearch={onSearch}
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
        onCancel={onCancel}
        confirmLoading={confirmLoading}
        editingStudent={editingStudent}
        form={form}
      />
    </>

  );
}
