const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

// Sử dụng body-parser để đọc dữ liệu từ body của request
app.use(bodyParser.json());

// Đọc dữ liệu từ file `data.txt`
const readDataFile = () => {
  try {
    const data = fs.readFileSync('data.txt', 'utf8');
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Lỗi đọc file:', err);
    return [];
  }
};

// Ghi dữ liệu vào file `data.txt`
const writeDataFile = (data) => {
  try {
    fs.writeFileSync('data.txt', JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Lỗi ghi file:', err);
  }
};

// API thêm thông tin mượn sách
app.post('/borrow', (req, res) => {
  const { name, class: userClass, book, date } = req.body;
  
  const borrowData = {
    type: 'borrow',
    name,
    class: userClass,
    book,
    date,
    returnDate: '--'
  };

  // Đọc dữ liệu hiện tại trong file
  const currentData = readDataFile();

  // Thêm thông tin mới vào dữ liệu
  currentData.push(borrowData);

  // Ghi lại dữ liệu vào file
  writeDataFile(currentData);

  res.send({ message: 'Mượn sách thành công!', data: borrowData });
});

// API cập nhật thông tin trả sách
app.post('/return', (req, res) => {
  const { name, book, returnDate } = req.body;

  const currentData = readDataFile();

  // Cập nhật thông tin trả sách
  currentData.forEach((item) => {
    if (item.book === book && item.returnDate === '--') {
      item.returnDate = returnDate;
    }
  });

  writeDataFile(currentData);

  res.send({ message: 'Trả sách thành công!', data: currentData });
});

// API lấy toàn bộ thông tin
app.get('/statistics', (req, res) => {
  const currentData = readDataFile();
  res.json(currentData);
});

// Cung cấp static files (HTML, CSS, JS)
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
