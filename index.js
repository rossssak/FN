const http = require('http');
const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors')
const bodyParser = require('body-parser');
const hostname = '127.0.0.1';
const port = 3000;
const fs = require('fs');

const { readFileSync } = require("fs");
var path = require("path");
let cer_part = path.join(process.cwd(), 'isrgrootx1.pem');

const connection = mysql.createConnection({
    host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
    user: '4StYUf1kzqUPEMK.root',
    password:"p7J4nM3OZkTlgCD2",
    database: 'imi_his_db',
    port:4000,
    ssl:{
      ca:fs.readFileSync(cer_part)
    }
});

app.use(cors())
app.use(express.json())
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

app.get('/', (req, res) => {
    res.json({
        "Name":"project lab 4",
        "Author":"Charoenporn Bouyam",
        "APIs":[
            {"api_name":"/getDoctors/","method":"get"},
            {"api_name":"/getDoctor/:id","method":"get"},
            {"api_name":"/addDoctor/","method":"post"},
            {"api_name":"/editDoctor/","method":"put"}
        ]
    });
});

app.get('/getDoctors', (req, res) => {
    let sql = 'SELECT * FROM doctor';
    connection.query(sql, function(err, results, fields) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

app.get('/getdoctor/:id', (req, res) => {
    let id = req.params.id;
    let sql = 'SELECT * FROM doctor WHERE doctor_id = ?';
    connection.query(sql, [id], function(err, results, fields) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

app.post('/addDoctor', (req, res) => {
    const { doctor_name, doctor_phone, doctor_status } = req.body;
    let sql = 'INSERT INTO doctor (name, telephone, status) VALUES (?, ?, ?)';
    connection.query(sql, [doctor_name, doctor_phone, doctor_status], function(err, results) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: "เพิ่มข้อมูลแพทย์สำเร็จ",
            data: results
        });
    });
});

app.put('/editDoctor', (req, res) => {
    const { doctor_id, doctor_name, doctor_phone, doctor_status } = req.body;
    let sql = 'UPDATE doctor SET name = ?, telephone = ?, status = ? WHERE doctor_id = ?';
    connection.query(sql, [doctor_name, doctor_phone, doctor_status, doctor_id], function(err, results) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: "แก้ไขข้อมูลแพทย์สำเร็จ",
            data: results
        });
    });
});