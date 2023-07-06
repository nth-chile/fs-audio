export default function (input: string): string {
  let result = input

  if (!result.startsWith('/')) {
    result = '/' + result;
  }

  if (result.endsWith('/')) {
    result = result.replace(/\/$/, '');
  }
  
  return result;
}