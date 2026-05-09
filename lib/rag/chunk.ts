export function hybridChunk(text: string) {
  const sentences = text
    .split(/[.!?]/)
    .map(s => s.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  let temp = "";

  for (const sentence of sentences) {
    if ((temp + sentence).length < 500) {
      temp += sentence + ". ";
    } else {
      chunks.push(temp.trim());
      temp = sentence + ". ";
    }
  }

  if (temp) chunks.push(temp.trim());
  console.log(chunks);
  
  return chunks;
}