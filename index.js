#!/usr/bin/env node

const [fs, path, utils, styleDictionary, argv] = [
  require("fs"),
	require("path"),
  require("./.frontech/utils"),
  require("./.frontech/styledictionary"),
	require('minimist')(process.argv.slice(2))
];

const {file, key} = argv;
const existData = fs.existsSync(path.resolve(process.cwd(), file));

if (existData) {
  let data = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), file)).toString()
  );

  if(key){
  	data = data[key] || {};
	}

  utils.printMessage("Settings creation process started");

  utils.warningConsole(
    `Based on the information provided in the configuration file ${file} the following files are generated: \n`
  );

  styleDictionary.styleDictionary(data, file);
  utils.buildCore(data.configuration.customPath)
  /* data.configuration.platforms.includes("scss")
    ? utils.buildChore(data.configuration.customPath)
    : null; */
} else {
  utils.errorConsole(`No ${file} configuration file specified`);
}
