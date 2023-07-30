const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth')

const resolvers = {
    Query: {
        me: async (parent, { _id }, context) => {
            return User.findOne({ _id: context.user._id }).populate('savedBooks');
        },
        // Test function to see if addUser works
        allUsers: async () => {
            return User.find().populate('savedBooks');
        }
    },

    Mutation: {
        // logs in user
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
        // create new user
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user }
        },
        // save book to user's list/array
        saveBook: async (parent, { BookInput }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: BookInput }},
                    { new: true, runValidators: true }, 
                );
                return updatedUser;
            } 
        },
        // remove a saved book from user's list 
        removeBook: async (parent, { bookId }, context) => {
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id},
                { $pull: { savedBooks: { bookId: bookId }}},
                { new: true }
            );
            return updatedUser;
        }
    }
}

module.exports = resolvers