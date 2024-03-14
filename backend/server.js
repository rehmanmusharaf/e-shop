const app = require("./app.js");
require("dotenv").config();

process.on("uncaughtException", (err) => {
  console.log(`Error : ${err}`);
});
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "backend/.env",
  });
}

app.listen(process.env.PORT, () => {
  console.log(`server Is Listening ON Port ${process.env.PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log("ERRO: ", err.message);
  console.log("Shutting Down The Serevr ");
  server.close(() => {
    process.exit(1);
  });
});
