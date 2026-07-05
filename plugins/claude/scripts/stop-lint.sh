#!/bin/sh
# AIGentDocs Stop hook — anti-drift feedback at the end of a turn.
# Runs the deterministic lint when the project is documented with the
# standard. Exit 2 feeds the findings back to Claude so it repairs the
# documentation before finishing; everything else stays silent.
# Inform-don't-block: set AIGENTDOCS_STOP_LINT=off to disable.

[ "$AIGENTDOCS_STOP_LINT" = "off" ] && exit 0
[ -d "docs/project" ] || exit 0

# Resolve the CLI locally before trusting any exit code: a missing CLI is a
# tooling condition, not a documentation finding — stay silent. (This also
# avoids npx and its registry round-trip on every Stop.)
CLI="node_modules/.bin/aigentdocs"
[ -x "$CLI" ] || exit 0

output=$("$CLI" lint 2>/dev/null)
status=$?

# Exit 1 means critical findings — but never claim findings without output.
if [ $status -eq 1 ] && [ -n "$output" ]; then
  echo "AIGentDocs lint found critical documentation findings:" >&2
  echo "$output" >&2
  echo "Repair the documentation (Anti-Drift Protocol) before finishing, or tell the user why you can't." >&2
  exit 2
fi
exit 0
