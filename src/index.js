const express = require('express');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');
const axios = require('axios');

const { PORT } = require('./config/serverConfig');
const { FLIGHT_SERVICE_PATH } = require('./config/serverConfig');
const { FLIGHT_AUTH_PATH } = require('./config/serverConfig');
const { BOOKING_SERVICE_PATH } = require('./config/serverConfig');

const app = express();

const limiter = rateLimit({
	windowMs: 2 * 60 * 1000,
	max: 10, 
})

app.use(morgan('combined'));
app.use(limiter);
const getFlightAuthURL = `${FLIGHT_AUTH_PATH}/api/v1/isauthenticated`
app.use('/bookingservice', async (req, res, next) => {
    console.log(req.headers['x-access-token']);
    try {
        const response = await axios.get(getFlightAuthURL , {
            headers: {
                'x-access-token': req.headers['x-access-token']
            }
        });
        console.log(response.data);
        if(response.data.success) {
            next();
        } else {
            return res.status(401).json({
                message: 'Unauthorised'
            })
        }
    } catch (error) {
        return res.status(401).json({
            message: 'Unauthorised'
        })
    }
})
app.use('/flightservice', createProxyMiddleware({ target: `${FLIGHT_SERVICE_PATH}/`, changeOrigin: true}));
app.use('/bookingservice', createProxyMiddleware({ target: `${BOOKING_SERVICE_PATH}/`, changeOrigin: true}));
app.get('/home', (req, res) => {
    return res.json({message: 'OK'});
})

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});