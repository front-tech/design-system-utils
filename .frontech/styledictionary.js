const [utils, symbols, route] = [
  require("./utils"),
  require("log-symbols"),
  require("path")
];


/**
 * This function is used to build tokens platforms by styledictionary
 * @param {string} file - name file tokens
 * @param {string} path - path export tokens
 */
const styleDictionary = (file, path) => {
  
  const _path = route.resolve(__dirname, '..', 'build', 'tokens', 'tokens-parsed.json');
  const buildPath = route.resolve(process.cwd(), path);
  let grid = [];
  const checkStencilUtils = (property, type) => ({ [type]: property[type] });

  const StyleDictionary = require("style-dictionary").extend(
    {
      source: [_path],
      platforms: {
        scss: {
          transformGroup: "scss",
          buildPath: `${buildPath}/library/scss/`,
          files: [
            {
              destination: "settings/_color.scss",
              format: "css/variables",
              filter: {
                type: "color"
              }
            },
            {
              destination: "settings/_typography.scss",
              format: "css/variables",
              filter: {
                attributes: {
                  category: 'font',
                }
              },
            },
            {
              destination: "settings/_grid.scss",
              format: "custom/grid",
              filter: {
                type: "sizing"
              }
            },
            {
              destination: "tools/_media-queries.scss",
              format: "custom/mediaqueries",
              filter: {
                type: "sizing"
              }
            },
            {
              destination: "settings/_spacing.scss",
              format: "css/variables",
              filter: {
                type: "spacing"
              }
            }
          ]
        },
      }
    }
  );

  StyleDictionary.registerTransform({
    name: 'attribute/font',
    type: 'attribute',
    transformer: prop => ({
      category: prop.path[0],
      type: prop.path[1],
      family: prop.path[2],
      weight: prop.path[3],
      style: prop.path[4]
    })
  });

  // Register a custom format to generate @font-face rules.
  StyleDictionary.registerFormat({
    name: 'font-face',
    formatter: ({ dictionary: { allTokens }, options }) => {
      const fontPathPrefix = options.fontPathPrefix || '../';

      // https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/src
      const formatsMap = {
        'woff2': 'woff2',
        'woff': 'woff',
        'ttf': 'truetype',
        'otf': 'opentype',
        'svg': 'svg',
        'eot': 'embedded-opentype'
      };

      console.log(allTokens);
      return allTokens.reduce((fontList, prop) => {

        return fontList;
      }, []).join('\n');
    }
  });

  StyleDictionary.registerFormat({
    name: "custom/grid",
    formatter: (dictionary) => {

      try {
        let result = [];
        for (const key in dictionary.properties.size) {

          if (key !== 'scale') {
            let value = dictionary.properties.size[key];
            /*           grid.push(dictionary.properties.size);
                      layout = value.gutter.attributes.type;
                      const [gutter, offset, columns, width] = [
                        value.gutter,
                        value.offset,
                        value.columns,
                        value.width
                      ];
                      result += `${layout}:(
                          ${gutter.path[2]}:${gutter.value},
                          ${offset.path[2]}:${offset.value},
                          ${columns.path[2]}:${columns.value},
                          ${width.path[2]}:${width.value}
                        ),`; */
          }

        }

        return `/// Dynamically created map based on the configuration file. Define the breakpoints of the different breakpoints\n/// @type map\n/// @group grid \n$breakpoints: (
                  ${result}
              );`;
      } catch {
        utils.messages.error(
          `${symbols.error}  No grid utility configuration specified. The file will be created without content. Please check the configuration file ${file}.`
        );
        return `// To generate the grid configuration, check the configuration file ${file}\n$breakpoints:()!default;`;
      }
    }
  });
  StyleDictionary.registerFormat({
    name: "custom/mediaqueries",
    formatter: (dictionary) => {
      try {
        let result = [];
        for (const key in property.grid) {
          let value = property.grid[key];
          layout = value.gutter.attributes.type;

          const [width] = [value.width.value];
          result += `/// Mixin whose objective is to create the media-query based on the cut points established in the configuration file\n///\n///\n/// @example scss\n///\n///      .test{\n///         width: 100%;\n///         @include screen-${key}(){\n///           width: auto;\n///         }\n///      }\n///\n/// @example css\n///\n///      .test {\n///         width: 100%;\n///       }\n///\n///      @media only screen and (min-width: ${width}) {\n///         .test {\n///           width: auto;\n///         }\n///      }\n///\n/// @group media-queries \n@mixin screen-${key}{\n   @media only screen and (min-width: ${width}) {\n     @content\n   }\n};\n`;
        }


        return (result += `/// Mixin whose objective is to create the media-query based on the cut points established in the configuration file\n///\n///\n/// @example scss\n///\n///      .test{\n///         width: 100%;\n///         @include screen-custom($screen){\n///           width: auto;\n///         }\n///      }\n///\n/// @example css\n///\n///      .test {\n///         width: 100%;\n///       }\n///\n///      @media only screen and (min-width: $screen) {\n///         .test {\n///           width: auto;\n///         }\n///      }\n///\n/// @group media-queries \n@mixin screen-custom($screen){\n   @media only screen and (min-width: $screen) {\n     @content\n   }\n};\n`);

      } catch (err) {
        utils.messages.error(
          `${symbols.error}  No grid utility configuration specified. The file will be created without content. Please check the configuration file ${file}.`
        );
        return `// To generate the mixin of mediaqueries, check the configuration file ${file}`;
      }
    }
  });

  StyleDictionary.registerFormat({
    name: "custom/properties-typography",
    formatter: (dictionary) => {
      try {
        console.log(dictionary);
        const property = checkStencilUtils(dictionary.properties, 'typography');
        let key = Object.keys(property.typography);
        let fonts = "";
        let customProperties = "";

        key.forEach((font) => {
          value = property.typography[font];
          fonts += `\n${font}: (\nname:${value.family.value},\nweight:${value.weight.value},\nstyle:${value.style.value}\n),`;
          customProperties += `--${font}:${value.family.value};\n`;
        });
        return `/// Font map defined in the ${file} file\n///@group fonts\n$fonts:(${fonts});\n\n/// Custom properties cuyo valor es el nombre aportado en el fichero ${file}\n/// @group fonts\n:root{\n${customProperties}};`;
      } catch (error) {
        utils.messages.error(
          `${symbols.error}  No font settings have been specified. The file will be created without content. Please check the configuration file ${file}.`
        );
        return `// To generate the text sources, check the configuration file ${file}\n$fonts:() !default;`;
      }
    }
  });
  StyleDictionary.registerFormat({
    name: "custom/properties-icons",
    formatter: (dictionary) => {
      try {
        const property = checkStencilUtils(dictionary.properties, 'typography');
        let key = Object.keys(property.typography);
        let icon;

        key.forEach((font) => {
          value = property.typography[font];
          value.family.input && value.family.output
            ? (icon = {
              value: font,
              input: value.family.input,
              output: value.family.output
            })
            : utils.messages.warning(
              `${symbols.warning}  Review the configuration file. For the creation of the iconic source you have entered the source path ${value.family.input} and the exit route ${value.family.output}`
            );
        });
        // TODO: Check build icon font
        // utils.generateIconFont(icon,data);
      } catch (error) {
        utils.messages.error(
          `${symbols.error}  No iconic font settings have been specified. The file will be created without content. Please check the configuration file ${file}.`
        );
        return `// To generate the iconic font, check the configuration file ${file}`;
      }
    }
  });

  StyleDictionary.buildAllPlatforms();
  utils.messages.print("Settings creation process finished");

};

const buildArchitecture = (file, path) => {
  utils.messages.print("Settings creation process started");

  
  utils.messages.warning(
    `\nBased on the information provided in the configuration file ${file} the following files are generated: \n`
  );
  styleDictionary(file, path);
  /* utils.buildCore(path); */
}

module.exports = {
  styleDictionary,
  buildArchitecture
}
