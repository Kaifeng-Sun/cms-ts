import { BaseType } from 'antd/lib/typography/Base';
import React, { useEffect, useState } from 'react'
import AppLayout from '../../../components/layout/layout'
import { Country, Degree } from '../../../lib/model/common';
import { StudentProfile } from '../../../lib/model/student';
import apiService from '../../../lib/services/api-service';
import storage from '../../../lib/services/storage';

export default function Page() {
  const [data, setData] = useState<StudentProfile>(null);
  const [existInterests, setExistInterests] = useState<BaseType[]>([]);
  const [degrees, setDegrees] = useState<Degree[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    apiService.getProfileByUserId<StudentProfile>(storage.userId).then((res) => {
      const { data } = res;

      setData(data);
      setFileList([
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: data.avatar,
        },
      ]);
    });

    apiService.getAllInterestLanguages().then((res) => {
      const { data } = res;

      setExistInterests(data);
    });

    apiService.getDegrees().then((res) => {
      const { data } = res;

      setDegrees(data);
    });
    apiService.getCountries().then((res) => {
      const { data } = res;

      setCountries(data);
    });
  }, []);
  return (
    <AppLayout>

    </AppLayout>
  )
}
