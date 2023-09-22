const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    PORT : process.env.PORT,
    FLIGHT_SERVICE_PATH: process.env.FLIGHT_SERVICE_PATH ,
    FLIGHT_AUTH_PATH: process.env.FLIGHT_AUTH_PATH ,
    BOOKING_SERVICE_PATH: process.env.BOOKING_SERVICE_PATH,
}