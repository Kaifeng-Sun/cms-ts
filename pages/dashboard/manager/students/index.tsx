import React, { useEffect, useState } from "react";
import { Table, Pagination, Button, Input, Modal, Space, Typography, Popconfirm, Form, Select } from "antd";
import type { ColumnsType } from "antd/lib/table";
import axios from "axios";
import { formatDistanceToNow } from 'date-fns';
import { Student } from '../../../../lib/model/student'

export default function Students() {
  const [data, setData] = useState<any[]>([]);
  const [paginator, setPaginator] = useState({ limit: 20, page: 1 });
  const [total, setTotal] = useState(0);
  const [name, setName] = useState('');
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const { Search } = Input;
  const { Link } = Typography;
  type SizeType = Parameters<typeof Form>[0]['size'];
  const [componentSize, setComponentSize] = useState<SizeType | 'default'>('default');
  const studentType = [
    { text: 'developer', value: 'developer' },
    { text: 'tester', value: 'tester' },
  ]

  const showPopconfirm = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setVisible(false);
  };

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
              setEditingStudent(record)
              setVisible(true)
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
    // window.timer = null

    // clearTimeout(timer);
    // timer =setTimeout(()=>{
    getData(paginator, name);
    // },0)
  }, [paginator, name])

  const getData = (paginator: any, name: string) => {
    const localData = localStorage.getItem("cms");
    axios
      .get('http://cms.chtoma.com/api/students', {
        params: {
          limit: paginator.limit,
          page: paginator.page,
          query: name
        },
        headers: { Authorization: 'Bearer ' + JSON.parse(localData || "").token }
      })
      .then((res) => {
        const { data: { students, total } } = res.data;
        console.log(res.data.data);
        setData(students);
        setTotal(total);
      }).catch((err) => {

      });
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

  const handleOk = (values:any)=>{
    const localData = localStorage.getItem("cms");
    console.log(values.name);
    
    !!editingStudent ? 
    axios
    .get('http://cms.chtoma.com/api/students', {
      params: {
        ...values
      },
      headers: { Authorization: 'Bearer ' + JSON.parse(localData || "").token }
    })
    .then((res) => {
      setEditingStudent(null)
    }).catch((err) => {

    })
    : 
    axios
    .get('http://cms.chtoma.com/api/students', {
      params: {

      },
      headers: { Authorization: 'Bearer ' + JSON.parse(localData || "").token }
    })
    .then((res) => {

    }).catch((err) => {

    })
    
  }

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

      <Modal
        title={!!editingStudent ? 'Edit Student' : 'Add Student'}
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText="Submit"
        
      >
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          size={componentSize as SizeType}
          requiredMark
          initialValues={{
            name: editingStudent?.name,
            email: editingStudent?.email,
            country: editingStudent?.country,
            typeId: editingStudent?.type.id,
          }}
        >
          <Form.Item label="Name:" name='name' required>
            <Input />
          </Form.Item>
          <Form.Item label="Email:" name='email' required>
            <Input />
          </Form.Item>
          <Form.Item label="Area" name='country' required>
            <Select>
              <Select.Option value="China">China</Select.Option>
              <Select.Option value="New Zealand">New Zealand</Select.Option>
              <Select.Option value="Canada">Canada</Select.Option>
              <Select.Option value="Australia">Australia</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Student Type:" name='typeId' required>
            <Select>
              {/* {studentType.map((type)=>{
                <Select.Option value={type.value}>{type.text}</Select.Option>
              })} */}
              <Select.Option value={1}>Tester</Select.Option>
              <Select.Option value={2}>Developer</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>

  );
}
