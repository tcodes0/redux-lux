const { resolve: re } = require("path");
const { readdirSync, statSync } = require("fs");

const config = require(re("liduxrc"));
const { actionsRoot, transformState } = config;

const nodes = readdirSync(re(actionsRoot));
const paths = nodes.map(node => re(`${actionsRoot}/${node}`));

const topLevel = paths.map((path, i) => {
  const stats = statSync(path);
  return {
    stats,
    path,
    isDir: stats.isDirectory(),
    isFile: !stats.isDirectory(),
    file: nodes[i]
  };
});

const dirs = topLevel.filter(it => it.isDir);
const files = topLevel.filter(it => it.isFile);

const actionFiles = [];
for (const dir of dirs) {
  const files = readdirSync(dir.path);
  const result = files.map(file => {
    return {
      file,
      path: `${dir.path}/${file}`,
      relativePath: `${actionsRoot}/${file}`
    };
  });
  actionFiles.push(...result);
};

console.log("action files", actionFiles);

for (const actionFile of actionFiles) {
  const { reducer } = require(actionFile.path)
  console.log("red", reducer)
}

const reducer = (state, action) => {
  return state;
};

module.exports = reducer;
