# Parking Management Api
This API provides functionality for managing a parking lot, including creating a parking lot, parking and leaving cars, and get parking slot number list and registration  plate number list.

### Installation
To use this API, you will need to have **Node.js** and **npm** installed.
1. Clone this repository: 'git clone https://github.com/reetoto/nodejs-parking.git'
2. Navigate to the project directory: 'cd nodejs-parking'
3. Install dependencies: 'npm install'
4. Start the server: 'npm start'

The server should now be running on http://localhost:3000.
*Database Using MySQL***
```sql
CREATE TABLE `cars` (
	`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	`plate1` VARCHAR(4) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`plate2` VARCHAR(4) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`plate_province_name` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`car_size` ENUM('S','M','L') NULL DEFAULT 'S' COLLATE 'utf8mb4_general_ci',
	`park_id` INT(10) UNSIGNED NULL DEFAULT NULL,
	`enter_datetime` DATETIME NULL DEFAULT NULL,
	`exit_datetime` DATETIME NULL DEFAULT NULL,
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `plate1_plate2_plate_province_name` (`plate1`, `plate2`, `plate_province_name`) USING BTREE,
	INDEX `park_id` (`park_id`) USING BTREE
);
```

```sql
CREATE TABLE `parks` (
	`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	`is_active` ENUM('Y','N') NOT NULL DEFAULT 'Y' COLLATE 'utf8mb4_general_ci',
	`is_blank` ENUM('Y','N') NOT NULL DEFAULT 'Y' COLLATE 'utf8mb4_general_ci',
	`slot_no` VARCHAR(5) NOT NULL COLLATE 'utf8mb4_general_ci',
	`piority_group` TINYINT(3) UNSIGNED NOT NULL DEFAULT '1' COMMENT 'Entrance proximity level 1=closest,2=middle,3=farthest',
	`created_datetime` DATETIME NULL DEFAULT NULL,
	`updated_datetime` DATETIME NULL DEFAULT NULL,
	`latest_car_id` INT(10) UNSIGNED NULL DEFAULT NULL,
	`latest_in_datetime` DATETIME NULL DEFAULT NULL,
	`latest_out_datetime` DATETIME NULL DEFAULT NULL,
	PRIMARY KEY (`id`) USING BTREE,
	UNIQUE INDEX `slot_no` (`slot_no`) USING BTREE,
	INDEX `is_active` (`is_active`) USING BTREE,
	INDEX `is_blank` (`is_blank`) USING BTREE,
	INDEX `piority_group` (`piority_group`) USING BTREE
);
```

### API Documentation

#### Create Parking Lot
Endpoint: 'POST /park/create'
Request Body *(parse application/x-www-form-urlencoded)*:
`{
  "slot_no": "C1", // required
  "priority_group": "2"
}`
- priority_group (Entrance proximity level 1 = closest, 2 = middle, 3 = farthest)

#### Update Parking Lot
Endpoint: 'POST /park/update'
Request Body *(parse application/x-www-form-urlencoded)*:
`{
 "id": "1",
 "is_active": "Y",
 "slot_no": "C1",  // required
  "piority_group": "2"
}`

#### Get Park List
Endpoint: 'GET /park/all'
Query Parameters: -

#### Get Park By ID
Endpoint: 'GET /park/detail'
Query Parameters: id (requied)

#### Get allocated slot number list by car size
Endpoint: 'GET /park/detail_park_bysize'
Query Parameters: car_size (requied), date_in (optional)

#### Create park the car
Endpoint: 'POST /car/car_in'
Request Body *(parse application/x-www-form-urlencoded)*:
`{
 "plate1": "1กก",
 "plate2": "1234",
 "plate_province_name": "กรุงเทพมหานคร",
 "car_size": "M"
}`

#### Update Leave Slot
Endpoint: 'POST /car/car_out'
Request Body *(parse application/x-www-form-urlencoded)*:
`{
 "car_id": 1,  // required
 "park_id": 1 // required
}
`
#### Get Car List
Endpoint: 'GET /car/all'
Query Parameters: -

#### Get Car By ID
Endpoint: 'GET /car/detail'
Query Parameters: id (requied)

#### Get Car plate number list by car size
Endpoint: 'GET /car/detail_car_bysize'
Query Parameters: car_size (requied), date_in (optional)

###End