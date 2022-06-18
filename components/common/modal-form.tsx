import React, { useEffect } from 'react'
import { Button, Form, Input, Modal, Radio, Select } from 'antd';
import { Student } from "../../lib/model/student"

interface ModalFormProps {
  editingStudent: Student | null
  visible: boolean
  confirmLoading: boolean
  onCreate: (student: Student) => void;
  onCancel: () => void;
  form: any
}

export default function ModalForm(props: ModalFormProps) {
  const { form, editingStudent, visible, confirmLoading, onCancel, onCreate } = props

  return (
    <Modal
      title={!!editingStudent ? 'Edit Student' : 'Add Student'}
      visible={visible}
      onOk={() => {
        form
          .validateFields()
          .then((values: Student) => {
            form.resetFields();
            onCreate(values);
          })
      }}
      onCancel={onCancel}
      okText={!!editingStudent ? 'Update' : 'Add'}
      destroyOnClose
    >
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        requiredMark
        initialValues={{
          name: editingStudent?.name,
          email: editingStudent?.email,
          country: editingStudent?.country,
          typeId: editingStudent?.type?.id,
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
  )
}
