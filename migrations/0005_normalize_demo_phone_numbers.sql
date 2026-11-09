-- Normalize legacy fictional demo records so history follows the same rule.
UPDATE applications
SET student_phone = CASE student_id
  WHEN 4 THEN '085-456-5589'
  ELSE '081-000-0000'
END
WHERE student_phone IS NOT NULL
  AND (
    LENGTH(REPLACE(REPLACE(student_phone, '-', ''), ' ', '')) != 10
    OR SUBSTR(REPLACE(REPLACE(student_phone, '-', ''), ' ', ''), 1, 1) != '0'
  );
