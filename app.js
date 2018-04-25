let nconf = require("nconf");
let express = require("express");
    let app = express();

nconf.argv()
    .env()
    .file({ file: './config.json' });

require("./boot")(app);
require("./routes")(app);

let port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('App listening on port ' + port);
});