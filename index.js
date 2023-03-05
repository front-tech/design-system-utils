#!/usr/bin/env node

const [fs, route, utils, styleDictionary, argv] = [
  require("fs"),
  require("path"),
  require("./.frontech/utils"),
  require("./.frontech/styledictionary"),
  require('minimist')(process.argv.slice(2)),
];

const { buildArchitecture } = styleDictionary;
const { file, theme, path, tokens } = argv;
const { messages, createFile, generateIconFont, getIcons, buildTokens } = utils;

const existData = fs.existsSync(route.resolve(process.cwd(), tokens));

const createTokens = async (data) => {

  const tokens = await buildTokens(data, file, path);

  if (Object.keys(tokens).includes('icons')) {
    await getIcons(tokens.icons, theme, path)
      .then(async (response) => {
        if (response) {
          messages.print('process transformation icons to icon font started');
          await generateIconFont(path)
            .then((response) => {
              if (response) {
                console.log(
                  `\nIconic font creation based on the svg files in the path ${path}`
                );
                response.forEach(async ({ folder, file, data }, index) => {
                  messages.success(`✔︎ ${folder}/${file}`);
                  createFile(folder, file, data);
                });

                messages.print('process transformation icons to icon font finished');
                buildArchitecture(file, path);
              }
            })
            .catch((error) => {
              console.error(error);
            })
        }
      })
  } else {
    if (tokens) buildArchitecture(file, path);
  }
}

if (existData) {
  let data = JSON.parse(
    fs.readFileSync(route.resolve(process.cwd(), tokens)).toString()
  );


  if (theme) {
    data = data[theme] || {};

    createTokens(data);
  } else {
    const isThemeTokensStudio = '$metadata' in data;
    if (isThemeTokensStudio) {
      const themesTokensStudio = data['$metadata']['tokenSetOrder'];

      const dataTokensStudio = themesTokensStudio
        .map((alias) => ({ tokens: data[alias], alias }))
        .reduce((acc, cur) => {
          const { alias, tokens } = cur;

          if (!acc[alias]) acc[alias] = {};
          acc[alias] = tokens;

          return acc
        }, {});

      createTokens(dataTokensStudio);
    }
  }
} else {
  messages.error(`No ${file} configuration file specified`);
}

