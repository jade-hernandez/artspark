// src/utils/strip-html.ts

/**
 * Removes HTML tags from a string.
 * Used to safely render API descriptions without dangerouslySetInnerHTML.
 */
function stripHtml(html: string): string {
  const withoutTags = html.replace(/<[^>]*>/g, "");
  const textarea = document.createElement("textarea");
  textarea.innerHTML = withoutTags;
  return textarea.value.trim();
}

export { stripHtml };
