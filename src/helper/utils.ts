export const arrayToObject = (arr: Array<any>, fields: Array<string>) => {
  const obj = {};

  return obj;
}

export const formatByThousand = (num: number) => {
  // const options = {
  //   maximumSignificantDigits: 3,
  //   minimumFractionDigits: 2,
  //   maximumFractionDigits: 2,
  // }
  // return new Intl.NumberFormat('en-IN', options).format(num)
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}