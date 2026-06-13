#!/bin/sh
# AIGentDocs Stop hook — anti-drift feedback at the end of a turn.
# Runs the deterministic lint when the project is documented with the
# standard. Exit 2 feeds the findings back to Claude so it repairs the
# documentation before finishing; everything else stays silent.
# Inform-don't-block: set AIGENTDOCS_STOP_LINT=off to disable.

[ "$AIGENTDOCS_STOP_LINT" = "off" ] && exit 0
[ -d "docs/project" ] || exit 0
command -v npx >/dev/null 2>&1 || exit 0

output=$(npx --no-install aigentdocs lint 2>/dev/null)
status=$?

# 127/none: CLI not installed in this project — stay silent.
if [ $status -eq 1 ]; then
  echo "AIGentDocs lint found critical documentation findings:" >&2
  echo "$output" >&2
  echo "Repair the documentation (Anti-Drift Protocol) before finishing, or tell the user why you can't." >&2
  exit 2
fi
exit 0
