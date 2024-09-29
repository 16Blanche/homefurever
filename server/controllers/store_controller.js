const Store = require('../models/store_model');

const newItem = (req, res) => {
    Store.create(req.body)
        .then((newItem) => {
            res.json({ newItem: newItem,status: "Product posted." })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong, please try again', error: err })
        });
}

const findAllItems = (req,res) => {
    Store.find()
    .then((allDaItems) => {
        res.json({ theItem: allDaItems })
    }) 
    .catch((err) => {
        res.json({ message: 'Something went wrong', error: err })
    });
};

module.exports = {
    newItem,
    findAllItems
}