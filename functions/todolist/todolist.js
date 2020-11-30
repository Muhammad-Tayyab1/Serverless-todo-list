const { ApolloServer, gql } = require('apollo-server-lambda');

const faunadb = require('faunadb'),
      q = faunadb.query;
      ;
require("dotenv").config()

const typeDefs = gql`
  type Query {
    todos: [Todo!]!
  }
  type Mutation {
    addTodo(text: String!): Todo!
    removeTodo(id: ID!): Todo!
  }
  type Todo {
    id: ID!
    text: String!
    done: Boolean!
  }
`

const resolvers = {
  Query: {
    todos: async (root, args, context) => {
      try {
        const adminClient = new faunadb.Client({ secret: process.env.FAUNA_SECRETS });
        const result = await adminClient.query(
          q.Map(
            q.Paginate(q.Match(q.Index('task'))),
            q.Lambda(x => q.Get(x))
          )
        )

        console.log(result.data);
        
        return result.data.map( (d) => {
          return {
            id: d.ref.id,
            text: d.data.text,
            done: d.data.done
          }
        })
      }
      catch(error) {
        console.log(error);
      }
    },
  },
  Mutation: {
      addTodo: async (_, { text }) => {
      try {
        const adminClient = new faunadb.Client({ secret: process.env.FAUNA_SECRETS  });
        const result = await adminClient.query(
          q.Create(
            q.Collection('todos'),
            { data: {
              text: text,
              done: false
            }},
          )
        )
        
        console.log("DATA : ", result);
        return {
          id: result.ref.id,
          task: result.data.task,
          done: result.data.done,
        };
      } catch (error) {
        console.log("Error : ", error)
      }
    },
      removeTodo: async (_, { id }) => {
    try {
      const adminClient = new faunadb.Client({ secret: process.env.FAUNA_SECRETS  });
        const result = await adminClient.query(
        q.Delete(q.Ref(q.Collection("todos"), id))
      )
      console.log("DATA : ", result);
      return {
        id: result.ref.id,
        task: result.data.task,
        done: result.data.done,
      };
    } catch (error) {
      console.log("Error : ", error);
    }
  },
},
}
 
const server = new ApolloServer({
  typeDefs,
  resolvers,
})

exports.handler = server.createHandler()

