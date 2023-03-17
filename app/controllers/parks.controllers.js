const db = require('../config/db.config')
const { QueryTypes } = require('sequelize')
let parks = {}

parks.getParkAll = async (req, res) => {
  try {
    const data = await db.Sequelize.query(
      `SELECT * FROM parks WHERE 1`,
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

parks.getParkById = async (req, res) => {
  const id = req.query.id ? req.query.id : ''
  try {
    const data = await db.Sequelize.query(
      `SELECT * FROM parks WHERE id = :id`,
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

parks.getParkBySize = async (req, res) => {
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
    whCondition = ' AND DATE(parks.latest_in_datetime) = "'+date_in+'"';
  }
  try {
    const data = await db.Sequelize.query(
      `SELECT parks.id AS park_id,
              parks.slot_no,
              parks.is_active,
              parks.is_blank
        FROM parks 
        LEFT JOIN cars ON parks.latest_car_id = cars.id
        WHERE cars.car_size = :car_size AND parks.is_blank='N' ${whCondition}
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

parks.createPark = async (req, res) => {
  const slot_no = req.body.slot_no ? req.body.slot_no : ''
  const piority_group = req.body.piority_group && req.body.piority_group!="" ? req.body.piority_group : 1
  const t = await db.Sequelize.transaction();

  try {
    await db.Sequelize.query(
      `INSERT INTO parks (
          slot_no,
          piority_group,
          created_datetime
        )VALUES(
          :slot_no,
          :piority_group,
          NOW()
        )
      `,
      {
        replacements: {
          slot_no: slot_no,
          piority_group: piority_group
        },
        type: QueryTypes.INSERT,
        transaction: t
      }
    );
    await t.commit();
    res.status(200).json({
      message: "Created!"
    });
  } catch(e) {
    await t.rollback();
    console.log('Error: ', e.message)
  }
}

parks.updatePark = async (req, res) => {
  const id = req.body.id ? req.body.id : ''
  const is_active = req.body.is_active && req.body.is_active!='' ? req.body.is_active : 'Y'
  const slot_no = req.body.slot_no ? req.body.slot_no : ''
  const piority_group = req.body.piority_group && req.body.piority_group!="" ? req.body.piority_group : 1

  if(id<1 || id=='' || slot_no==''){
    res.status(200).json({
      message: "Bad Request!"
    });
    return;
  }

  const t = await db.Sequelize.transaction();

  await db.Sequelize.query(
    `UPDATE parks 
    SET slot_no = :slot_no,
        piority_group = :piority_group,
        is_active = :is_active,
        updated_datetime = NOW()
    WHERE id=:id
    `,
    {
      replacements: {
        id: id,
        is_active: is_active,
        slot_no: slot_no,
        piority_group: piority_group
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

module.exports = parks