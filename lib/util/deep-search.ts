export type PredicateFn<T> = (data: T, value: any) => boolean;

export const deepSearchRecordFactory = <T>(
  predicateFn: PredicateFn<T>,
  value: any,
  key: string
) => {
  return function search(data: T[], record : number[] = [] ): number[] {
    const headNode = data.slice(0, 1)[0];
    const restNodes = data.slice(1);

    record.push( -restNodes.length - 1); // 节点位置入栈

    if (predicateFn(headNode, value)) {
      return record;
    }
console.log('headNode',headNode);

    if (headNode[key]) {
      const res = search(headNode[key], record);

      if (res) {
        return record;
      } else {
        record.pop(); // 节点出栈
      }
    }

    if (restNodes.length) {
      record.pop(); // 节点出栈

      const res = search(restNodes, record);

      if (res) {
        return record;
      }
    }

    return [];
  };
};