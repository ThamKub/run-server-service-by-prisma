// จัดการเรื่อง อัปโหลดไฟล์ โดย multer
// จัดการเรื่องการทํางาน CRUD กับฐานข้อมูล โดย prisma

// require package ที่ต้องใช้ในการอัปโหลดไฟล์
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: 'did8bqqoj',
    api_key: '537651755757621',
    api_secret: 'nQtwP7OupB7Aq7DDL0Iwwsb3Wfk'
})


// require package ที่ต้องใช้ในการทํางานกับฐานข้อมูล
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//สร้างส่วนของการอัปโหลดไฟล์ด้วย multer ทำ 2 ขั้นตอน------------------------
//1. กําหนดตําแหน่งที่จะอัปโหลดไฟล์ และชื่อไฟล์
const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        const newFileName = 'runner_' + Math.floor(Math.random() * Date.now())
 
        return {
            folder: 'images/runner', // โฟลเดอร์ใน Cloudinary
            allowed_formats: ['jpg', 'png'], // กำหนดประเภทไฟล์
            public_id: newFileName
        }
    },
});

//2. ฟังก์ชันอัปโหลดไฟล์
exports.uploadRunner = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const mimeType = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(path.extname(file.originalname));
        if (mimeType && extname) {
            return cb(null, true);
        }
        cb('Give proper files formate to upload');
    }
}).single('runnerImage');

//สร้างฟังก์ชัน Create/Insert เพื่อเพิ่มข้อมูลลงตารางในฐานข้อมูล----------------
exports.createRunner = async (req, res) => {
    try{
        //เอาข้อมูลที่ส่งมาจาก client/user เพิ่มลงตารางในฐานข้อมูล
        const result = await prisma.runner_tb.create({ //.create คือ การเพิ่ม
            data: {
                runnerName: req.body.runnerName,
                runnerUsername: req.body.runnerUsername,
                runnerPassword: req.body.runnerPassword,
                runnerImage: req.file ? req.file.path : "",
            }
        });

        //ส่งผลการทำงานกลับไปยัง client/user
        res.status(201).json({
            message: 'Insert data successfully',
            data: result
        });
    }catch(err){
        res.status(500).json({ message: `ERROR:  ${err}` });
    }
}

exports.checkLoginRunner = async (req, res) => {
    try{
        const result = await prisma.runner_tb.findFirst({ //.create คือ การเพิ่ม
            where: {
                runnerUsername: req.params.runnerUsername,
                runnerPassword: req.params.runnerPassword,
            }
        });

        if(result){
            res.status(200).json({
                message: 'username and password is correct',
                data: result
            });
        }else{
            res.status(200).json({
                message: 'username and password is incorrect',
                data: result
         });
        }
    }catch(err){
        res.status(500).json({ message: `ERROR:  ${err}` });
    }
}