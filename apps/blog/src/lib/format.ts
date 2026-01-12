export const formatDate = (value: string) => {
  const date = new Date(value);
  const options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' };
  return new Intl.DateTimeFormat('en-US', options).format(date);
};
