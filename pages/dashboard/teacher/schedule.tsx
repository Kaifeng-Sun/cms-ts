import React, { useEffect, useState } from 'react'
import AppLayout from '../../../components/layout/layout'
import apiService from '../../../lib/services/api-service'
import storage from '../../../lib/services/storage'
import { BadgeProps, Card, Col, Row } from 'antd';
import { Badge, Calendar } from 'antd';
import type { Moment } from 'moment';
import { Chapter, ClassSchedule } from '../../../lib/model/courses';
import { ClockCircleOutlined, NotificationFilled } from '@ant-design/icons';
import { cloneDeep, omit, orderBy } from 'lodash';
import {
  addDays,
  addHours,
  addMonths,
  addWeeks,
  addYears,
  differenceInCalendarDays,
  getDay,
  getMonth,
  getYear,
  isSameDay
} from 'date-fns';
import { weekDays } from '../../../lib/constant/config';
const courseTypeColors: string[] = [
  'magenta',
  'volcano',
  'orange',
  'gold',
  'green',
  'cyan',
  'crimson',
  'purple',
  'red',
  'lime',
];

export interface WeekdayTime {
  weekday: number;
  time: string;
}

export interface ClassCalendar extends WeekdayTime {
  date: Date;
  chapter: Chapter;
}

function sortWeekdaysBy(weekDays: WeekdayTime[], start: Date): WeekdayTime[] {
  const startWeekDay = getDay(start);

  weekDays = orderBy(weekDays, ['weekday', 'time'], ['asc', 'asc']);

  const firstIndex = weekDays.findIndex((item) => item.weekday === startWeekDay);
  const head = weekDays.slice(firstIndex);
  const rest = weekDays.slice(0, firstIndex);

  return [...head, ...rest];
}

function generateClassCalendar(course: ClassSchedule): ClassCalendar[] {
  const {
    startTime,
    durationUnit,
    duration,
    schedule: { classTime, chapters },
  } = course;

  if (!classTime) {
    return [];
  }

  const chaptersCopy = cloneDeep(chapters);
  const start = new Date(startTime);
  const addFns = [addYears, addMonths, addDays, addWeeks, addHours]; 
  const end = addFns[durationUnit - 1](start, duration);
  const days = differenceInCalendarDays(end, start);
  const transformWeekday = (day: string) => weekDays.findIndex((item) => item === day);
  const classTimes = classTime.map((item) => {
    const [day, time] = item.split(' ');
    const weekday = transformWeekday(day);

    return { weekday, time };
  });
  const sortedClassTimes = sortWeekdaysBy(classTimes, start);
  const getClassInfo = (day: number) => sortedClassTimes.find((item) => item.weekday === day);
  const result: ClassCalendar[] = [
    { date: start, chapter: chaptersCopy.shift(), weekday: getDay(start), time: '' }, // 第一节课没有时间
  ];

  for (let i = 1; i < days; i++) {
    const date = addDays(start, i);
    const day = getDay(date);
    const classInfo = getClassInfo(day);

    if (classInfo) {
      const chapter = chaptersCopy.shift();

      result.push({ date, chapter, ...classInfo });
    }
  }

  return result;
}

export default function Page() {
  const [data, setData] = useState<(ClassSchedule & { calendar: ClassCalendar[] })[]>([]);


  const monthCellRender = (current: Moment) => {
    const month = +current.format('M');
    const year = +current.format('YYYY');
    const result = data
      .map((course) => {
        const result = course.calendar.filter((item) => {
          const classMonth = getMonth(item.date);
          const classYear = getYear(item.date);

          return classYear === year && classMonth === month;
        });
        const total = result.length;

        return !!total ? { ...course, statistics: { total } } : null;
      })
      .filter((item) => !!item);

    return result.length ? (
      <>
        {result.map((course) => (
          <Row gutter={[6, 6]} key={course.id}>
            <Col>
              <b>{course.name}</b>
            </Col>
            <Col offset={1}>{course.statistics.total} lessons</Col>
          </Row>
        ))}
      </>
    ) : null;
  };

  const dateCellRender = (current: Moment) => {
    const listData = data
      .map((course) => {
        const { calendar } = course;
        const target = calendar.find((item) => isSameDay(new Date(current.toString()), item.date));

        return !!target ? { class: target, ...omit(course, 'calendar') } : null;
      })
      .filter((item) => !!item);
    return (
      <>
        {listData.map((item, index) => (
          <Row
            gutter={[6, 6]}
            key={index}
            style={{ fontSize: 12 }}
          >
            <Col span={1}>
              <ClockCircleOutlined />
            </Col>

            <Col span={8} offset={1}>
              {item.class?.time}
            </Col>

            <Col offset={1} style={{ color: courseTypeColors[item.type[0]?.id % 9] }}>
              {item.name}
            </Col>
          </Row>
        ))}
      </>
    );
  };

  useEffect(() => {
    apiService.getClassSchedule(storage.userId).then((res) => {
      const { data } = res;
     const result = data.map((course) => ({ ...course, calendar: generateClassCalendar(course) }));
     setData(result)
    })
  }, [])
  return (
    <AppLayout>
      <Card title="My Class Schedule">
        <Calendar dateCellRender={dateCellRender} monthCellRender={monthCellRender} />;
      </Card>
    </AppLayout>
  )
}
