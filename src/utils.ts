export const weeksBetween = (d1: Date, d2: Date) => {
  let diff = (d2.getTime() - d1.getTime()) / 1000;
  diff /= 60 * 60 * 24 * 7;

  return Math.abs(Math.round(diff));
};
