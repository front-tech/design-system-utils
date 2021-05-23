const [fs, postcss, sass, autoprefixer, utils, symbols] = [
  require("fs"),
  require("postcss"),
  require("sass"),
  require("autoprefixer"),
  require("./utils"),
  require("log-symbols")
];
const file = `${__dirname.slice(
  0,
  __dirname.length - 10
)}/library/web/abstracts.scss`;

module.exports.buildCSS = (config) => {
  const path = () => {
    
    const file = config.configuration.outputCSS.path.match(/([^\/]+$)/);
    const folder = config.configuration.outputCSS.path.slice(0,config.configuration.outputCSS.path.length - file[0].length - 1);
    if(config.configuration.outputCSS.path.indexOf("/") > -1){
      return {
        file: file[0],
        folder
      }
    }else {
      return {
        file: file[0],
        folder: './'
      }
    }
  }
  const transformSass = sass
    .renderSync({
      file,
      sourceMap: false,
      outputStyle: "compressed"
    })
    .css.toString();

  const buildCSS = postcss([autoprefixer]).process(transformSass).css;
  console.log(
    `\nCreation of CSS output of the utilities generated based on the configuration file`
  );

  if (config.configuration.outputCSS.path.length > 0 ) {
    utils.createFile(path().folder,path().file,buildCSS)
    console.log(
      `${symbols.success}  ${process.cwd()}/${config.configuration.outputCSS.path}`
    );
  } else {
    utils.errorConsole(
      `Revisa el fichero de configuración, has establecido la siguiente información:\n\n${JSON.stringify(
        { "outputCSS": config.configuration.outputCSS },
        null,
        2
      )}`
    );
  }
};
