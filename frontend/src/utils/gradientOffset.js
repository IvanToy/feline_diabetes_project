export const gradientOffset = (levels) => {
  const maxData = Math.max(...levels.map((e) => e.level));
  const minData = Math.min(...levels.map((e) => e.level));

  return maxData / 2 / 500;
};
