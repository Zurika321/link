<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nhập Thông Tin Hình Chữ Nhật</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .container {
            border: 1px solid #ccc;
            padding-left: 20px;
            padding-right: 35px;
            border-radius: 5px;
            width: 300px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        input {
            width: 100%;
            padding: 8px;
            margin: 10px 0;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        button {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 10px;
            border-radius: 4px;
            cursor: pointer;
            width: 100%;
        }
        button:hover {
            background-color: #45a049;
        }
        .result {
            margin-top: 20px;
            font-size: 18px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Nhập Thông Tin Hình Chữ Nhật</h2>
        <form id="rectangleForm" method="post">
            <label for="length">Chiều dài:</label>
            <input type="number" id="length" name="length" step="any" required>
            <label for="width">Chiều rộng:</label>
            <input type="number" id="width" name="width" step="any" required>
            <button type="submit">Tính</button>
        </form>
        <?php
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $length = floatval($_POST['length']);
            $width = floatval($_POST['width']);
            $result = $length * $width;

            echo "<div class='result'>";
            echo "<p>Kết quả: $result</p>";
            echo "</div>";
        }
        ?>
    </div>
</body>
</html>
