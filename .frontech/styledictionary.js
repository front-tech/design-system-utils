const [utils, symbols] = [
  require("./utils"),
  require("log-symbols")
];



module.exports.styleDictionary = (data, file) => {
  let grid = [];
  const checkStencilUtils = (property,type) => property.sassConfig ? {[type]: property.sassConfig[type]} : {[type]:property[type]};
  const StyleDictionary = require("style-dictionary").extend(
		{
			source: [file],
			...utils.buildPlatforms(data.configuration)
		}
  );

  
  StyleDictionary.registerFormat({
    name: "custom/grid",
    formatter: (dictionary) => {
      const property = checkStencilUtils(dictionary.properties,'grid');
      try {
        let result = [];
        for (const key in property.grid) {
          let value = property.grid[key];
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
      const property = checkStencilUtils(dictionary.properties,'grid');
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
    name: "custom/spacing",
    formatter: (dictionary) => {
      try {
        const property = checkStencilUtils(dictionary.properties,'spacing');
        const { increase, limit } = property.spacing;

        return `/// Dynamically created map based on the configuration file. Define the attributes to create the margin and padding utility classes\n/// @type number\n/// @group spacing
          $spacing: (
              increase:${increase.value},
              limit:${limit.value}
          );
        `;
      } catch {
        utils.messages.error(
          `${symbols.error}  No margin and padding utility settings are specified. The file will be created without content. Please check the configuration file ${file}.`
        );
        return `// To generate the margin and padding utilities, check the configuration file ${file}\n$spacing:() !default;`;
      }
    }
  });
  StyleDictionary.registerFormat({
    name: "custom/properties-color",
    formatter: (dictionary) => {
      try {
        const property = checkStencilUtils(dictionary.properties,'color');
        let key = Object.keys(property.color);
        let customProperties = "\n";
        key.forEach((item) => {
          value = property.color[item];
          customProperties += `--${item}:${value.value};\n`;
        });
        return `/// Color variables defined in the ${file} file\n///@group colors\n:root{${customProperties}};`;
      } catch(e) {
        utils.messages.error(
          `${symbols.error}  No color settings have been specified. The file will be created without content. Please check the configuration file ${file}.`
        );
        return `// To generate the custom properties of colors, check the configuration file ${file}`;
      }
    }
  });

  StyleDictionary.registerFormat({
    name: "custom/properties-typography",
    formatter: (dictionary) => {
      try {
        const property = checkStencilUtils(dictionary.properties,'typography');
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
        const property = checkStencilUtils(dictionary.properties,'typography');
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
        utils.generateIconFont(icon,data);
      } catch (error) {
        utils.messages.error(
          `${symbols.error}  No iconic font settings have been specified. The file will be created without content. Please check the configuration file ${file}.`
        );
        return `// To generate the iconic font, check the configuration file ${file}`;
      }
    }
  });

  StyleDictionary.buildAllPlatforms();
};
