# aigentdocs

CLI for the [AIGentDocs](https://github.com/rodrigo-amc/AIGentDocs) docs-as-code standard: living domain documentation designed for AI coding agents. Deterministic — no LLM involved.

```bash
# Scaffold the structure into your repository (or --lite for the minimal profile)
npx aigentdocs init

# Validate documentation compliance (exit 1 on critical findings)
npx aigentdocs lint

# Install the pre-commit hook (only critical findings block; bypass: --no-verify)
npx aigentdocs hooks install

# Generate per-tool adapter files pointing to AGENTS.md
npx aigentdocs adapt

# Upgrade docs/standard/ to this CLI's bundled standard version
npx aigentdocs update
```

Once installed (`npm i -D aigentdocs`), the short alias `agd` works too.

Full documentation: see the [AIGentDocs repository](https://github.com/rodrigo-amc/AIGentDocs).
