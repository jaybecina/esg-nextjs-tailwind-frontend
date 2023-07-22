export function interpolateValues(paragraph: string, payload: { [key: string]: any }) {
  if (!paragraph) {
    return;
  }

  const headerArr = paragraph.split(" ");

  headerArr.forEach((char: string, index: number) => {
    if (char.startsWith("{{")) {
      const key = char.replace("{{", "").replace("}}", "");
      const hasProp = Object.hasOwn(payload, key);

      headerArr[index] = hasProp ? payload[key] : char
    }
  });

  return headerArr.join(" ")
}