import fs from "fs";
import path from "path";

// Walk directory and find all .mdx files
function findMdxFiles(dir, fileList = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!item.startsWith(".") && item !== "node_modules" && item !== "mintlify-starter-kit-files") {
        findMdxFiles(fullPath, fileList);
      }
    } else if (item.endsWith(".mdx")) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

// Remove emojis from text (but not from frontmatter title)
function removeEmojis(text) {
  // Common emoji Unicode ranges
  return text
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, "")
    .replace(/[\u{2600}-\u{26FF}]/gu, "")
    .replace(/[\u{2700}-\u{27BF}]/gu, "")
    .replace(/[\u{FE00}-\u{FE0F}]/gu, "")
    .replace(/[\u{1F600}-\u{1F64F}]/gu, "")
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, "")
    .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, "")
    .replace(/[\u{1F900}-\u{1F9FF}]/gu, "")
    .replace(/[\u{2702}-\u{27B0}]/gu, "")
    .replace(/[\u{24C2}-\u{1F251}]/gu, "")
    .replace(/[\u{1F004}]/gu, "")
    .replace(/[\u{1F0CF}]/gu, "")
    .replace(/[\u{1F170}-\u{1F251}]/gu, "")
    .replace(/[\u{2B00}-\u{2BFF}]/gu, "")
    .replace(/[\u{2190}-\u{21FF}]/gu, "")  // arrows
    .replace(/[\u{2B05}-\u{2B07}]/gu, "")
    .replace(/→/g, "")
    .replace(/←/g, "")
    .replace(/↑/g, "")
    .replace(/↓/g, "");
}

// Check if a string contains ReadMe metadata markers
function hasReadmeMetadata(text) {
  return text.includes("excerpt:") ||
    text.includes("deprecated:") ||
    text.includes("hidden:") ||
    text.includes("metadata:") ||
    text.includes("robots:") ||
    text.includes("next:") ||
    text.includes("pages:") ||
    text.includes("--- title:");
}

// Extract a clean description from body content
function extractCleanDescription(body) {
  // Remove headings, callouts, code blocks, images
  let clean = body
    .replace(/^---[\s\S]*?---/m, "")
    .replace(/^#.+$/gm, "")
    .replace(/^##.+$/gm, "")
    .replace(/^###.+$/gm, "")
    .replace(/<Callout[^>]*>[\s\S]*?<\/Callout>/g, "")
    .replace(/<Callout[^>]*>/g, "")
    .replace(/<\/Callout>/g, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "")
    .replace(/^[>\s]+/gm, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .trim();

  if (clean) {
    let desc = clean.substring(0, 150).replace(/\n/g, " ").replace(/\s+/g, " ").trim();
    if (clean.length > 150) desc += "...";
    return desc;
  }
  return "";
}

const mdxFiles = findMdxFiles("docs");
console.log(`Found ${mdxFiles.length} .mdx files to fix\n`);

let fixed = 0;
let skipped = 0;

for (const mdxFile of mdxFiles) {
  let content = fs.readFileSync(mdxFile, "utf-8");
  let modified = false;

  // Parse frontmatter
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!fmMatch) {
    // No frontmatter — skip
    skipped++;
    continue;
  }

  let frontmatter = fmMatch[1];
  let body = fmMatch[2];

  // 1. Fix description — remove ReadMe metadata from it
  const descMatch = frontmatter.match(/description:\s*["']?(.*?)["']?\s*$/m);
  if (descMatch) {
    let desc = descMatch[1];
    if (hasReadmeMetadata(desc) || desc.startsWith("---") || desc.length > 200) {
      // Description is broken — extract a clean one from the body
      let cleanDesc = extractCleanDescription(body);
      if (cleanDesc) {
        frontmatter = frontmatter.replace(
          /description:.*$/m,
          `description: "${cleanDesc.replace(/"/g, '\\"')}"`
        );
        modified = true;
      } else {
        // Remove the description entirely if we can't extract a clean one
        frontmatter = frontmatter.replace(/\ndescription:.*$/m, "");
        modified = true;
      }
    }
  }

  // 2. Remove ReadMe metadata blocks from the body content
  // These look like: --- title: ... excerpt: ... deprecated: ... hidden: ... metadata: ... ---
  if (hasReadmeMetadata(body)) {
    // Remove the entire ReadMe metadata block
    body = body.replace(/^---\n[\s\S]*?(excerpt|deprecated|hidden|metadata|robots|next):[\s\S]*?---\n?/m, "");
    // Also remove any inline ReadMe metadata that leaked into the content
    body = body.replace(/^excerpt:.*$/gm, "");
    body = body.replace(/^deprecated:.*$/gm, "");
    body = body.replace(/^hidden:.*$/gm, "");
    body = body.replace(/^metadata:.*$/gm, "");
    body = body.replace(/^robots:.*$/gm, "");
    body = body.replace(/^next:.*$/gm, "");
    body = body.replace(/^pages:.*$/gm, "");
    body = body.replace(/^  -.*$/gm, ""); // indented sub-items of metadata
    modified = true;
  }

  // 3. Remove emojis from the body content (but NOT from the frontmatter title)
  const titleMatch = frontmatter.match(/title:\s*["'](.*?)["']/);
  const titleEmojis = titleMatch ? titleMatch[1] : "";

  // Remove emojis from body
  const bodyWithoutEmojis = removeEmojis(body);
  if (bodyWithoutEmojis !== body) {
    body = bodyWithoutEmojis;
    modified = true;
  }

  // 4. Clean up extra newlines and empty lines
  body = body.replace(/\n{3,}/g, "\n\n");
  body = body.trimStart();

  if (modified) {
    content = `---\n${frontmatter}\n---\n\n${body}`;
    fs.writeFileSync(mdxFile, content);
    console.log(`✅ Fixed: ${mdxFile.replace(/\.mdx$/, "")}`);
    fixed++;
  } else {
    skipped++;
  }
}

console.log(`\n📊 Results: ${fixed} fixed, ${skipped} skipped`);
