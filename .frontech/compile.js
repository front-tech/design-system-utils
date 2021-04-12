const fs = require('fs');
const Handlebars = require('handlebars');
const utils = require('./utils');
function render(filename, data)
{
let docs = {posts:data}
  let source   = fs.readFileSync(filename,'utf8').toString();
  Handlebars.registerHelper('isMixin',(value) => {
    return value === 'mixin'
  })
  Handlebars.registerHelper('isDefined',(value) => {
    if (typeof value === "object") return value.length > 0;
    return value !== undefined;
  })
  Handlebars.registerHelper('isCSS',(value) => {
    return value === 'css';
  })
  let template = Handlebars.compile(source);
  let output = template(docs);
  return output;
}

let data = JSON.parse(fs.readFileSync(`${__dirname.slice(0,__dirname.length - 10)}/doc.json`, 'utf8'));

let result = render('./theme/views/layouts/main.hbs', data);

utils.createFile('docs','index.html',result);