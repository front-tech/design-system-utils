#!/usr/bin/env node

const [fs, utils, symbols, webfont, css] = [
  require("fs"),
  require("./.frontech/utils"),
  require("log-symbols"),
  require("webfont").default,
  require("./.frontech/postcss")
];
let grid = [];
const fileConfig = process.argv.filter((file) =>
  /.frontech.json/.test(file) ? file : null
);
const existData = fs.existsSync(`${process.cwd()}/${fileConfig}`);
if (existData) {
  const data = JSON.parse(
    fs.readFileSync(`${process.cwd()}/${fileConfig}`).toString()
  );

  const generateIconFont = async (svg) => {
    const { name, input, output } = svg;
    webfont({
      files: `${process.cwd()}/${input}/*.svg`,
      fontName: name,
      template: "scss",
      dest: `${__dirname}/library/web/settings/_icons.scss`,
      templateClassName: "icon",
      templateFontPath: "#{$font-path}",
      fontWeight: 800
    })
      .then((result) => {
        const file = (folder, file, data) => {
          utils.createFile(folder, file, data);
          console.log(`${symbols.success}  ${folder}/${file}`);
        };
        let utilities = fs.readdirSync(
          `${__dirname}/library/web/utilities/`,
          "utf-8",
          () => true
        );
        let partials = "";
        utilities.map((partial, index) =>
          index !== utilities.length - 1
            ? (partials += `@forward '${partial
                .replace("_", "")
                .replace(".scss", "")}';\n`)
            : null
        ); 
        fs.writeFileSync(
          `${__dirname}/library/web/utilities/utilities.scss`,
          partials,
          () => true
        ); 
        console.log(
          `\nIconic font creation based on the svg files in the path ${input}`
        );
        file(
          `${__dirname}/library/web/utilities`,
          `_icons.scss`,
          `@use '../settings/general' as *;\n${result.template}`
        );
        file(
          `${process.cwd()}/${output}`,
          `${result.config.fontName}.svg`,
          result.svg
        );
        file(
          `${process.cwd()}/${output}`,
          `${result.config.fontName}.ttf`,
          result.ttf
        );
        file(
          `${process.cwd()}/${output}`,
          `${result.config.fontName}.eot`,
          result.eot
        );
        file(
          `${process.cwd()}/${output}`,
          `${result.config.fontName}.woff`,
          result.woff
        );
        data.outputCSS ? css.buildCSS(data) : null;
        utils.printMessage("Settings creation process finished");
      })
      .catch((e) => {
        console.log(e)
        utils.errorConsole(
          `\nCheck the configuration file, you have established the following information:\n\n${JSON.stringify(
            svg,
            null,
            2
          )}`
        );
        utils.createFile(
          `${__dirname}/library/web/utilities`,
          `_icons.scss`,
          `// To generate the iconic font, check the configuration file .frontech.json`
        );
      });
  };
  const StyleDictionary = require("style-dictionary").extend({
    source: [".frontech.json"],
    platforms: {
      scss: {
        transformGroup: "scss",
        buildPath: `${__dirname}/library/web/`,
        files: [
          {
            destination: "settings/_color.scss",
            format: "custom/properties-color",
            filter: {
              type: "color"
            }
          },
          {
            destination: "settings/_typography.scss",
            format: "custom/properties-typography",
            filter: {
              type: "typography"
            }
          },
          {
            destination: "utilities/_icons.scss",
            format: "custom/properties-icons",
            filter: {
              type: "icons"
            }
          },
          {
            destination: "settings/_grid.scss",
            format: "custom/grid",
            filter: {
              type: "grid"
            }
          },
          {
            destination: "tools/_media-queries.scss",
            format: "custom/mediaqueries",
            filter: {
              type: "grid"
            }
          },
          {
            destination: "settings/_spacing.scss",
            format: "custom/spacing",
            filter: {
              type: "spacing"
            }
          }
        ]
      },
      android: {
        transformGroup: "android",
        buildPath: `${__dirname}/library/android/`,
        files: [
          {
            destination: "tokens.colors.xml",
            format: "android/colors",
            filter: {
              type: "color"
            }
          }
        ]
      },
      ios: {
        transformGroup: "ios",
        buildPath: `${__dirname}/library/ios/`,
        files: [
          {
            destination: "tokens.color.h",
            format: "ios/macros",
            filter: {
              type: "color"
            }
          },
          {
            destination: "tokens.font.h",
            format: "ios/singleton.h",
            filter: {
              type: "typography"
            }
          },
          {
            destination: "tokens.font.m",
            format: "ios/singleton.m",
            filter: {
              type: "typography"
            }
          }
        ]
      }
    }
  });

  StyleDictionary.registerFormat({
    name: "custom/grid",
    formatter: (dictionary) => {
      try {
        let result = [];
        if (typeof dictionary.properties.grid === "undefined")
          throw new Error();
        for (const key in dictionary.properties.grid) {
          let value = dictionary.properties.grid[key];
          grid.push(key);
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
              ),`;
        }

        return `/// Dynamically created map based on the configuration file. Define the breakpoints of the different breakpoints\n/// @type map\n/// @group grid \n$breakpoints: (
                    ${result}
                );`;
      } catch {
        utils.errorConsole(
          `${symbols.error}  No grid utility configuration specified. The file will be created without content. Please check the configuration file .frontech.json.`
        );
        return "// To generate the grid configuration, check the configuration file .frontech.json\n$breakpoints:()!default;";
      }
    }
  });
  StyleDictionary.registerFormat({
    name: "custom/mediaqueries",
    formatter: (dictionary) => {
      try {
        let result = [];
        if (typeof dictionary.properties.grid === "undefined")
          throw new Error();
        for (const key in dictionary.properties.grid) {
          let value = dictionary.properties.grid[key];
          layout = value.gutter.attributes.type;
          
          const [width] = [value.width.value];
          result += `/// Mixin whose objective is to create the media-query based on the cut points established in the configuration file\n///\n///\n/// @example scss\n///\n///      .test{\n///         width: 100%;\n///         @include screen-${key}(){\n///           width: auto;\n///         }\n///      }\n///\n/// @example css\n///\n///      .test {\n///         width: 100%;\n///       }\n///\n///      @media only screen and (min-width: ${width}) {\n///         .test {\n///           width: auto;\n///         }\n///      }\n///\n/// @group media-queries \n@mixin screen-${key}{\n   @media only screen and (min-width: ${width}) {\n     @content\n   }\n};\n`;
        }

        return result;
      } catch {
        utils.errorConsole(
          `${symbols.error}  No grid utility configuration specified. The file will be created without content. Please check the configuration file .frontech.json.`
        );
        return "// To generate the mixin of mediaqueries, check the configuration file .frontech.json";
      }
    }
  });
  StyleDictionary.registerFormat({
    name: "custom/spacing",
    formatter: (dictionary) => {
      try {
        const { increase, limit } = dictionary.properties.spacing;

        return `/// Dynamically created map based on the configuration file. Define the attributes to create the margin and padding utility classes\n/// @type number\n/// @group spacing
            $spacing: (
                increase:${increase.value},
                limit:${limit.value}
            );
          `;
      } catch {
        utils.errorConsole(
          `${symbols.error}  No margin and padding utility settings are specified. The file will be created without content. Please check the configuration file .frontech.json.`
        );
        return "// To generate the margin and padding utilities, check the configuration file .frontech.json\n$spacing:() !default;";
      }
    }
  });
  StyleDictionary.registerFormat({
    name: "custom/properties-color",
    formatter: (dictionary) => {
      try {
        let key = Object.keys(dictionary.properties.color);
        let customProperties = "\n";
        key.forEach((item) => {
          value = dictionary.properties.color[item];
          customProperties += `--${item}:${value.value};\n`;
        });
        return `/// Color variables defined in the .frontech.json file\n///@group colors\n:root{${customProperties}};`;
      } catch {
        utils.errorConsole(
          `${symbols.error}  No color settings have been specified. The file will be created without content. Please check the configuration file .frontech.json.`
        );
        return "// To generate the custom properties of colors, check the configuration file .frontech.json";
      }
    }
  });

  StyleDictionary.registerFormat({
    name: "custom/properties-typography",
    formatter: (dictionary) => {
      try {
        let key = Object.keys(dictionary.properties.typography);
        let fonts = "";
        let customProperties = "";

        key.forEach((font) => {
          value = dictionary.properties.typography[font];
          fonts += `\n${font}: (\nname:${value.family.value},\nweight:${value.weight.value},\nstyle:${value.style.value}\n),`;
          customProperties += `--${font}:${value.family.value};\n`;
        });
        return `/// Font map defined in the .frontech.json file\n///@group fonts\n$fonts:(${fonts});\n\n/// Custom properties cuyo valor es el nombre aportado en el fichero .frontech.json\n/// @group fonts\n:root{\n${customProperties}};`;
      } catch (error) {
        utils.errorConsole(
          `${symbols.error}  No font settings have been specified. The file will be created without content. Please check the configuration file .frontech.json.`
        );
        return "// To generate the text sources, check the configuration file .frontech.json\n$fonts:() !default;";
      }
    }
  });
  StyleDictionary.registerFormat({
    name: "custom/properties-icons",
    formatter: (dictionary) => {
      try {
        let key = Object.keys(dictionary.properties.typography);
        let icon;

        key.forEach((font) => {
          value = dictionary.properties.typography[font];
          value.family.input && value.family.output
            ? (icon = {
                name: font,
                input: value.family.input,
                output: value.family.output
              })
            : utils.warningConsole(
                `${symbols.warning}  Review the configuration file. For the creation of the iconic source you have entered the source path ${value.family.input} and the exit route ${value.family.output}`
              );
        });
        generateIconFont(icon);
      } catch (error) {
        utils.errorConsole(
          `${symbols.error}  No iconic font settings have been specified. The file will be created without content. Please check the configuration file .frontech.json.`
        );
        return "// To generate the iconic font, check the configuration file .frontech.json";
      }
    }
  });

  utils.printMessage("Settings creation process started");

  utils.warningConsole(
    `Based on the information provided in the configuration file ${fileConfig} the following files are generated: \n`
  );

  StyleDictionary.buildAllPlatforms();
} else {
  utils.errorConsole(
    `No .frontech.json configuration file specified`
  );
}
    