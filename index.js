#!/usr/bin/env node

const [fs, path, utils, styleDictionary, argv] = [
  require("fs"),
	require("path"),
  require("./.frontech/utils"),
  require("./.frontech/styledictionary"),
	require('minimist')(process.argv.slice(2))
];

const {file, key, icons} = argv;
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
  if(icons){
    let fontIcons = [];
    for (const key in data.typography) {
      if(data.typography[key].family.type === 'icons') fontIcons = {...data.typography[key].family};
    };
    utils.generateIconFont(fontIcons,data);
  } else {
    styleDictionary.styleDictionary(data, file);
    data.configuration.platforms.includes("scss")
      ? utils.buildCore(data.configuration.customPath)
      : utils.messages.warning('You have not specified any platform.'); 
  }

} else {
  utils.messages.error(`No ${file} configuration file specified`);
}
