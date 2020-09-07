//const Events = require('./dbConnection');
import { Events, User, Booking} from "./dbConnection";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const getEvents = async eventIds => {
    try{
        const events = await Event.find({ _id: { $in: eventIds}});
        events.map(event => {
            return {
                ...event._doc,
                _id: event.id,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator)
            };
        });
        return events;
    } catch(err) {
        throw err;
    }
}

const getSingleEvent = async eventId => {
    try {
        const event = await Events.findById(eventId);
        console.log('eventIdeventIdeventIdeventIdeventId', eventId)
        return {
            ...event._doc,
            _id: event.id,
            creator: getUser.bind(this,event.creator)
        }
    } catch(err){
        throw err
    }
}

const getUser = async userId => {
    try{
        const user = await User.findById(userId);
        console.log('fdsfdsfdsff', userId)
        return {
            ...user._doc,
            _id: user.id,
            createdEvents: getEvents.bind(this, user._doc.createdEvents)
        }
    } catch(err) {
        throw err
    }
}

// resolver map
export const resolvers = {
    Query: {
        events: async () => {
            try {
                const events = await Events.find();
                return events.map(event => {
                    return {
                        ...event._doc,
                        _id: event.id,
                        date: new Date(event._doc.date).toISOString(),
                        creator: getUser.bind(this, event._doc.creator)
                    }
                })
            } catch(err) {
                throw err;
            }
        },
        bookings: async () => {
            try {
                const bookings = await Booking.find();
                return bookings.map(booking => {
                    return {
                        ...booking._doc,
                        _id: booking.id,
                        user: getUser.bind(this, booking._doc.user),
                        event: getSingleEvent.bind(this, booking._doc.events),
                        createdAt: new Date(booking._doc.createdAt).toISOString(),
                        updatedAt: new Date(booking._doc.updatedAt).toISOString(),
                    };
                })
            } catch(err){
                throw err;
            }
        },
        login: async (_, {email, password}) => {
            try{
                console.log("login function" + email)
                const user = await User.findOne({email: email});
                if(!user){
                    throw new Error('user does not excist')
                }
                console.log("login functiondfd" + user.password)
                const isEqual = await bcryptjs.compare(password, user.password)
                if(!isEqual){
                    throw new Error('User details not correct')
                }
                const token = await jwt.sign({userId: user.id, email: user.email}, 'secretkey', 
                    {expiresIn: '1h'}
                );
                return { userId: (await user).id, token: token, tokenExpiration: 1}
            } catch(err){
                throw err
            }
        }
    },
    Mutation: {
        createEvents: async (_, { eventInput }, req) => {
            if(!req.isAuth){
                throw new Error("unauthenticated")
            }
            const newEvent = new Events({
                title: eventInput.title,
                description: eventInput.description,
                price: eventInput.price,
                date: new Date(eventInput.date).toISOString(),
                creator: "5f3d42092d5d708daf04d2a1"
            });
            let createdEvent;
            try{
                console.log('inside the createevent resolveer')
                const result = await newEvent
                .save()
                    createdEvent = { ...result._doc, _id: result._doc._id.toString(), creator: getUser.bind(this, result._doc.creator)};
                    const user = await User.findById("5f3d42092d5d708daf04d2a1")
                    if(!user){
                        throw new Error("User don't exist")
                    }
                    user.createdEvents.push(newEvent);
                    await user.save();
               
                    return createdEvent;
                
                }catch(err){
                    throw err
                }
        },
        createUser: async (_, { eventInput }) => {
            try{
            const user = await  User.findOne({email: eventInput.email})
                if(user){
                    throw new Error("User exist already")
                }
                const hashedPassword = await bcryptjs.hash(eventInput.password, 12)
                    const newUser = new User({
                        email: eventInput.email,
                        password: hashedPassword,
                    });

                    const result = await newUser.save();


                    return { ...result._doc, password: null, _id: result.id}
                } catch(err) {
                throw err;
                } 
        },
        bookEvent: async (_, { eventId}, req) => {
            if(!req.isAuth){
                throw new Error("unauthenticated")
            }
            try {
                const fetchedEvent = await Events.findOne({_id: eventId});
                //console.log('inside the bookevent'+fetchedEvent)
                const booking = new Booking({
                    user: "5f3d42092d5d708daf04d2a1",
                    events: fetchedEvent
                });
                const result = await booking.save()
                console.log('bokking console' +result)
                return {
                    ...result._doc,
                    _id: result.id,
                    user: getUser.bind(this, result._doc.user),
                    event: getSingleEvent.bind(this, result._doc.events),
                    createdAt: new Date(result._doc.createdAt).toISOString(),
                    updatedAt: new Date(result._doc.updatedAt).toISOString(),
                }
            } catch(err) {
                throw err;
            }
        },
        cancelBooking: async (_, { bookingId}, req) => {
            if(!req.isAuth){
                throw new Error("unauthenticated")
            }
            try{
                const booking = await Booking.findById(bookingId).populate('event');
                console.log('dfdfdff'+ booking)
                const event = { 
                    ...booking.events,
                    _id: booking.events.id,
                    creator: getUser.bind(this, booking.events._doc.creator)
                }
                await Booking.deleteOne({_id: bookingId})
                return event;
            } catch(err){
                throw err
            }
        }
    },
};
