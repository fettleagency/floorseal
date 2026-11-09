# floorseal

Shopify theme for **floorseal.myshopify.com**, based on Shopify's Horizon theme (v4.4.0).

## How it's wired up

- The `main` branch is connected to the store through Shopify's GitHub integration
  (Online Store → Themes → Add theme → Connect from GitHub).
- Pushing to `main` updates the connected theme in the store.
- Changes made in the Shopify theme editor (e.g. `config/settings_data.json`, template JSON)
  are committed back to `main` by Shopify. **Always `git pull` before starting work.**

## Local development

Requires [Shopify CLI](https://shopify.dev/docs/api/shopify-cli) (`brew install shopify-cli`).

```bash
shopify theme dev -e development       # local preview with hot reload
shopify theme check                    # lint Liquid / theme files
```

`shopify theme dev` uses a temporary development theme, so it never touches the live theme.

## Workflow

1. `git pull` on `main`
2. Branch off: `git checkout -b feature/my-change`
3. Develop with `shopify theme dev -e development`
4. Open a PR into `main`; merging deploys to the connected theme

For bigger pieces of work, connect the feature branch to its own theme in Shopify
(Add theme → Connect from GitHub → pick the branch) to get a shareable preview.
