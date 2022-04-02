const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar Date
  type User {
    _id: ID!
    email: String!
    password: String!
    likes: [Painting]
    cart: [Painting]
  }

  type Collection {
    _id: ID!
    collectionName: String!
    description: String!
    paintings: [Painting]
  }

  type Painting {
    _id: ID!
    title: String!
    year: Date!
    medium: String!
    description: String!
    photo: String!
    collection: Collection
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    user(id: ID!): User
    userprofile(user:ID!): User
    collections: [Collection]
    collections(user: ID!): [Collection]
    paintings: [Painting]
    paintingsCollection(collection: ID!): [Painting]
    likedPaintings(user: ID!): Painting
    cart(user: ID!): [Cart]
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth

    addUser(email: String!, password: String!): Auth

    updateUser(id: ID!): User

    removeUser(userId: ID!): User

    addCollection(
      collectionName: String!
      description: String!
    ): Collection

    updateCollection(
      collectionId: ID!
      collectionName: String
      description: String
    ): Collection

    removeCollection(collectionId: ID!): Collection

    addPainting(
      title: String!
      year: String!
      medium: String!
      description: String!
      photo: String!
      collection: ID
    ): Painting

    updatePainting(
      paintingId: ID!
      title: String
      year: String
      medium: String
      description: String
      photo: String
    ): Painting

    removePainting(paintingId: ID!): Painting

  }
`;

module.exports = typeDefs;