CREATE TABLE IF NOT EXISTS memories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  day_number INT UNIQUE NOT NULL,
  release_date DATE NOT NULL,
  display_settings JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS memory_blocks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  memory_id INT NOT NULL,
  block_type ENUM('title', 'paragraph', 'image', 'quote', 'highlight') NOT NULL,
  content TEXT NOT NULL,
  sort_order INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (memory_id) REFERENCES memories(id) ON DELETE CASCADE
);

-- Seed data for 25 days
INSERT INTO memories (day_number, release_date) VALUES
(1, '2025-07-20'), (2, '2025-07-21'), (3, '2025-07-22'), (4, '2025-07-23'), (5, '2025-07-24'),
(6, '2025-07-25'), (7, '2025-07-26'), (8, '2025-07-27'), (9, '2025-07-28'), (10, '2025-07-29'),
(11, '2025-07-30'), (12, '2025-07-31'), (13, '2025-08-01'), (14, '2025-08-02'), (15, '2025-08-03'),
(16, '2025-08-04'), (17, '2025-08-05'), (18, '2025-08-06'), (19, '2025-08-07'), (20, '2025-08-08'),
(21, '2025-08-09'), (22, '2025-08-10'), (23, '2025-08-11'), (24, '2025-08-12'), (25, '2025-08-13');

-- Example content for Day 1
INSERT INTO memory_blocks (memory_id, block_type, content, sort_order) VALUES
(1, 'title', 'Our First Day', 0),
(1, 'image', '/uploads/1752153142263-sample_receipt.jpg', 1),
(1, 'paragraph', 'Remember this? The very first time we went out for a coffee. It was a bit awkward, but also perfect.', 2),
(1, 'quote', '"I think I''m falling for you."', 3);
