const express = require("express");
const app = express();
const router = express.Router();
app.use(express.static(__dirname + "/dist"));

router.get("/", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});

router.get("/faq", (req, res) => {
  res.sendFile(__dirname + "/dist/faq.html");
});

app.use("/", router);

const server = app.listen(3000, () => {
  const {address, port} = server.address();
  console.log(`Interceptor app listening at http://${address}:${port}`);
});
