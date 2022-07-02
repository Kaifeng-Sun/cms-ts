import * as Highcharts from 'highcharts/highmaps';
import HighchartsReact from 'highcharts-react-official'
import mapDataWorld from '@highcharts/map-collection/custom/world.geo.json';
import React, { useEffect, useState } from 'react'
import apiService from '../../lib/services/api-service';

export default function DistributionChart(props: any) {
  const { data, title } = props
  const [world,setWorld]=useState<any>()
  const [options, setOptions] = useState<any>({
    colorAxis: {
      min: 0,
      stops: [
        [0, '#fff'],
        [1, '#1890ff'],
      ],
    },
    legend: {
      layout: 'vertical',
      align: 'left',
      verticalAlign: 'bottom',
    },
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: false,
    }
  })
  useEffect(()=>{
    (async () => {
      const res = await apiService.getWorld();

      setWorld(res.data);
      setOptions({
        series: [{ mapData: res.data }],
      });
    })();
  },[])
  useEffect(() => {
    if (!data || !world) {
      return;
    }

    const mapSource = data.map((item: { name: string; amount: any; }) => {
      const target = world.features.find(
        (feature: { properties: { name: string; }; }) => item.name.toLowerCase() === feature.properties.name.toLowerCase()
      );

      return !!target
        ? {
            'hc-key': target.properties['hc-key'],
            value: item.amount,
          }
        : {};
    });
    const options = {
      title: {
        text: `<span style="text-transform: capitalize">${title
          .split(/(?=[A-Z])/)
          .join(' ')}</span>`,
      },
      series: [
        {
          data: mapSource,
          mapData: world,
          name: 'Total',
          states: {
            hover: {
              color: '#a4edba',
            },
          },
        },
      ],
    };

    setOptions(options);    
  }, [data, title, world]);

  return (
    <HighchartsReact
      options={options}
      highcharts={Highcharts}
      constructorType={'mapChart'}
    />
  )
}