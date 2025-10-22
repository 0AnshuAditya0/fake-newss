import * as cheerio from "cheerio";
import axios from "axios";

export interface ScrapedContent {
  title: string;
  text: string;
  domain: string;
  success: boolean;
  error?: string;
}

export async function scrapeUrl(url: string): Promise<ScrapedContent> {
  try {
    // Validate URL
    const parsedUrl = new URL(url);
    const domain = parsedUrl.hostname.replace("www.", "");

    // Fetch the page
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    // Parse HTML
    const $ = cheerio.load(response.data);

    // Remove script, style, and nav elements
    $("script, style, nav, header, footer, aside").remove();

    // Extract title
    const title = $("title").text().trim() || 
                  $('meta[property="og:title"]').attr("content") || 
                  $("h1").first().text().trim() || 
                  "";

    // Extract main content
    let text = "";
    
    // Try common content selectors
    const contentSelectors = [
      "article",
      '[role="main"]',
      "main",
      ".article-content",
      ".post-content",
      ".entry-content",
      "#content",
    ];

    for (const selector of contentSelectors) {
      const content = $(selector).text().trim();
      if (content.length > text.length) {
        text = content;
      }
    }

    // Fallback to body if no content found
    if (!text) {
      text = $("body").text().trim();
    }

    // Clean up whitespace
    text = text.replace(/\s+/g, " ").trim();

    // Limit text length
    if (text.length > 5000) {
      text = text.substring(0, 5000);
    }

    if (!text || text.length < 100) {
      return {
        title: "",
        text: "",
        domain,
        success: false,
        error: "Could not extract sufficient content from the page",
      };
    }

    return {
      title,
      text: title + ". " + text,
      domain,
      success: true,
    };
  } catch (error: any) {
    return {
      title: "",
      text: "",
      domain: "",
      success: false,
      error: error.message || "Failed to scrape URL",
    };
  }
}
