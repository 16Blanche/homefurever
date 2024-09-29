const mongoose = require('mongoose');

async function dropIndex() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/epetadopt_db', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Drop the index
        await mongoose.connection.db.collection('adoptions').dropIndex({ adoption_id: 1 });

        console.log('Index dropped successfully');
        mongoose.disconnect();
    } catch (err) {
        console.error('Error dropping index:', err);
    }
}

dropIndex();
