const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        // getSingleUser
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')
                    .populate('savedBooks')

                return userData;
            }

            throw new AuthenticationError("You need to be logged in!");
        }
    },

    Mutation: {
        // createUser
        createUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },
        // login
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError("You're credentials are incorrect!");
            }
            const correctPassword = await user.isCorrectPassword(password);
            if (!correctPassword) {
                throw new AuthenticationError("You're credentials are incorrect!");
            }
            const token = signToken(user);

            return { token, user };
        },
        saveBook: async (parent, { bookId }, context) => {
            if (!context.user) {
                throw new AuthenticationError("You need to be logged in!");
            }

            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $addToSet: { savedBooks: bookId } },
                { new: true }
            )
            .populate('savedBooks');

            return updatedUser;
        }
    }
};

module.exports = resolvers;