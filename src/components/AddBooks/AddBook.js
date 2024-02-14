import React, { useState } from "react";
import axios from "axios";
import Navigation from "../Navigation/Navigation";
import Grid from "../Grid/Grid";

const AddBooks = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [quantity, setQuantity] = useState("");
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState(false);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value);
  };

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };

  const handleSearch = () => {
    axios
      .get(`https://www.googleapis.com/books/v1/volumes?q=${search}`)
      .then((res) => {
        setBooks(res?.data?.items);
      })
      .catch((err) => console.log(err));
  };

  const handleBookClick = (book) => {
    setSelectedBook(book);
    setOrderQuantity(1);
  };

  const handleOrderQuantityChange = (event) => {
    setOrderQuantity(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Add logic here to handle the form submission, such as sending data to a backend server or updating state variables.
    if (selectedBook) {
      const newBook = {
        title: selectedBook.volumeInfo.title,
        author: selectedBook.volumeInfo.authors[0],
        quantity: orderQuantity,
      };
      // Further processing
      setTitle("");
      setAuthor("");
      setQuantity("");
      setSelectedBook(null);
      setOrderQuantity(1);
      setOrderSuccess(true);
      setOrderError(false);
    } else {
      setOrderError(true);
      setOrderSuccess(false);
    }
  };

  const handleBookLinkClick = (bookUrl) => {
    console.log(`Opening book URL: ${bookUrl}`);
    // Open the book URL in a new tab or window
  };

  return (
    <div>
      <Navigation />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Enter title"
        />
        <input
          type="text"
          value={author}
          onChange={handleAuthorChange}
          placeholder="Enter author"
        />
        <input
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          placeholder="Enter quantity"
        />
        <button type="submit">Add Book</button>
      </form>

      <div>
        <h2>Search Books</h2>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Enter search term"
        />
        <button onClick={handleSearch}>Search</button>
        
        {books.map((book) => (
  <li key={book.id}>
    <div onClick={() => handleBookClick(book)}>
      <a
        href={book.volumeInfo.infoLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src={book.volumeInfo.imageLinks?.thumbnail}
          alt="Book Thumbnail"
        />
      </a>
      <div>
        <h3>
          <a
            href={book.volumeInfo.infoLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            {book.volumeInfo.title}
          </a>
        </h3>
        <p>{book.volumeInfo.description}</p>
        <p>Price: {book.saleInfo?.listPrice?.amount}</p>
      </div>
    </div>
    <input
      type="number"
      value={orderQuantity}
      onChange={handleOrderQuantityChange}
      placeholder="Quantity"
    />
    <button type="submit">Order</button>
  </li>
))}
    
      </div>

      {selectedBook && (
        <div>
          <h2>Selected Book</h2>
          <p>Title: {selectedBook.volumeInfo.title}</p>
          <p>Author: {selectedBook.volumeInfo.authors[0]}</p>
          <p>Quantity: {quantity}</p>
          <p>Price: {selectedBook.saleInfo?.listPrice?.amount}</p>
          <input
            type="number"
            value={orderQuantity}
            onChange={handleOrderQuantityChange}
            placeholder="Quantity"

          />
          <button type="submit">Order Book</button>
        </div>
      )}

      {orderSuccess && <p>Success!</p>}
      {orderError && <p>Error placing order. Please try again.</p>}
    </div>
  );
};

export default AddBooks;