const db = require('../config/db.config')
const { QueryTypes } = require('sequelize')
let cars = {}

cars.getCarAll = async (req, res) => {
  try {
    const data = await db.Sequelize.query(
      `SELECT * FROM cars WHERE 1 ORDER BY id DESC`,
      {
        type: QueryTypes.SELECT,
      }
    );
    res.status(200).json({
      data: data
    });
  } catch(e) {
    console.log('Error: ', e.message)
  }
}

cars.getCarById = async (req, res) => {
  const id = req.query.id ? req.query.id : ''
  try {
    const data = await db.Sequelize.query(
      `SELECT * FROM cars WHERE id = :id`,
      {
        replacements: {
          id: id,
        },
        plain: true, type: QueryTypes.SELECT,
      }
    );
    res.status(200).json({
      data: data
    });
  } catch(e) {
    console.log('Error: ', e.message)
  }
}

cars.getCarBySize = async (req, res) => {
  const car_size = req.query.car_size && req.query.car_size!='' ? req.query.car_size.toUpperCase() : ''
  const date_in = req.query.date_in ? req.query.date_in : ''

  if(car_size==''){
    res.status(200).json({
      message: "Bad Request!"
    });
    return;
  }

  var whCondition = ''
  if(date_in!=""){
    whCondition = ' AND DATE(cars.enter_datetime) = "'+date_in+'"';
  }
  try {
    const data = await db.Sequelize.query(
      `SELECT cars.id AS car_id,
              cars.plate1,
              cars.plate2,
              cars.plate_province_name,
              cars.car_size,
              cars.enter_datetime,
              cars.exit_datetime,
              cars.park_id,
              parks.slot_no
        FROM cars 
        LEFT JOIN parks ON cars.park_id = parks.id
        WHERE cars.car_size = :car_size ${whCondition}
      `,
      {
        replacements: {
          car_size: car_size,
        },
        type: QueryTypes.SELECT,
      }
    );
    res.status(200).json({
      data: data
    });
  } catch(e) {
    console.log('Error: ', e.message)
  }
}

cars.createCarIn = async (req, res) => {
  const plate1 = req.body.plate1 ? req.body.plate1 : ''
  const plate2 = req.body.plate2 ? req.body.plate2 : ''
  const plate_province_name = req.body.plate_province_name ? req.body.plate_province_name : ''
  const car_size = req.body.car_size && req.body.car_size!='' ? req.body.car_size.toUpperCase() : 'S'
  const t = await db.Sequelize.transaction();

  var park_id = ''
  var slot_no = ''
  const data_slot = await db.Sequelize.query(
    `SELECT id, slot_no
      FROM parks 
      WHERE is_active="Y" AND is_blank="Y" 
      ORDER BY piority_group ASC, id ASC
    `,
    {
      plain: true, type: QueryTypes.SELECT,
    }
  );
  try {
    park_id = data_slot.id
    slot_no = data_slot.slot_no
  } catch (error) {}

  if(park_id<1 || park_id==''){
    res.status(200).json({
      message: "No Free Parking!"
    });
    return;
  }

  var car_id = ''
  const data_car = await db.Sequelize.query(
    `INSERT INTO cars (
        plate1,
        plate2,
        plate_province_name,
        car_size,
        park_id,
        enter_datetime
      )VALUES(
        :plate1,
        :plate2,
        :plate_province_name,
        :car_size,
        :park_id,
        NOW()
      )
    `,
    {
      replacements: {
        plate1: plate1,
        plate2: plate2,
        plate_province_name: plate_province_name,
        car_size: car_size,
        park_id: park_id,
      },
      type: QueryTypes.INSERT,
      transaction: t
    }
  );
  try {
    car_id = data_car[0]
  } catch (error) {}
  await db.Sequelize.query(
    `UPDATE parks
      SET is_blank = 'N',
          latest_car_id = :car_id,
          latest_in_datetime=NOW()
      WHERE id = :park_id
    `,
    {
      replacements: {
        park_id: park_id,
        car_id: car_id
      },
      type: QueryTypes.UPDATE,
      transaction: t
    }
  );
  try {
    if(car_id>0 && car_id!=""){
      await t.commit();
    }else{
      res.status(200).json({
        message: "Cannot create car!"
      });
      return;
    }
    res.status(200).json({
      message: "Created!",
      data: {
        car_id: car_id,
        park_id: park_id,
        slot_no: slot_no
      }
    });
  } catch(e) {
    await t.rollback();
    console.log('Error: ', e.message)
  }
}

cars.updateCarOut = async (req, res) => {
  const car_id = req.body.car_id ? req.body.car_id : ''
  const park_id = req.body.park_id ? req.body.park_id : ''

  if(car_id<1 || car_id=='' || park_id<1 || park_id==''){
    res.status(200).json({
      message: "Bad Request!"
    });
    return;
  }

  const t = await db.Sequelize.transaction();
  await db.Sequelize.query(
    `UPDATE cars 
    SET exit_datetime = NOW()
    WHERE id=:id
    `,
    {
      replacements: {
        id: car_id
      },
      type: QueryTypes.INSERT,
      transaction: t
    }
  );
  await db.Sequelize.query(
    `UPDATE parks 
    SET is_blank = 'Y',
        latest_out_datetime=NOW()
    WHERE id=:id
    `,
    {
      replacements: {
        id: park_id
      },
      type: QueryTypes.INSERT,
      transaction: t
    }
  );
  try {
    await t.commit();
    res.status(200).json({
      message: "Updated!"
    });
  } catch(e) {
    await t.rollback();
    console.log('Error: ', e.message)
  }
}

module.exports = cars