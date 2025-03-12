const express = require("express")
const app = express();
const db = require("./db");


app.use(express.json());
let port = 3000;
const model = require("./models/index");

const personRoutes = require("./routes/person");
const menuRoutes = require("./routes/menu");
const productRoutes = require("./routes/product");

app.use("/persons",personRoutes);
app.use("/menu",menuRoutes),
app.use("/product",productRoutes)

 
app.get("/homePage",(req,res)=>{
  res.send("hey");
})



app.listen(port, () => {
  console.log("my server is ready", port);
});
