import { memoize } from "lodash";
import { useRouter } from "next/router";
import { useUserRole } from "../../components/custom-hooks/login-state";
import { Role } from "../constant/role";
import { SideBarItem } from "../constant/routes";
import storage from "../services/storage";

/**
 * 生成key
 */
export const generateKey = (data: SideBarItem, index: number): string => {
  return `${data.label}_${index}`;
};

/**
* 生成路径
* @param data - side nav config
*/
const generatePath = (data: SideBarItem): string => {
  return data.path.join('/');
};

/**
 * 生成key 或 path 的工厂函数
 * @param fn - 生成key或path的函数
 * @return - 执行函数
 */
const generateFactory = (fn: (data: SideBarItem, index: number) => string) =>
  function inner(data: SideBarItem[], current = ''): string[][] {
    const keys = data.map((item, index) => {
      let key = fn(item, index);

      if (current) {
        key = [current, key].join('/');
      }

      if (item.subMenu && !!item.subMenu.length) {
        return inner(item.subMenu, key).map((item) => item.join('/'));
      } else {
        return [key];
      }
    });

    return keys;
  };

/**
 * 判断当前路径是否指向一个详情页
 */
const isDetailPath = (path: string): boolean => {
  const paths = path.split('/');
  const length = paths.length;
  const last = paths[length - 1];
  const reg = /\[.*\]/;

  return reg.test(last);
};

/**
* 根据路由信息找出生成当前side nav 的 key，path 信息
*/
const getKeyPathInfo = (data: SideBarItem[]): { keys: string[]; paths: string[] } => {
  const getPaths = generateFactory(generatePath);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const userRole = useUserRole();
  const paths = getPaths(data)
    .reduce((acc, cur) => [...acc, ...cur], [])
    .map((item) => ['/dashboard', userRole, item].filter((item) => !!item).join('/'));
  const getKeys = generateFactory(generateKey);
  const keys = getKeys(data).reduce((acc, cur) => [...acc, ...cur], []);

  return { keys, paths };
};

/**
 * 忽略详情路径上的参数路径
 */
const omitDetailPath = (path: string): string => {
  const isDetail = isDetailPath(path);

  return isDetail ? path.slice(0, path.lastIndexOf('/')) : path;
};

/**
 * getKeyPathInfo 的缓存版本，避免获取相同的sideNav的key path时递归过程重复执行
 */
const memoizedGetKeyPathInfo = memoize(getKeyPathInfo, (data) =>
  data.map((item) => item.label).join('_')
);

const isPathEqual = (target: string) => (current: string) => {
  current = current.endsWith('/') ? current.slice(0, -1) : current;

  return current === target;
};

/**
 * 获取当前活动的sideNav
 */
export const getActiveKey = (data: SideBarItem[]) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
  const activeRoute = omitDetailPath(router.pathname);
  const { paths, keys } = memoizedGetKeyPathInfo(data);
  const isEqual = isPathEqual(activeRoute);
  const index = paths.findIndex(isEqual);

  return keys[index] || '';
};