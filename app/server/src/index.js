const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('./prisma-client')

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: (root, args, context, info) => context.prisma.links(),
    link: (parent, args, context) =>
      context.prisma.links({
        where: {
          url: args.url,
          id: args.id
        }
      })
  },
  Mutation: {
    post: (parent, args, context) => {
      return context.prisma.createLink({
        url: args.url,
        description: args.description
      })
    },
    deleteLink: (parent, args) => {
      const deleteIndex = links.findIndex(link => link.id === args.id)
      const tempLinks = links[deleteIndex]
      links.splice(deleteIndex, 1)
      return tempLinks
    },
    updateLink: (parent, args) => {
      const updateIndex = links.findIndex(link => link.id === args.id)
      links[updateIndex] = {
        ...links[updateIndex],
        ...args
      }
      return links[updateIndex]
    }
  }
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: request => ({
    ...request,
    prisma
  })
})

server.start(() => console.log(`Server is running on http://localhost:4000`))
