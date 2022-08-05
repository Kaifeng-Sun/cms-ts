import { Button, Col, Form, Input, message, Row, Select, TimePicker } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import { FormListFieldData } from 'antd/lib/form/FormList';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react'
import { ScheduleRequest } from '../../lib/model/courses';
import apiService from '../../lib/services/api-service';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Gutter } from 'antd/lib/grid/row';
import { validateMessages, weekDays } from '../../lib/constant/config';
import moment from 'moment';

const gutter: [Gutter, Gutter] = [6, 16];

export interface AddChapterFormProps {
  courseId?: number;
  scheduleId?: number;
  onSuccess?: (res: boolean) => void;
  isAdd?: boolean;
}

const { Option } = Select;
const clsTime = 'classTime';
const cpts = 'chapters';

type ChapterFormValue = {
  [cpts]: {
    name: string;
    content: string;
  }[];
  [clsTime]: {
    weekday: string;
    time: Date;
  }[];
};
export default function CourseChapter({
  courseId,
  onSuccess,
  scheduleId,
  isAdd = true,
}: AddChapterFormProps) {

  const [form] = useForm<ChapterFormValue>();
  const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>([]);

  const updateSelectedWeekdays = (namePath?: (string | number)[]) => {
    const selected: {
      weekday: string;
      time: string;
    }[] = form.getFieldValue(clsTime) || [];

    let result = selected.map((item) => item?.weekday);

    if (namePath) {
      const value = form.getFieldValue(namePath);

      result = result.filter((item) => item !== value);
    }

    setSelectedWeekdays(result);
  };

  const onFinish = (values: ChapterFormValue) => {
    if (!courseId && !scheduleId) {
      message.error('You must select a course to update!');
      return;
    }

    const { classTime: origin, chapters } = values;
    console.log(origin);
    
    const classTime = origin.map(({ weekday, time }) => `${weekday} ${format(moment(time, 'hh:mm:ss').toDate(), 'hh:mm:ss')}`);
    const req: ScheduleRequest = {
      chapters: chapters.map((item, index) => ({ ...item, order: index + 1 })),
      classTime,
      scheduleId,
      courseId,
    };

    apiService.updateSchedule(req).then((res) => {
      const { data } = res;

      if (!!onSuccess && data) {
        onSuccess(true);
      }
    });
  };
  const initialValues = {
    [cpts]: [{ name: '', content: '' }],
    [clsTime]: [{ weekday: '', time: '' }],
  };

  useEffect(() => {
    (async () => {
      if (!scheduleId || isAdd) {
        return;
      }

      const { data } = await apiService.getScheduleById({ scheduleId });

      if (!!data) {
        const classTimes = data.classTime.map((item) => {
          const [weekday, time] = item.split(' ');

          return { weekday, time: moment(`2020-11-11 ${time}`) }
        });

        form.setFieldsValue({ chapters: data.chapters, classTime: classTimes });
        setSelectedWeekdays(classTimes.map((item) => item.weekday));
      }
    })();
  }, [scheduleId]);
  return (
    <Form
      form={form}
      name="schedule"
      onFinish={onFinish}
      autoComplete="off"
      validateMessages={validateMessages}
      style={{ padding: '0 1.6%' }}
      initialValues={initialValues}
    >
      <Row gutter={gutter}>
        <Col span={12}>
          <h2>Chapters</h2>
          <Form.List name={cpts}>
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Row key={field.key} gutter={20}>
                    <Col span={8}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'name']}
                        fieldKey={[field.key, 'name']}
                        rules={[{ required: true }]}
                      >
                        <Input size="large" placeholder="Chapter Name" />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'content']}
                        fieldKey={[field.key, 'content']}
                        rules={[{ required: true }]}
                      >
                        <Input size="large" placeholder="Chapter content" />
                      </Form.Item>
                    </Col>

                    <Col span={2}>
                      <FormItem>
                        <MinusCircleOutlined
                          onClick={() => {
                            if (fields.length > 1) {
                              remove(field.name);
                            } else {
                              message.warn('You must set at least one chapter.');
                            }
                          }}
                        />
                      </FormItem>
                    </Col>
                  </Row>
                ))}

                <Row>
                  <Col span={20}>
                    <Form.Item>
                      <Button
                        type="dashed"
                        size="large"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add Chapter
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
          </Form.List>
        </Col>

        <Col span={12}>
          <h2>Class times</h2>
          <Form.List name="classTime">
            {(fields: FormListFieldData[], { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Row key={field.key} gutter={20}>
                    <Col span={8}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'weekday']}
                        fieldKey={[field.key, 'weekday']}
                        rules={[{ required: true }]}
                      >
                        <Select
                          size="large"
                          onChange={(value: string) =>

                            setSelectedWeekdays([...selectedWeekdays, value])
                          }
                        >
                          {weekDays.map((day) => (
                            <Option
                              key={day}
                              value={day}
                              disabled={
                                selectedWeekdays.includes(day) || 
                                (
                                  !!weekDays ?
                                    weekDays.indexOf(day) < weekDays.indexOf(selectedWeekdays[selectedWeekdays.length - 1])
                                    : false
                                )}>

                              {day}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'time']}
                        fieldKey={[field.key, 'time']}
                        rules={[{ required: true }]}
                      >
                        <TimePicker size="large" style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>

                    <Col span={2}>
                      <FormItem>
                        <MinusCircleOutlined
                          onClick={() => {
                            if (fields.length > 1) {
                              updateSelectedWeekdays([clsTime, field.name, 'weekday']);
                              remove(field.name);
                            } else {
                              message.warn('You must set at least one class time.');
                            }
                          }}
                        />
                      </FormItem>
                    </Col>
                  </Row>
                ))}

                <Row>
                  <Col span={20}>
                    <Form.Item>
                      <Button
                        type="dashed"
                        size="large"
                        disabled={fields.length >= 7}
                        onClick={() => {
                          updateSelectedWeekdays();
                          add();
                        }}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add Class Time
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
          </Form.List>
        </Col>
      </Row>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}
