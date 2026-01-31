-- Health Indicators Sample Data for All 27 Barangays
-- IMPORTANT: This script uses ACTUAL resident and user IDs from your database
-- It will cycle through your existing residents for each barangay

-- Get the first admin user for recorded_by
-- If you want to specify a different user, replace the subquery with the actual UUID
-- Example: '550e8400-e29b-41d4-a716-446655440000'::uuid

-- Insert sample health indicators for each barangay
-- This approach uses the first 8 residents from each barangay

-- BARANGAY 1: ABELLA
INSERT INTO public.health_indicators (resident_id, indicator_type, value, unit, status, notes, recorded_by, recorded_at)
SELECT 
  id,
  indicator_type,
  value,
  unit,
  status,
  'Health check - ABELLA',
  (SELECT id FROM public.users LIMIT 1),
  NOW() - INTERVAL '5 days'
FROM (
  SELECT 
    (SELECT id FROM public.residents WHERE barangay = 'ABELLA' LIMIT 1) as id,
    'blood_pressure'::text as indicator_type,
    120 as value,
    'mmHg' as unit,
    'normal' as status
) t WHERE id IS NOT NULL;

-- Continue with other health metrics for ABELLA
INSERT INTO public.health_indicators (resident_id, indicator_type, value, unit, status, notes, recorded_by, recorded_at)
SELECT 
  id,
  'temperature',
  36.8,
  'C',
  'normal',
  'Health check - ABELLA',
  (SELECT id FROM public.users LIMIT 1),
  NOW() - INTERVAL '4 days'
FROM (SELECT (SELECT id FROM public.residents WHERE barangay = 'ABELLA' LIMIT 1) as id) t WHERE id IS NOT NULL;

INSERT INTO public.health_indicators (resident_id, indicator_type, value, unit, status, notes, recorded_by, recorded_at)
SELECT 
  id, 'glucose', 95, 'mg/dL', 'normal',
  'Health check - ABELLA',
  (SELECT id FROM public.users LIMIT 1), NOW() - INTERVAL '6 days'
FROM (SELECT (SELECT id FROM public.residents WHERE barangay = 'ABELLA' LIMIT 1) as id) t WHERE id IS NOT NULL;

INSERT INTO public.health_indicators (resident_id, indicator_type, value, unit, status, notes, recorded_by, recorded_at)
SELECT 
  id, 'cholesterol', 180, 'mg/dL', 'normal',
  'Health check - ABELLA',
  (SELECT id FROM public.users LIMIT 1), NOW() - INTERVAL '7 days'
FROM (SELECT (SELECT id FROM public.residents WHERE barangay = 'ABELLA' LIMIT 1) as id) t WHERE id IS NOT NULL;

INSERT INTO public.health_indicators (resident_id, indicator_type, value, unit, status, notes, recorded_by, recorded_at)
SELECT 
  id, 'heart_rate', 72, 'bpm', 'normal',
  'Health check - ABELLA',
  (SELECT id FROM public.users LIMIT 1), NOW() - INTERVAL '3 days'
FROM (SELECT (SELECT id FROM public.residents WHERE barangay = 'ABELLA' LIMIT 1) as id) t WHERE id IS NOT NULL;

INSERT INTO public.health_indicators (resident_id, indicator_type, value, unit, status, notes, recorded_by, recorded_at)
SELECT 
  id, 'oxygen_saturation', 98, '%', 'normal',
  'Health check - ABELLA',
  (SELECT id FROM public.users LIMIT 1), NOW() - INTERVAL '2 days'
FROM (SELECT (SELECT id FROM public.residents WHERE barangay = 'ABELLA' LIMIT 1) as id) t WHERE id IS NOT NULL;

-- Add warning readings
INSERT INTO public.health_indicators (resident_id, indicator_type, value, unit, status, notes, recorded_by, recorded_at)
SELECT 
  id, 'blood_pressure', 135, 'mmHg', 'warning',
  'Elevated BP - ABELLA',
  (SELECT id FROM public.users LIMIT 1), NOW() - INTERVAL '1 day'
FROM (SELECT (SELECT id FROM public.residents WHERE barangay = 'ABELLA' OFFSET 1 LIMIT 1) as id) t WHERE id IS NOT NULL;

INSERT INTO public.health_indicators (resident_id, indicator_type, value, unit, status, notes, recorded_by, recorded_at)
SELECT 
  id, 'glucose', 115, 'mg/dL', 'warning',
  'Elevated glucose - ABELLA',
  (SELECT id FROM public.users LIMIT 1), NOW()
FROM (SELECT (SELECT id FROM public.residents WHERE barangay = 'ABELLA' OFFSET 2 LIMIT 1) as id) t WHERE id IS NOT NULL;

-- BARANGAY 2: DAYANGDANG (sample - 6 readings)
INSERT INTO public.health_indicators (resident_id, indicator_type, value, unit, status, notes, recorded_by, recorded_at)
SELECT 
  id, 'blood_pressure', 118, 'mmHg', 'normal',
  'Regular monitoring - DAYANGDANG',
  (SELECT id FROM public.users LIMIT 1), NOW() - INTERVAL '5 days'
FROM (SELECT (SELECT id FROM public.residents WHERE barangay = 'DAYANGDANG' LIMIT 1) as id) t WHERE id IS NOT NULL;

INSERT INTO public.health_indicators (resident_id, indicator_type, value, unit, status, notes, recorded_by, recorded_at)
SELECT 
  id, 'glucose', 98, 'mg/dL', 'normal',
  'Good glucose control - DAYANGDANG',
  (SELECT id FROM public.users LIMIT 1), NOW() - INTERVAL '2 days'
FROM (SELECT (SELECT id FROM public.residents WHERE barangay = 'DAYANGDANG' LIMIT 1) as id) t WHERE id IS NOT NULL;

INSERT INTO public.health_indicators (resident_id, indicator_type, value, unit, status, notes, recorded_by, recorded_at)
SELECT 
  id, 'heart_rate', 75, 'bpm', 'normal',
  'Stable heart rate - DAYANGDANG',
  (SELECT id FROM public.users LIMIT 1), NOW() - INTERVAL '3 days'
FROM (SELECT (SELECT id FROM public.residents WHERE barangay = 'DAYANGDANG' LIMIT 1) as id) t WHERE id IS NOT NULL;

-- Sample for all barangays - one comprehensive record each
-- Run this for the remaining 25 barangays
-- Pattern: Get first resident from barangay, insert mix of normal/warning readings

-- Quick insert for all 27 barangays (one resident per barangay with basic readings)
INSERT INTO public.health_indicators (resident_id, indicator_type, value, unit, status, notes, recorded_by, recorded_at)
SELECT 
  residents.id,
  'blood_pressure',
  CASE 
    WHEN residents.barangay IN ('PEÑAFRANCIA', 'SABANG', 'SAN FELIPE', 'CARARAYAN', 'MABOLO', 'PANICUASON') THEN 140
    ELSE 120
  END,
  'mmHg',
  CASE 
    WHEN residents.barangay IN ('PEÑAFRANCIA', 'SABANG', 'SAN FELIPE', 'CARARAYAN', 'MABOLO', 'PANICUASON') THEN 'warning'::text
    ELSE 'normal'::text
  END,
  'Health Indicators - ' || residents.barangay,
  (SELECT id FROM public.users LIMIT 1),
  NOW()
FROM (
  SELECT DISTINCT ON (barangay) id, barangay
  FROM public.residents
  WHERE barangay IN (
    'ABELLA', 'DAYANGDANG', 'PEÑAFRANCIA', 'BAGUMBAYAN NORTE', 'DEL ROSARIO',
    'SABANG', 'BAGUMBAYAN SUR', 'DINAGA', 'SAN FELIPE', 'BALATAS',
    'IGUALDAD INTERIOR', 'SAN FRANCISCO (POB.)', 'CALAUAG', 'LERMA', 'SAN ISIDRO',
    'CARARAYAN', 'LIBOTON', 'SANTA CRUZ', 'CAROLINA', 'MABOLO',
    'TABUCO', 'CONCEPCION GRANDE', 'PACOL', 'TINAGO', 'CONCEPCION PEQUEÑO',
    'PANICUASON', 'TRIANGULO'
  )
  ORDER BY barangay
) residents;

-- Add glucose readings for all barangays
INSERT INTO public.health_indicators (resident_id, indicator_type, value, unit, status, notes, recorded_by, recorded_at)
SELECT 
  residents.id,
  'glucose',
  CASE 
    WHEN residents.barangay IN ('SABANG', 'CARARAYAN', 'PANICUASON') THEN 110
    ELSE 95
  END,
  'mg/dL',
  CASE 
    WHEN residents.barangay IN ('SABANG', 'CARARAYAN', 'PANICUASON') THEN 'warning'::text
    ELSE 'normal'::text
  END,
  'Glucose check - ' || residents.barangay,
  (SELECT id FROM public.users LIMIT 1),
  NOW() - INTERVAL '1 day'
FROM (
  SELECT DISTINCT ON (barangay) id, barangay
  FROM public.residents
  WHERE barangay IN (
    'ABELLA', 'DAYANGDANG', 'PEÑAFRANCIA', 'BAGUMBAYAN NORTE', 'DEL ROSARIO',
    'SABANG', 'BAGUMBAYAN SUR', 'DINAGA', 'SAN FELIPE', 'BALATAS',
    'IGUALDAD INTERIOR', 'SAN FRANCISCO (POB.)', 'CALAUAG', 'LERMA', 'SAN ISIDRO',
    'CARARAYAN', 'LIBOTON', 'SANTA CRUZ', 'CAROLINA', 'MABOLO',
    'TABUCO', 'CONCEPCION GRANDE', 'PACOL', 'TINAGO', 'CONCEPCION PEQUEÑO',
    'PANICUASON', 'TRIANGULO'
  )
  ORDER BY barangay
) residents;

-- Add temperature readings for all barangays
INSERT INTO public.health_indicators (resident_id, indicator_type, value, unit, status, notes, recorded_by, recorded_at)
SELECT 
  residents.id,
  'temperature',
  36.8,
  'C',
  'normal',
  'Temperature check - ' || residents.barangay,
  (SELECT id FROM public.users LIMIT 1),
  NOW() - INTERVAL '2 days'
FROM (
  SELECT DISTINCT ON (barangay) id, barangay
  FROM public.residents
  WHERE barangay IN (
    'ABELLA', 'DAYANGDANG', 'PEÑAFRANCIA', 'BAGUMBAYAN NORTE', 'DEL ROSARIO',
    'SABANG', 'BAGUMBAYAN SUR', 'DINAGA', 'SAN FELIPE', 'BALATAS',
    'IGUALDAD INTERIOR', 'SAN FRANCISCO (POB.)', 'CALAUAG', 'LERMA', 'SAN ISIDRO',
    'CARARAYAN', 'LIBOTON', 'SANTA CRUZ', 'CAROLINA', 'MABOLO',
    'TABUCO', 'CONCEPCION GRANDE', 'PACOL', 'TINAGO', 'CONCEPCION PEQUEÑO',
    'PANICUASON', 'TRIANGULO'
  )
  ORDER BY barangay
) residents;
