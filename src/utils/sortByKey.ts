export default function<T>(key: keyof T, arr: T[], asc?: boolean): T[] {
  return arr.sort((a, b) => {
    if (a[key] < b[key]) {
      return asc ? -1 : 1;
    }
    if (a[key] > b[key]) {
      return asc ? 1 : -1;
    }
    return 0;
  });
}
