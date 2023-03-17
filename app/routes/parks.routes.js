const express = require('express');
const parkControllers = require('../controllers/parks.controllers');

const router = express.Router();

const getHome = async (req, res) => {
  res.status(200).json({
    message: "This is park!",
  });
};
router.get('/', getHome);
router.get('/all', parkControllers.getParkAll);
router.get('/detail', parkControllers.getParkById);
router.get('/detail_park_bysize', parkControllers.getParkBySize);
router.post('/create', parkControllers.createPark);
router.post('/update', parkControllers.updatePark);

module.exports = router