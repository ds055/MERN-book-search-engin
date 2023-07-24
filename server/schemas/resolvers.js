const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth')

const resolvers = {
    Query: {
        me: async () => {
            return User.findOne({ _id }).populate('savedBooks');
        },
        // Test function to see if addUser works
        allUsers: async () => {
            return User.find();
        }
    },

    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('No user found with that email address!')
            }

            const correctPw = await user.isCorrectPassword(password)

            if (!correctPw) {
                throw new AuthenticationError('Incorrect password!');
            }

            const token = signToken(user);

            return { token, user };
        },
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user }
        },
        saveBook: async (parent, { user, body }) => {
            const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $addToSet: { savedBooks: body }},
                { new: true, runValidators: true }, 
            );
            return updatedUser;
        },
        removeBook: async (parent, { user, params }) => {
            const updatedUser = await User.findOneAndUpdate(
                { _id: user._id},
                { $pull: { savedBooks: { bookId: params.bookId }}},
                { new: true }
            )
        }
    }
}

module.exports = resolvers