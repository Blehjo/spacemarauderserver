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
    // create a new profile
    addProfile: async (
      parent,
      {
        firstName,
        photo,
        attachmentStyle,
        genderIdentity,
        genderInterests,
        bio,
        birthdate,
        pronouns,
        sexualOrientation,
        currentCity,
        user,
      },
      context
    ) => {
      if (context.user) {
        const profile = await Profile.create(
          {
            firstName,
            photo,
            attachmentStyle,
            genderIdentity,
            genderInterests,
            bio,
            birthdate,
            pronouns,
            sexualOrientation,
            currentCity,
            user,
          }
        );
        return profile;
      }
      throw new AuthenticationError("You need to be logged in!");
    },

    // updateProfile: async
    updateProfile: async (parent, args, context) => {
      if (context.user) {
        return await Profile.findOneAndUpdate(
          { _id: args.profileId },
          {
            $set: {
              firstName: args.firstName,
              photo: args.photo,
              attachmentStyle: args.attachmentStyle,
              genderIdentity: args.genderIdentity,
              genderInterests: args.genderInterests,
              bio: args.bio,
              birthdate: args.birthdate,
              pronouns: args.pronouns,
              sexualOrientation: args.sexualOrientation,
              currentCity: args.currentCity,
            },
          },
          { new: true }
        );
      }
      throw new AuthenticationError("You need to be logged in!");
    },

    // add a thread
    addThread: async (
      parent,
      { text, user, match,},
      context
    ) => {
      if (context.user) {
        const thread = await Thread.create({
          text,
          user,
          match,
        })
        return thread;
      }
      throw new AuthenticationError("You need to be logged in!");
    },

    // delete a thread by the id
    removeThread: async (parent, { threadId }, context) => {
      if (context.user) {
        const deleteThread = await Thread.findOneAndDelete(
          { _id: threadId }
        );
        return deleteThread;
      }
      throw new AuthenticationError("You need to be logged in!");
    },

    // add a message
    addMessage: async (
      parent,
      {text, date, thread, user },
      context
    ) => {
      if (context.user) {
        const message = await Message.create({
          text,
          date,
          thread,
          user,
        });
        return message;
      }
      throw new AuthenticationError("You need to be logged in!");
    },

    // delete a message by id look at activity 12 resolvers
    removeMessage: async (parent, { messageId }, context) => {
      if (context.user) {
        return Message.findOneAndDelete(
          { _id: messageId }
        );
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;