interface ITag {
  name: string;
  attributes: IAttribute;
}

interface IAttribute {
  [key: string]: string;
}
export const ssiTagParser = (text: string): ITag => {
  const removeWhitespace = text
    .replace(/\s\s/g, '')
    .replace('<!--#', '')
    .replace('-->', '');
  const attributes = removeWhitespace.split(' ');
  const tag: ITag = {
    name: attributes[0],
    attributes: {},
  };
  attributes.forEach((attribute: string) => {
    const index = attribute.indexOf('=');
    if (index > 0) {
      const name = attribute.substring(0, index);
      const value = attribute.substring(index + 1);
      tag.attributes[name] = value.replace(/["']/g, '');
    }
  });
  return tag;
};
