-- ============================================================================
-- HEALTH WORKERS MODULE - SAMPLE DATA FOR TESTING
-- ============================================================================
-- Run this after migrations to populate test data
-- ============================================================================

-- 1. Create test users (health workers)
INSERT INTO public.users (username, password_hash, user_role, assigned_barangay) VALUES
('hw_barangay1', '$2b$10$YourHashedPasswordHere', 'workers', 'Barangay San Jose'),
('hw_barangay2', '$2b$10$YourHashedPasswordHere', 'workers', 'Barangay Mabini'),
('hw_barangay3', '$2b$10$YourHashedPasswordHere', 'workers', 'Barangay Tagumpay')
ON CONFLICT (username) DO NOTHING;

-- 2. Get user IDs for later use (adjust these UUIDs based on actual IDs)
-- SELECT id FROM public.users WHERE username LIKE 'hw_%' LIMIT 3;

-- 3. Create health facilities
INSERT INTO public.health_facilities (name, barangay, latitude, longitude, contact_json, operating_hours) VALUES
('Barangay San Jose Health Center', 'Barangay San Jose', 14.5994, 120.9842, 
  '{"phone": "555-0001", "email": "sjhc@health.gov", "address": "Main St, San Jose"}',
  '{"start": "08:00", "end": "17:00"}'),
  
('Mabini Community Clinic', 'Barangay Mabini', 14.5900, 120.9750,
  '{"phone": "555-0002", "email": "mabini@health.gov", "address": "Health Way, Mabini"}',
  '{"start": "07:00", "end": "18:00"}'),
  
('Tagumpay Birthing Center', 'Barangay Tagumpay', 14.6000, 120.9900,
  '{"phone": "555-0003", "email": "tagumpay@health.gov", "address": "Care Lane, Tagumpay"}',
  '{"start": "06:00", "end": "21:00"}')
ON CONFLICT DO NOTHING;

-- 4. Create sample residents for Barangay San Jose
INSERT INTO public.residents (barangay, purok, full_name, birth_date, sex, contact_number, philhealth_no, created_by) VALUES
('Barangay San Jose', 'Purok 1', 'Maria Santos', '1985-05-15', 'Female', '09123456789', 'PH-2024-001', 
  (SELECT id FROM public.users WHERE username = 'hw_barangay1' LIMIT 1)),
  
('Barangay San Jose', 'Purok 1', 'Juan Dela Cruz', '1990-08-22', 'Male', '09234567890', 'PH-2024-002',
  (SELECT id FROM public.users WHERE username = 'hw_barangay1' LIMIT 1)),
  
('Barangay San Jose', 'Purok 2', 'Rosa Garcia', '1992-12-10', 'Female', '09345678901', 'PH-2024-003',
  (SELECT id FROM public.users WHERE username = 'hw_barangay1' LIMIT 1)),
  
('Barangay San Jose', 'Purok 2', 'Carlos Rodriguez', '1965-03-20', 'Male', '09456789012', 'PH-2024-004',
  (SELECT id FROM public.users WHERE username = 'hw_barangay1' LIMIT 1)),
  
('Barangay San Jose', 'Purok 3', 'Ana Reyes', '1988-07-05', 'Female', '09567890123', 'PH-2024-005',
  (SELECT id FROM public.users WHERE username = 'hw_barangay1' LIMIT 1))
ON CONFLICT DO NOTHING;

-- 5. Create sample vaccination records
INSERT INTO public.vaccination_records (resident_id, vaccine_name, dose_number, vaccine_date, next_dose_date, 
                                        vaccination_site, batch_number, status, notes, administered_by) VALUES
((SELECT id FROM public.residents WHERE full_name = 'Maria Santos' LIMIT 1), 
 'COVID-19 (Pfizer)', 1, '2024-01-15', '2024-02-15', 'left_arm', 'BATCH-001', 'completed',
 'No adverse reactions', (SELECT id FROM public.users WHERE username = 'hw_barangay1' LIMIT 1)),

((SELECT id FROM public.residents WHERE full_name = 'Juan Dela Cruz' LIMIT 1),
 'COVID-19 (Pfizer)', 2, '2024-01-20', NULL, 'right_arm', 'BATCH-002', 'completed',
 'Completed series', (SELECT id FROM public.users WHERE username = 'hw_barangay1' LIMIT 1)),

((SELECT id FROM public.residents WHERE full_name = 'Rosa Garcia' LIMIT 1),
 'BCG', 1, '2023-11-10', NULL, 'left_arm', 'BATCH-003', 'completed',
 'Infant vaccination', (SELECT id FROM public.users WHERE username = 'hw_barangay1' LIMIT 1))
ON CONFLICT DO NOTHING;

-- 6. Create sample maternal health records
INSERT INTO public.maternal_health_records (resident_id, record_type, visit_date, trimester, 
                                            blood_pressure_systolic, blood_pressure_diastolic, weight,
                                            fetal_heart_rate, status, notes, recorded_by) VALUES
((SELECT id FROM public.residents WHERE full_name = 'Maria Santos' LIMIT 1),
 'antenatal', '2024-01-10', 2, 120, 80, 62.5, 145, 'normal',
 'Pregnancy normal, baby growing well', (SELECT id FROM public.users WHERE username = 'hw_barangay1' LIMIT 1)),

((SELECT id FROM public.residents WHERE full_name = 'Rosa Garcia' LIMIT 1),
 'antenatal', '2024-01-15', 1, 118, 78, 58.0, 140, 'normal',
 'Early pregnancy checkup', (SELECT id FROM public.users WHERE username = 'hw_barangay1' LIMIT 1))
ON CONFLICT DO NOTHING;

-- 7. Create sample senior assistance records
INSERT INTO public.senior_assistance_records (resident_id, assistance_type, visit_date,
                                              blood_pressure_systolic, blood_pressure_diastolic,
                                              blood_glucose, medications_given, vital_status, status, 
                                              follow_up_date, notes, recorded_by) VALUES
((SELECT id FROM public.residents WHERE full_name = 'Carlos Rodriguez' LIMIT 1),
 'medical_support', '2024-01-12', 145, 92, 125.5, 'Metformin 500mg x2 daily, Lisinopril 10mg daily',
 'stable', 'completed', '2024-02-12',
 'Blood pressure slightly elevated, advised to reduce salt intake', 
 (SELECT id FROM public.users WHERE username = 'hw_barangay1' LIMIT 1)),

((SELECT id FROM public.residents WHERE full_name = 'Ana Reyes' LIMIT 1),
 'home_care', '2024-01-14', 135, 85, 120.0, 'Vitamins and supplements',
 'improved', 'completed', '2024-01-28',
 'Recovery progressing well after hospitalization',
 (SELECT id FROM public.users WHERE username = 'hw_barangay1' LIMIT 1))
ON CONFLICT DO NOTHING;

-- 8. Create health metrics for dashboard
INSERT INTO public.health_metrics (barangay, metric_type, metric_date, value, target) VALUES
('Barangay San Jose', 'vaccination_coverage', CURRENT_DATE, 65, 95),
('Barangay San Jose', 'maternal_health_coverage', CURRENT_DATE, 80, 90),
('Barangay San Jose', 'senior_assistance_coverage', CURRENT_DATE, 60, 85),
('Barangay San Jose', 'total_visits', CURRENT_DATE, 12, NULL)
ON CONFLICT (barangay, metric_type, metric_date) DO UPDATE SET
  value = EXCLUDED.value;

-- 9. Verify data was inserted
SELECT 'Users' AS type, COUNT(*) AS count FROM public.users WHERE user_role = 'workers'
UNION ALL
SELECT 'Residents', COUNT(*) FROM public.residents WHERE barangay = 'Barangay San Jose'
UNION ALL
SELECT 'Vaccination Records', COUNT(*) FROM public.vaccination_records
UNION ALL
SELECT 'Maternal Health', COUNT(*) FROM public.maternal_health_records
UNION ALL
SELECT 'Senior Assistance', COUNT(*) FROM public.senior_assistance_records;

-- ============================================================================
-- END OF SAMPLE DATA
-- ============================================================================
