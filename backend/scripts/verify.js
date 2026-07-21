const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const backendRoot = path.resolve(__dirname, '..');
const sourceRoot = path.join(backendRoot, 'src');
const routesRoot = path.join(sourceRoot, 'routes');

const collectJavaScriptFiles = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const entryPath = path.join(directory, entry.name);
  return entry.isDirectory() ? collectJavaScriptFiles(entryPath) : entry.name.endsWith('.js') ? [entryPath] : [];
});

const sourceFiles = collectJavaScriptFiles(sourceRoot);
for (const filePath of sourceFiles) {
  const result = spawnSync(process.execPath, ['--check', filePath], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status || 1);
}

const routeFiles = fs.readdirSync(routesRoot)
  .filter((fileName) => fileName.endsWith('.routes.js'))
  .sort();

for (const fileName of routeFiles) {
  require(path.join(routesRoot, fileName));
}

const loadedFiles = Object.keys(require.cache);
const forbiddenFiles = loadedFiles.filter((filePath) => /[\\/]src[\\/]server\.js$|[\\/]src[\\/]utils[\\/]seed(?:-data)?\.js$/.test(filePath));
if (forbiddenFiles.length > 0) {
  console.error(`Route verification loaded forbidden modules: ${forbiddenFiles.join(', ')}`);
  process.exit(1);
}

console.log(`Verified ${sourceFiles.length} backend JavaScript files and ${routeFiles.length} route modules without server or seed.`);
