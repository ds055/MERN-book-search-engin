import { gql } from '@apollo/client';

// retrieves all current user data--including saved books
export const GET_ME = gql`
    query ExampleQuery {
        me {
            _id
            bookCount
            email
            savedBooks {
                authors
                bookId
                description
                image
                link
                title
            }
            username
        }
    }
`