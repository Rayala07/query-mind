import app from "./src/app.js";
import "dotenv/config";
import connectDB from "./src/config/db.js";
import { testAi } from "./src/services/ai.service.js";

const port = process.env.PORT || 5000;

connectDB();

app.listen(port, () => {
  console.log(`Server running on PORT ${port}`);
});