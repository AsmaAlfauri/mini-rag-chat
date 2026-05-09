import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .limit(5);

  console.log("DATA:", data);
  console.log("ERROR:", error);

  return Response.json({ data, error });
}