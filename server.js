import connectDB from "./config/dbConnect.js";
import app from "./src/app.js";
import http from "http";

const PORT = process.env.PORT || 8000;
connectDB(process.env.MONGO_URL);
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log("(----------------------------------------)");
  console.log("|          Server Started at...          |");
  console.log("|          http://localhost:" + PORT + "         |");
  console.log("(----------------------------------------)");
});
