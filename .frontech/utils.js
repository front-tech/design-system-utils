const [fs, colors] = [require("fs"), require("colors")];

module.exports.errorConsole = (string) => console.log(colors.red(string));
module.exports.warningConsole = (string) => console.log(colors.yellow(string));
module.exports.successConsole = (string) => console.log(colors.green(string));

module.exports.createFile = (folder, file, data) => {
  try {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
      fs.writeFileSync(`${folder}/${file}`, data, () => true);
    } else {
      fs.writeFileSync(`${folder}/${file}`, data, () => true);
    }
  } catch (error) {
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




