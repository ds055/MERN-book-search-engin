import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

import { useMutation, useQuery } from '@apollo/client';
import Auth from '../utils/auth';

// use GET_ME query to get current user data
import { GET_ME } from '../utils/queries';
// removes book from local storage
import { removeBookId } from '../utils/localStorage';
// use REMOVE_BOOK from mutation.js to delete book from the db
import { REMOVE_BOOK } from '../utils/mutations'

const SavedBooks = () => {
  // mutation to remove book from user's list
  const [deleteBook, { err }] = useMutation(REMOVE_BOOK);

  // gets current user data via query; refetch allows data to be refreshed upon book deletion
  const { loading, data, refetch } = useQuery(GET_ME, );
  const userData = data?.me || {};

  // ensure the user is logged in
  const token = Auth.loggedIn() ? Auth.getToken() : null;

  if (!token) {
    return false;
  }

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      // pass in id of book to delete selected book; id passed in during mapped content creation below
      const { data } = await deleteBook({
        variables: {bookId},
      })

      if (!data)  {
        throw new Error('something went wrong!');
      }
      
      // upon success, remove book's id from localStorage and then refresh the userData to make page reflect updates
      removeBookId(bookId);
      refetch();
      
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div fluid="true" className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length 
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {/* cards created based on user data from db */}
          {userData.savedBooks.map((book) => {
            return (
              <Col key={book.bookId} md="4">
                <Card key={book.bookId} border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
