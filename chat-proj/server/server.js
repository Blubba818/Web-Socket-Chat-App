const { GraphQLServer, PubSub } = require('graphql-yoga')

const messages = []

const typeDefs = `
    type Message {
        id: ID!
        user: String!
        icon: String!
        color: String!
        content: String!
    }

    type Query {
        messages: [Message!]
    }

    type Mutation {
        postMessage(user: String!, icon: String!, color: String!, content: String!): ID!
    }

    type Subscription {
        messages: [Message!]
    }
`

const subscribers = []
const onMessagesUpdates = (fn) => subscribers.push(fn)

const resolvers = {
    Query: {
        messages: () => messages
    },
    Mutation: {
        postMessage: (parent, {user, content, icon, color}) => {
            const id = messages.length
            messages.push({
                id,
                user,
                icon,
                color,
                content
            })
            subscribers.forEach((fn) => fn())
            return id
        }
    },
    Subscription: {
        messages: {
            subscribe: (parent, args, { pubsub}) => {
                const channel = Math.random().toString(36).slice(2,15)
                onMessagesUpdates(() => pubsub.publish(channel, {messages}))
                setTimeout(() => pubsub.publish(channel, { messages }), 0)
                return pubsub.asyncIterator(channel)
            }
        }
    }
}

const pubsub = new PubSub()
const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } })
server.start(({port}) => {
    console.log(`Server on http://localhost:${port}/`)
})