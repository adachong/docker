// Take the order
const _ = require('lodash');
const joi = require('@hapi/joi');

const schema = joi.object().keys({
    id: joi.number().required()
});

/**
 * @api {patch} /orders/:id       Take an order
 * @apiName Take Order
 * @apiGroup Orders
 * 
 * @apiParam {Number} id                  <order_id>, (auto-incremental integer or UUID)
 * 
 * @apiSuccess (200) {String} status      e.g. "TAKEN" or "SUCCESS"
 * 
 * @apiError {String} error               e.g. "VALIDATION_ERROR", "DB_ERROR"
 */
module.exports = (req, res) => {
    let { error } = joi.validate(req.params, schema);
    if (error) {
        console.log('Validation error: ' + error);
        return res.status(400).send({ error: 'VALIDATION_ERROR' });
    }
    let {id} = req.params;

    const db = req.connection;
    db.beginTransaction((err) => {
        if (err) {
            console.log('DB transaction error: ' + err);
            return res.status(503).send({ error: 'DB_ERROR' });
        }
        let updateSql = 'UPDATE `orders` SET Status = \'TAKEN\' WHERE ID = %d AND Status = \'UNASSIGNED\';';
        updateSql = _.replace(updateSql, '%d', id);
        db.query(updateSql, (err, result) => {
            if (err) {
                db.rollback();
                console.log('DB update order error: ' + err);
                return res.status(503).send({ error: 'DB_ERROR' });
            }
            db.commit((err) => {
                if (err) {
                    console.log('DB commit order error: ' + err);
                    return res.status(503).send({ error: 'DB_ERROR' });
                }
                if (result.affectedRows === 0) {
                    return res.status(200).send({ status: 'TAKEN' });
                }
                return res.status(200).send({ status: 'SUCCESS' });
            });
        });
    });
};
