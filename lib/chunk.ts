export function semanticChunk(text: string) {
  return text
    .split(/[.!?]/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
}