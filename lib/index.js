const { createTokens } = require("../.frontech/builder");
const { config } = require("../.frontech/utils");

const [fs, route, utils] = [
    require("fs"),
    require("path"),
    require("../.frontech/utils"),
    require("../.frontech/styledictionary"),
];

const { messages } = utils;

/**
 * @description This function is used to create architectura tokens
 * @param {{file: String; theme: String; path: String; tokens: String}} args 
 */
const designSystemsUtils = (args) => {
    try {
        const { file, theme, path, tokens } = config(args);
        const existData = fs.existsSync(route.resolve(process.cwd(), tokens));

        if (existData) {
            let data = JSON.parse(
                fs.readFileSync(route.resolve(process.cwd(), tokens)).toString()
            );


            if (theme) {
                data = data[theme] || {};

                createTokens(data, file, path, theme);
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

                    createTokens(dataTokensStudio, file, path, themesTokensStudio);
                }
            }
        } else {
            messages.error(`No ${file} configuration file specified`);
        }
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    designSystemsUtils
}



