class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  addBookToList(book) {
    const list = document.getElementById('book-list');

    // Create <tr> element
    const row = document.createElement('tr');

    // Insert cols
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="delete">X</a></td>
    `;

    list.appendChild(row);
  }

  showAlert(message, className) {
    // Create div
    const div = document.createElement('div');
    
    // Add classes
    div.className = `alert ${className}`;

    // Add text
    div.appendChild(document.createTextNode(message));

    // Get parent
    const container = document.querySelector('.container');

    // Get form
    const form = document.querySelector('#book-form');

    // Insert alert
    container.insertBefore(div, form);

    // Timeout after 3 seconds
    setTimeout(function() {
      document.querySelector('.alert').remove();
    }, 3000);
  }

  deleteBook(target) {
    if(target.className === 'delete') {
      target.parentElement.parentElement.remove(); // Removes li tag (li (parent of td) > td (parent of a) > a)
    }
  }

  clearFields() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
  }
}

// Local storage class
class Store {
  static getBooks() {
    let books;

    if(localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  static displayBooks() {
    const books = Store.getBooks();

    books.forEach(function(book) {
      // Instantiate class
      const ui = new UI;

      // Add book to UI
      ui.addBookToList(book);
    });
  }

  static addBook(book) {
    const books = Store.getBooks();

    books.push(book);

    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach(function(book, index) { // Within callback, 'book' is the iteration. Callback takes in an index parameter.
      if(book.isbn === isbn) {
        books.splice(index, 1); // Setting the splice at the index of the iteration
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}

// DOM load event
document.addEventListener('DOMContentLoaded', Store.displayBooks);

// Add book event listener
document.getElementById('book-form').addEventListener('submit', function(e){

  // Get form values
  const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value

  // Instantiate book
  const book = new Book(title, author, isbn);

  // Instantiate UI object
  const ui = new UI();

  // Validate input
  if(title === '' || author === '' || isbn === '') {
    // Error message
    ui.showAlert('Please fill in all fields', 'error');
  } else {
    // Add book to list
    ui.addBookToList(book);

    // Add to LS
    Store.addBook(book); // Does not need to be instantiated as it is a static method

    // Success message
    ui.showAlert('Book added!', 'success');

    // Clear input fields
    ui.clearFields();
  }

  e.preventDefault();
});

// Delete book event listener
document.getElementById('book-list').addEventListener('click', function(e) {

  // Instantiate UI object
  const ui = new UI();

  // Delete book
  ui.deleteBook(e.target);

  // Remove from LS
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent); // Grab the ISBN number of the book

  // Show message
  ui.showAlert('Book removed!', 'success');

  e.preventDefault();
});