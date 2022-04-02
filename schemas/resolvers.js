const { AuthenticationError } = require("apollo-server-express");
const { Painting, Collection, User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    // get all users
    users: async () => {
      return User.find().populate("likes").populate("cart");
    },
    // need to get one user by id for signup and so can add user id to profile schema
    user: async (parent, args) => {
      return await User.findById(args.id).populate("likes").populate("cart");
    },
    // get the profile of the user that is logged in 
    userprofile: async (parent, args) => {
      return User.findOne(args).populate("likes").populate("cart");
    },
    // get all collections
    collections: async () => {
      return Collection.find({}).populate("paintings");
    },
    // get all the liked collections for one user by the user's id
    likedCollections: async (parent, args) => {
      return Collection.find(args).populate("paintings");
    },
    // get all paintings
    paintings: async (parent, args) => {
      return Painting.find({}).populate("collection");
    },
    painting: async (parent, args) => {
      return Painting.findOne(args).populate("collection");
    },
    // get all paintings in a collection by id 
    paintingsCollection: async (parent, args) => {
      return Painting.findOne(args).populate("collection");
    },
    // get all messages
    likedPaintings: async (parent, args) => {
      return User.find(args).populate("thread").populate("user");
    },
    // get messages by id of the thread
    cart: async (parent, args) => {
      return User.find(args).populate("thread").populate("user");
    },
    // By adding context to our query, we can retrieve the logged in user without specifically searching for them
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate("likes").populate("cart");
      }
      throw newAuthenticationError("You need to be logged in!");
    },
  },
  Mutation: {
    // update - login
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError(
          "Incorrect email or password! Try again QUEEN"
        );
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError(
          "Incorrect email or password! Try again QUEEN"
        );
      }

      const token = signToken(user);
      return { token, user };
    },
    // create a new user
    addUser: async (parent, { email, password }) => {
      const user = await User.create({ email, password });
      const token = signToken(user);

      return { token, user };
    },
    // update a user to add the profile ID
    updateUser: async (parent, args, context)=>{
      if(context.user){
        return await User.findOneAndUpdate(
          {_id:args.id},
          {$set:{profile:args.profile}},
          {new:true}
        );
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    // delete a user
    removeUser: async (parent, {}, context ) => {
        if (context.user) {
          const deletedUser = await User.findOneAndDelete({ _id: userId });
          return deletedUser;
        }
        throw new AuthenticationError("You need to be logged in!");
    },
    // create a new collection
    addCollection: async (
      parent,
      {
        collectionName,
        description,
      },
      context
    ) => {
      if (context.user) {
        const collection = await Collection.create(
          {
            collectionName,
            description,
          }
        );
        return collection;
      }
      throw new AuthenticationError("You need to be logged in!");
    },

    // update collection
    updateCollection: async (parent, args, context) => {
      if (context.user) {
        return await Collection.findOneAndUpdate(
          { _id: args.collectionId },
          {
            $set: {
              collectionName: args.collectionName,
              description: args.description,
            },
          },
          { new: true }
        );
      }
      throw new AuthenticationError("You need to be logged in!");
    },

    // delete a collection by the id
    removeCollection: async (parent, { collectionId }, context) => {
        if (context.user) {
          const deletedCollection = await Collection.findOneAndDelete(
            { _id: collectionId }
          );
          return deletedCollection;
        }
        throw new AuthenticationError("You need to be logged in!");
    },

    // add a painting
    addPainting: async (
      parent,
      { 
        title, 
        year, 
        medium,
        description,
        photo,
        collection,
      },
      context
    ) => {
      if (context.user) {
        const painting = await Painting.create({
            title, 
            year, 
            medium,
            description,
            photo,
            collection,
        })
        return painting;
      }
      throw new AuthenticationError("You need to be logged in!");
    },

    // update painting
    updatePainting: async (parent, args, context) => {
        if (context.user) {
          return await Painting.findOneAndUpdate(
            { _id: args.paintingId },
            {
              $set: {
                title: args.title,
                year: args.year,
                medium: args.medium,
                description: args.description,
                photo: args.photo,
              },
            },
            { new: true }
          );
        }
        throw new AuthenticationError("You need to be logged in!");
    },

    // delete a painting by the id
    removePainting: async (parent, { paintingId }, context) => {
      if (context.user) {
        const deletedPainting = await Painting.findOneAndDelete(
          { _id: paintingId }
        );
        return deletedPainting;
      }
      throw new AuthenticationError("You need to be logged in!");
    },

  },
};

module.exports = resolvers;