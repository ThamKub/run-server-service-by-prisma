const express = require("express");
const cors = require("cors");
const runnerRoutes = require("./routes/runner.routes.js");
//const runRoutes = require("./routes/run.routes.js");
 
require("dotenv").config();
 
const app = express(); // สร้าง Web Server ด้วย Express
 
const port = process.env.PORT || 5555; // กำหนด Port ที่ Web Server จะใช้
 
app.use(cors()); // ใช้งาน cors สำหรับการทำงานร่วมกับ Web Server อื่นๆ
app.use(express.json()); // ใช้งาน express.json() สำหรับการทำงานร่วมกับ JSON
 
app.use("/runner", runnerRoutes); // กำหนดเส้นทางการเข้าถึง resouces ใน Web Server
app.use("/run", runRoutes); // กำหนดเส้นทางการเข้าถึง resouces ใน Web Server
 
// เขียนคำสั่งเพื่อเทส เพื่อให้ client/user เข้าถึง resouces ใน Web Server
app.get("/", (req, res) => {
  res.js({
    message: "Welcome to backend run server service",
  });
});
 
// คำสั่งที่ใช้เปิด Web Server เพื่อให้ client/user เข้าถึง resouces ใน Web Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});