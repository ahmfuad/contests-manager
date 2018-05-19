let nconf = require("nconf");
let express = require("express");
    let app = express();

nconf.argv()
    .env()
    .file({ file: './config.json' });


global.__basedir = __dirname;
global.__databaseUri = process.argv.indexOf("--local") > -1 ? nconf.get("database:uri-local") : nconf.get("database:uri");

require("./boot")(app);
require("./routes")(app);

let port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('App listening on port ' + port);
});