import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from '../../../../components/layout/layout';
import apiService from "../../../../lib/services/api-service";
import { CourseType } from "../../../../lib/model/courses";

export default function Page() {
  const router = useRouter();
  const { id } = router.query;
  const [info, setInfo] = useState<{ label: string; value: any }[]>([]);
  const [schedule, setSchedule] = useState({});
  const [type, setType] = useState<CourseType[]>([]);


  // useEffect(() => {
  //   async function fetchCourse(id: number) {
  //     const { data } = await apiService.getCourseById(id)
  //     if (!!data) {
  //       return data
  //     }
  //   }
  //   if (!!id) {
  //     const detailRespond = fetchCourse(+id)
  //     if (!!detailRespond) {
  //       detailRespond.then(res => {
  //         const data = res
  //         if (!!data) {
  //           console.log(data);
            
  //           const info = [
  //             { label: 'cover', value: data.cover },
  //             { label: 'create Date', value: data.createdAt },
  //             { label: 'detail', value: data.detail },
  //             { label: 'durationUnit', value: data.durationUnit },
  //             { label: 'id', value: data.id },
  //             { label: 'name', value: data.name },
  //             { label: 'price', value: data.price },
  //             { label: 'duration', value: data.duration },
  //             { label: 'scheduleId', value: data.scheduleId },
  //             { label: 'star', value: data.star },
  //             { label: 'startTime', value: data.startTime },
  //             { label: 'status', value: data.status },
  //             { label: 'teacherId', value: data.teacherId },
  //             { label: 'teacherName', value: data.teacherName },
  //             { label: 'status', value: data.status },
  //             { label: 'uid', value: data.uid },
  //           ];
  //           // setAbout(about)
  //           setInfo(info)
  //           setSchedule(data.schedule)
  //           setType(data.type)
  //         }
  //       })
  //     }
  //   }
  // },[id])


  return (
    <>
      <Layout>
        {id}
      </Layout>
    </>
  )
}
