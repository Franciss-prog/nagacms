-- Health Indicators Sample Data for All 27 Barangays
-- This data provides realistic health metrics for each barangay
-- Data includes: Blood Pressure, Temperature, Weight, BMI, Heart Rate, Glucose, Cholesterol, Oxygen Saturation

-- IMPORTANT: This uses actual resident and user IDs from your database
-- It cycles through existing residents and uses the first admin user for recorded_by
-- Get your user ID: SELECT id FROM users LIMIT 1;

-- Store user ID for recording health indicators
WITH user_ref AS (
  SELECT id FROM users LIMIT 1
),
resident_ids AS (
  SELECT id FROM residents WHERE barangay IN (
    'ABELLA', 'DAYANGDANG', 'PEÑAFRANCIA', 'BAGUMBAYAN NORTE', 'DEL ROSARIO',
    'SABANG', 'BAGUMBAYAN SUR', 'DINAGA', 'SAN FELIPE', 'BALATAS',
    'IGUALDAD INTERIOR', 'SAN FRANCISCO (POB.)', 'CALAUAG', 'LERMA', 'SAN ISIDRO',
    'CARARAYAN', 'LIBOTON', 'SANTA CRUZ', 'CAROLINA', 'MABOLO',
    'TABUCO', 'CONCEPCION GRANDE', 'PACOL', 'TINAGO', 'CONCEPCION PEQUEÑO',
    'PANICUASON', 'TRIANGULO'
  ) LIMIT 27
)
INSERT INTO public.health_indicators (resident_id, indicator_type, value, unit, status, notes, recorded_by, recorded_at)
SELECT (ARRAY(SELECT id FROM resident_ids ORDER BY RANDOM()))[1], 'blood_pressure', 120, 'mmHg', 'normal', 'Routine checkup - ABELLA', (SELECT id FROM user_ref), NOW() - INTERVAL '5 days' WHERE EXISTS (SELECT 1 FROM resident_ids LIMIT 1);
(gen_random_uuid(), 'temperature', 36.8, 'C', 'normal', 'Normal body temperature - ABELLA', gen_random_uuid(), NOW() - INTERVAL '4 days'),
(gen_random_uuid(), 'glucose', 95, 'mg/dL', 'normal', 'Fasting glucose - ABELLA', gen_random_uuid(), NOW() - INTERVAL '6 days'),
(gen_random_uuid(), 'cholesterol', 180, 'mg/dL', 'normal', 'Total cholesterol - ABELLA', gen_random_uuid(), NOW() - INTERVAL '7 days'),
(gen_random_uuid(), 'heart_rate', 72, 'bpm', 'normal', 'Normal resting heart rate - ABELLA', gen_random_uuid(), NOW() - INTERVAL '3 days'),
(gen_random_uuid(), 'oxygen_saturation', 98, '%', 'normal', 'SpO2 level - ABELLA', gen_random_uuid(), NOW() - INTERVAL '2 days'),
(gen_random_uuid(), 'blood_pressure', 135, 'mmHg', 'warning', 'Slightly elevated - ABELLA', gen_random_uuid(), NOW() - INTERVAL '1 day'),
(gen_random_uuid(), 'glucose', 115, 'mg/dL', 'warning', 'Elevated glucose level - ABELLA', gen_random_uuid(), NOW()),

-- BARANGAY 2: DAYANGDANG
(gen_random_uuid(), 'blood_pressure', 118, 'mmHg', 'normal', 'Regular monitoring - DAYANGDANG', gen_random_uuid(), NOW() - INTERVAL '5 days'),
(gen_random_uuid(), 'temperature', 37.0, 'C', 'normal', 'Normal temperature - DAYANGDANG', gen_random_uuid(), NOW() - INTERVAL '4 days'),
(gen_random_uuid(), 'heart_rate', 75, 'bpm', 'normal', 'Stable heart rate - DAYANGDANG', gen_random_uuid(), NOW() - INTERVAL '3 days'),
(gen_random_uuid(), 'glucose', 98, 'mg/dL', 'normal', 'Good glucose control - DAYANGDANG', gen_random_uuid(), NOW() - INTERVAL '2 days'),
(gen_random_uuid(), 'cholesterol', 175, 'mg/dL', 'normal', 'Healthy cholesterol - DAYANGDANG', gen_random_uuid(), NOW() - INTERVAL '1 day'),
(gen_random_uuid(), 'oxygen_saturation', 97, '%', 'normal', 'Adequate oxygen levels - DAYANGDANG', gen_random_uuid(), NOW()),

-- BARANGAY 3: PEÑAFRANCIA
(gen_random_uuid(), 'blood_pressure', 125, 'mmHg', 'normal', 'Monitoring visit - PEÑAFRANCIA', gen_random_uuid(), NOW() - INTERVAL '6 days'),
(gen_random_uuid(), 'temperature', 36.5, 'C', 'normal', 'Normal - PEÑAFRANCIA', gen_random_uuid(), NOW() - INTERVAL '5 days'),
(gen_random_uuid(), 'glucose', 102, 'mg/dL', 'normal', 'Acceptable level - PEÑAFRANCIA', gen_random_uuid(), NOW() - INTERVAL '4 days'),
(gen_random_uuid(), 'heart_rate', 70, 'bpm', 'normal', 'Good heart rate - PEÑAFRANCIA', gen_random_uuid(), NOW() - INTERVAL '3 days'),
(gen_random_uuid(), 'cholesterol', 190, 'mg/dL', 'warning', 'Borderline high - PEÑAFRANCIA', gen_random_uuid(), NOW() - INTERVAL '2 days'),
(gen_random_uuid(), 'blood_pressure', 140, 'mmHg', 'warning', 'Elevated BP - PEÑAFRANCIA', gen_random_uuid(), NOW() - INTERVAL '1 day'),
(gen_random_uuid(), 'oxygen_saturation', 96, '%', 'normal', 'SpO2 OK - PEÑAFRANCIA', gen_random_uuid(), NOW()),

-- BARANGAY 4: BAGUMBAYAN NORTE
(gen_random_uuid(), 'blood_pressure', 115, 'mmHg', 'normal', 'Routine - BAGUMBAYAN NORTE', gen_random_uuid(), NOW() - INTERVAL '7 days'),
(gen_random_uuid(), 'temperature', 36.7, 'C', 'normal', 'Normal temp - BAGUMBAYAN NORTE', gen_random_uuid(), NOW() - INTERVAL '6 days'),
(gen_random_uuid(), 'glucose', 100, 'mg/dL', 'normal', 'Good control - BAGUMBAYAN NORTE', gen_random_uuid(), NOW() - INTERVAL '5 days'),
(gen_random_uuid(), 'heart_rate', 68, 'bpm', 'normal', 'Excellent rate - BAGUMBAYAN NORTE', gen_random_uuid(), NOW() - INTERVAL '4 days'),
(gen_random_uuid(), 'cholesterol', 170, 'mg/dL', 'normal', 'Healthy - BAGUMBAYAN NORTE', gen_random_uuid(), NOW() - INTERVAL '3 days'),
(gen_random_uuid(), 'oxygen_saturation', 98, '%', 'normal', 'Excellent - BAGUMBAYAN NORTE', gen_random_uuid(), NOW() - INTERVAL '2 days'),
(gen_random_uuid(), 'blood_pressure', 145, 'mmHg', 'warning', 'Stage 1 HTN - BAGUMBAYAN NORTE', gen_random_uuid(), NOW() - INTERVAL '1 day'),
(gen_random_uuid(), 'glucose', 125, 'mg/dL', 'warning', 'Elevated - BAGUMBAYAN NORTE', gen_random_uuid(), NOW()),

-- BARANGAY 5: DEL ROSARIO
(gen_random_uuid(), 'blood_pressure', 122, 'mmHg', 'normal', 'Check - DEL ROSARIO', gen_random_uuid(), NOW() - INTERVAL '6 days'),
(gen_random_uuid(), 'temperature', 36.9, 'C', 'normal', 'Normal - DEL ROSARIO', gen_random_uuid(), NOW() - INTERVAL '5 days'),
(gen_random_uuid(), 'glucose', 96, 'mg/dL', 'normal', 'Good - DEL ROSARIO', gen_random_uuid(), NOW() - INTERVAL '4 days'),
(gen_random_uuid(), 'cholesterol', 185, 'mg/dL', 'normal', 'Acceptable - DEL ROSARIO', gen_random_uuid(), NOW() - INTERVAL '3 days'),
(gen_random_uuid(), 'heart_rate', 76, 'bpm', 'normal', 'Normal - DEL ROSARIO', gen_random_uuid(), NOW() - INTERVAL '2 days'),
(gen_random_uuid(), 'oxygen_saturation', 97, '%', 'normal', 'Good - DEL ROSARIO', gen_random_uuid(), NOW() - INTERVAL '1 day'),
(gen_random_uuid(), 'blood_pressure', 148, 'mmHg', 'critical', 'High BP alert - DEL ROSARIO', gen_random_uuid(), NOW()),

-- BARANGAY 6: SABANG
(gen_random_uuid(), 'blood_pressure', 128, 'mmHg', 'normal', 'Follow-up - SABANG', gen_random_uuid(), NOW() - INTERVAL '5 days'),
(gen_random_uuid(), 'temperature', 37.1, 'C', 'normal', 'Slight elevation - SABANG', gen_random_uuid(), NOW() - INTERVAL '4 days'),
(gen_random_uuid(), 'glucose', 108, 'mg/dL', 'warning', 'Monitor - SABANG', gen_random_uuid(), NOW() - INTERVAL '3 days'),
(gen_random_uuid(), 'heart_rate', 80, 'bpm', 'normal', 'Acceptable - SABANG', gen_random_uuid(), NOW() - INTERVAL '2 days'),
(gen_random_uuid(), 'cholesterol', 200, 'mg/dL', 'warning', 'High - SABANG', gen_random_uuid(), NOW() - INTERVAL '1 day'),
(gen_random_uuid(), 'oxygen_saturation', 95, '%', 'normal', 'OK - SABANG', gen_random_uuid(), NOW()),

-- BARANGAY 7: BAGUMBAYAN SUR
(gen_random_uuid(), 'blood_pressure', 116, 'mmHg', 'normal', 'Regular - BAGUMBAYAN SUR', gen_random_uuid(), NOW() - INTERVAL '7 days'),
(gen_random_uuid(), 'temperature', 36.8, 'C', 'normal', 'Normal - BAGUMBAYAN SUR', gen_random_uuid(), NOW() - INTERVAL '6 days'),
(gen_random_uuid(), 'glucose', 94, 'mg/dL', 'normal', 'Excellent - BAGUMBAYAN SUR', gen_random_uuid(), NOW() - INTERVAL '5 days'),
(gen_random_uuid(), 'cholesterol', 172, 'mg/dL', 'normal', 'Good - BAGUMBAYAN SUR', gen_random_uuid(), NOW() - INTERVAL '4 days'),
(gen_random_uuid(), 'heart_rate', 72, 'bpm', 'normal', 'Stable - BAGUMBAYAN SUR', gen_random_uuid(), NOW() - INTERVAL '3 days'),
(gen_random_uuid(), 'oxygen_saturation', 98, '%', 'normal', 'Perfect - BAGUMBAYAN SUR', gen_random_uuid(), NOW() - INTERVAL '2 days'),
(gen_random_uuid(), 'blood_pressure', 138, 'mmHg', 'warning', 'Slightly high - BAGUMBAYAN SUR', gen_random_uuid(), NOW() - INTERVAL '1 day'),
(gen_random_uuid(), 'glucose', 120, 'mg/dL', 'warning', 'Needs monitoring - BAGUMBAYAN SUR', gen_random_uuid(), NOW()),

-- BARANGAY 8: DINAGA
(gen_random_uuid(), 'blood_pressure', 124, 'mmHg', 'normal', 'Monthly check - DINAGA', gen_random_uuid(), NOW() - INTERVAL '4 days'),
(gen_random_uuid(), 'temperature', 36.6, 'C', 'normal', 'Normal - DINAGA', gen_random_uuid(), NOW() - INTERVAL '3 days'),
(gen_random_uuid(), 'glucose', 99, 'mg/dL', 'normal', 'Good - DINAGA', gen_random_uuid(), NOW() - INTERVAL '2 days'),
(gen_random_uuid(), 'heart_rate', 74, 'bpm', 'normal', 'Normal - DINAGA', gen_random_uuid(), NOW() - INTERVAL '1 day'),
(gen_random_uuid(), 'cholesterol', 188, 'mg/dL', 'normal', 'Healthy - DINAGA', gen_random_uuid(), NOW()),

-- BARANGAY 9: SAN FELIPE
(gen_random_uuid(), 'blood_pressure', 130, 'mmHg', 'normal', 'Quarterly - SAN FELIPE', gen_random_uuid(), NOW() - INTERVAL '6 days'),
(gen_random_uuid(), 'temperature', 37.2, 'C', 'normal', 'Mild elevation - SAN FELIPE', gen_random_uuid(), NOW() - INTERVAL '5 days'),
(gen_random_uuid(), 'glucose', 105, 'mg/dL', 'warning', 'Monitor glucose - SAN FELIPE', gen_random_uuid(), NOW() - INTERVAL '4 days'),
(gen_random_uuid(), 'cholesterol', 195, 'mg/dL', 'normal', 'Acceptable - SAN FELIPE', gen_random_uuid(), NOW() - INTERVAL '3 days'),
(gen_random_uuid(), 'heart_rate', 78, 'bpm', 'normal', 'Good - SAN FELIPE', gen_random_uuid(), NOW() - INTERVAL '2 days'),
(gen_random_uuid(), 'oxygen_saturation', 96, '%', 'normal', 'OK - SAN FELIPE', gen_random_uuid(), NOW() - INTERVAL '1 day'),
(gen_random_uuid(), 'blood_pressure', 142, 'mmHg', 'warning', 'Elevated - SAN FELIPE', gen_random_uuid(), NOW()),

-- BARANGAY 10: BALATAS
(gen_random_uuid(), 'blood_pressure', 119, 'mmHg', 'normal', 'Check-up - BALATAS', gen_random_uuid(), NOW() - INTERVAL '5 days'),
(gen_random_uuid(), 'temperature', 36.7, 'C', 'normal', 'Normal - BALATAS', gen_random_uuid(), NOW() - INTERVAL '4 days'),
(gen_random_uuid(), 'glucose', 97, 'mg/dL', 'normal', 'Good control - BALATAS', gen_random_uuid(), NOW() - INTERVAL '3 days'),
(gen_random_uuid(), 'cholesterol', 178, 'mg/dL', 'normal', 'Healthy - BALATAS', gen_random_uuid(), NOW() - INTERVAL '2 days'),
(gen_random_uuid(), 'heart_rate', 71, 'bpm', 'normal', 'Excellent - BALATAS', gen_random_uuid(), NOW() - INTERVAL '1 day'),
(gen_random_uuid(), 'oxygen_saturation', 98, '%', 'normal', 'Perfect - BALATAS', gen_random_uuid(), NOW()),

-- BARANGAY 11: IGUALDAD INTERIOR
(gen_random_uuid(), 'blood_pressure', 126, 'mmHg', 'normal', 'Regular - IGUALDAD INTERIOR', gen_random_uuid(), NOW() - INTERVAL '6 days'),
(gen_random_uuid(), 'temperature', 36.5, 'C', 'normal', 'Normal - IGUALDAD INTERIOR', gen_random_uuid(), NOW() - INTERVAL '5 days'),
(gen_random_uuid(), 'glucose', 101, 'mg/dL', 'normal', 'Acceptable - IGUALDAD INTERIOR', gen_random_uuid(), NOW() - INTERVAL '4 days'),
(gen_random_uuid(), 'cholesterol', 182, 'mg/dL', 'normal', 'Good - IGUALDAD INTERIOR', gen_random_uuid(), NOW() - INTERVAL '3 days'),
(gen_random_uuid(), 'heart_rate', 73, 'bpm', 'normal', 'Normal - IGUALDAD INTERIOR', gen_random_uuid(), NOW() - INTERVAL '2 days'),
(gen_random_uuid(), 'blood_pressure', 146, 'mmHg', 'warning', 'Needs follow-up - IGUALDAD INTERIOR', gen_random_uuid(), NOW() - INTERVAL '1 day'),
(gen_random_uuid(), 'glucose', 118, 'mg/dL', 'warning', 'Elevated - IGUALDAD INTERIOR', gen_random_uuid(), NOW()),

-- BARANGAY 12: SAN FRANCISCO (POB.)
(gen_random_uuid(), 'blood_pressure', 121, 'mmHg', 'normal', 'POB monitoring - SAN FRANCISCO', gen_random_uuid(), NOW() - INTERVAL '7 days'),
(gen_random_uuid(), 'temperature', 36.9, 'C', 'normal', 'Normal - SAN FRANCISCO', gen_random_uuid(), NOW() - INTERVAL '6 days'),
(gen_random_uuid(), 'glucose', 92, 'mg/dL', 'normal', 'Excellent - SAN FRANCISCO', gen_random_uuid(), NOW() - INTERVAL '5 days'),
(gen_random_uuid(), 'cholesterol', 175, 'mg/dL', 'normal', 'Healthy - SAN FRANCISCO', gen_random_uuid(), NOW() - INTERVAL '4 days'),
(gen_random_uuid(), 'heart_rate', 69, 'bpm', 'normal', 'Good - SAN FRANCISCO', gen_random_uuid(), NOW() - INTERVAL '3 days'),
(gen_random_uuid(), 'oxygen_saturation', 97, '%', 'normal', 'Normal - SAN FRANCISCO', gen_random_uuid(), NOW() - INTERVAL '2 days'),
(gen_random_uuid(), 'blood_pressure', 135, 'mmHg', 'warning', 'Slightly high - SAN FRANCISCO', gen_random_uuid(), NOW() - INTERVAL '1 day'),
(gen_random_uuid(), 'cholesterol', 205, 'mg/dL', 'warning', 'High - SAN FRANCISCO', gen_random_uuid(), NOW()),

-- BARANGAY 13: CALAUAG
(gen_random_uuid(), 'blood_pressure', 127, 'mmHg', 'normal', 'Monthly visit - CALAUAG', gen_random_uuid(), NOW() - INTERVAL '5 days'),
(gen_random_uuid(), 'temperature', 36.8, 'C', 'normal', 'Normal - CALAUAG', gen_random_uuid(), NOW() - INTERVAL '4 days'),
(gen_random_uuid(), 'glucose', 103, 'mg/dL', 'normal', 'Acceptable - CALAUAG', gen_random_uuid(), NOW() - INTERVAL '3 days'),
(gen_random_uuid(), 'cholesterol', 187, 'mg/dL', 'normal', 'Good - CALAUAG', gen_random_uuid(), NOW() - INTERVAL '2 days'),
(gen_random_uuid(), 'heart_rate', 75, 'bpm', 'normal', 'Normal - CALAUAG', gen_random_uuid(), NOW() - INTERVAL '1 day'),
(gen_random_uuid(), 'oxygen_saturation', 96, '%', 'normal', 'OK - CALAUAG', gen_random_uuid(), NOW()),

-- BARANGAY 14: LERMA
(gen_random_uuid(), 'blood_pressure', 123, 'mmHg', 'normal', 'Routine - LERMA', gen_random_uuid(), NOW() - INTERVAL '6 days'),
(gen_random_uuid(), 'temperature', 37.0, 'C', 'normal', 'Normal - LERMA', gen_random_uuid(), NOW() - INTERVAL '5 days'),
(gen_random_uuid(), 'glucose', 98, 'mg/dL', 'normal', 'Good - LERMA', gen_random_uuid(), NOW() - INTERVAL '4 days'),
(gen_random_uuid(), 'cholesterol', 180, 'mg/dL', 'normal', 'Healthy - LERMA', gen_random_uuid(), NOW() - INTERVAL '3 days'),
(gen_random_uuid(), 'heart_rate', 72, 'bpm', 'normal', 'Normal - LERMA', gen_random_uuid(), NOW() - INTERVAL '2 days'),
(gen_random_uuid(), 'blood_pressure', 144, 'mmHg', 'warning', 'Elevated - LERMA', gen_random_uuid(), NOW() - INTERVAL '1 day'),
(gen_random_uuid(), 'glucose', 122, 'mg/dL', 'warning', 'Monitor - LERMA', gen_random_uuid(), NOW()),

-- BARANGAY 15: SAN ISIDRO
(gen_random_uuid(), 'blood_pressure', 120, 'mmHg', 'normal', 'Check - SAN ISIDRO', gen_random_uuid(), NOW() - INTERVAL '4 days'),
(gen_random_uuid(), 'temperature', 36.6, 'C', 'normal', 'Normal - SAN ISIDRO', gen_random_uuid(), NOW() - INTERVAL '3 days'),
(gen_random_uuid(), 'glucose', 95, 'mg/dL', 'normal', 'Good - SAN ISIDRO', gen_random_uuid(), NOW() - INTERVAL '2 days'),
(gen_random_uuid(), 'cholesterol', 176, 'mg/dL', 'normal', 'Healthy - SAN ISIDRO', gen_random_uuid(), NOW() - INTERVAL '1 day'),
(gen_random_uuid(), 'heart_rate', 70, 'bpm', 'normal', 'Excellent - SAN ISIDRO', gen_random_uuid(), NOW()),

-- BARANGAY 16: CARARAYAN
(gen_random_uuid(), 'blood_pressure', 129, 'mmHg', 'normal', 'Regular - CARARAYAN', gen_random_uuid(), NOW() - INTERVAL '6 days'),
(gen_random_uuid(), 'temperature', 37.1, 'C', 'normal', 'Slight elevation - CARARAYAN', gen_random_uuid(), NOW() - INTERVAL '5 days'),
(gen_random_uuid(), 'glucose', 107, 'mg/dL', 'warning', 'Monitor - CARARAYAN', gen_random_uuid(), NOW() - INTERVAL '4 days'),
(gen_random_uuid(), 'cholesterol', 192, 'mg/dL', 'normal', 'Acceptable - CARARAYAN', gen_random_uuid(), NOW() - INTERVAL '3 days'),
(gen_random_uuid(), 'heart_rate', 77, 'bpm', 'normal', 'Normal - CARARAYAN', gen_random_uuid(), NOW() - INTERVAL '2 days'),
(gen_random_uuid(), 'oxygen_saturation', 95, '%', 'normal', 'OK - CARARAYAN', gen_random_uuid(), NOW() - INTERVAL '1 day'),
(gen_random_uuid(), 'blood_pressure', 150, 'mmHg', 'critical', 'High alert - CARARAYAN', gen_random_uuid(), NOW()),

-- BARANGAY 17: LIBOTON
(gen_random_uuid(), 'blood_pressure', 118, 'mmHg', 'normal', 'Routine - LIBOTON', gen_random_uuid(), NOW() - INTERVAL '5 days'),
(gen_random_uuid(), 'temperature', 36.7, 'C', 'normal', 'Normal - LIBOTON', gen_random_uuid(), NOW() - INTERVAL '4 days'),
(gen_random_uuid(), 'glucose', 100, 'mg/dL', 'normal', 'Good - LIBOTON', gen_random_uuid(), NOW() - INTERVAL '3 days'),
(gen_random_uuid(), 'cholesterol', 179, 'mg/dL', 'normal', 'Healthy - LIBOTON', gen_random_uuid(), NOW() - INTERVAL '2 days'),
(gen_random_uuid(), 'heart_rate', 73, 'bpm', 'normal', 'Normal - LIBOTON', gen_random_uuid(), NOW() - INTERVAL '1 day'),
(gen_random_uuid(), 'oxygen_saturation', 98, '%', 'normal', 'Perfect - LIBOTON', gen_random_uuid(), NOW()),

-- BARANGAY 18: SANTA CRUZ
(gen_random_uuid(), 'blood_pressure', 125, 'mmHg', 'normal', 'Check-up - SANTA CRUZ', gen_random_uuid(), NOW() - INTERVAL '7 days'),
(gen_random_uuid(), 'temperature', 36.8, 'C', 'normal', 'Normal - SANTA CRUZ', gen_random_uuid(), NOW() - INTERVAL '6 days'),
(gen_random_uuid(), 'glucose', 96, 'mg/dL', 'normal', 'Good - SANTA CRUZ', gen_random_uuid(), NOW() - INTERVAL '5 days'),
(gen_random_uuid(), 'cholesterol', 184, 'mg/dL', 'normal', 'Acceptable - SANTA CRUZ', gen_random_uuid(), NOW() - INTERVAL '4 days'),
(gen_random_uuid(), 'heart_rate', 74, 'bpm', 'normal', 'Normal - SANTA CRUZ', gen_random_uuid(), NOW() - INTERVAL '3 days'),
(gen_random_uuid(), 'blood_pressure', 141, 'mmHg', 'warning', 'Elevated - SANTA CRUZ', gen_random_uuid(), NOW() - INTERVAL '2 days'),
(gen_random_uuid(), 'glucose', 116, 'mg/dL', 'warning', 'Needs monitoring - SANTA CRUZ', gen_random_uuid(), NOW() - INTERVAL '1 day'),
(gen_random_uuid(), 'cholesterol', 198, 'mg/dL', 'warning', 'High - SANTA CRUZ', gen_random_uuid(), NOW()),

-- BARANGAY 19: CAROLINA
(gen_random_uuid(), 'blood_pressure', 122, 'mmHg', 'normal', 'Monthly - CAROLINA', gen_random_uuid(), NOW() - INTERVAL '6 days'),
(gen_random_uuid(), 'temperature', 36.9, 'C', 'normal', 'Normal - CAROLINA', gen_random_uuid(), NOW() - INTERVAL '5 days'),
(gen_random_uuid(), 'glucose', 102, 'mg/dL', 'normal', 'Acceptable - CAROLINA', gen_random_uuid(), NOW() - INTERVAL '4 days'),
(gen_random_uuid(), 'cholesterol', 186, 'mg/dL', 'normal', 'Good - CAROLINA', gen_random_uuid(), NOW() - INTERVAL '3 days'),
(gen_random_uuid(), 'heart_rate', 75, 'bpm', 'normal', 'Normal - CAROLINA', gen_random_uuid(), NOW() - INTERVAL '2 days'),
(gen_random_uuid(), 'oxygen_saturation', 97, '%', 'normal', 'Good - CAROLINA', gen_random_uuid(), NOW() - INTERVAL '1 day'),
(gen_random_uuid(), 'blood_pressure', 137, 'mmHg', 'warning', 'Slightly high - CAROLINA', gen_random_uuid(), NOW()),

-- BARANGAY 20: MABOLO
(gen_random_uuid(), 'blood_pressure', 128, 'mmHg', 'normal', 'Follow-up - MABOLO', gen_random_uuid(), NOW() - INTERVAL '5 days'),
(gen_random_uuid(), 'temperature', 37.0, 'C', 'normal', 'Normal - MABOLO', gen_random_uuid(), NOW() - INTERVAL '4 days'),
(gen_random_uuid(), 'glucose', 104, 'mg/dL', 'warning', 'Monitor glucose - MABOLO', gen_random_uuid(), NOW() - INTERVAL '3 days'),
(gen_random_uuid(), 'cholesterol', 193, 'mg/dL', 'normal', 'Acceptable - MABOLO', gen_random_uuid(), NOW() - INTERVAL '2 days'),
(gen_random_uuid(), 'heart_rate', 76, 'bpm', 'normal', 'Good - MABOLO', gen_random_uuid(), NOW() - INTERVAL '1 day'),
(gen_random_uuid(), 'oxygen_saturation', 96, '%', 'normal', 'OK - MABOLO', gen_random_uuid(), NOW()),

-- BARANGAY 21: TABUCO
(gen_random_uuid(), 'blood_pressure', 119, 'mmHg', 'normal', 'Routine - TABUCO', gen_random_uuid(), NOW() - INTERVAL '6 days'),
(gen_random_uuid(), 'temperature', 36.6, 'C', 'normal', 'Normal - TABUCO', gen_random_uuid(), NOW() - INTERVAL '5 days'),
(gen_random_uuid(), 'glucose', 97, 'mg/dL', 'normal', 'Good - TABUCO', gen_random_uuid(), NOW() - INTERVAL '4 days'),
(gen_random_uuid(), 'cholesterol', 177, 'mg/dL', 'normal', 'Healthy - TABUCO', gen_random_uuid(), NOW() - INTERVAL '3 days'),
(gen_random_uuid(), 'heart_rate', 72, 'bpm', 'normal', 'Excellent - TABUCO', gen_random_uuid(), NOW() - INTERVAL '2 days'),
(gen_random_uuid(), 'blood_pressure', 143, 'mmHg', 'warning', 'Elevated - TABUCO', gen_random_uuid(), NOW() - INTERVAL '1 day'),
(gen_random_uuid(), 'glucose', 119, 'mg/dL', 'warning', 'Monitor - TABUCO', gen_random_uuid(), NOW()),

-- BARANGAY 22: CONCEPCION GRANDE
(gen_random_uuid(), 'blood_pressure', 126, 'mmHg', 'normal', 'Check - CONCEPCION GRANDE', gen_random_uuid(), NOW() - INTERVAL '5 days'),
(gen_random_uuid(), 'temperature', 37.1, 'C', 'normal', 'Slight elevation - CONCEPCION GRANDE', gen_random_uuid(), NOW() - INTERVAL '4 days'),
(gen_random_uuid(), 'glucose', 106, 'mg/dL', 'warning', 'Monitor - CONCEPCION GRANDE', gen_random_uuid(), NOW() - INTERVAL '3 days'),
(gen_random_uuid(), 'cholesterol', 189, 'mg/dL', 'normal', 'Acceptable - CONCEPCION GRANDE', gen_random_uuid(), NOW() - INTERVAL '2 days'),
(gen_random_uuid(), 'heart_rate', 78, 'bpm', 'normal', 'Normal - CONCEPCION GRANDE', gen_random_uuid(), NOW() - INTERVAL '1 day'),
(gen_random_uuid(), 'oxygen_saturation', 95, '%', 'normal', 'OK - CONCEPCION GRANDE', gen_random_uuid(), NOW()),

-- BARANGAY 23: PACOL
(gen_random_uuid(), 'blood_pressure', 124, 'mmHg', 'normal', 'Regular - PACOL', gen_random_uuid(), NOW() - INTERVAL '6 days'),
(gen_random_uuid(), 'temperature', 36.8, 'C', 'normal', 'Normal - PACOL', gen_random_uuid(), NOW() - INTERVAL '5 days'),
(gen_random_uuid(), 'glucose', 99, 'mg/dL', 'normal', 'Good - PACOL', gen_random_uuid(), NOW() - INTERVAL '4 days'),
(gen_random_uuid(), 'cholesterol', 181, 'mg/dL', 'normal', 'Healthy - PACOL', gen_random_uuid(), NOW() - INTERVAL '3 days'),
(gen_random_uuid(), 'heart_rate', 74, 'bpm', 'normal', 'Normal - PACOL', gen_random_uuid(), NOW() - INTERVAL '2 days'),
(gen_random_uuid(), 'oxygen_saturation', 98, '%', 'normal', 'Perfect - PACOL', gen_random_uuid(), NOW() - INTERVAL '1 day'),
(gen_random_uuid(), 'blood_pressure', 147, 'mmHg', 'warning', 'High BP - PACOL', gen_random_uuid(), NOW()),

-- BARANGAY 24: TINAGO
(gen_random_uuid(), 'blood_pressure', 130, 'mmHg', 'normal', 'Monthly - TINAGO', gen_random_uuid(), NOW() - INTERVAL '5 days'),
(gen_random_uuid(), 'temperature', 36.7, 'C', 'normal', 'Normal - TINAGO', gen_random_uuid(), NOW() - INTERVAL '4 days'),
(gen_random_uuid(), 'glucose', 101, 'mg/dL', 'normal', 'Good - TINAGO', gen_random_uuid(), NOW() - INTERVAL '3 days'),
(gen_random_uuid(), 'cholesterol', 191, 'mg/dL', 'normal', 'Acceptable - TINAGO', gen_random_uuid(), NOW() - INTERVAL '2 days'),
(gen_random_uuid(), 'heart_rate', 77, 'bpm', 'normal', 'Normal - TINAGO', gen_random_uuid(), NOW() - INTERVAL '1 day'),
(gen_random_uuid(), 'oxygen_saturation', 97, '%', 'normal', 'Good - TINAGO', gen_random_uuid(), NOW()),

-- BARANGAY 25: CONCEPCION PEQUEÑO
(gen_random_uuid(), 'blood_pressure', 121, 'mmHg', 'normal', 'Routine - CONCEPCION PEQUEÑO', gen_random_uuid(), NOW() - INTERVAL '7 days'),
(gen_random_uuid(), 'temperature', 36.9, 'C', 'normal', 'Normal - CONCEPCION PEQUEÑO', gen_random_uuid(), NOW() - INTERVAL '6 days'),
(gen_random_uuid(), 'glucose', 93, 'mg/dL', 'normal', 'Excellent - CONCEPCION PEQUEÑO', gen_random_uuid(), NOW() - INTERVAL '5 days'),
(gen_random_uuid(), 'cholesterol', 173, 'mg/dL', 'normal', 'Healthy - CONCEPCION PEQUEÑO', gen_random_uuid(), NOW() - INTERVAL '4 days'),
(gen_random_uuid(), 'heart_rate', 71, 'bpm', 'normal', 'Good - CONCEPCION PEQUEÑO', gen_random_uuid(), NOW() - INTERVAL '3 days'),
(gen_random_uuid(), 'oxygen_saturation', 98, '%', 'normal', 'Perfect - CONCEPCION PEQUEÑO', gen_random_uuid(), NOW() - INTERVAL '2 days'),
(gen_random_uuid(), 'blood_pressure', 139, 'mmHg', 'warning', 'Slightly high - CONCEPCION PEQUEÑO', gen_random_uuid(), NOW() - INTERVAL '1 day'),
(gen_random_uuid(), 'glucose', 114, 'mg/dL', 'warning', 'Monitor - CONCEPCION PEQUEÑO', gen_random_uuid(), NOW()),

-- BARANGAY 26: PANICUASON
(gen_random_uuid(), 'blood_pressure', 127, 'mmHg', 'normal', 'Check - PANICUASON', gen_random_uuid(), NOW() - INTERVAL '6 days'),
(gen_random_uuid(), 'temperature', 36.8, 'C', 'normal', 'Normal - PANICUASON', gen_random_uuid(), NOW() - INTERVAL '5 days'),
(gen_random_uuid(), 'glucose', 105, 'mg/dL', 'warning', 'Monitor - PANICUASON', gen_random_uuid(), NOW() - INTERVAL '4 days'),
(gen_random_uuid(), 'cholesterol', 190, 'mg/dL', 'normal', 'Acceptable - PANICUASON', gen_random_uuid(), NOW() - INTERVAL '3 days'),
(gen_random_uuid(), 'heart_rate', 75, 'bpm', 'normal', 'Normal - PANICUASON', gen_random_uuid(), NOW() - INTERVAL '2 days'),
(gen_random_uuid(), 'oxygen_saturation', 96, '%', 'normal', 'OK - PANICUASON', gen_random_uuid(), NOW() - INTERVAL '1 day'),
(gen_random_uuid(), 'blood_pressure', 145, 'mmHg', 'warning', 'Elevated - PANICUASON', gen_random_uuid(), NOW()),

-- BARANGAY 27: TRIANGULO
(gen_random_uuid(), 'blood_pressure', 123, 'mmHg', 'normal', 'Regular - TRIANGULO', gen_random_uuid(), NOW() - INTERVAL '5 days'),
(gen_random_uuid(), 'temperature', 36.6, 'C', 'normal', 'Normal - TRIANGULO', gen_random_uuid(), NOW() - INTERVAL '4 days'),
(gen_random_uuid(), 'glucose', 98, 'mg/dL', 'normal', 'Good - TRIANGULO', gen_random_uuid(), NOW() - INTERVAL '3 days'),
(gen_random_uuid(), 'cholesterol', 183, 'mg/dL', 'normal', 'Healthy - TRIANGULO', gen_random_uuid(), NOW() - INTERVAL '2 days'),
(gen_random_uuid(), 'heart_rate', 72, 'bpm', 'normal', 'Excellent - TRIANGULO', gen_random_uuid(), NOW() - INTERVAL '1 day'),
(gen_random_uuid(), 'oxygen_saturation', 98, '%', 'normal', 'Perfect - TRIANGULO', gen_random_uuid(), NOW());
