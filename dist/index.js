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
  

  utils.messages.print("Settings creation process started");

  utils.messages.warning(
    `Based on the information provided in the configuration file ${file} the following files are generated: \n`
  );

  styleDictionary.styleDictionary(data, file);
  data.configuration.platforms.includes("scss")
    ? utils.buildCore(data.configuration.customPath)
    : utils.messages.warning('You have not specified any platform.'); 
} else {
  utils.messages.error(`No ${file} configuration file specified`);
}
