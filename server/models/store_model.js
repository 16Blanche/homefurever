const mongoose = require('mongoose');
const StoreSchema = new mongoose.Schema({

    p_img:{
        type: String
    },

    p_product: {
        type: String
    },

    p_price: {
        type: Number
    },

    p_details: {
        type: String
    }
});

const Store = mongoose.model('Store', StoreSchema);
module.exports = Store;