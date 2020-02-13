var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var cors = require('cors');

app.use(cors());


// Database

var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "articles",
    port: '8889'
})
con.connect(function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('connection done');
    }
})



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

// parse application/json
app.use(bodyParser.json())

// Retrieve users by ID or MAIL
app.post('/posts', function (req, res, next) {
    var title = req.body.title;
    var body = req.body.body;
    console.log(title, body)
    var sql = 'INSERT INTO ?? (title, body) VALUES(?, ?)';
    var inserts = ['articles', title, body];
    sql = mysql.format(sql, inserts);
    con.query(sql, function (err, rows) {
        if (err) throw err;
        res.status(200).json({
            'success': 'added'
        });
    })
});

app.get('/posts', function (req, res, next) {
    var sql = 'SELECT * FROM ?? ORDER BY id DESC';
    var inserts = ['articles'];
    sql = mysql.format(sql, inserts);
    con.query(sql, function (err, result) {
        if (err) throw err;
        if (result.length > 0) {
            res.status(200).json({
                result
            });
        } else {
            res.status(200).json({
                'number': result.length
            });
        }
    });
});



app.put('/posts', function (req, res, next) {
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    console.log(id, title, body);
    var sql = 'UPDATE ?? SET title = ?, body = ? WHERE id = ?';
    var inserts = ['articles', title, body, id];
    sql = mysql.format(sql, inserts);
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.status(200).json({
            result
        });

    });
});

app.delete('/posts', function (req, res, next) {
    var id = req.body.id;
    console.log(id);
    var sql = 'DELETE FROM ?? WHERE id = ?';
    var inserts = ['articles', id];
    sql = mysql.format(sql, inserts);
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.status(200).json({
            'delete': 'success'
        });

    });
});


// Error 404
app.use(function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
        'error': 'Url not found'
    });
});


app.listen(8080); // Error 404