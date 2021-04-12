const [express, exphbs, sassdoc, fs, path] = [
  require("express"),
  require("express-handlebars"),
  require("sassdoc"),
  require("fs"),
  require("path")
];
require('dotenv').config();

const app = express();
const port = 'http://jsamper92-github.io/utility-sass' | 3000;
const publicPath = path.resolve(__dirname, "public");

app.engine(
  "hbs",
  exphbs({
    helpers: require("./handlers/handlebars"),
    defaultLayout: "",
    extname: ".hbs"
  })
);
 
app.set("view engine", "hbs");
app.use(express.static(publicPath));
app.listen(port, () => {
  console.log(`The web server has started on port ${port}`);
});

const groupData = (array) => {
  return array.reduce((acc, item) => {
    let { group } = item;

    return { ...acc, [group]: [...(acc[group] || []), item] };
  }, {});
};

const createImportsUtilities = () => {
  let imports = "";
  const utilitiesPath = `${__dirname}//public/styles/scss/utilities/utilities.scss`;
  imports += `@use 'grid';\n@use 'animations';`;
  
  fs.writeFileSync(utilitiesPath,imports, () => true);
};

const createKeyFrames = (array) => {
  let data = "";
  array
    .filter((item) => item.group[0] === "animations")
    .map((keyframe) =>
      keyframe.context.type === "mixin"
        ? (data += `${keyframe.context.code} `)
        : null
    );
  fs.writeFileSync(
    `${__dirname}/public/styles/scss/utilities/_animations.scss`,
    data,
    () => true
  );
  createImportsUtilities();
}; 

sassdoc
  .parse(`${__dirname}/../library/web/**/*.scss`, { verbose: true })
  .then(function (data) {
    app.get("/", (req, res) => {
      fs.writeFile('doc.json',JSON.stringify(groupData(data),null,2),() => true);
      createKeyFrames(data);
        res.render(__dirname + "/views/layouts/main", {
          posts: groupData(data)
        });
    });
  });
    