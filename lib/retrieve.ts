import { documents } from "./documents";

// just check key match 
export function retrieveRelevantDocs(question: string) {
  const keywords = question.toLowerCase().split(" ");

  const matches = documents.filter((doc) =>
    keywords.some((word) =>
      doc.toLowerCase().includes(word)
    )
  );

  return matches.slice(0, 3);
}