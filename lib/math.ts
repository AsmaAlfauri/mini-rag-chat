export function dot(a: number[], b: number[]) {
  return a.reduce((sum, v, i) => sum + v * b[i], 0);
}