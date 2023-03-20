
const [fs, utils, symbols, route] = [
  require('fs'),
  require("./utils"),
  require("log-symbols"),
  require("path")
];
const { createFile } = utils;
const setCreationTimeFile = () => `/**\n* Do not edit directly\n* Generated on ${new Date().toUTCString()}\n*/\n`;

const buildCore = (path) => {

  const root = __dirname.replace('.frontech', '');
  const paths = [
    {
      root,
      path: route.resolve(root, `library/scss/utilities/`),
      name: `_grid.scss`
    },
    {
      root,
      path: route.resolve(root, `library/scss/utilities/`),
      name: `utilities.scss`
    },
    {
      root,
      path: route.resolve(root, `library/scss/tools/`),
      name: `_animations.scss`
    },
    {
      root,
      path: route.resolve(root, `library/scss/tools/`),
      name: `_functions.scss`
    },
    {
      root,
      path: route.resolve(root, `library/scss/base/`),
      name: `_fonts.scss`
    },
    {
      root,
      path: route.resolve(root, `library/scss/base/`),
      name: `_reset.scss`
    },
    {
      root,
      path: route.resolve(root, `library/scss/base/`),
      name: `base.scss`
    },
    {
      root,
      path: route.resolve(root, `library/scss/tools/`),
      name: `tools.scss`
    },
    {
      root,
      path: route.resolve(root, `library/scss/tools/`),
      name: `_rem.scss`
    },
    {
      root,
      path: route.resolve(root, `library/scss/utilities/`),
      name: `utilities.scss`
    },
    {
      root,
      path: route.resolve(root, `library/scss/`),
      name: `abstracts.scss`
    }
  ];
  const files = paths.map((file) => {
    const { name } = file;
    const origin = route.resolve(route.resolve(process.cwd(), path), file.path.replace(file.root, ''))
    const data = `${setCreationTimeFile()}${fs
      .readFileSync(route.resolve(file.path, file.name))
      .toString()}`;
    return {
      origin,
      name,
      data
    }
  });
  const _nameSettingsPartials = fs.readdirSync(route.resolve(process.cwd(), path, 'library/scss', 'settings'))
    .filter(file => file.includes('_'));
  const _settingsPartials = [..._nameSettingsPartials]
    .map(file => {
      const origin = route.resolve(route.resolve(process.cwd(), path, `library/scss/`, 'settings'))
      const data = `${setCreationTimeFile()}${fs
        .readFileSync(route.resolve(origin, file))
        .toString()}`;
      return {
        origin,
        name: file,
        data
      }
    });
  const _settingsPartialsRequired = [
    {
      origin: route.resolve(route.resolve(process.cwd(), path, `library/scss/`, 'settings')),
      name: 'settings.scss',
      data: `${setCreationTimeFile()}${[..._nameSettingsPartials, '_general.scss']
        .map(file => file.replace('_', '').replace('.scss', ''))
        .reduce((acc, current) => (acc += `@forward '${current}';\n`), '')}`,
      force: true
    },
    {
      origin: route.resolve(route.resolve(process.cwd(), path, `library/scss/`, 'settings')),
      name: '_general.scss',
      data: `${setCreationTimeFile()}/// Variable path by default of the sources defined in the .frontech.json file.\n/// To modify the path, simply set the variable in the import as follows: @use '~@front-tech/design-systems-utils/library/web/abstracts' with ($font-path:'public/assets/fonts/');\n/// @group fonts\n$font-path: "${path}/fonts/" !default;\n/// Variable that defines the reference unit in order to transform px into rem. By default 16px. To modify the size, simply set the variable in the import as follows: @use '~@front-tech/design-systems-utils/library/web/abstracts' with ($rem-baseline: 10px);\n/// @group rem\n$rem-baseline: 16px !default;\n/// Variable that transforms pixels into rem for browsers that support rem as well as if they do not. By default false.\n/// @group rem\n$rem-fallback: false !default;\n/// Variable that provides compatibility with Internet Explorer 9 and does not convert pixels into rem, as it is not compatible. By default, it is false.\n/// @group rem\n$rem-px-only: false !default;`,
      force: true
    }
  ]
  Promise.all([...files, ..._settingsPartials, ..._settingsPartialsRequired]
    .map(({ origin, name, data, force = false }) => createFile(origin, name, data, force)));
};

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
          /* transforms: ['attribute/font'], */
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
              format: "custom/variables",
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
              format: "custom/spacing",
              filter: {
                type: "spacing"
              }
            },
            {
              destination: "settings/_opacity.scss",
              format: "css/variables",
              filter: {
                type: "opacity"
              }
            },
            {
              destination: "settings/_border.scss",
              format: "custom/variables",
              filter: "isBorder"
            },
          ]
        },
      }
    }
  );

  StyleDictionary.registerFilter({
    name: 'isBorder',
    matcher: function (token) {
      return token.attributes.category.includes('border');
    }
  })

  StyleDictionary.registerFormat({
    name: 'custom/variables',
    formatter: ({ dictionary: { allTokens }, options }) => {

      const _tokens = allTokens.reduce((tokens, prop) => {
        const { name, value } = prop;
        const _tokenCompositionLenght = Object.values(value).length === 1;
        const isString = typeof value === 'string';

        let customVar = '';
        let customVarAdvanced = '';

        if (!isString) {
          if (_tokenCompositionLenght) {
            customVarAdvanced += `--${name}: ${Object.values(value).map((item) => item).join('')};\n`
          } else {
            customVarAdvanced += Object.entries(value)
              .reduce((acc, [key, _value]) => (acc += `--${name}-${key}: ${_value};\n`), '')
          }
        }
        customVar += `--${name}:${value};\n`;
        return tokens += isString ? customVar : customVarAdvanced;
      }, '');

      return `:root{\n${_tokens}}`
    }
  });

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
      try {
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

        /* console.log(allTokens); */
        return allTokens.reduce((fontList, prop) => {
          const { attributes, name } = prop;
          const { type, item } = attributes;
          const attrs = ['family', 'weight'];
          const sizes = ['xs', 'sm', 'md', 'lg'];
          if (attrs.includes(type)) {
            console.log(prop);
            if (type === 'family' && item) {
              if (!fontList[item]) fontList[item] = {}
            }
            /* if (!fontList[type]) fontList[type] = {}
            console.log(type); */
          }
          return fontList;
        }, []).join('\n');
      } catch (error) {
        console.error(error)
      }
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
    name: "custom/spacing",
    formatter: ({ dictionary: { allTokens } }) => {
      const spacing = allTokens.reduce((acc, cur) => {
        const { path, value, name } = cur;
        let spacings = [];

        if (path.some(type => type.includes('inset')) && /\s/g.test(value)) {
          const values = value.split(' ');
          const spacingCss = values.reduce((acc, cur) => (acc += cur !== 'auto' ? `calc(${cur} - 1px)` : cur), '');
          const item = `--${name}: ${spacingCss};`
          spacings.push(item);
        } else {
          const item = `--${name}: ${value};`
          spacings.push(item);
        }

        acc.push(spacings.map(space => space))

        return acc;
      }, []).join('\n');


      return `${setCreationTimeFile()}:root{\n${spacing}\n}`
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

  StyleDictionary.buildAllPlatforms();
  utils.messages.print("Settings creation process finished");

};

const buildStyleDictionary = (file, path) => {
  utils.messages.print("Settings creation process started");


  utils.messages.warning(
    `\nBased on the information provided in the configuration file ${file} the following files are generated: \n`
  );
  styleDictionary(file, path);
  buildCore(path);
}



module.exports = {
  styleDictionary,
  buildStyleDictionary
}
