const fs = require('fs');

const init = fs.readFileSync('./API/INIT.md').toString();
const readme = fs.readFileSync('./README.md').toString();

const finalReadme = `${init} ${readme}`;

fs.writeFileSync('README.md',finalReadme);