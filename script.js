// Hàm để thêm sách vào bảng khi nhấn nút "Thêm"
document.getElementById("borrow-form").addEventListener("submit", function(e) {
    e.preventDefault();

    // Lấy dữ liệu từ các ô input
    const bookName = document.getElementById("book-name").value;
    const author = document.getElementById("author").value;
    const borrower = document.getElementById("borrower").value;
    const className = document.getElementById("class").value;
    const borrowDate = document.getElementById("borrow-date").value;
    const daysBorrowed = document.getElementById("days-borrowed").value;

    // Kiểm tra nếu dữ liệu cần thiết không bị thiếu
    if (!bookName || !author || !borrower || !className || !borrowDate || !daysBorrowed) {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
    }

    // Tính toán ngày trả (sử dụng giá trị ngày mượn và số ngày mượn, nhưng để trống trong bảng)
    const returnDate = new Date(borrowDate);
    returnDate.setDate(returnDate.getDate() + parseInt(daysBorrowed));

    // Tạo đối tượng sách
    const bookData = {
        bookName,
        author,
        borrower,
        className,
        borrowDate,
        daysBorrowed,
        returnDate: returnDate.toLocaleDateString(),
        status: ""
    };

    // Lưu thông tin sách vào localStorage
    const books = JSON.parse(localStorage.getItem("books")) || [];
    books.push(bookData);
    localStorage.setItem("books", JSON.stringify(books));

    // Hiển thị sách trong bảng
    displayBooks();

    // Clear form inputs
    document.getElementById("borrow-form").reset();
});

// Hiển thị sách từ localStorage lên bảng
function displayBooks() {
    const table = document.getElementById("book-table").getElementsByTagName("tbody")[0];
    table.innerHTML = ""; // Xóa bảng cũ

    const books = JSON.parse(localStorage.getItem("books")) || [];
    books.forEach((book, index) => {
        const newRow = table.insertRow();
        newRow.innerHTML = `
            <td>${book.bookName}</td>
            <td>${book.author}</td>
            <td>${book.borrower}</td>
            <td>${book.className}</td>
            <td>${book.borrowDate}</td>
            <td>${book.daysBorrowed}</td>
            <td>${book.returnDate}</td>
            <td>${book.status}</td>
            <td><button onclick="editBook(this, ${index})">Chỉnh sửa</button></td>
        `;
    });
}

// Hiển thị hộp chỉnh sửa
function editBook(button, index) {
    const books = JSON.parse(localStorage.getItem("books")) || [];
    const book = books[index];

    // Chèn dữ liệu vào form chỉnh sửa
    document.getElementById("edit-book-name").value = book.bookName;
    document.getElementById("edit-author").value = book.author;
    document.getElementById("edit-borrower").value = book.borrower;
    document.getElementById("edit-class").value = book.className;
    document.getElementById("edit-borrow-date").value = book.borrowDate;
    document.getElementById("edit-days-borrowed").value = book.daysBorrowed;
    document.getElementById("edit-return-date").value = book.returnDate;
    document.getElementById("edit-status").value = book.status;

    // Hiển thị hộp chỉnh sửa
    document.getElementById("edit-box").style.display = "block";
    document.body.classList.add("modal-open");

    // Cập nhật thông tin khi nhấn nút "Cập nhật"
    document.getElementById("edit-form").onsubmit = function(e) {
        e.preventDefault();

        const updatedBookName = document.getElementById("edit-book-name").value;
        const updatedAuthor = document.getElementById("edit-author").value;
        const updatedBorrower = document.getElementById("edit-borrower").value;
        const updatedClass = document.getElementById("edit-class").value;
        const updatedBorrowDate = document.getElementById("edit-borrow-date").value;
        const updatedDaysBorrowed = document.getElementById("edit-days-borrowed").value;

        // Kiểm tra nếu dữ liệu cần thiết không bị thiếu
        if (!updatedBookName || !updatedAuthor || !updatedBorrower || !updatedClass || !updatedBorrowDate || !updatedDaysBorrowed) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        // Cập nhật thông tin vào mảng sách
        const updatedReturnDate = new Date(updatedBorrowDate);
        updatedReturnDate.setDate(updatedReturnDate.getDate() + parseInt(updatedDaysBorrowed));

        books[index] = {
            bookName: updatedBookName,
            author: updatedAuthor,
            borrower: updatedBorrower,
            className: updatedClass,
            borrowDate: updatedBorrowDate,
            daysBorrowed: updatedDaysBorrowed,
            returnDate: updatedReturnDate.toLocaleDateString(),
            status: document.getElementById("edit-status").value
        };

        // Lưu lại dữ liệu đã cập nhật vào localStorage
        localStorage.setItem("books", JSON.stringify(books));

        // Hiển thị lại sách
        displayBooks();

        // Đóng hộp chỉnh sửa
        document.getElementById("edit-box").style.display = "none";
        document.body.classList.remove("modal-open");
    };
}

// Đóng hộp chỉnh sửa khi nhấn X
document.getElementById("close-edit-box").addEventListener("click", function() {
    document.getElementById("edit-box").style.display = "none";
    document.body.classList.remove("modal-open");
});

// Hiển thị sách từ localStorage khi trang được tải
window.onload = displayBooks;
