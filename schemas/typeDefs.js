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

  type Library {
    _id: ID!
    libraryName: String!
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
    library: Library
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    user(id: ID!): User
    userprofile(user:ID!): User
    libraries: [Library]
    library(library: ID!): Library
    likedLibraries(user: ID!): [Library]
    paintings: [Painting]
    painting(painting: ID!): Painting
    paintingsLibrary(library: ID!): [Painting]
    likedPaintings(user: ID!): [Painting]
    cart(user: ID!): [Painting]
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth

    addUser(email: String!, password: String!): Auth

    updateUser(id: ID!): User

    removeUser(userId: ID!): User

    addLibrary(
      libraryName: String!
      description: String!
    ): Library

    updateLibrary(
      libraryId: ID!
      libraryName: String
      description: String
    ): Library

    removeLibrary(libraryId: ID!): Library

    addPainting(
      title: String!
      year: DATE!
      medium: String!
      description: String!
      photo: String!
      library: ID
    ): Painting

    updatePainting(
      paintingId: ID!
      title: String
      year: DATE
      medium: String
      description: String
      photo: String
    ): Painting

    removePainting(paintingId: ID!): Painting

  }
`;

module.exports = typeDefs;