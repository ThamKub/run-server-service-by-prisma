const express = require('express');

const runnerController = require('./../controllers/runner.controller');

const router = express.Router();

router.post('/',runnerController.uploadRunner, runnerController.addRunner); //เพิ่มข้อมูลนักวิ่ง

module.exports = router;