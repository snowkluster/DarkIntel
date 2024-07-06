import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [lastSearchTime, setLastSearchTime] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleSearch = async () => {
    try {
      const now = Date.now();
      if (lastSearchTime && now - lastSearchTime < 100000) {
        setShowModal(true);
        setModalMessage('Please wait at least 100 seconds between searches.');
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/search/?search_term=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSearchResults(data);
      setLastSearchTime(now);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults([]);
    }
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSearch();
    setSearchTerm('');
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMessage('');
  };

  const renderSearchResults = () => {
    return (
      <Container className="mt-4" style={{ minHeight: '80vh' }}>
        <Row xs={1} md={2} lg={3} className="g-4" style={{ overflowY: 'auto', maxHeight: '100%' }}>
          {searchResults.map((post, index) => (
            <Col key={index}>
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>{post.post_title}</Card.Title>
                  <Card.Text>
                    Replies: {post.replies} | Views: {post.views} <br />
                    Date Posted: {post.date_posted}
                  </Card.Text>
                  <Button variant="primary" href={post.post_link} target="_blank">Go to post</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    );
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Container>
          <Navbar.Brand>Dark Intel</Navbar.Brand>
          <Form className="d-flex ms-auto" onSubmit={handleSubmit}>
            <FormControl
              type="text"
              placeholder="Search"
              className="me-2"
              value={searchTerm}
              onChange={handleInputChange}
            />
            <Button variant="outline-light" type="submit">Search</Button>
          </Form>
        </Container>
      </Navbar>

      {searchResults.length > 0 && renderSearchResults()}

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Search Limit Exceeded</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
