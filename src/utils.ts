import { createClient } from "@supabase/supabase-js";
import "dotenv/config";
import gm from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString(undefined, options);
}

function capitalize(str: string): string {
  if (typeof str !== "string" || str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

type ArticleX = {
  id: number;
  html: string;
  slug: string;
  title: string;
  imageUrl: string;
  author: string;
  pubDate: Date;
  tags: string[];
};

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Undefined supabase URL or key");
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function getArticles(): Promise<ArticleX[]> {
  // Step 1: Fetch articles from the public.article table
  const { data: articles, error: articlesError } = await supabase
    .from("article")
    .select("id, text, imageUrl, author_id");

  if (articlesError) {
    console.error("Error fetching articles:", articlesError);
    return [];
  }

  if (!articles) return [];

  // Step 5: Process each article to include HTML content and author info
  const dbArticles: ArticleX[] = [];

  for (const article of articles) {
    const matterresult = gm(article.text);
    const processedContent = await remark()
      .use(html)
      .process(matterresult.content);
    const contentHtml = processedContent.toString();

    dbArticles.push({
      id: article.id,
      html: contentHtml,
      title: matterresult.data.title,
      imageUrl: article.imageUrl,
      slug: matterresult.data.slug,
      pubDate: matterresult.data.pubDate,
      tags: matterresult.data.tags,
      author: article.author_name,
    });
  }

  return dbArticles;
}

export { formatDate, capitalize, getArticles };
export type { ArticleX };
