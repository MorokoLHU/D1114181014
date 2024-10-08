<?php
$row_num = $_GET['row_num'];
$col_num = $_GET['col_num'];
$gender = $_GET['gender'];
$dept = $_GET['dept'];
$message = $_GET['message'];
echo '表格大小'. $row_num .'列'. $col_num .'行';
echo '<br>';
echo '性別為'.$gender.'。';
echo '<br>';
echo '科系是'.$dept.'。';
echo '<br>';
echo '留言'.$message.'。';
echo '<br>';


?>

<?php
// 檢查是否設置了 col_num 和 row_num

    
    // 驗證輸入值
    if ($col_num > 0 && $row_num > 0) {
      
        // 生成表格
        echo "<table border=\"1\">";
        // 生成表頭
        echo "<tr>";
        for ($i = 1; $i <= $col_num; $i++) {
            echo "<th>行 $i</th>";
        }
        echo "</tr>";
        
        // 生成表身
        for ($j = 1; $j <= $row_num; $j++) {
            echo "<tr>";
            for ($i = 1; $i <= $col_num; $i++) {
                echo "<td>列 $j 行 $i</td>";
            }
            echo "</tr>";
        }
        echo "</table>";
        
        echo "</body>
        </html>";
    } else {
        echo "請輸入正整數的行數和列數。";
    }

?>