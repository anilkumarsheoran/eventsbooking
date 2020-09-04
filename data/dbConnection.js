const mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.k3o4a.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`).then(console.log('connected to db')).catch((err)=> console.log(err))

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Events'
    } ]

})

const eventsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    date: {
        type: Number,
        required: true
    },
    creator: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
});

const bookingSchema = new mongoose.Schema({
    events: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Events'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},
    {
        timestamps: true
    }
)

export const User = mongoose.model('User', userSchema);
export const Events = mongoose.model('Events', eventsSchema);
export const Booking = mongoose.model('Booking', bookingSchema);