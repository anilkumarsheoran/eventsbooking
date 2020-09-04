import { resolvers } from './resolvers';
import { makeExecutableSchema } from '@graphql-tools/schema';


const typeDefs = `
    type Booking {
        _id: ID!
        event: Events!
        user: User!
        createdAt: String
        UpdatedAt: String
    }

    type Events {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
        creator: User!
    }

    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    type User {
        _id: ID!
        email: String!
        password: String
        createdEvents: [Events!]
    }

    type AuthData {
        userId: ID!
        token: String!
        tokenExpiration: Int!
    }

    input UserInput {
        email: String!
        password: String!
    }

    type Query {
        events : [Events!]!
        bookings: [Booking!]!
        login(email: String!, password: String!): AuthData!
    }

    type Mutation {
        createEvents (eventInput: EventInput): Events
        createUser (eventInput: UserInput): User
        bookEvent(eventId: ID!): Booking!
        cancelBooking(bookingId: ID!): Events!
    }
`
export const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });