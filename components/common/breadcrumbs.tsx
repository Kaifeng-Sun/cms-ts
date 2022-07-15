import { Breadcrumb } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { routes, SideBarItem } from "../../lib/constant/routes";
import { Role } from "../../lib/model/role";
import storage from "../../lib/services/storage";
import { deepSearchRecordFactory } from "../../lib/util/deep-search";

export default function Breadcrumbs() {
  const router = useRouter();
  const path = router.pathname
  const paths = path.split('/').slice(1);
  const homePath = '/' + paths.slice(0, 2).join('/');
  const userRole = storage.role || (router.pathname.split('/')[2] as Role)
  const pathsWithoutRole = paths.filter(v => v !== 'manager' && v !== 'teacher' && v !== 'student');
  const hasDetail = pathsWithoutRole[pathsWithoutRole.length - 1] === '[id]'
  const pathsData = hasDetail ? pathsWithoutRole.filter((_, index) => index !== pathsWithoutRole.length - 1) : pathsWithoutRole
  const sideMenu = routes.get(userRole) as SideBarItem[];

  return (
    <Breadcrumb>
      <Breadcrumb.Item key={"crumb_dashboard_" + userRole}>
        <Link href={homePath}>
          {`CMS ${userRole.toLocaleUpperCase()} SYSTEM`}
        </Link>
      </Breadcrumb.Item>

      {
        pathsData.map((name, index) => {

          const record = deepSearchRecordFactory(
            (nav: SideBarItem, value: any) => nav.label === value,
            name,
            'subMenu'
          )(sideMenu);

          const { navs }: { source: SideBarItem[], navs: SideBarItem[] } = record.reduce(
            (acc: { source: SideBarItem[], navs: SideBarItem[] }, cur: any) => {
              const item = acc.source[acc.source.length + cur];

              return { source: item.subMenu??[], navs: [...acc.navs, item] };
            },
            { source: sideMenu, navs: [] }
          );

          const isText =
            index === pathsData.length - 1 || navs.every((item) => item.hideLinkInBreadcrumb);

          const subPath = navs
            .map((item) => item.path)
            .reduce((acc, cur) => [...acc, ...cur], [])
            .filter((item) => !!item)
            .join('/');

          return (
            <Breadcrumb.Item key={index}>
              {isText ? name : <Link href={`${homePath}/${subPath}`}>{name}</Link>}
            </Breadcrumb.Item>
          );
        })
      }
      {
        (hasDetail)
          ? (
            <Breadcrumb.Item key={"crumb_dashboard_detail"}>
              Detail
            </Breadcrumb.Item>
          )
          : null
      }

    </Breadcrumb>
  );
}
