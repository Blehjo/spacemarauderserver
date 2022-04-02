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

    addProfile(
      firstName: String!
      photo: String
      attachmentStyle: String!
      genderIdentity: String!
      genderInterests: String!
      bio: String!
      birthdate: Date!
      pronouns: String
      sexualOrientation: String
      currentCity: String!
      user: ID
    ): Profile
    updateProfile(
      profileId: ID!
      firstName: String
      photo: String
      attachmentStyle: String
      genderIdentity: String
      genderInterests: String
      bio: String
      birthdate: Date
      pronouns: String
      sexualOrientation: String
      currentCity: String
    ): Profile
    addThread(
      text: String
      user: ID
      match: ID
    ): Thread
    removeThread(threadId: ID!): Thread
    addMessage(
      text: String
      date: Date
      thread: ID
      user: ID
    ): Message
    removeMessage(messageId: ID!): Message
  }
`;

module.exports = typeDefs;