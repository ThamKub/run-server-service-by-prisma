const express = require('express');
const cors = require('cors');
const runnerRouter = require('./routes/runner.route');
const runRouter = require('./routes/run.route');

require('dotenv').config();

const http = require('http');

const app = express(); //สร้าง Web Server

const PORT = process.env.PORT || 5555; //เรียกใช้ค่า PORT จาก .env

//ใช้ตัว middleware ในการจัดการ
//การเรียกใช้งานข้าม domain
app.use(cors());
//ข้อมูล JSON จาก client/user
app.use(express.json());
//เส้นทาง
app.use('/runner',runnerRouter);
app.use('/run',runRouter);
// การเข้าถึงไฟล์ รูปภาพ
app.use('/images/runner', express.static('images/runner'));
app.use('/images/run', express.static('images/run'));

//เขียนคำสั่งเพื่อเทส เพื่อให้ client/user เข้าถึง resource ใน server
app.get('/', (req, res) => {
    res.json({
        message: `Welcome to backend run server service`
    })
})

//คำสั่งที่ใช้เปิด server เพื่อให้ client/user เข้าถึง resource ใน server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} .....`);
})