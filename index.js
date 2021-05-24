#!/usr/bin/env node

const [fs, utils, styleDictionary] = [
  require("fs"),
  require("./.frontech/utils"),
  require("./.frontech/styledictionary")
];
const fileConfig = process.argv.filter((file) =>
  /.frontech.json/.test(file) ? file : null
);
const existData = fs.existsSync(`${process.cwd()}/${fileConfig}`);
if (existData) {
  const data = JSON.parse(
    fs.readFileSync(`${process.cwd()}/${fileConfig}`).toString()
  );

  utils.printMessage("Settings creation process started");

  utils.warningConsole(
    `Based on the information provided in the configuration file ${fileConfig} the following files are generated: \n`
  );

  styleDictionary.styleDictionary(data);
  utils.buildChore(data.configuration.customPath)
  /* data.configuration.platforms.includes("scss")
    ? utils.buildChore(data.configuration.customPath)
    : null; */
} else {
  utils.errorConsole(`No .frontech.json configuration file specified`);
}
