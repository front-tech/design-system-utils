const [fs, route, colors, translateTokens, svgSpreact, webfont, figma] = [
  require("fs"),
  require('path'),
  require("colors"),
  require("./tokens"),
  require('svg-spreact'),
  require("webfont").default,
  require('figma-icons-tokens'),
];

const { tokensResolved } = translateTokens;
const { figmaIconsTokens } = figma;


const messages = {
  error: (string) => console.log(colors.red(string)),
  warning: (string) => console.log(colors.yellow(string)),
  success: (string) => console.log(colors.green(string)),
  print: (message) => {
    console.log("");
    console.log("-".repeat(message.length));
    console.log(message.toUpperCase());
    console.log("-".repeat(message.length));
    console.log("");
  }
}
const handleCreateFile = (folder, file, data, force) => {

  return new Promise((resolve, reject) => {
    const _file = route.resolve(folder, file);
    if (fs.existsSync(_file)) {
      const _previewFile = fs.readFileSync(_file, (err) => {
        if (err) {
          console.error(err)
          reject(err);
        }
      }).toString();
      const isDiff = JSON.stringify(data) === JSON.stringify(_previewFile);
      if (isDiff || force) {
        fs.writeFile(route.resolve(folder, file), data, (err) => {
          if (err) {
            console.error(err)
            reject(err);
          } else {
            resolve(`File ${_file} created successfully`)
          }
        });
      }
    } else {
      fs.writeFile(route.resolve(folder, file), data, (err) => {
        if (err) {
          console.error(err)
          reject(err);
        } else {
          resolve(`File ${_file} created successfully`)
        }
      });
    }
  })

}

const createFile = (folder, file, data, force = false) => {
  return new Promise(async (resolve, reject) => {
    try {

      if (!fs.existsSync(folder)) {
        fs.mkdir(folder, { recursive: true }, async (err) => {
          if (err) {
            console.error(err);
          } else {
            const response = await handleCreateFile(folder, file, data, force);
            resolve(response);
          }
        });
      } else {
        const response = await handleCreateFile(folder, file, data, force);
        resolve(response);
      }
    } catch (error) {
      messages.error(error);
      reject(error);
    }
  })
};

const buildCore = (path) => {


  const root = __dirname.replace('.frontech', '');
  const paths = [
    {
      root,
      path: route.resolve(root, `library/web/utilities/`),
      name: `_grid.scss`
    },
    {
      root,
      path: route.resolve(root, `library/web/utilities/`),
      name: `utilities.scss`
    },
    {
      root,
      path: route.resolve(root, `library/web/tools/`),
      name: `_animations.scss`
    },
    {
      root,
      path: route.resolve(root, `library/web/tools/`),
      name: `_functions.scss`
    },
    {
      root,
      path: route.resolve(root, `library/web/base/`),
      name: `_fonts.scss`
    },
    {
      root,
      path: route.resolve(root, `library/web/base/`),
      name: `_reset.scss`
    },
    {
      root,
      path: route.resolve(root, `library/web/base/`),
      name: `base.scss`
    },
    {
      root,
      path: route.resolve(root, `library/web/settings/`),
      name: `_color.scss`
    },
    {
      root,
      path: route.resolve(root, `library/web/settings/`),
      name: `_typography.scss`
    },
    {
      root,
      path: route.resolve(root, `library/web/settings/`),
      name: `_general.scss`
    },
    {
      root,
      path: route.resolve(root, `library/web/settings/`),
      name: `_general.scss`
    },
    {
      root,
      path: route.resolve(root, `library/web/settings/`),
      name: `settings.scss`
    },
    {
      root,
      path: route.resolve(root, `library/web/tools/`),
      name: `tools.scss`
    },
    {
      root,
      path: route.resolve(root, `library/web/tools/`),
      name: `_rem.scss`
    },
    {
      root,
      path: route.resolve(root, `library/web/utilities/`),
      name: `utilities.scss`
    },
    {
      root,
      path: route.resolve(root, `library/web/`),
      name: `abstracts.scss`
    }
  ];
  paths.forEach((file) => {

    const origin = route.resolve(route.resolve(process.cwd(), path), file.path.replace(file.root, ''))
    const data = fs
      .readFileSync(route.resolve(file.path, file.name))
      .toString();

    createFile(origin, file.name, data);
  });
};

const generateIconFont = async (path) => {
  return new Promise(async (resolve, reject) => {
    const files = route.resolve(process.cwd(), path, 'fonts', 'icomoon');
    const assets = route.resolve(process.cwd(), path, 'images', 'icons');
    const utilities = route.resolve(process.cwd(), path, 'library/scss/utilities');
    const dest = route.resolve(process.cwd(), path, 'library/scss/settings/_icons.scss');

    await webfont({
      dest,
      files: `${assets}/*.svg`,
      fontName: 'icomoon',
      template: "scss",
      templateClassName: "icon",
      templateFontPath: "#{$font-path}",
      fontWeight: 800
    })
      .then((result) => {
        const _files = [
          {
            folder: utilities,
            file: `_icons.scss`,
            data: `@use '../settings/general' as *;\n${result.template}`
          },
          {
            folder: files,
            file: `${result.config.fontName}.svg`,
            data: result.svg
          },
          {
            folder: files,
            file: `${result.config.fontName}.ttf`,
            data: result.ttf
          },
          {
            folder: files,
            file: `${result.config.fontName}.eot`,
            data: result.eot
          }
        ]

        resolve(_files);
      })
      .catch((e) => {
        console.log(e);
        messages.error(
          `\nCheck the configuration file, you have established the following information:\n\n${JSON.stringify(
            svg,
            null,
            2
          )}`
        );

        createFile(
          `${process.cwd()}/library/scss/utilities`,
          `_icons.scss`,
          `// To generate the iconic font, check the configuration file ${file}`
        );
        reject('error');
      });
  })

};

const buildTokens = (tokens, file, path) => {
  return new Promise(async (resolve) => {
    const _tokens = await tokensResolved(tokens, file, path);

    if (_tokens) {
      const _path = route.resolve(__dirname, '..', 'build', 'tokens');
      const _file = await createFile(_path, 'tokens-parsed.json', JSON.stringify(_tokens), true);
      if (_file) resolve(_tokens)
    }
  })

}

const generateSvgSprites = (icons, path) => {
  return new Promise((resolve) => {
    try {
      const _icons = icons.map(({ data }) => data);
      const names = icons.map(({ name }) => name);
      const processId = n => `${names[n]}`;

      svgSpreact(_icons, { tidy: true, optimize: true, processId })
        .then(async ({ defs }) => {
          const files = await createFile(route.resolve(path, 'images/sprites'), 'sprites.svg', defs);

          if (files) {
            messages.print('process import icons tokens finished');
            messages.print('icon sprit svg process started');
            messages.success(`✔︎ file ${path}/images/sprites/sprites.svg successfully created`);
            messages.print('icon sprit svg process finished');
            resolve(true);
          }
        })
        .catch(error => console.error(error))
    } catch (error) {
      console.error(error)
    }
  })
}

const getIcons = async (data, theme, path) => {
  return new Promise(async (resolve, reject) => {
    messages.print('process import icons tokens started');

    await figmaIconsTokens({ theme, path: route.resolve(path, 'images/icons'), file: null, key: 'icons', data })
      .then(async (response) => {
        const _iconsPath = route.resolve(process.cwd(), path, 'images', 'icons');
        const existIcons = fs.existsSync(_iconsPath);

        if (!existIcons) {
          generateSvgSprites(response, path);
        } else {
          const icons = fs.readdirSync(_iconsPath)
            .map(file => {
              const _file = route.resolve(_iconsPath, file);
              const data = fs.readFileSync(_file).toString();
              const name = file;
              return { data, name };
            })
            .map(({ name, data }) => {
              if (response.find(file => file.name === name)) {
                const _data = response.filter(file => file.name === name)[0].data;
                return {
                  name,
                  data: _data
                }
              }

              return {
                name,
                data
              }
            });

          const sprite = await generateSvgSprites(icons, path);
          if (sprite) resolve(true);
        }
      })
      .catch(error => {
        console.error(error)
      })

  })
}

module.exports = {
  getIcons,
  messages,
  buildCore,
  createFile,
  buildTokens,
  generateIconFont,
  generateSvgSprites
}