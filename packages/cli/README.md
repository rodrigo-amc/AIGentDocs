# aigenticdocs

CLI for the [AIGenticDocs](https://github.com/rodrigo-amc/AIGentDocs) docs-as-code standard: living domain documentation designed for AI coding agents. Deterministic — no LLM involved.

```bash
# Scaffold the structure into your repository (or --lite for the minimal profile)
npx aigenticdocs init

# Validate documentation compliance (exit 1 on critical findings)
npx aigenticdocs lint

# Install the pre-commit hook (only critical findings block; bypass: --no-verify)
npx aigenticdocs hooks install

# Generate per-tool adapter files pointing to AGENTS.md
npx aigenticdocs adapt

# Upgrade docs/standard/ to this CLI's bundled standard version
npx aigenticdocs update
```

Once installed (`npm i -D aigenticdocs`), the short alias `agd` works too.

Full documentation: see the [AIGenticDocs repository](https://github.com/rodrigo-amc/AIGentDocs).
