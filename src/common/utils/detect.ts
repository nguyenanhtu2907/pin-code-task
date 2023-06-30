export const isAndroid = () => navigator.userAgent.match(/Android/i) !== null;
export const isIos = () =>
  navigator.userAgent.match(/iPhone|iPad|iPod/i) !== null;
export const isValidNumber = (num: number | string) => {
  return !Number.isNaN(Number(num));
};
