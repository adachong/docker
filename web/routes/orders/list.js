// List all orders

/**
 * @api {get} /orders             Get order list
 * @apiName Get Order list
 * @apiGroup Orders
 * 
 * @apiParam {Object[]} data
 * @apiParam {Number} data.id                 order_id
 * @apiParam {Number} data.distance           distance
 * @apiParam {String} data.status             status e.g. "TAKEN"
 * 
 * @apiError {String} error               e.g. "ERROR_DESCRIPTION"
 */
module.exports = (req, res) => {
    const db = req.connection;
    db.query('SELECT * FROM `orders`', (err, results) => {
        if (err) {
            console.log('DB query order error: ' + err);
            return res.status(503).send({ error: 'DB_ERROR' });
        }
        res.status(200).send(results);
    });
};
