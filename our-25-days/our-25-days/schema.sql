CREATE TABLE IF NOT EXISTS memories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  day_number INT UNIQUE NOT NULL,
  release_date DATE NOT NULL,
  title VARCHAR(255) NOT NULL,
  text_content TEXT NOT NULL,
  media_url VARCHAR(255) NOT NULL,
  media_type ENUM('image', 'video', 'audio') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO memories (day_number, release_date, title, text_content, media_url, media_type) VALUES
(1, '2025-07-01', 'A beautiful start', 'This is a memory for day 1.', 'https://example.com/image.jpg', 'image');
