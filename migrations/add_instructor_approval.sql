-- Add isApproved column to instructors table
ALTER TABLE instructors 
ADD COLUMN is_approved BOOLEAN DEFAULT FALSE;

-- Update existing instructors to be pending approval
UPDATE instructors 
SET is_approved = FALSE 
WHERE is_approved IS NULL;