CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- default password hash below corresponds to: admin123
INSERT INTO `users` (`email`, `password`, `role`)
VALUES (
  'tarangvaghani@gmail.com',
  '$2b$10$uCX2RBwQ4C6odW3j9A0bH.utXXSFFj7CMfXZQfJQxly3A6zz0BbZu',
  'admin'
)
ON DUPLICATE KEY UPDATE
  `password` = VALUES(`password`),
  `role` = VALUES(`role`);
