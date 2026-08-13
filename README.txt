LIOR — MACRO INSIGHT GITHUB PAGES SITE
======================================

DEPLOYMENT TARGET
-----------------
Public repository: https://github.com/Macro-Insight/github.io
Pages URL: https://macro-insight.github.io/github.io/
Branch: main
Publishing folder: repository root

The ZIP contents are ready to upload directly to the repository root. After
extraction, index.html must be at the root rather than inside an additional
wrapper folder.

INITIAL DEPLOYMENT
------------------
1. Upload all extracted files and folders to the main branch.
2. Open the repository's Settings > Pages page.
3. Under Build and deployment, choose Deploy from a branch.
4. Select main and / (root), then save.
5. Wait for Pages to publish and open the Pages URL above.

ARTICLE PUBLISHING
------------------
The site is compatible with:
D:\publish_plugin\item_github.py

The publisher discovers agent/publish-config.json in the repository, writes
published articles to data/articles.json, uploads article images to assets/,
and verifies each public article at article.html?id=<article-id>.

The homepage and article archive both load data/articles.json automatically.
Published entries are ordered by date with the newest first, so no HTML list
needs to be updated after an article is published.

IMPORTANT FILES
---------------
config.js                         Browser content endpoints and site identity.
data/profile.json                 Lior's public profile data.
data/articles.json                Published article metadata and body content.
data/research.json                Research-note data.
agent/profile.json                Editorial voice and review rules.
agent/content-schema.json         Required article fields.
agent/content-plan.json           Content lanes and cadence.
agent/publish-config.json         Repository, Pages URL and publishing target.
agent/writing-style.json          Editorial and citation rules.

CONTENT REVIEW
--------------
- Keep every article id unique and URL-safe.
- Use ISO dates in YYYY-MM-DD format.
- Keep drafts outside data/articles.json until review is complete.
- Published content is educational and must not be presented as personalized
  investment advice or as a guarantee of future outcomes.
