import { createClient } from "@supabase/supabase-js";
import 'dotenv/config'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

if(supabaseUrl == undefined){
    throw new Error("supabaseUrl undefined");
}

if(supabaseKey == undefined){
    throw new Error("supabase Key undefined")
}

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);