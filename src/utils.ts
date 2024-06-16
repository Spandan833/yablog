import { createClient } from "@supabase/supabase-js";
import 'dotenv/config'
import gm from 'gray-matter'
import {remark} from 'remark'
import html from 'remark-html'

function formatDate(date: Date) : string {
    const options: Intl.DateTimeFormatOptions = 
    {   year : 'numeric', 
        month: 'long', 
        day: 'numeric'
    }
    return new Date(date).toLocaleDateString(undefined,options);
}

function capitalize(str : string) : string {
    if(typeof str != 'string' || str.length == 0)
        return str

    return str.charAt(0).toUpperCase() + str.slice(1);
}

type ArticleX = {
    html: string,
    slug: string,
    title: string,
    imageUrl: string,
    author: string,
    pubDate: Date,
    tags: string[],
}

const supabaseUrl = 'https://dfslbwfclnvgwatqglio.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY

if(supabaseKey == undefined){
    throw new Error("Undefined supabase key")
}

const supabase = createClient(supabaseUrl, supabaseKey)


async function getArticles() : Promise<ArticleX[]> {

    let { data: articles, error } = await supabase
    .from('article')
    .select('*')

    let dbTexts : any[] = articles!

    let dbArticles : ArticleX[] = [];

    console.log("Article count" + articles?.length)
    dbTexts?.forEach(async (text) => {
        
        const matterresult = gm(text.text);
        const processedContent = await remark().use(html).process(matterresult.content)

        const contentHtml = processedContent.toString();

        //console.table(processedContent)
        dbArticles.push({
            html: contentHtml,
            title: matterresult.data.title,
            imageUrl: text.imageUrl,
            slug: matterresult.data.slug,
            pubDate: matterresult.data.pubDate,
            tags: matterresult.data.tags,
            author: matterresult.data.author
        })
    })
    return dbArticles;
}

export { formatDate, capitalize, getArticles };
export type { ArticleX };

