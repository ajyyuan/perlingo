# Search indexing

Local fix prepared October 26, 2026; not deployed. It addresses plausible sources of Search Console’s “Duplicate without user-selected canonical” report. The affected-URL export and Google-selected canonicals were not available, so the report’s exact duplicate cluster is not confirmed.

## Investigation

Public GET checks on October 26 found:

| URL | Live response before this fix |
| --- | --- |
| `https://perlingo.app/` | 200 with immediate meta-refresh to `/challenge/`, no canonical |
| `/index.html` | 307 to `/` |
| `/challenge`, `/challenge/index.html` | 307 to `/challenge/` |
| `/learning`, `/learning/index.html` | 307 to `/learning/` |
| `/challenge/`, `/learning/` | 200, no canonical |
| `/about.html` | 307 to `/about`; destination 200 without canonical |
| `https://perlingo-parallel.ayuan2.chatgpt.site/challenge/` | 200, no canonical |
| `http://perlingo.app/` | 302 to HTTPS |
| `https://www.perlingo.app/` | DNS did not resolve |

The checked-in Worker had a 302 home redirect, but the live asset response bypassed it. Therefore Worker-only metadata or redirects would not cover the observed production behavior. Directory aliases, query variations and the retained Sites origin were possible duplicate sources. The `www` hostname was not confirmed as a serving duplicate.

## Implemented locally

HTML canonical links are present before JavaScript runs and always use `https://perlingo.app`. Each public entry page keeps its own destination:

- Challenge: `/challenge/`; Learning: `/learning/`; Spanish cards: `/lemmas/`.
- Introduction: `/about`; privacy: `/privacy`.
- Accent comparison: `/audio-regions/`; card sources: `/lemmas/sources`.
- Language tree: `/challenge/tree`; Challenge audio credits: `/challenge/audio-sources`.

These paths match the host’s extensionless HTML and directory-slash conventions. The same tags survive static copying and Challenge asset-path rewriting, including when served on the retained Sites origin. Query strings do not enter these canonical tags; they remain available to the application. Learning pack variants use the Learning entry-page canonical while retaining their separate content/progress behavior. The content-review and word-notes authoring views are outside this targeted entry-page fix.

`_redirects` ships with static assets and permanently redirects `/` and `/index.html` to `/lemmas/` with 308. The Worker’s existing home redirects also use 308. The generated meta-refresh fallback has a Lemmas canonical for hosts that do not apply redirect rules. The local server uses 308 for its existing home/Challenge aliases and now accepts `/learning/index.html` for canonical previewing. There is no cross-origin navigation redirect: existing sign-in return URLs and preview access remain usable. No robots exclusions, content changes, voice changes or pronunciation-feedback changes are introduced.

Google treats canonical tags and permanent redirects as strong signals, not guarantees of its selected canonical. See [Google’s canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) and [Cloudflare static redirect rules](https://developers.cloudflare.com/workers/static-assets/redirects/).

## Preview and verification

Run `node --test tests/indexing.test.mjs` for focused regression coverage: canonical destinations, Challenge rewrite safety, isolated static build output, and actual Worker redirect handling with framework/provider dependencies stubbed. No live provider requests are made.

Run `npm run dev`, then open `http://127.0.0.1:5173/`. It should reach Lemmas. Open `/learning?pack=starter` and `/learning/index.html?pack=course`; confirm both still load the requested pack. In DevTools, `document.querySelector('link[rel="canonical"]').href` should return `https://perlingo.app/learning/`. Challenge should return its own canonical. Check that normal learning/navigation still work. Local source serving retains `.html` information-page URLs; production extensionless routing is verified with the hosted build.

For production-equivalent preview, build with the command in [the release workflow](audio-hosting.md#release-workflow), then run `npm --prefix hosting start`. On its printed localhost address, inspect `/`, `/index.html?code=preview&pack=course`, `/challenge/`, `/learning/`, `/about.html` and `/about`. Home aliases should permanently redirect with the query intact; canonical destinations should return 200. Check generated `dist/client/_redirects` and the HTML in `dist/client`, not just the framework layout. For asset-only verification, Wrangler can serve `hosting/dist/client` with `--assets`, exercising `_redirects` independently of the Worker.

After an explicitly approved deployment, repeat public checks on both origins, inspect the actual affected URLs in Search Console, verify the user-declared canonical, and request validation/re-indexing where appropriate. Re-crawling and Google’s canonical selection remain outstanding until then. Do not describe this local fix as a cleared Search Console issue.

## Local validation record — October 26, 2026

All 268 repository tests passed, including three new indexing tests; `npm run check` and `git diff --check` passed. The combined hosted build passed after restoring the incomplete hosting dependency installation with `npm --prefix hosting run install:ci` (existing lockfile unchanged).

HTTP checks passed against the source preview on port 5173, built Worker on port 8787, and independent static-assets preview on port 8788. Both hosted previews returned 308 for `/` and `/index.html`, preserving `?code=preview%2Btest&pack=course`. All nine canonical destinations returned 200 with their matching absolute canonical tags. Existing `/learning`, `/learning/index.html`, `/about.html` and `/challenge/index.html` normalization remained 307 to the expected targets. This verifies static-rule processing independently of Worker routing; no deployment or Search Console validation was performed.


## Home destination — October 27, 2026

The local implementation now makes Lemmas the home destination in the source server, Worker, framework fallback, static redirect rules and generated HTML fallback. `/learning/` remains served by the original source `index.html`, whose Learning canonical is intentionally retained; the generated root HTML has the Lemmas canonical. Root redirect query parameters remain intact. Learning and Challenge retain their own URLs and are linked from a quiet More disclosure in the Lemmas footer. The Lemmas wordmark stays within Lemmas. This change is not deployed.

October 27 validation: all 293 repository tests and `npm run check` passed. Updated routing tests verified generated fallback canonicals/static rules and Worker root redirects with preserved query data; Lemmas, Learning, Challenge and speech API routes remain distinct. Browser preview confirmed `/` reaches `/lemmas/` with its query intact, the More menu exposes both legacy links, and Escape closes it with focus restored. Hosted deployment and production verification remain pending.
