const express = require("express")
const app = express();
const db = require("./db");
const routes = require("./routes")
let port = 3000;


app.use(express.json());

app.use("/api", routes);




app.listen(port, () => {
  console.log("my server is ready", port);
});
