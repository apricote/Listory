export const numberToPercent = (ratio: number) =>
  ratio.toLocaleString(undefined, {
    style: "percent",
    minimumFractionDigits: 2,
  });
