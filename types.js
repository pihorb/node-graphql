const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
} = require('graphql')

const { books, authors } = require('./db')

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  description: ' This represents an author of the book',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    books: {
      type: new GraphQLList(BookType) ,
      resolve: (author) => books.filter(book => book.authorId === author.id)
    },
  }),
})

const BookType = new GraphQLObjectType({
  name: 'Book',
  description: ' This represents a book written by an author',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: GraphQLNonNull(GraphQLInt) },
    author: {
      type: AuthorType,
      resolve: (book) => authors.find((author) => author.id === book.authorId),
    },
  }),
})

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    book: {
      type: BookType,
      description: 'A Single Book',
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => books.find(book => book.id === args.id),
    },
    books: {
      type: new GraphQLList(BookType),
      description: 'A List Of Books',
      resolve: () => books,
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: 'List of Authors',
      resolve: () => authors,
    },
    author: {
      type: AuthorType,
      description: 'A Single Authors',
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => authors.find(author => author.id === args.id),
    },
  }),
})

module.exports = {
  BookType,
  RootQueryType,
}
