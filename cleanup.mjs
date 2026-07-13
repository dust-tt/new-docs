import fs from "fs";
import path from "path";

// ============================================================
// TITLE MAPPING: file path (without .mdx) → correct ReadMe title
// ============================================================
const titleMap = {
  // Getting Started
  "docs/user-documentation/getting-started/intro-to-dust": "Intro to Dust",
  
  // Dust Rollout Guide
  "docs/user-documentation/getting-started/dust-rollout-guide/welcome-to-dust": "Welcome to Dust",
  "docs/user-documentation/getting-started/dust-rollout-guide/launch-strategy": "Launch strategy",
  "docs/user-documentation/getting-started/dust-rollout-guide/team-onboarding-material": "Team onboarding material",
  "docs/user-documentation/getting-started/dust-rollout-guide/build-your-builder-community": "Build your builder community",
  "docs/user-documentation/getting-started/dust-rollout-guide/admin-guide-set-up-your-dust-workspace": "Admin guide: set up your Dust workspace",
  "docs/user-documentation/getting-started/dust-rollout-guide/designing-use-cases": "Designing use cases",
  "docs/user-documentation/getting-started/dust-rollout-guide/educate-activate": "Educate & activate",
  "docs/user-documentation/getting-started/dust-rollout-guide/measure-expand": "Measure & expand",
  
  // Use Cases & Guides
  "docs/user-documentation/getting-started/use-cases-and-guides/sales": "🤝 Sales",
  "docs/user-documentation/getting-started/use-cases-and-guides/customer-support": "🏆 Customer Support",
  "docs/user-documentation/getting-started/use-cases-and-guides/marketing": "📣 Marketing & Content",
  "docs/user-documentation/getting-started/use-cases-and-guides/engineering": "🤖 Engineering",
  "docs/user-documentation/getting-started/use-cases-and-guides/data-analytics": "📈 Data Analytics",
  "docs/user-documentation/getting-started/use-cases-and-guides/knowledge": "📖 Knowledge",
  "docs/user-documentation/getting-started/use-cases-and-guides/recruiting-and-people": "👥 Recruiting & People",
  "docs/user-documentation/getting-started/use-cases-and-guides/product-and-design": "📦 Product",
  "docs/user-documentation/getting-started/use-cases-and-guides/collaboration": "Collaboration",
  
  // FAQ - General Questions
  "docs/user-documentation/getting-started/faq/general-questions/what-data-sources-can-be-connected-to-dust": "What data sources can be connected to Dust?",
  "docs/user-documentation/getting-started/faq/general-questions/what-ai-models-are-available-in-dust": "What AI models are available in Dust?",
  "docs/user-documentation/getting-started/faq/general-questions/what-tools-are-available-in-dust": "What tools are available in Dust?",
  "docs/user-documentation/getting-started/faq/general-questions/what-are-the-pricing-plans-for-dust": "What are the pricing plans for Dust?",
  "docs/user-documentation/getting-started/faq/general-questions/how-does-dust-handle-user-data": "How does Dust handle user data?",
  
  // FAQ - Managing agents
  "docs/user-documentation/getting-started/faq/managing-agents/i-dont-know-how-to-start-creating-an-agent-what-should-i-do": "I don't know how to start creating an agent, what should I do?",
  "docs/user-documentation/getting-started/faq/managing-agents/how-do-i-edit-a-custom-agent": "How do I edit a custom agent?",
  "docs/user-documentation/getting-started/faq/managing-agents/what-settings-model-should-i-use": "What settings / model should I use?",
  "docs/user-documentation/getting-started/faq/managing-agents/can-agents-create-a-new-file-or-document-directly-into-notion-google-drive-or-other-connected-platforms": "Can agents create a new file or document directly into Notion, Google Drive or other connected platforms?",
  "docs/user-documentation/getting-started/faq/managing-agents/what-data-do-the-agents-have-access-to": "What data do the agents have access to?",
  "docs/user-documentation/getting-started/faq/managing-agents/do-the-agents-have-access-to-the-internet": "Do the agents have access to the internet?",
  "docs/user-documentation/getting-started/faq/managing-agents/does-the-dust-agent-give-accurate-and-safe-responses": "Does the Dust agent give accurate and safe responses?",
  "docs/user-documentation/getting-started/faq/managing-agents/is-there-a-dust-conversation-api": "Is there a Dust conversation API?",
  "docs/user-documentation/getting-started/faq/managing-agents/can-i-share-a-conversation": "Can I share a conversation?",
  "docs/user-documentation/getting-started/faq/managing-agents/can-i-delete-or-rename-a-conversation": "Can I delete or rename a conversation?",
  "docs/user-documentation/getting-started/faq/managing-agents/can-i-use-the-dust-agents-in-different-languages": "Can I use the Dust agents in different languages?",
  "docs/user-documentation/getting-started/faq/managing-agents/how-can-i-find-the-id-of-an-agent": "How can I find the ID of an agent?",
  
  // FAQ - Troubleshooting & Limitations
  "docs/user-documentation/getting-started/faq/troubleshooting-and-limitations/when-asking-a-question-about-data-within-slack-the-link-to-the-thread-isnt-always-the-right-one": "When asking a question about data within Slack, the link to the thread isn't always the right one",
  "docs/user-documentation/getting-started/faq/troubleshooting-and-limitations/i-havent-received-a-login-or-i-am-having-trouble-logging-in": "I haven't received a login, or I am having trouble logging in",
  "docs/user-documentation/getting-started/faq/troubleshooting-and-limitations/i-try-to-create-an-agent-using-the-table-query-tool-but-it-doesnt-work": "I try to create an agent using the Table Query tool, but it doesn't work",
  "docs/user-documentation/getting-started/faq/troubleshooting-and-limitations/the-agent-is-producing-links-that-dont-work-and-falsely-claiming-something-untrue-whats-going-on": "The agent is producing links that don't work and falsely claiming something untrue, what's going on?",
  "docs/user-documentation/getting-started/faq/troubleshooting-and-limitations/why-doesnt-the-agent-remember-what-i-said-earlier-in-a-conversation": "Why doesn't the agent remember what I said earlier in a conversation?",
  "docs/user-documentation/getting-started/faq/troubleshooting-and-limitations/why-isnt-my-recently-updated-document-showing-in-agent-responses": "Why isn't my recently updated document showing in agent responses?",
  "docs/user-documentation/getting-started/faq/troubleshooting-and-limitations/can-dust-remember-and-incorporate-my-feedback-in-the-future": "Can Dust remember and incorporate my feedback in the future?",
  "docs/user-documentation/getting-started/faq/troubleshooting-and-limitations/is-dust-down": "Is Dust down?",
  "docs/user-documentation/getting-started/faq/troubleshooting-and-limitations/why-is-dust-slow-or-my-agent-taking-too-long-to-respond": "Why is Dust slow or my agent taking too long to respond?",
  
  // FAQ - standalone
  "docs/user-documentation/getting-started/faq/file-size-limits": "File size limits",
  "docs/user-documentation/getting-started/faq/how-to-change-your-email-address-in-dust": "How to Change Your Email Address in Dust",
  
  // Agents
  "docs/user-documentation/agents/create-your-first-agent": "Create your first agent",
  "docs/user-documentation/agents/llm-best-practices/how-to-write-effective-instructions": "How to write effective instructions",
  "docs/user-documentation/agents/llm-best-practices/choosing-the-right-ai-model": "Choosing the Right AI Model for Your Dust Agent",
  "docs/user-documentation/agents/llm-best-practices/understanding-llms-context-windows": "Understanding LLMs Context Windows",
  "docs/user-documentation/agents/llm-best-practices/understanding-llm-limitations": "Understanding LLM Limitations: Counting and Parsing Structured Data",
  "docs/user-documentation/agents/llm-best-practices/understanding-rag": "Understanding Retrieval Augmented Generation (RAG) and the search method in Dust",
  "docs/user-documentation/agents/templates": "Templates",
  "docs/user-documentation/agents/knowledge/search-data-sources": "Search data sources",
  "docs/user-documentation/agents/knowledge/table-queries": "Table queries",
  "docs/user-documentation/agents/knowledge/extract-data": "Extract data",
  "docs/user-documentation/agents/knowledge/include-data": "Include data",
  
  // Agents - Tools
  "docs/user-documentation/agents/tools/airtable": "Airtable",
  "docs/user-documentation/agents/tools/agent-memory": "Agent Memory",
  "docs/user-documentation/agents/tools/asana": "Asana",
  "docs/user-documentation/agents/tools/ashby": "Ashby",
  "docs/user-documentation/agents/tools/attio": "Attio",
  "docs/user-documentation/agents/tools/canva": "Canva",
  "docs/user-documentation/agents/tools/confluence": "Confluence",
  "docs/user-documentation/agents/tools/databricks": "Databricks",
  "docs/user-documentation/agents/tools/file-generation": "File Generation",
  "docs/user-documentation/agents/tools/fathom": "Fathom",
  "docs/user-documentation/agents/tools/gong": "Gong",
  "docs/user-documentation/agents/tools/freshservice": "Freshservice",
  "docs/user-documentation/agents/tools/front": "Front",
  "docs/user-documentation/agents/tools/github": "GitHub",
  "docs/user-documentation/agents/tools/gmail": "Gmail",
  "docs/user-documentation/agents/tools/google-calendar": "Google Calendar",
  "docs/user-documentation/agents/tools/google-drive": "Google Drive",
  "docs/user-documentation/agents/tools/google-sheets-deprecated": "[Deprecated] Google Sheets",
  "docs/user-documentation/agents/tools/hubspot": "HubSpot",
  "docs/user-documentation/agents/tools/image-generation": "Image Generation",
  "docs/user-documentation/agents/tools/jira": "Jira",
  "docs/user-documentation/agents/tools/jit-tools": "JIT tools",
  "docs/user-documentation/agents/tools/microsoft-outlook": "Microsoft Outlook (Mail, Calendar)",
  "docs/user-documentation/agents/tools/microsoft-sharepoint-and-onedrive": "Microsoft Sharepoint and OneDrive tools",
  "docs/user-documentation/agents/tools/microsoft-teams": "Microsoft Teams",
  "docs/user-documentation/agents/tools/microsoft-excel": "Microsoft Excel",
  "docs/user-documentation/agents/tools/miro": "Miro",
  "docs/user-documentation/agents/tools/monday-com": "Monday.com",
  "docs/user-documentation/agents/tools/netsuite": "NetSuite",
  "docs/user-documentation/agents/tools/notion": "Notion",
  "docs/user-documentation/agents/tools/power-bi": "Power BI",
  "docs/user-documentation/agents/tools/productboard": "Productboard",
  "docs/user-documentation/agents/tools/slack-tools": "Slack tools",
  "docs/user-documentation/agents/tools/ukg-ready": "UKG Ready",
  "docs/user-documentation/agents/tools/val-town": "Val Town",
  "docs/user-documentation/agents/tools/vanta": "Vanta",
  "docs/user-documentation/agents/tools/voice-and-sound-generation": "Voice and sound generation",
  "docs/user-documentation/agents/tools/salesloft": "Salesloft",
  "docs/user-documentation/agents/tools/semrush": "Semrush",
  "docs/user-documentation/agents/tools/slab": "Slab",
  "docs/user-documentation/agents/tools/snowflake": "Snowflake",
  "docs/user-documentation/agents/tools/statuspage": "Statuspage",
  "docs/user-documentation/agents/tools/run-agent": "Run agent",
  "docs/user-documentation/agents/tools/web-search-and-browse": "Web Search & Browse",
  "docs/user-documentation/agents/tools/zendesk": "Zendesk",
  "docs/user-documentation/agents/tools/wake-ups": "Wake-ups",
  "docs/user-documentation/agents/tools/computer": "Computer",
  
  // Agents - Skills
  "docs/user-documentation/agents/skills/skill-examples": "Skill Examples",
  
  // Agents - Triggers
  "docs/user-documentation/agents/triggers/schedules": "Schedules",
  "docs/user-documentation/agents/triggers/webhooks/filter-webhooks-payload": "Filter webhooks payload",
  "docs/user-documentation/agents/triggers/webhooks/rate-limiting": "Rate Limiting",
  
  // Agents - Integrations
  "docs/user-documentation/agents/integrations/dust-mcp-server": "Dust MCP Server",
  "docs/user-documentation/agents/integrations/dust-in-slack/slack-auto-join": "[Beta] Slack Auto-Join",
  "docs/user-documentation/agents/integrations/dust-in-slack/slack-workflows": "Slack workflows",
  "docs/user-documentation/agents/integrations/send-and-forward-email-to-agents": "Send and Forward Email to Agents",
  "docs/user-documentation/agents/integrations/zapier": "Zapier",
  "docs/user-documentation/agents/integrations/make-com": "Make.com",
  "docs/user-documentation/agents/integrations/n8n": "n8n",
  "docs/user-documentation/agents/integrations/power-automate": "Power Automate",
  "docs/user-documentation/agents/integrations/meeting-transcripts": "Meeting transcripts",
  "docs/user-documentation/agents/integrations/google-sheets-add-on": "Google Sheets Add-on",
  "docs/user-documentation/agents/integrations/dust-in-zendesk": "Dust in Zendesk",
  "docs/user-documentation/agents/integrations/browser-extension": "Browser Extension (Chrome, Firefox & Chromium-based browsers)",
  "docs/user-documentation/agents/integrations/raycast-extension": "Raycast Extension",
  "docs/user-documentation/agents/integrations/dust-in-teams": "Dust in Teams",
  
  // Agents - standalone
  "docs/user-documentation/agents/go-deep": "Go Deep",
  "docs/user-documentation/agents/frames/white-labeled-frames": "White-labeled Frames",
  "docs/user-documentation/agents/deep-dive-agent": "@deep-dive Agent",
  "docs/user-documentation/agents/troubleshooting-your-agent": "Troubleshooting your agent",
  "docs/user-documentation/agents/structured-output-format": "Structured output format",
  "docs/user-documentation/agents/agent-builder-sidekick": "Agent Builder Sidekick",
  "docs/user-documentation/agents/steering-conversations": "Steering: Conversations that keep up with you",
  "docs/user-documentation/agents/branch-a-conversation": "Branch a Conversation",
  "docs/user-documentation/agents/context-compaction": "Context Compaction",
  "docs/user-documentation/agents/self-improving-skills": "Self Improving Skills",
  
  // Pods
  "docs/user-documentation/pods/overview": "Overview",
  "docs/user-documentation/pods/getting-started": "Getting started",
  "docs/user-documentation/pods/members-and-roles": "Members and roles",
  "docs/user-documentation/pods/tasks": "Tasks",
  "docs/user-documentation/pods/conversations": "Conversations",
  "docs/user-documentation/pods/files": "Files",
  "docs/user-documentation/pods/frames": "Frames",
  "docs/user-documentation/pods/admin-controls": "Admin controls",
  "docs/user-documentation/pods/examples/shared-asset-library": "Shared asset library",
  "docs/user-documentation/pods/examples/personal-second-brain": "Personal second brain",
  "docs/user-documentation/pods/examples/initiative-and-project-management": "Initiative and project management",
  "docs/user-documentation/pods/examples/ticket-handling-and-support-knowledge": "Ticket handling and support knowledge",
  "docs/user-documentation/pods/examples/one-pod-per-customer": "One Pod per customer",
  "docs/user-documentation/pods/examples/content-and-editorial-production": "Content and editorial production",
  "docs/user-documentation/pods/examples/competitive-intelligence": "Competitive intelligence",
  
  // Data Sources
  "docs/user-documentation/data-sources/overview": "Overview",
  "docs/user-documentation/data-sources/connections": "Connections",
  "docs/user-documentation/data-sources/websites": "Websites",
  "docs/user-documentation/data-sources/folders": "Folders",
  "docs/user-documentation/data-sources/conversation-files/conversation-files": "Conversation Files",
  "docs/user-documentation/data-sources/conversation-files/read-images": "Read images",
  "docs/user-documentation/data-sources/custom-connections/zapier-automatically-add-datasource": "[Zapier] Automatically add any datasource to Dust",
  "docs/user-documentation/data-sources/custom-connections/beta-import-jira-issues": "[Beta] Import Jira issues",
  "docs/user-documentation/data-sources/custom-connections/beta-import-salesforce-data": "[Beta] Import Salesforce Data",
  "docs/user-documentation/data-sources/custom-connections/beta-import-hubspot-data": "[Beta] Import Hubspot Data",
  "docs/user-documentation/data-sources/custom-connections/beta-import-guru-cards": "[Beta] Import Guru Cards",
  "docs/user-documentation/data-sources/custom-connections/beta-import-linear-issues": "[Beta] Import Linear Issues",
  "docs/user-documentation/data-sources/custom-connections/beta-import-dropbox-files": "[Beta] Import Dropbox Files",
  "docs/user-documentation/data-sources/custom-connections/beta-import-front-conversations": "[Beta] Import Front Conversations",
  
  // Admins
  "docs/user-documentation/admins/quickstart": "Quickstart",
  "docs/user-documentation/admins/users-and-permissions-management/access-controls-and-permissions": "Access Controls and Permissions",
  "docs/user-documentation/admins/users-and-permissions-management/memberships-and-roles": "Memberships & Roles",
  "docs/user-documentation/admins/users-and-permissions-management/single-sign-on-sso/single-sign-on-sso": "Single Sign-On (SSO)",
  "docs/user-documentation/admins/users-and-permissions-management/single-sign-on-sso/saml-sso": "SAML SSO",
  "docs/user-documentation/admins/users-and-permissions-management/users-and-groups-provisioning": "Users and groups provisioning",
  "docs/user-documentation/admins/spaces-management": "Spaces management",
  "docs/user-documentation/admins/agents-management": "Agents management",
  "docs/user-documentation/admins/connections-management/google-drive": "Google Drive",
  "docs/user-documentation/admins/connections-management/notion": "Notion",
  "docs/user-documentation/admins/connections-management/confluence": "Confluence",
  "docs/user-documentation/admins/connections-management/intercom": "Intercom",
  "docs/user-documentation/admins/connections-management/github": "Github",
  "docs/user-documentation/admins/connections-management/microsoft": "Microsoft",
  "docs/user-documentation/admins/connections-management/zendesk": "Zendesk",
  "docs/user-documentation/admins/connections-management/snowflake": "Snowflake",
  "docs/user-documentation/admins/connections-management/bigquery": "BigQuery",
  "docs/user-documentation/admins/connections-management/gong": "Gong",
  "docs/user-documentation/admins/tools-management/adding-an-mcp-server": "Adding an MCP Server",
  "docs/user-documentation/admins/tools-management/personal-vs-shared-credentials": "Personal vs Shared Credentials for Tools & MCP Servers",
  "docs/user-documentation/admins/tools-management/salesforce/salesforce": "Salesforce",
  "docs/user-documentation/admins/tools-management/salesforce/salesforce-notes-on-api-limit-and-permissions": "Salesforce - Notes on API limit and permissions",
  "docs/user-documentation/admins/tools-management/managing-microsoft-tools": "Managing Microsoft tools",
  "docs/user-documentation/admins/tools-management/computer-admin-setup": "Computer admin setup",
  "docs/user-documentation/admins/workspace-analytics": "Workspace analytics",
  "docs/user-documentation/admins/audit-logs/audit-logs": "Audit Logs",
  "docs/user-documentation/admins/audit-logs/audit-logs-events-reference": "Audit Logs — Events Reference",
  "docs/user-documentation/admins/usage-seats-and-credits/seat-management": "Seat management",
  "docs/user-documentation/admins/usage-seats-and-credits/credits": "Credits",
  "docs/user-documentation/admins/usage-seats-and-credits/credit-management": "Credit management",
  "docs/user-documentation/admins/usage-seats-and-credits/optimize-credit-consumption": "Optimize credit consumption",
  "docs/user-documentation/admins/usage-seats-and-credits/train-team-credit-optimization": "Train your team on credit optimization",
  "docs/user-documentation/admins/billing/subscriptions-and-payments": "Subscriptions & Payments",
  "docs/user-documentation/admins/admin-troubleshooting/admin-troubleshooting": "Admin Troubleshooting",
  "docs/user-documentation/admins/admin-troubleshooting/slack-troubleshooting": "Slack Troubleshooting",
  
  // Developers
  "docs/user-documentation/developers/client-side-mcp-server": "Client Side MCP Server (Preview)",
  
  // Deprecated
  "docs/user-documentation/deprecated/legacy-dust-apps/creating-google-calendar-events-from-a-dust-agent": "Creating Google Calendar events from a Dust agent",
  "docs/user-documentation/deprecated/legacy-dust-apps/allowing-an-agent-to-send-an-email": "Allowing an agent to send an email",
  "docs/user-documentation/deprecated/dev-pre-configuring-a-custom-mcp-server": "Dev : pre-configuring a custom MCP server",
  
  // Developer Platform
  "docs/developer-platform/overview/developer-platform": "Developer platform",
  "docs/developer-platform/overview/javascript-sdk": "Javascript SDK",
  "docs/developer-platform/core-concepts/datasources": "Datasources",
  "docs/developer-platform/core-concepts/chunks-and-documents": "Chunks and documents",
  "docs/developer-platform/core-concepts/rate-limits": "Rate limits",
  "docs/developer-platform/dust-api-documentation/openapi-and-postman": "OpenAPI & Postman",
  "docs/developer-platform/dust-labs/dust-labs-repository": "Dust-Labs repository",
  "docs/developer-platform/dust-cli/dust-cli": "💻 Dust CLI",
  "docs/developer-platform/legacy-dust-apps/what-is-a-dust-app": "What is a Dust App?",
  "docs/developer-platform/legacy-dust-apps/dust-apps-core-concepts": "Dust Apps: Core Concepts",
  "docs/developer-platform/legacy-dust-apps/build-your-first-dust-app": "Build your first Dust App",
  "docs/developer-platform/legacy-dust-apps/blocks/core-blocks": "Core blocks",
};

// ============================================================
// CLEANUP SCRIPT
// ============================================================

// Walk directory and find all .mdx files
function findMdxFiles(dir, fileList = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!item.startsWith(".") && item !== "node_modules" && item !== "mintlify-starter-kit-files") {
        findMdxFiles(fullPath, fileList);
      }
    } else if (item.endsWith(".mdx") && item !== "index.mdx") {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const mdxFiles = findMdxFiles("docs");
console.log(`Found ${mdxFiles.length} .mdx files to clean up\n`);

let fixed = 0;
let skipped = 0;
let noTitle = 0;

for (const mdxFile of mdxFiles) {
  // Get the relative path without extension
  const relPath = mdxFile.replace(/\.mdx$/, "").replace(/\\/g, "/");
  
  // Look up the correct title
  const correctTitle = titleMap[relPath];
  
  if (!correctTitle) {
    console.log(`⚠️  No title mapping for: ${relPath}`);
    noTitle++;
    continue;
  }
  
  let content = fs.readFileSync(mdxFile, "utf-8");
  let modified = false;
  
  // 1. Fix frontmatter — ensure proper format
  // Check if frontmatter exists and is properly formatted
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n/);
  
  if (fmMatch) {
    // Frontmatter exists — update the title
    let frontmatter = fmMatch[1];
    let body = content.slice(fmMatch[0].length);
    
    // Replace the title line
    if (frontmatter.includes('title:')) {
      frontmatter = frontmatter.replace(/title:.*$/m, `title: "${correctTitle.replace(/"/g, '\\"')}"`);
    } else {
      frontmatter = `title: "${correctTitle.replace(/"/g, '\\"')}"\n` + frontmatter;
    }
    
    // 2. Remove the H1 heading if it matches the title (Mintlify shows frontmatter title automatically)
    // Remove the first H1 heading (it's redundant with the frontmatter title)
    body = body.replace(/^#\s+.+\n+/m, "");
    
    // 3. Clean up extra newlines at the start
    body = body.trimStart();
    
    content = `---\n${frontmatter}\n---\n\n${body}`;
    modified = true;
  } else {
    // No frontmatter — add it
    // Remove the first H1 heading
    let body = content.replace(/^#\s+.+\n+/m, "").trimStart();
    
    // Extract description from first paragraph
    let description = "";
    const firstPara = body.replace(/^[>\s]+/gm, "").trim();
    if (firstPara) {
      description = firstPara.substring(0, 150).replace(/\n/g, " ").trim();
      if (firstPara.length > 150) description += "...";
    }
    
    content = `---\ntitle: "${correctTitle.replace(/"/g, '\\"')}"${description ? `\ndescription: "${description.replace(/"/g, '\\"')}"` : ""}\n---\n\n${body}`;
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(mdxFile, content);
    console.log(`✅ Fixed: ${relPath} → "${correctTitle}"`);
    fixed++;
  } else {
    skipped++;
  }
}

console.log(`\n📊 Results: ${fixed} fixed, ${skipped} skipped, ${noTitle} missing title mapping`);
if (noTitle > 0) {
  console.log(`\n⚠️  ${noTitle} files have no title mapping — they'll keep their current title.`);
}
