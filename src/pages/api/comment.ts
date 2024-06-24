import type { APIRoute } from "astro";
import { supabase } from "../../lib/supabase";
export const POST: APIRoute = async ({ request,redirect }) => {
    
    const { data: { user }, error: err } = await supabase.auth.getUser()

    if(err){
        throw new Error(err.toString())
    }
    console.log(user)
    if(user == undefined){
        return redirect("/signin")
    }
    const formData = await request.formData();
    const comment = formData.get("text");
    const userId = formData.get("user_id")
    const postId = formData.get("post_id")
    const slug = formData.get("slug")
    // Do something with the data, then return a success response
    
    const { data, error } = await supabase.from('comments').insert(
        [{ user_id: userId, post_id: postId, text: comment, username: user.email?.split('@')[0]}]).select()

    if(error){
        throw new Error(error.toString())
    }

    return redirect("/articles/"+slug);
};