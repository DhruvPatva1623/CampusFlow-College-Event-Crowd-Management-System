-- CampusFlow database
-- import this file in phpMyAdmin (Import tab)

CREATE DATABASE IF NOT EXISTS campusflow;
USE campusflow;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  enrollment_no VARCHAR(30) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL,
  branch VARCHAR(50) NOT NULL,
  year INT NOT NULL,
  phone VARCHAR(15) NOT NULL
);

CREATE TABLE IF NOT EXISTS events (
  event_id INT AUTO_INCREMENT PRIMARY KEY,
  event_name VARCHAR(100) NOT NULL,
  category VARCHAR(30) NOT NULL,
  event_date DATE NOT NULL,
  event_time VARCHAR(20) NOT NULL,
  venue VARCHAR(100) NOT NULL,
  capacity INT NOT NULL,
  description TEXT,
  instructions TEXT
);

CREATE TABLE IF NOT EXISTS registrations (
  registration_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  event_id INT NOT NULL,
  registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'REGISTERED',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE,
  UNIQUE (user_id, event_id)
);

CREATE TABLE IF NOT EXISTS admins (
  admin_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

-- sample events
INSERT INTO events (event_name, category, event_date, event_time, venue, capacity, description, instructions) VALUES
('TechFest 2026', 'Technical', '2026-11-15', '10:00 AM', 'Main Auditorium', 300,
 'Yearly technical fest with coding contests, project exhibition and talks by guest speakers.',
 'Carry your college ID card. Laptops are allowed only in the coding contest hall.'),
('Cultural Night 2026', 'Cultural', '2026-12-05', '06:00 PM', 'Open Air Theatre', 500,
 'An evening of music, dance and drama performances by students of all departments.',
 'Enter only through the assigned gates and keep the aisles clear.'),
('Sports Meet 2026', 'Sports', '2026-11-28', '08:00 AM', 'College Ground', 200,
 'Inter-department sports meet with cricket, football, kabaddi and athletics.',
 'Wear sports shoes, carry a water bottle and report to your department captain.'),
('Web Development Workshop', 'Workshop', '2026-10-25', '02:00 PM', 'Computer Lab 3', 60,
 'Hands-on workshop on HTML, CSS, JavaScript and PHP for beginners.',
 'Bring your own laptop if you can. Basic computer knowledge is enough.');

-- organizer account:
-- no account is added here. Create your own after importing:
-- 1. make a hash:  php -r "echo password_hash('your_password', PASSWORD_DEFAULT);"
-- 2. run this in phpMyAdmin (SQL tab) with your own username and the hash:
--    INSERT INTO admins (username, password) VALUES ('your_username', 'paste_hash_here');
