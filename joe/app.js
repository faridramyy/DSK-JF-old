const express = require("express");
const fileUpload = require("express-fileupload");

var app = express();
app.use(fileUpload());
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("");
});

app.post("/", (req, res) => {
  if (req.files) {
    console.log(req.files);
    const file = req.files.file;
    const filename = file.name;
    const filePath = `${__dirname}/store/${filename}`;

    file.mv(`${__dirname}/store/${filename}`, (err) => {
      if (err) {
        console.log(err);
        res.send("there is an error");
      }
      else{
        res.send('uploaded successfully')
        console.log("File path:", filePath);

      }
    });
  } else {
    console.log("there is no file ");
    res.send("there is no file");
  }
});

app.listen(5000, () => {
  console.log("Shaghal 3la port 5000");
});
