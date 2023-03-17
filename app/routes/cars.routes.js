const express = require('express');
const carControllers = require('../controllers/cars.controllers');

const router = express.Router();

const getHome = async (req, res) => {
  res.status(200).json({
    message: "This is cars!",
  });
};
router.get('/', getHome);
router.get('/all', carControllers.getCarAll);
router.get('/detail', carControllers.getCarById);
router.get('/detail_car_bysize', carControllers.getCarBySize);
router.post('/car_in', carControllers.createCarIn);
router.post('/car_out', carControllers.updateCarOut);

module.exports = router