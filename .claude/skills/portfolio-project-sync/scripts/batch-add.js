#!/usr/bin/env node
// batch-add.js - Orchestrate adding multiple repos to portfolio
// Usage: node batch-add.js <username> [repo1,repo2,...]
// If no repos specified, lists all repos and lets you pick

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const USERNAME = process.argv[2];
const REPOS_ARG = process.argv[3]; // comma-separated

if (!USERNAME) {
  console.error('Usage: node batch-add.js <username> [repo1,repo2,...]');
  process.exit(1);
}

function run(cmd) {
  return execSync(cmd, { encoding: 'utf8', timeout: 30000 }).trim();
}

// Step 1: Fetch repos
console.log('=== Step 1: Fetching repositories ===');
const reposJson = run(`gh repo list ${USERNAME} --limit 50 --json name,description,isPrivate`);
const repos = JSON.parse(reposJson);

if (REPOS_ARG) {
  // Filter to specified repos
  const selected = REPOS_ARG.split(',').map(r => r.trim().toLowerCase());
  var filtered = repos.filter(r => selected.includes(r.name.toLowerCase()));
} else {
  // Show all repos
  repos.forEach((r, i) => {
    const priv = r.isPrivate ? ' [PRIVATE]' : '';
    console.log(`${i + 1}. ${r.name}${priv} - ${r.description || '(no desc)'}`);
  });
  console.log('\nRun with specific repos: node batch-add.js USERNAME repo1,repo2,repo3');
  process.exit(0);
}

// Step 2: Detect tech stack for each
console.log('\n=== Step 2: Detecting tech stacks ===');
const detectScript = path.join(__dirname, 'detect-stack.js');

for (const repo of filtered) {
  console.log(`\n--- ${repo.name} ---`);
  console.log(`  Description: ${repo.description || '(none)'}`);
  console.log(`  Private: ${repo.isPrivate}`);

  try {
    const result = run(`node "${detectScript}" ${USERNAME} ${repo.name}`);
    const data = JSON.parse(result);
    console.log(`  Stack: ${data.stack.join(', ') || '(unknown)'}`);
    console.log(`  Type: ${data.type}`);
  } catch (e) {
    console.log(`  Stack: (detection failed)`);
  }
}

// Step 3: Generate entries
console.log('\n=== Step 3: Generate project entries ===');
console.log('Use the output above to create entries with add-project.js');
console.log('Example:');
console.log(`  node add-project.js --name "${filtered[0]?.name || 'Project'}" --desc "..." --link "..." --category "Tool" --stack "..." --tags "..."`);
