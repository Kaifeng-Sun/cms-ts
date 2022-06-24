import { Breadcrumb } from "antd";
import { useRouter } from "next/router";
import React from "react";
import storage from "../../lib/services/storage";

export default function Breadcrumbs() {
  const router = useRouter();
  const slug = router.asPath
  const generateBreadCrumbs = () => {
    // Remove any query parameters, as those aren't included in breadcrumbs
    const asPathWithoutQuery = router.asPath.split("?")[0];

    // Break down the path between "/"s, removing empty entities
    // Ex:"/my/nested/path" --> ["my", "nested", "path"]
    const asPathNestedRoutes = asPathWithoutQuery.split("/")
      .filter(v => v.length > 0)
      .filter(v => { return v !== 'manager' && 'teacher' && 'student' });

    // Iterate over the list of nested route parts and build
    // a "crumb" object for each one.
    const crumbList = asPathNestedRoutes.map((subpath, idx) => {
      // We can get the partial nested route for the crumb
      // by joining together the path parts up to this point.
      const href = "/" + asPathNestedRoutes.slice(0, idx + 1).join("/");
      // The title will just be the route string for now
      const text = (idx === asPathNestedRoutes.length - 1 && !isNaN(+subpath)) 
      ? 'Detail' 
      : subpath[0].toUpperCase() + subpath.substr(1);
      const isLast = (idx === asPathNestedRoutes.length - 1) ? true : false
      return { href, text, isLast };
    })

    // Add in a default "Home" crumb for the top-level
    return (storage.role === 'manager')
    ?
    [{ href: "/", text: "CMS MANAGER SYSTEM", isLast:false },...crumbList]
    :
    [{ href: "/", text: "CMS DASHBOARD", isLast:false },...crumbList]
  }
  return (
    <Breadcrumb>
      {generateBreadCrumbs().map((crumb, index) => {
        return (
          <Breadcrumb.Item key={index}>
            {(!crumb.isLast)
              ?
              <a href={crumb.href}>{crumb.text}</a>
              :
              <span>{crumb.text}</span>
            }
          </Breadcrumb.Item>
        )
      })}
    </Breadcrumb>
  );
}
