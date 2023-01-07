const [fs, colors, webfont, symbols, css] = [require("fs"), require("colors"), require("webfont").default, require("log-symbols"), require("./postcss")
];

module.exports.messages = {
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

module.exports.createFile = (folder, file, data) => {
  try {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
      fs.writeFileSync(`${folder}/${file}`, data, () => true);
    } else {
      fs.writeFileSync(`${folder}/${file}`, data, () => true);
    }
  } catch (error) {
    this.messages.error(error);
  }
};

module.exports.buildPlatforms = (configuration) => {
  const platformsInput = configuration.platforms ? configuration.platforms : ['scss'];
  const ouput = (folder) =>
    configuration.customPath
      ? `${process.cwd()}/${configuration.customPath}/library/${folder}/`
      : `${process.cwd()}/library/${folder}/`;
  const platforms = {
    scss: {
      transformGroup: "scss",
      buildPath: ouput("web"),
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
      buildPath: ouput("android"),
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
      buildPath: ouput("ios"),
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
  };

  const listPlatforms = () => {
    let listPlatforms = {};
    platformsInput.forEach((item) => listPlatforms[item] = platforms[item]);
    return listPlatforms;
  };



  return {
    platforms: listPlatforms()
  };
};

module.exports.buildCore = (path) => {

  const paths = [
    {
      path: `${__dirname.slice(
        0,
        __dirname.length - 10
      )}/library/web/utilities/`,
      name: `_grid.scss`
    },
    {
      path: `${__dirname.slice(
        0,
        __dirname.length - 10
      )}/library/web/utilities/`,
      name: `_spacing.scss`
    },
    {
      path: `${__dirname.slice(
        0,
        __dirname.length - 10
      )}/library/web/utilities/`,
      name: `utilities.scss`
    },
    {
      path: `${__dirname.slice(0, __dirname.length - 10)}/library/web/tools/`,
      name: `_animations.scss`
    },
    {
      path: `${__dirname.slice(0, __dirname.length - 10)}/library/web/tools/`,
      name: `_functions.scss`
    },
    {
      path: `${__dirname.slice(0, __dirname.length - 10)}/library/web/base/`,
      name: `_fonts.scss`
    },
    {
      path: `${__dirname.slice(0, __dirname.length - 10)}/library/web/base/`,
      name: `_reset.scss`
    },
    {
      path: `${__dirname.slice(0, __dirname.length - 10)}/library/web/base/`,
      name: `base.scss`
    },
    {
      path: `${__dirname.slice(
        0,
        __dirname.length - 10
      )}/library/web/settings/`,
      name: `_general.scss`
    },
    {
      path: `${__dirname.slice(
        0,
        __dirname.length - 10
      )}/library/web/settings/`,
      name: `settings.scss`
    },
    {
      path: `${__dirname.slice(0, __dirname.length - 10)}/library/web/tools/`,
      name: `tools.scss`
    },
    {
      path: `${__dirname.slice(0, __dirname.length - 10)}/library/web/tools/`,
      name: `_rem.scss`
    },
    {
      path: `${__dirname.slice(
        0,
        __dirname.length - 10
      )}/library/web/utilities/`,
      name: `utilities.scss`
    },
    {
      path: `${__dirname.slice(0, __dirname.length - 10)}/library/web/`,
      name: `abstracts.scss`
    }
  ];
  paths.forEach((file) => {
    const finalPath = path
      ? `${file.path.replace(
        __dirname.slice(0, __dirname.length - 10),
        process.cwd() + "/" + path
      )}`
      : file.path.replace(
        __dirname.slice(0, __dirname.length - 10),
        process.cwd()
      );

    let data = fs
      .readFileSync(`${file.path}${file.name}`, () => true)
      .toString();

    this.createFile(finalPath, file.name, data);
  });
};


module.exports.generateIconFont = async (svg, data) => {
  const { value, input, output } = svg;
  webfont({
    files: `${process.cwd()}/${input}/*.svg`,
    fontName: value,
    template: "scss",
    dest: `${process.cwd()}/library/web/settings/_icons.scss`,
    templateClassName: "icon",
    templateFontPath: "#{$font-path}",
    fontWeight: 800
  })
    .then((result) => {
      const file = (folder, file, data) => {
        this.createFile(folder, file, data);
        console.log(`${symbols.success}  ${folder}/${file}`);
      };
      const pathFile = data.configuration.customPath
        ? `${process.cwd()}/${data.configuration.customPath
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
      this.messages.print("Settings creation process finished");
    })
    .catch((e) => {
      console.log(e);
      this.messages.error(
        `\nCheck the configuration file, you have established the following information:\n\n${JSON.stringify(
          svg,
          null,
          2
        )}`
      );
      this.createFile(
        `${process.cwd()}/library/web/utilities`,
        `_icons.scss`,
        `// To generate the iconic font, check the configuration file ${file}`
      );
    });

};