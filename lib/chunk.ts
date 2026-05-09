export function chunkText(text: string, size = 100) {
  const words = text.split(" ");
  const chunks = [];

  for (let i = 0; i < words.length; i += size) {
    chunks.push(words.slice(i, i + size).join(" "));
  }
  console.log(chunks);
  
  return chunks;
}