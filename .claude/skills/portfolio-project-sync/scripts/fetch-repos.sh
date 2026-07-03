#!/bin/bash
# fetch-repos.sh - List GitHub repos and extract metadata
# Usage: ./fetch-repos.sh <username> [--private]

set -e

USERNAME="${1:?Usage: ./fetch-repos.sh <username>}"
LIMIT="${2:-50}"

echo "=== Fetching repos for $USERNAME ==="
echo ""

# List all repos
gh repo list "$USERNAME" --limit "$LIMIT" --json name,description,url,pushedAt,isPrivate,defaultBranchRef \
  | node -e "
    const data = JSON.parse(require('fs').readFileSync('/dev/stdin', 'utf8'));
    data.sort((a, b) => new Date(b.pushedAt) - new Date(a.pushedAt));
    data.forEach((repo, i) => {
      const priv = repo.isPrivate ? ' [PRIVATE]' : '';
      const desc = repo.description || '(no description)';
      console.log(\`\${i+1}. \${repo.name}\${priv}\`);
      console.log(\`   Desc: \${desc}\`);
      console.log(\`   URL: \${repo.url}\`);
      console.log(\`   Updated: \${repo.pushedAt}\`);
      console.log('');
    });
    console.log(\`Total: \${data.length} repos\`);
  "
