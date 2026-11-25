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

## Front-end build (`source/`)

Static HTML templates are built in `source/assets/static/` with Bootstrap and gulp.
Shopify ignores the `source/` folder, so nothing in it reaches the store.

```bash
cd source
npm ci           # first time only
npm start        # build, watch and serve at http://localhost:8081/
npm run build    # one-off build
```

- SCSS lives in `source/assets/scss/`, custom JS in `source/assets/js/custom/`,
  images in `source/assets/images/`, fonts in `source/assets/fonts/`.
- Everything compiles into `source/dist/` (not committed). In the HTML, link to
  `/dist/styles/main.css`, `/dist/scripts/lib.js`, `/dist/scripts/script.js` and `/dist/images/…`.
- Custom JS is linted with ESLint on every build and save (rules in `source/eslint.config.js`).
  Problems are printed in the terminal, they don't stop the build.
- No jQuery: `lib.js` is Bootstrap's bundle (Popper included), so write custom JS as plain JavaScript.
- Source maps are written next to `main.css` and `script.js`, so dev tools show the original
  SCSS and JS files. Set `maps` to `false` in `gulpfile.js` before building into the theme.
- Rubik (400, 400 italic, 500, 600) is self-hosted from the `@fontsource/rubik` package. The `@font-face`
  rules are in `source/assets/scss/_configs/_fonts.scss` and the files are copied by the gulp
  `fonts` task. Use it in SCSS with `font-family: $rubik;`.
- To add a JS library, `npm i <name>` and add its path to `paths.libs` in `gulpfile.js`.
- Built and tested on Node 26 (`source/.nvmrc`, so `nvm use` picks it up).
- Sass is pinned at 1.77.5 on purpose: newer versions print hundreds of deprecation
  warnings with Bootstrap 5.3.

## Workflow

1. `git pull` on `main`
2. Branch off: `git checkout -b feature/my-change`
3. Develop with `shopify theme dev -e development`
4. Open a PR into `main`; merging deploys to the connected theme

For bigger pieces of work, connect the feature branch to its own theme in Shopify
(Add theme → Connect from GitHub → pick the branch) to get a shareable preview.
