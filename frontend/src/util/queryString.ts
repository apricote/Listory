interface QueryParameters {
  [x: string]: string;
}
export const qs = (parameters: QueryParameters): string => {
  const queryParams = new URLSearchParams();

  Object.entries(parameters).forEach(([key, value]) =>
    queryParams.append(key, value)
  );

  return queryParams.toString();
};
