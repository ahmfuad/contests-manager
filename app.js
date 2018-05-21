var path = require('path');
let nconf = require("nconf");
let express = require("express");
    let app = express();

nconf.argv()
    .env()
    .file({ file: './config.json' });

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.sendfile('./views/layout.html');
});

app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

global.__basedir = __dirname;
global.__databaseUri = process.argv.indexOf("--local") > -1 ? nconf.get("database:uri-local") : nconf.get("database:uri");

require("./boot")(app);
require("./routes")(app);

let port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('App listening on port ' + port);
});