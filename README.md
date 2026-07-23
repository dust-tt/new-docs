# Dust Documentation

Source for [docs.dust.tt](https://docs.dust.tt), built with [Mintlify](https://mintlify.com).

## Structure

- `docs.json`: site configuration and navigation
- `index.mdx`: homepage
- `docs/user-documentation/`: product documentation (getting started, agents, data sources, admins)
- `docs/developer-platform/`: developer platform docs and API reference (auto-generated from `docs/developer-platform/dust-api-documentation/openapi.json`)
- `docs/changelog.mdx`: product changelog
- `branding/`: logos and favicon

## Local development

Install the Mintlify CLI and run the local preview from the repo root:

```bash
npm i -g mint
mint dev
```

The preview runs at `http://localhost:3000`.

## Conventions

- Pages are MDX with YAML frontmatter (`title`, `description`); no H1 in the body
- Internal links are root-relative, without the `.mdx` extension (e.g. `/docs/user-documentation/agents/tools/notion`)
- API reference links use `/api-reference/{tag}/{endpoint-slug}` (pages are generated at deploy time)
- No UI screenshots (see decision #765)
- Callouts use Mintlify components: `<Info>`, `<Tip>`, `<Warning>`, `<Note>`, `<Check>`, `<Danger>`

## Checks before pushing

```bash
mint dev                                          # parses all pages, catches MDX errors
lychee --offline --root-dir "$(pwd)" --fallback-extensions mdx 'docs/**/*.mdx' index.mdx   # internal links
```

## Deployment

Pushes to `main` trigger a Mintlify deployment automatically.