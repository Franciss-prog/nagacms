-- ============================================================================
-- HEALTH INDICATORS SAMPLE DATA FOR TESTING & QUERIES
-- ============================================================================
-- This script provides comprehensive sample data for the health_indicators table
-- Ready to use with Supabase
-- ============================================================================

-- NOTE: Replace the UUIDs below with actual UUIDs from your:
-- 1. residents table (resident_id)
-- 2. users table (recorded_by)
-- Or use these sample UUIDs if you've already created test data

-- STEP 1: Insert Blood Pressure readings (systolic/diastolic format)
INSERT INTO public.health_indicators 
(id, resident_id, indicator_type, value, unit, status, notes, recorded_by, recorded_at, created_at)
VALUES
('550e8400-e29b-41d4-a716-446655440001'::uuid, '650e8400-e29b-41d4-a716-446655440001'::uuid, 'blood_pressure', 120, 'mmHg', 'normal', 'Systolic 120/Diastolic 80', 'f6306fad-40d1-4b8d-bb9e-5817242e059b'::uuid, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
('550e8400-e29b-41d4-a716-446655440002'::uuid, '650e8400-e29b-41d4-a716-446655440001'::uuid, 'blood_pressure', 140, 'mmHg', 'warning', 'Systolic 140/Diastolic 90 - Elevated', 'f6306fad-40d1-4b8d-bb9e-5817242e059b'::uuid, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
('550e8400-e29b-41d4-a716-446655440003'::uuid, '650e8400-e29b-41d4-a716-446655440002'::uuid, 'blood_pressure', 160, 'mmHg', 'critical', 'Systolic 160/Diastolic 100 - Hypertensive Crisis', 'f6306fad-40d1-4b8d-bb9e-5817242e059b'::uuid, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
('550e8400-e29b-41d4-a716-446655440004'::uuid, '650e8400-e29b-41d4-a716-446655440003'::uuid, 'blood_pressure', 118, 'mmHg', 'normal', 'Systolic 118/Diastolic 78', 'f6306fad-40d1-4b8d-bb9e-5817242e059b'::uuid, NOW() - INTERVAL '1 days', NOW() - INTERVAL '1 days'),

-- STEP 2: Insert Temperature readings
('550e8400-e29b-41d4-a716-446655440005'::uuid, '650e8400-e29b-41d4-a716-446655440001'::uuid, 'temperature', 36.8, '°C', 'normal', 'Normal body temperature', 'f6306fad-40d1-4b8d-bb9e-5817242e059b'::uuid, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
('550e8400-e29b-41d4-a716-446655440006'::uuid, '650e8400-e29b-41d4-a716-446655440002'::uuid, 'temperature', 38.5, '°C', 'warning', 'Elevated temperature - possible infection', 'f6306fad-40d1-4b8d-bb9e-5817242e059b'::uuid, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
('550e8400-e29b-41d4-a716-446655440007'::uuid, '650e8400-e29b-41d4-a716-446655440003'::uuid, 'temperature', 39.8, '°C', 'critical', 'High fever - requires immediate attention', 'f6306fad-40d1-4b8d-bb9e-5817242e059b'::uuid, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655440008'::uuid, '650e8400-e29b-41d4-a716-446655440004'::uuid, 'temperature', 37.2, '°C', 'normal', 'Normal temperature', 'f6306fad-40d1-4b8d-bb9e-5817242e059b'::uuid, NOW(), NOW()),

-- STEP 3: Insert Weight measurements (in kg)
('550e8400-e29b-41d4-a716-446655440009'::uuid, '650e8400-e29b-41d4-a716-446655440001'::uuid, 'weight', 68.5, 'kg', 'normal', 'Healthy weight for adult', 'f6306fad-40d1-4b8d-bb9e-5817242e059b'::uuid, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
('550e8400-e29b-41d4-a716-446655440010'::uuid, '650e8400-e29b-41d4-a716-446655440002'::uuid, 'weight', 82.3, 'kg', 'warning', 'Overweight - monitor diet and exercise', 'f6306fad-40d1-4b8d-bb9e-5817242e059b'::uuid, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
('550e8400-e29b-41d4-a716-446655440011'::uuid, '650e8400-e29b-41d4-a716-446655440003'::uuid, 'weight', 95.0, 'kg', 'critical', 'Obese - requires medical intervention', 'f6306fad-40d1-4b8d-bb9e-5817242e059b'::uuid, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
('550e8400-e29b-41d4-a716-446655440012'::uuid, '650e8400-e29b-41d4-a716-446655440004'::uuid, 'weight', 72.1, 'kg', 'normal', 'Healthy weight', 'f6306fad-40d1-4b8d-bb9e-5817242e059b'::uuid, NOW() - INTERVAL '1 days', NOW() - INTERVAL '1 days'),

-- STEP 4: Insert Height measurements (in cm)
('550e8400-e29b-41d4-a716-446655440013'::uuid, '650e8400-e29b-41d4-a716-446655440001'::uuid, 'height', 170, 'cm', 'normal', 'Height recorded for BMI calculation', 'f6306fad-40d1-4b8d-bb9e-5817242e059b'::uuid, NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'),
('550e8400-e29b-41d4-a716-446655440014'::uuid, '650e8400-e29b-41d4-a716-446655440002'::uuid, 'height', 165, 'cm', 'normal', 'Height recorded', 'f6306fad-40d1-4b8d-bb9e-5817242e059b'::uuid, NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days'),
('550e8400-e29b-41d4-a716-446655440015'::uuid, '650e8400-e29b-41d4-a716-446655440003'::uuid, 'height', 175, 'cm', 'normal', 'Height recorded', 'f6306fad-40d1-4b8d-bb9e-5817242e059b'::uuid, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
('550e8400-e29b-41d4-a716-446655440016'::uuid, '650e8400-e29b-41d4-a716-446655440004'::uuid, 'height', 168, 'cm', 'normal', 'Height recorded', 'f6306fad-40d1-4b8d-bb9e-5817242e059b'::uuid, NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),

-- STEP 5: Insert BMI measurements
('550e8400-e29b-41d4-a716-446655440017'::uuid, '650e8400-e29b-41d4-a716-446655440001'::uuid, 'bmi', 23.7, 'kg/m²', 'normal', 'Healthy BMI range (18.5-24.9)', 'f6306fad-40d1-4b8d-bb9e-5817242e059b'::uuid, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
('550e8400-e29b-41d4-a716-446655440018'::uuid, '650e8400-e29b-41d4-a716-446655440002'::uuid, 'bmi', 30.2, 'kg/m²', 'warning', 'Overweight (25.0-29.9) to Obese borderline', 'f6306fad-40d1-4b8d-bb9e-5817242e059b'::uuid, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
('550e8400-e29b-41d4-a716-446655440019'::uuid, '650e8400-e29b-41d4-a716-446655440003'::uuid, 'bmi', 31.0, 'kg/m²', 'critical', 'Obese class I - health risk', 'f6306fad-40d1-4b8d-bb9e-5817242e059b'::uuid, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
('550e8400-e29b-41d4-a716-446655440020'::uuid, '650e8400-e29b-41d4-a716-446655440004'::uuid, 'bmi', 25.5, 'kg/m²', 'warning', 'Overweight (25.0-29.9)', 'f6306fad-40d1-4b8d-bb9e-5817242e059b'::uuid, NOW() - INTERVAL '1 days', NOW() - INTERVAL '1 days'),

-- STEP 6: Insert Heart Rate measurements (in bpm)
('550e8400-e29b-41d4-a716-446655440021'::uuid, '650e8400-e29b-41d4-a716-446655440001'::uuid, 'heart_rate', 72, 'bpm', 'normal', 'Normal resting heart rate', 'f6306fad-40d1-4b8d-bb9e-5817242e059b'::uuid, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
('550e8400-e29b-41d4-a716-446655440022'::uuid, '650e8400-e29b-41d4-a716-446655440002'::uuid, 'heart_rate', 95, 'bpm', 'warning', 'Elevated heart rate - stress or illness', 'f6306fad-40d1-4b8d-bb9e-5817242e059b'::uuid, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
('550e8400-e29b-41d4-a716-446655440023'::uuid, '650e8400-e29b-41d4-a716-446655440003'::uuid, 'heart_rate', 120, 'bpm', 'critical', 'Tachycardia - requires monitoring', 'f6306fad-40d1-4b8d-bb9e-5817242e059b'::uuid, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655440024'::uuid, '650e8400-e29b-41d4-a716-446655440004'::uuid, 'heart_rate', 68, 'bpm', 'normal', 'Normal heart rate', 'f6306fad-40d1-4b8d-bb9e-5817242e059b'::uuid, NOW(), NOW()),

-- STEP 7: Insert Glucose/Blood Sugar measurements (in mg/dL)
('550e8400-e29b-41d4-a716-446655440025'::uuid, '650e8400-e29b-41d4-a716-446655440001'::uuid, 'glucose', 95, 'mg/dL', 'normal', 'Normal fasting glucose', 'f6306fad-40d1-4b8d-bb9e-5817242e059b'::uuid, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
('550e8400-e29b-41d4-a716-446655440026'::uuid, '650e8400-e29b-41d4-a716-446655440002'::uuid, 'glucose', 126, 'mg/dL', 'warning', 'Pre-diabetic range', 'f6306fad-40d1-4b8d-bb9e-5817242e059b'::uuid, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
('550e8400-e29b-41d4-a716-446655440027'::uuid, '650e8400-e29b-41d4-a716-446655440003'::uuid, 'glucose', 250, 'mg/dL', 'critical', 'Diabetic range - requires treatment', 'f6306fad-40d1-4b8d-bb9e-5817242e059b'::uuid, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
('550e8400-e29b-41d4-a716-446655440028'::uuid, '650e8400-e29b-41d4-a716-446655440004'::uuid, 'glucose', 105, 'mg/dL', 'normal', 'Normal glucose level', 'f6306fad-40d1-4b8d-bb9e-5817242e059b'::uuid, NOW() - INTERVAL '1 days', NOW() - INTERVAL '1 days'),

-- STEP 8: Insert Cholesterol measurements (in mg/dL)
('550e8400-e29b-41d4-a716-446655440029'::uuid, '650e8400-e29b-41d4-a716-446655440001'::uuid, 'cholesterol', 180, 'mg/dL', 'normal', 'Desirable cholesterol level', 'f6306fad-40d1-4b8d-bb9e-5817242e059b'::uuid, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
('550e8400-e29b-41d4-a716-446655440030'::uuid, '650e8400-e29b-41d4-a716-446655440002'::uuid, 'cholesterol', 210, 'mg/dL', 'warning', 'Borderline high cholesterol', 'f6306fad-40d1-4b8d-bb9e-5817242e059b'::uuid, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
('550e8400-e29b-41d4-a716-446655440031'::uuid, '650e8400-e29b-41d4-a716-446655440003'::uuid, 'cholesterol', 260, 'mg/dL', 'critical', 'High cholesterol - medication needed', 'f6306fad-40d1-4b8d-bb9e-5817242e059b'::uuid, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655440032'::uuid, '650e8400-e29b-41d4-a716-446655440004'::uuid, 'cholesterol', 190, 'mg/dL', 'normal', 'Good cholesterol level', 'f6306fad-40d1-4b8d-bb9e-5817242e059b'::uuid, NOW(), NOW()),

-- STEP 9: Insert Oxygen Saturation measurements (in %)
('550e8400-e29b-41d4-a716-446655440033'::uuid, '650e8400-e29b-41d4-a716-446655440001'::uuid, 'oxygen_saturation', 98, '%', 'normal', 'Normal oxygen saturation', 'f6306fad-40d1-4b8d-bb9e-5817242e059b'::uuid, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
('550e8400-e29b-41d4-a716-446655440034'::uuid, '650e8400-e29b-41d4-a716-446655440002'::uuid, 'oxygen_saturation', 94, '%', 'warning', 'Low oxygen saturation - monitor closely', 'f6306fad-40d1-4b8d-bb9e-5817242e059b'::uuid, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
('550e8400-e29b-41d4-a716-446655440035'::uuid, '650e8400-e29b-41d4-a716-446655440003'::uuid, 'oxygen_saturation', 88, '%', 'critical', 'Critical oxygen saturation - requires oxygen', 'f6306fad-40d1-4b8d-bb9e-5817242e059b'::uuid, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655440036'::uuid, '650e8400-e29b-41d4-a716-446655440004'::uuid, 'oxygen_saturation', 97, '%', 'normal', 'Normal oxygen saturation', 'f6306fad-40d1-4b8d-bb9e-5817242e059b'::uuid, NOW(), NOW()),

-- STEP 10: Insert Respiratory Rate measurements (in breaths/min)
('550e8400-e29b-41d4-a716-446655440037'::uuid, '650e8400-e29b-41d4-a716-446655440001'::uuid, 'respiratory_rate', 16, 'breaths/min', 'normal', 'Normal respiratory rate', 'f6306fad-40d1-4b8d-bb9e-5817242e059b'::uuid, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
('550e8400-e29b-41d4-a716-446655440038'::uuid, '650e8400-e29b-41d4-a716-446655440002'::uuid, 'respiratory_rate', 22, 'breaths/min', 'warning', 'Elevated respiratory rate - possible infection', 'f6306fad-40d1-4b8d-bb9e-5817242e059b'::uuid, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
('550e8400-e29b-41d4-a716-446655440039'::uuid, '650e8400-e29b-41d4-a716-446655440003'::uuid, 'respiratory_rate', 30, 'breaths/min', 'critical', 'Tachypnea - requires emergency care', 'f6306fad-40d1-4b8d-bb9e-5817242e059b'::uuid, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655440040'::uuid, '650e8400-e29b-41d4-a716-446655440004'::uuid, 'respiratory_rate', 18, 'breaths/min', 'normal', 'Normal respiratory rate', 'f6306fad-40d1-4b8d-bb9e-5817242e059b'::uuid, NOW(), NOW());

-- ============================================================================
-- SAMPLE QUERIES FOR TESTING
-- ============================================================================

-- 1. Get all health indicators for a specific resident
-- SELECT * FROM public.health_indicators 
-- WHERE resident_id = '650e8400-e29b-41d4-a716-446655440001'::uuid 
-- ORDER BY recorded_at DESC;

-- 2. Get all critical health indicators
-- SELECT hi.id, hi.indicator_type, hi.value, hi.unit, hi.status, hi.recorded_at
-- FROM public.health_indicators hi
-- WHERE hi.status = 'critical'
-- ORDER BY hi.recorded_at DESC;

-- 3. Get latest health indicator for each type per resident
-- SELECT DISTINCT ON (indicator_type) 
--   indicator_type, value, unit, status, recorded_at
-- FROM public.health_indicators 
-- WHERE resident_id = '650e8400-e29b-41d4-a716-446655440001'::uuid
-- ORDER BY indicator_type, recorded_at DESC;

-- 4. Get average blood pressure readings
-- SELECT 
--   AVG(value) as avg_value,
--   MIN(value) as min_value,
--   MAX(value) as max_value,
--   unit
-- FROM public.health_indicators 
-- WHERE indicator_type = 'blood_pressure'
-- GROUP BY unit;

-- 5. Get health indicators recorded in the last 7 days
-- SELECT * FROM public.health_indicators 
-- WHERE recorded_at >= NOW() - INTERVAL '7 days'
-- ORDER BY recorded_at DESC;

-- 6. Get count of health indicators by status
-- SELECT 
--   status,
--   COUNT(*) as count,
--   COUNT(DISTINCT resident_id) as residents_affected
-- FROM public.health_indicators 
-- GROUP BY status;

-- 7. Get residents with critical indicators
-- SELECT DISTINCT r.id, r.full_name, r.barangay
-- FROM public.residents r
-- INNER JOIN public.health_indicators hi ON r.id = hi.resident_id
-- WHERE hi.status = 'critical'
-- ORDER BY r.full_name;
