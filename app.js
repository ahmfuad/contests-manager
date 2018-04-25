let nconf = require("nconf");
let express = require("express");
    let app = express();

nconf.argv()
    .env()
    .file({ file: './config.json' });

require("./boot")(app);
require("./routes")(app);

app.listen(3000, function () {
    console.log('App listening on port 3000');
});