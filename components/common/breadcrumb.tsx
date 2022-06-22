import { Breadcrumb } from "antd";
import React from "react";

export default function breadcrumb(props: any) {
  const { slug } = props;
  const home = slug.split("/")[1]; //dashboard
  const role = slug.split("/")[2]; //role
  const recent = slug.split("/")[3]; //recent
  const detail = slug.split("/")[4]; //detail

  return (
    <Breadcrumb>
      <Breadcrumb.Item>
        <a href={"/" + home + "/" + role}>{role + " " + home}</a>
      </Breadcrumb.Item>
      {!!recent && !!detail ? (
        <Breadcrumb.Item>
          <a href={"/" + home + "/" + role + "/" + recent}>{recent}</a>
        </Breadcrumb.Item>
      ) : (
        ""
      )}
      {!!recent && !detail ? <Breadcrumb.Item>{recent}</Breadcrumb.Item> : ""}
      {!!detail ? <Breadcrumb.Item>Detail</Breadcrumb.Item> : ""}
    </Breadcrumb>
  );
}
