// Create an order
const googleDistanceMatrix = require('google-distance-matrix');
const _ = require('lodash');
const joi = require('@hapi/joi');
const { googleApiKey } = require('../../config');

const schema = joi.object().keys({
    origin: joi.array().items(joi.string().regex(/^\d*\.?\d*$/)).length(2).required(),
    destination: joi.array().items(joi.string().regex(/^\d*\.?\d*$/)).length(2).required()
});

let initGoogleDistanceMatrix = () => {
    googleDistanceMatrix.key(googleApiKey);
    googleDistanceMatrix.units('imperial');
    googleDistanceMatrix.mode('driving');
    return googleDistanceMatrix;
};

// getMatrixInput combines the origin and destination to a one value array ['<LATITUDE>,<LONGTITUDE>']
let getMatrixInput = ({ origin, destination }) => {
    return {
        origin: [_.join(origin, ',')],
        destination: [_.join(destination, ',')]
    };
};

/**
 * @api {post} /orders            Create an order
 * @apiName CreateOrder
 * @apiGroup Orders
 * 
 * @apiParam {String[]}   origin                ["START_LATITUDE", "START_LONGTITUDE"],
 * @apiParam {String[]}   destination           ["END_LATITUDE", "END_LONGTITUDE"]
 * 
 * @apiSuccess (200) {Number} id                <order_id>, (auto-incremental integer or UUID)
 * @apiSuccess (200) {Number} distance          <total_distance>,(integer in meters)
 * @apiSuccess (200) {String} status            e.g. 'UNASSIGNED'
 *
 * @apiError {String} error                     e.g. "VALIDATION_ERROR", "DB_ERROR"
 */
module.exports = (req, res) => {
    const db = req.connection;
    let { error } = joi.validate(req.body, schema);
    if (error) {
        console.log('Validation error: ' + error);
        return res.status(400).send({ error: 'VALIDATION_ERROR' });
    }
    let { origin, destination } = getMatrixInput(req.body);

    // Pass the origin and destination to get the travel distance from google API, and create a new order
    const googleDistance = initGoogleDistanceMatrix();
    googleDistance.matrix(origin, destination, (err, distances) => {
        if (err || !distances || _.get(distances, 'status') !== 'OK') {
            return res.status(503).send('ERROR_DESCRIPTION');
        }
        let distanceInMeter = _.round(_.get(distances, 'rows[0].elements[0].distance.value', 0));
        let insertSql = 'INSERT INTO `orders` (Distance, Status) VALUES (%v, \'UNASSIGNED\');';
        insertSql = _.replace(insertSql, '%v', distanceInMeter);
        db.query(insertSql, (err, results) => {
            if (err) {
                console.log('DB insert order error: ' + err);
                return res.status(503).send('DB_ERROR');
            }
            let result = {
                id: results.insertId,
                distance: distanceInMeter,
                status: 'UNASSIGNED'
            };
            res.status(200).send(result);
        });
    });
};