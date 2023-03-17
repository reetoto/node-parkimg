const express = require("express")
const cors = require("cors")
const bodyParser = require('body-parser')
const db = require('./app/config/db.config')
const os = require("os")

const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// ROUTES Requie
var parksRouter = require('./app/routes/parks.routes')
var carsRouter = require('./app/routes/cars.routes')

// ROUTES Path
app.use('/park', parksRouter);
app.use('/car', carsRouter);

app.get("/", (req, res) => {
  const checker = {uptime: process.uptime(),message: 'OK',timestamp: Date.now()};
  try {
    res.send(checker);
  } catch (error) {
    checker.message = error;
    res.status(503).send();
  }
});
app.get("/dbcon", async (req, res) => {
  const checker = {uptime: process.uptime(),message: 'OK',timestamp: Date.now()};
  try {
    await db.sequelize.authenticate();
    res.send(checker);
  } catch (error) {
    checker.message = error;
    res.status(503).send();
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).json({
    message: "No such route exists"
  })
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({
    message: "Error Message"
  })
});

const hostName = os.hostname();
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on ${hostName} port ${PORT}`)
});
// console.log(process.env.NODE_ENV)

module.exports = app;