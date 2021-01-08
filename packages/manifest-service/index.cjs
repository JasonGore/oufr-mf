const express = require("express");
const path = require("path");
const app = express();

let manifest = {
  fluentui: "v7.147.0",
  possibleVersions: "v7.147.0,v8.0.0-beta.32"
};

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.get("/r/:remote/:file", (req, res) => {
  const { remote, file } = req.params;
  res.sendFile(path.join(__dirname, `../../${remote}/cdn/${manifest[remote]}/${file}`));
});

app.get("/admin", (req, res) => {
  res.render("admin/index", { manifest: JSON.stringify(manifest, null, 2) });
});

app.post(
  "/admin/manifest",
  express.urlencoded({
    extended: true,
  }),
  (req, res) => {
    manifest = JSON.parse(req.body.manifest);
    res.redirect("/admin");
  }
);

app.listen(7000, () => {
  console.log("manifest service http://localhost:7000");
});
