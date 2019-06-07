const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const config = require('./config');
const ordersRouter = require('./routes/orders');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/', express.static(__dirname + '/public/apidoc'));

// MySQL connection
let mysqlConfig = {
  host            : process.env.DATABASE_HOST,
  port            : process.env.MYSQL_PORT,
  user            : process.env.MYSQL_USER,
  password        : process.env.MYSQL_PASSWORD,
  database        : process.env.MYSQL_DATABASE
};
let connection = mysql.createConnection(mysqlConfig);

connection.connect((err) => {
	if (err) {
		return console.error("MySQL connection error: " + err.stack);
	}
  console.log("MySQL connected as id: " + connection.threadId);
});

app.use((req, res, next) => {
  req.connection = connection;
  next();
});

app.use('/orders', ordersRouter);

app.listen(config.server.port, () => {
	console.log("App listening on port: " + config.server.port);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received. Closing http server ...');
  server.close(() => {
    console.log('HTTP server closed.');
    connection.end((err) => {
      console.log('MySQL connection closed.')
    });
  });
});

module.exports = app;