export function processGraph(data: Array<any>) {
  const rechartData = [];

  data.forEach((item: any, index) => {
    let struct = { row: item.row };

    for (let key in item) {
      if (key.toLowerCase() !== "row")
        struct[key] = item[key].value;
    }

    rechartData.push(struct)
  })

  return rechartData;
}