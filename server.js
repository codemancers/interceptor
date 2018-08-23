const express = require("express");
const helmet = require("helmet");

const app = express();
const router = express.Router();

app.use(helmet());
app.use(express.static(__dirname + "/dist"));

router.get("/", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});

router.get("/faq", (req, res) => {
  res.sendFile(__dirname + "/dist/faq.html");
});

app.use("/", router);

app.use((req, res, next) => {
  res.status(404);
  res.redirect("/"); //redirect to / on 404's
});

const server = app.listen(3000, () => {
  const {address, port} = server.address();
  console.log(`Interceptor app listening at http://${address}:${port}`);
});
