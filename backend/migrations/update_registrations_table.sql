-- Migration script to update registrations table
-- Run this script to add missing columns and fix status enum

-- Add missing columns if they don't exist
ALTER TABLE `registrations` 
ADD COLUMN IF NOT EXISTS `cnic` varchar(15) DEFAULT NULL AFTER `phone`,
ADD COLUMN IF NOT EXISTS `application_id` varchar(20) DEFAULT NULL AFTER `cnic`,
ADD COLUMN IF NOT EXISTS `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP AFTER `status`,
ADD COLUMN IF NOT EXISTS `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER `created_at`;

-- Add indexes for better performance
ALTER TABLE `registrations` 
ADD INDEX IF NOT EXISTS `idx_email` (`email`),
ADD INDEX IF NOT EXISTS `idx_cnic` (`cnic`),
ADD UNIQUE INDEX IF NOT EXISTS `unique_application_id` (`application_id`);

-- Update status enum to include 'Payment Pending'
-- First, modify the enum to include the new value
ALTER TABLE `registrations` 
MODIFY COLUMN `status` enum('Payment Pending','Pending','Verified','Rejected') DEFAULT 'Payment Pending';

-- Update existing records that have 'Pending' status to 'Payment Pending' if they don't have a slip
UPDATE `registrations` 
SET `status` = 'Payment Pending' 
WHERE `status` = 'Pending' AND (`slip` IS NULL OR `slip` = '');

-- Update existing records that have 'Pending' status to 'Verified' if they have a slip
UPDATE `registrations` 
SET `status` = 'Verified' 
WHERE `status` = 'Pending' AND `slip` IS NOT NULL AND `slip` != '';

-- Add sample CNIC and application_id for existing records if they're NULL
UPDATE `registrations` 
SET 
  `cnic` = CONCAT('12345-', LPAD(id, 7, '0'), '-', FLOOR(RAND() * 9) + 1),
  `application_id` = CONCAT('REG-', DATE_FORMAT(created_at, '%Y%m%d'), '-', LPAD(id, 4, '0'))
WHERE `cnic` IS NULL OR `application_id` IS NULL;

-- Verify the changes
SELECT 
  id, 
  name, 
  email, 
  cnic, 
  application_id, 
  course_title, 
  status, 
  slip,
  created_at,
  updated_at
FROM `registrations` 
ORDER BY id DESC; 