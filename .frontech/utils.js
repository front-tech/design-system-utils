const [fs, colors] = [require("fs"), require("colors")];

module.exports.errorConsole = (string) => console.log(colors.red(string));
module.exports.warningConsole = (string) => console.log(colors.yellow(string));
module.exports.successConsole = (string) => console.log(colors.green(string));

module.exports.createFile = (folder, file, data) => {
  try {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
      console.log(folder);
      fs.writeFileSync(`${folder}/${file}`, data, () => true);
    } else {
      fs.writeFileSync(`${folder}/${file}`, data, () => true);
    }
  } catch (error) {
    console.log(error);
    this.errorConsole("Ha ocurrido un error", error);
  }
};

module.exports.printMessage = (message) => {
  console.log("");
  console.log("-".repeat(message.length));
  console.log(message.toUpperCase());
  console.log("-".repeat(message.length));
  console.log("");
};

module.exports.buildPlatforms = (configuration) => {
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
    configuration.platforms.forEach((item) => {
      listPlatforms[item] = platforms[item];
    });
    return listPlatforms;
  };

  return {
    source: [".frontech.json"],
    platforms: listPlatforms()
  };
};

module.exports.buildChore = (path) => {
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