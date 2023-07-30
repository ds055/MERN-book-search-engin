import { gql } from '@apollo/client';

// add user to DB
export const ADD_USER = gql`
mutation ADD_USER($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
        user {
            username,
            email,
        }
        token
}
  }
`

// Login user to page: required to save or delete books
export const LOGIN_USER = gql`
mutation LOGIN_USER($email: String!, $password: String!) {
    login(email: $email, password: $password) {
        user {
            username
            _id
        }
        token
    }
}
`

// save book to user's list
export const SAVE_BOOK = gql`
mutation Mutation($input: BookInput) {
  saveBook(BookInput: $input) {
    _id
    username
    email
    bookCount
    savedBooks {
      authors
      bookId
      description
      image
      link
      title
    }
  }
}
`

// remove book from user's list
export const REMOVE_BOOK = gql`
mutation Mutation($bookId: ID!) {
    removeBook(bookId: $bookId) {
        savedBooks {
        bookId
        }
    }
}
`