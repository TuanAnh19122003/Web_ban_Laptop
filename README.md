- Để chạy file cần tải thêm ứng dụng mongodb theo đường dẫn : https://www.mongodb.com/try/download/shell

- Lệnh chạy file: npm start
- Lệnh tạo nhánh cho thành viên nhóm trên github: git checkout -b feature/your-feature-name

- Cập Nhật Nhánh của Bạn:
+ Nếu bạn đang làm việc trên một nhánh khác, hãy chuyển sang nhánh đó hoặc trở về nhánh chính:
  * git checkout feature/your-feature-name
  * git check master

- Hợp Nhánh Tính Năng vào Nhánh Chính
 + Giả sử bạn có một nhánh tính năng (ví dụ: feature/login-page) mà bạn muốn hợp vào nhánh main. Chạy lệnh sau:
  * git merge feature/login-page

- Lệnh đẩy code lên git: 
B1: git add .
B2: git commit -m"vt gi cx dc"
B3: git push -u origin master 
    nếu là nhánh thì đổi thành git push origin feature/(tên nhánh của bạn)
