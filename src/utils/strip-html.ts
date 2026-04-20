// src/utils/strip-html.ts

/**
 * Removes HTML tags from a string.
 * Used to safely render API descriptions without dangerouslySetInnerHTML.
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

export { stripHtml };
