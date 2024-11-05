import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request, redirect }) => {
  const {
    data: { user },
    error: err,
  } = await supabase.auth.getUser();

  if (err) {
    throw new Error(err.toString());
  }
  console.log(user);
  if (user == undefined) {
    return redirect("/signin");
  }

  const formData = await request.formData();
  const text = formData.get("content")?.toString();
  const imageUrl = formData.get("image_url")?.toString();
  const authorName = user.email?.split("@")[0];

  const { error } = await supabase.from("article").insert([
    {
      text,
      imageUrl,
      author_id: user.id, // Setting the author_id as the logged-in user's ID
      created_at: new Date().toISOString(),
      author_name: authorName,
    },
  ]);

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  return redirect("/");
};
