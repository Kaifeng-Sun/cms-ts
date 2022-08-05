import { Button, Col, DatePicker, Form, Input, InputNumber, message, Modal, Row, Select, Spin, Upload } from 'antd'
import { Gutter } from 'antd/lib/grid/row';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import { Role } from '../../lib/constant/role';
import { AddCourseRequest, Course, CourseType } from '../../lib/model/courses';
import { Teacher } from '../../lib/model/teacher';
import apiService from '../../lib/services/api-service';
import { useUserRole } from '../custom-hooks/login-state';
import { CloseCircleOutlined, InboxOutlined, KeyOutlined } from '@ant-design/icons';
import { useForm } from 'antd/lib/form/Form';
import { format, getTime } from 'date-fns';
import NumberWithUnit, { NumberWithUnitValue } from '../common/number-with-unit';
import { DurationUnit } from '../../lib/constant/duration';
import TextArea from 'antd/lib/input/TextArea';
import ImgCrop from 'antd-img-crop';
import { UploadFile } from 'antd/lib/upload/interface';
import { getBase64 } from '../../lib/util/image-helper';
import moment from 'moment';

const UploadInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgb(240, 240, 240);
  width: 100%;
  .anticon {
    font-size: 44px;
    color: #1890ff;
  }
  p {
    font-size: 24px;
    color: #999;
  }
`;

const DescriptionTextArea = styled(Form.Item)`
  .ant-form-item-control {
    position: absolute;
    inset: 0;
    top: 37px;
    bottom: 30px;
  }
  .ant-form-item-control-input,
  .ant-form-item-control-input-content,
  text-area {
    padding-right:10px;
    padding-left: 10px;
    height: 100%;
  }
`;

const UploadItem = styled(Form.Item)`
  .ant-upload.ant-upload-select-picture-card {
    width: 100%;
    margin: 0;
  }
  .ant-form-item-control {
    position: absolute;
    inset: 0;
    top: 37px;
    bottom: 30px;
  }
  .ant-upload-picture-card-wrapper,
  .ant-form-item-control-input,
  .ant-form-item-control-input div {
    height: 100%;
  }
  .ant-upload-picture-card-wrapper img {
    object-fit: cover !important;
  }
  .ant-upload-list-item-progress,
  .ant-tooltip {
    height: auto !important;
    .ant-tooltip-arrow {
      height: 13px;
    }
  }
  .ant-upload-list-picture-card-container {
    width: 100%;
  }
  .ant-upload-list-item-actions {
    .anticon-delete {
      color: red;
    }
  }
`;

const DeleteIcon = styled(CloseCircleOutlined)`
  color: red;
  position: absolute;
  right: -10px;
  top: 1em;
  font-size: 24px;
  opacity: 0.5;
`;

const gutter: [Gutter, Gutter] = [6, 16];

export interface AddCourseFormProps {
  course?: Course;
  onSuccess?: (course: Course) => void;
}

const validateDuration = (_, value: NumberWithUnitValue) => {
  if (value?.number > 0) {
    return Promise.resolve();
  }

  return Promise.reject('Duration must be greater than 0!');
};

export default function CourseDetail({ course, onSuccess }: AddCourseFormProps) {
  const [form] = useForm();
  const [isTeacherSearching, setIsTeacherSearching] = useState<boolean>(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courseTypes, setCourseTypes] = useState<CourseType[]>([]);
  const [isGenCodeDisplay, setIsGenCodeDisplay] = useState(true);
  const [isAdd, setIsAdd] = useState(course === undefined);
  const [fileList, setFileList] = useState([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [preview, setPreview] = useState<{ previewImage: string; previewTitle: string }>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getCode = () => {
    apiService.createCourseCode().then((res) => {
      const { data: uid } = res;

      form.setFieldsValue({ uid });
      setIsGenCodeDisplay(false);
    });
  };

  const handlePreview = async (file: UploadFile<any>) => {
    if (!file.url && !file.preview) {
      file.preview = (await getBase64(file.originFileObj)) as string;
    }

    setPreview({
      previewImage: file.url || file.preview,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };
  
  const role = useUserRole();

  const onFinish = async (values: any) => {

    if (!isAdd && !course) {
      message.error('You must select a course to update!');
      return;
    }

    const req: AddCourseRequest = {
      ...values,
      duration: +values.duration.number,
      startTime: values.startTime && format(moment(values.startTime, 'yyy-MM-dd').toDate(), 'yyy-MM-dd'),
      teacherId: +values.teacher || +course.teacherId,
      durationUnit: +values.duration.unit,
    };
    const response = isAdd
      ? apiService.addCourse(req)
      : apiService.updateCourse({ ...req, id: course.id });
    const { data } = await response;

    if (!!data && !course) {
      setIsAdd(false);
    }

    if (!!onSuccess && !!data) {
      onSuccess(data);
    }
  };

  useEffect(() => {
    if (isAdd) {
      getCode();
    }

    apiService.getCourseTypes().then((res) => {
      const { data } = res;

      setCourseTypes(data);
    });
  }, [])

  useEffect(() => {
    if (!!course) {
      const values = {
        ...course,
        type: course.type.map(item => item.id),
        teacherId: course.teacherName,
        startTime: moment(course.startTime),
        duration: { number: course.duration, unit: course.durationUnit },
      };

      console.log('====================================');
      console.log(values);
      console.log('====================================');
      form.setFieldsValue(values);

      setFileList([{ name: 'Cover Image', url: course.cover }]);
    }
  }, [course]);
  return (
    <>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Row gutter={gutter}>
          <Col span={8}>
            <Form.Item
              label="Course Name"
              name="name"
              rules={[{ required: true }, { max: 100, min: 3 }]}
            >
              <Input type="text" placeholder="course name" />
            </Form.Item>
          </Col>

          <Col span={16}>
            <Row gutter={gutter}>
              <Col span={8}>
                <Form.Item
                  label="Teacher"
                  name="teacher"
                  rules={[{ required: true }]}
                  style={{ marginLeft: 5 }}
                >
                  <Select
                    placeholder="Select teacher"
                    notFoundContent={isTeacherSearching ? <Spin size="small" /> : null}
                    filterOption={false}
                    showSearch
                    disabled={role !== Role.manager}
                    onSearch={(query: string) => {
                      setIsTeacherSearching(true);

                      apiService.getTeachers({ query }).then((res) => {
                        const { data } = res;

                        if (!!data) {
                          setTeachers(data.teachers);
                        }
                        setIsTeacherSearching(false);
                      });
                    }}
                  >
                    {teachers.map(({ id, name }) => (
                      <Select.Option key={id} value={id}>
                        {name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label="Type"
                  name="type"
                  rules={[{ required: true }]}
                >
                  <Select mode="multiple">
                    {courseTypes.map((type) => (
                      <Select.Option value={type.id} key={type.id}>
                        {type.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="Course Code" name="uid" rules={[{ required: true }]}>
                  <Input
                    type="text"
                    placeholder="course code"
                    disabled
                    addonAfter={
                      isGenCodeDisplay ? <KeyOutlined style={{ cursor: 'pointer' }} /> : null
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col>

          </Col>
          <Col>

          </Col>
        </Row>

        <Row gutter={gutter}>
          <Col span={8}>
            <Form.Item label="Start Date" name="startTime">
              <DatePicker
                style={{ width: '100%' }}
                disabledDate={(current) => {
                  const today = getTime(new Date());
                  const date = current.valueOf();
                  return date < today;
                }}
              />
            </Form.Item>

            <Form.Item label="Price" name="price" rules={[{ required: true }]}>
              <InputNumber
                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                // @ts-ignore
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                min={0}
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item label="Student Limit" name="maxStudents" rules={[{ required: true }]}>
              <InputNumber min={1} max={10} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label="Duration"
              name="duration"
              rules={[
                { required: true },
                { validator: validateDuration }
              ]}
            >
              <NumberWithUnit
                options={new Array(5)
                  .fill('')
                  .map((_, index) => ({ unit: index + 1, label: DurationUnit[index + 1] }))}
                defaultUnit={DurationUnit.month}
              />
            </Form.Item>
          </Col>

          <Col span={8} style={{ position: 'relative' }}>
            <DescriptionTextArea
              label="Description"
              name="detail"
              rules={[
                { required: true },
                {
                  min: 100,
                  max: 1000,
                  message: 'Description length must between 100 - 1000 characters.',
                },
              ]}
              style={{ paddingLeft:'10px',paddingRight:'10px' }}
            >
              <TextArea placeholder="Course description" style={{ height: '100%', }} />
            </DescriptionTextArea>
          </Col>

          <Col span={8} style={{ position: 'relative',marginLeft:'0px' }}>
            <UploadItem label="Cover" name="cover" style={{width:'100%'}}>
              <ImgCrop rotate aspect={16 / 9}>
                <Upload
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  listType="picture-card"
                  fileList={fileList}
                  onChange={({ fileList: newFileList, file }) => {
                    const { status } = file;

                    if (file?.response) {
                      const { url } = file.response;

                      form.setFieldsValue({ cover: url });
                    } else {
                      form.setFieldsValue({ cover: course?.cover || '' });
                    }

                    setIsUploading(status === 'uploading');
                    setFileList(newFileList);
                  }}
                  onPreview={handlePreview}
                >
                  {fileList.length >= 1 ? null : (
                    <UploadInner>
                      <InboxOutlined />
                      <p>Click or drag file to this area to upload</p>
                    </UploadInner>
                  )}
                </Upload>
              </ImgCrop>
            </UploadItem>
            {isUploading && (
              <DeleteIcon
                onClick={() => {
                  setIsUploading(false);
                  setFileList([]);
                }}
              />
            )}
          </Col>
        </Row>
        
        <Row gutter={gutter}>
          <Col span={8}>
            <Form.Item>
              <Button type="primary" htmlType="submit" disabled={isUploading}>
                {isAdd ? 'Create Course' : 'Update Course'}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Modal
        visible={!!preview}
        title={preview?.previewTitle}
        footer={null}
        onCancel={() => setPreview(null)}
      >
        <img alt="example" style={{ width: '100%' }} src={preview?.previewImage} />
      </Modal>
    </>
  )
}
