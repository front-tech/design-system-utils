const [utils, symbols, webfont, css] = [
  require("./utils"),
  require("log-symbols"),
  require("webfont").default,
  require("./postcss")
];
module.exports.styleDictionary = (data) => {
  let grid = [];

  const StyleDictionary = require("style-dictionary").extend(
    utils.buildPlatforms(data.configuration)
  );

  const generateIconFont = async (svg) => {
    const { name, input, output } = svg;
    webfont({
      files: `${process.cwd()}/${input}/*.svg`,
      fontName: name,
      template: "scss",
      dest: `${process.cwd()}/library/web/settings/_icons.scss`,
      templateClassName: "icon",
      templateFontPath: "#{$font-path}",
      fontWeight: 800
    })
      .then((result) => {
        const file = (folder, file, data) => {
          utils.createFile(folder, file, data);
          console.log(`${symbols.success}  ${folder}/${file}`);
        };
        const pathFile = data.configuration.customPath
          ? `${process.cwd()}/${
              data.configuration.customPath
            }/library/web/utilities`
          : `${process.cwd()}/library/web/utilities`;
        console.log(
          `\nIconic font creation based on the svg files in the path ${input}`
        );
        file(
          pathFile,
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
        data.configuration.outputCSS ? css.buildCSS(data) : null;
        utils.printMessage("Settings creation process finished");
      })
      .catch((e) => {
        console.log(e);
        utils.errorConsole(
          `\nCheck the configuration file, you have established the following information:\n\n${JSON.stringify(
            svg,
            null,
            2
          )}`
        );
        utils.createFile(
          `${process.cwd()}/library/web/utilities`,
          `_icons.scss`,
          `// To generate the iconic font, check the configuration file .frontech.json`
        );
      });
  };
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

        return (result += `/// Mixin whose objective is to create the media-query based on the cut points established in the configuration file\n///\n///\n/// @example scss\n///\n///      .test{\n///         width: 100%;\n///         @include screen-custom($screen){\n///           width: auto;\n///         }\n///      }\n///\n/// @example css\n///\n///      .test {\n///         width: 100%;\n///       }\n///\n///      @media only screen and (min-width: $screen) {\n///         .test {\n///           width: auto;\n///         }\n///      }\n///\n/// @group media-queries \n@mixin screen-custom($screen){\n   @media only screen and (min-width: $screen) {\n     @content\n   }\n};\n`);
        
      } catch (err) {
        console.log(err)
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

  StyleDictionary.buildAllPlatforms();
};
