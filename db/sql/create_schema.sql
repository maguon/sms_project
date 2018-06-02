CREATE SCHEMA `sms` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'lxq'@'%' IDENTIFIED BY 'lxq_sms';

GRANT ALL privileges ON sms.* TO 'lxq'@'localhost'IDENTIFIED BY 'lxq_sms';