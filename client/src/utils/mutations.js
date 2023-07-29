import { gql } from '@apollo/client';

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

export const REMOVE_BOOK = gql`
mutation Mutation($bookId: ID!) {
    removeBook(bookId: $bookId) {
        savedBooks {
        bookId
        }
    }
}
`