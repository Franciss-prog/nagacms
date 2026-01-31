-- ============================================================================
-- SAMPLE HEALTH INDICATORS DATA
-- Based on CY 2023-2024 Disease Surveillance Data for Naga City
-- ============================================================================

INSERT INTO public.health_indicators (
  id,
  resident_id,
  indicator_type,
  value,
  unit,
  status,
  notes,
  recorded_by,
  recorded_at,
  created_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440013',
  'Hypertension',
  172,
  'mmHg',
  'critical',
  'Disease surveillance record from Naga City CY 2023-2024',
  '550e8400-e29b-41d4-a716-446655440001',
  '2025-03-26T12:41:17.612260',
  now()
);
INSERT INTO public.health_indicators (
  id,
  resident_id,
  indicator_type,
  value,
  unit,
  status,
  notes,
  recorded_by,
  recorded_at,
  created_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440012',
  'Diabetes',
  235,
  'mg/dL',
  'critical',
  'Disease surveillance record from Naga City CY 2023-2024',
  '550e8400-e29b-41d4-a716-446655440001',
  '2025-02-28T12:41:17.612282',
  now()
);
INSERT INTO public.health_indicators (
  id,
  resident_id,
  indicator_type,
  value,
  unit,
  status,
  notes,
  recorded_by,
  recorded_at,
  created_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440012',
  'Respiratory Infection',
  36,
  'count',
  'warning',
  'Disease surveillance record from Naga City CY 2023-2024',
  '550e8400-e29b-41d4-a716-446655440001',
  '2025-04-11T12:41:17.612289',
  now()
);
INSERT INTO public.health_indicators (
  id,
  resident_id,
  indicator_type,
  value,
  unit,
  status,
  notes,
  recorded_by,
  recorded_at,
  created_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440004',
  '550e8400-e29b-41d4-a716-446655440014',
  'Gastroenteritis',
  42,
  'cases',
  'normal',
  'Disease surveillance record from Naga City CY 2023-2024',
  '550e8400-e29b-41d4-a716-446655440001',
  '2025-10-12T12:41:17.612294',
  now()
);
INSERT INTO public.health_indicators (
  id,
  resident_id,
  indicator_type,
  value,
  unit,
  status,
  notes,
  recorded_by,
  recorded_at,
  created_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440005',
  '550e8400-e29b-41d4-a716-446655440013',
  'Dengue',
  41,
  'cases',
  'normal',
  'Disease surveillance record from Naga City CY 2023-2024',
  '550e8400-e29b-41d4-a716-446655440001',
  '2025-11-28T12:41:17.612298',
  now()
);
INSERT INTO public.health_indicators (
  id,
  resident_id,
  indicator_type,
  value,
  unit,
  status,
  notes,
  recorded_by,
  recorded_at,
  created_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440006',
  '550e8400-e29b-41d4-a716-446655440010',
  'Pneumonia',
  14,
  'cases',
  'normal',
  'Disease surveillance record from Naga City CY 2023-2024',
  '550e8400-e29b-41d4-a716-446655440001',
  '2025-11-05T12:41:17.612302',
  now()
);
INSERT INTO public.health_indicators (
  id,
  resident_id,
  indicator_type,
  value,
  unit,
  status,
  notes,
  recorded_by,
  recorded_at,
  created_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440007',
  '550e8400-e29b-41d4-a716-446655440011',
  'Malaria',
  46,
  'cases',
  'warning',
  'Disease surveillance record from Naga City CY 2023-2024',
  '550e8400-e29b-41d4-a716-446655440001',
  '2025-06-09T12:41:17.612308',
  now()
);
INSERT INTO public.health_indicators (
  id,
  resident_id,
  indicator_type,
  value,
  unit,
  status,
  notes,
  recorded_by,
  recorded_at,
  created_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440008',
  '550e8400-e29b-41d4-a716-446655440013',
  'Diarrhea',
  24,
  'cases',
  'warning',
  'Disease surveillance record from Naga City CY 2023-2024',
  '550e8400-e29b-41d4-a716-446655440001',
  '2025-09-30T12:41:17.612311',
  now()
);
INSERT INTO public.health_indicators (
  id,
  resident_id,
  indicator_type,
  value,
  unit,
  status,
  notes,
  recorded_by,
  recorded_at,
  created_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440009',
  '550e8400-e29b-41d4-a716-446655440014',
  'Hypertension',
  126,
  'mmHg',
  'warning',
  'Disease surveillance record from Naga City CY 2023-2024',
  '550e8400-e29b-41d4-a716-446655440001',
  '2026-01-05T12:41:17.612315',
  now()
);
INSERT INTO public.health_indicators (
  id,
  resident_id,
  indicator_type,
  value,
  unit,
  status,
  notes,
  recorded_by,
  recorded_at,
  created_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440010',
  '550e8400-e29b-41d4-a716-446655440012',
  'Asthma',
  42,
  'cases',
  'normal',
  'Disease surveillance record from Naga City CY 2023-2024',
  '550e8400-e29b-41d4-a716-446655440001',
  '2025-10-28T12:41:17.612318',
  now()
);
INSERT INTO public.health_indicators (
  id,
  resident_id,
  indicator_type,
  value,
  unit,
  status,
  notes,
  recorded_by,
  recorded_at,
  created_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440011',
  '550e8400-e29b-41d4-a716-446655440014',
  'Tuberculosis',
  8,
  'cases',
  'normal',
  'Disease surveillance record from Naga City CY 2023-2024',
  '550e8400-e29b-41d4-a716-446655440001',
  '2025-04-10T12:41:17.612322',
  now()
);
INSERT INTO public.health_indicators (
  id,
  resident_id,
  indicator_type,
  value,
  unit,
  status,
  notes,
  recorded_by,
  recorded_at,
  created_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440012',
  '550e8400-e29b-41d4-a716-446655440014',
  'Typhoid',
  1,
  'cases',
  'warning',
  'Disease surveillance record from Naga City CY 2023-2024',
  '550e8400-e29b-41d4-a716-446655440001',
  '2025-08-22T12:41:17.612325',
  now()
);
INSERT INTO public.health_indicators (
  id,
  resident_id,
  indicator_type,
  value,
  unit,
  status,
  notes,
  recorded_by,
  recorded_at,
  created_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440013',
  '550e8400-e29b-41d4-a716-446655440014',
  'Skin Infection',
  38,
  'cases',
  'normal',
  'Disease surveillance record from Naga City CY 2023-2024',
  '550e8400-e29b-41d4-a716-446655440001',
  '2025-03-09T12:41:17.612328',
  now()
);
INSERT INTO public.health_indicators (
  id,
  resident_id,
  indicator_type,
  value,
  unit,
  status,
  notes,
  recorded_by,
  recorded_at,
  created_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440014',
  '550e8400-e29b-41d4-a716-446655440010',
  'Bronchitis',
  28,
  'cases',
  'warning',
  'Disease surveillance record from Naga City CY 2023-2024',
  '550e8400-e29b-41d4-a716-446655440001',
  '2025-10-11T12:41:17.612332',
  now()
);
INSERT INTO public.health_indicators (
  id,
  resident_id,
  indicator_type,
  value,
  unit,
  status,
  notes,
  recorded_by,
  recorded_at,
  created_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440015',
  '550e8400-e29b-41d4-a716-446655440013',
  'Measles',
  39,
  'cases',
  'warning',
  'Disease surveillance record from Naga City CY 2023-2024',
  '550e8400-e29b-41d4-a716-446655440001',
  '2025-12-18T12:41:17.612335',
  now()
);
INSERT INTO public.health_indicators (
  id,
  resident_id,
  indicator_type,
  value,
  unit,
  status,
  notes,
  recorded_by,
  recorded_at,
  created_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440016',
  '550e8400-e29b-41d4-a716-446655440014',
  'Diabetes',
  400,
  'mg/dL',
  'critical',
  'Disease surveillance record from Naga City CY 2023-2024',
  '550e8400-e29b-41d4-a716-446655440001',
  '2025-06-15T12:41:17.612339',
  now()
);
INSERT INTO public.health_indicators (
  id,
  resident_id,
  indicator_type,
  value,
  unit,
  status,
  notes,
  recorded_by,
  recorded_at,
  created_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440017',
  '550e8400-e29b-41d4-a716-446655440011',
  'Hypertension',
  159,
  'mmHg',
  'critical',
  'Disease surveillance record from Naga City CY 2023-2024',
  '550e8400-e29b-41d4-a716-446655440001',
  '2025-06-30T12:41:17.612343',
  now()
);
INSERT INTO public.health_indicators (
  id,
  resident_id,
  indicator_type,
  value,
  unit,
  status,
  notes,
  recorded_by,
  recorded_at,
  created_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440018',
  '550e8400-e29b-41d4-a716-446655440013',
  'Pneumonia',
  6,
  'cases',
  'normal',
  'Disease surveillance record from Naga City CY 2023-2024',
  '550e8400-e29b-41d4-a716-446655440001',
  '2025-02-10T12:41:17.612347',
  now()
);
INSERT INTO public.health_indicators (
  id,
  resident_id,
  indicator_type,
  value,
  unit,
  status,
  notes,
  recorded_by,
  recorded_at,
  created_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440019',
  '550e8400-e29b-41d4-a716-446655440012',
  'Malaria',
  12,
  'cases',
  'warning',
  'Disease surveillance record from Naga City CY 2023-2024',
  '550e8400-e29b-41d4-a716-446655440001',
  '2025-10-16T12:41:17.612350',
  now()
);
INSERT INTO public.health_indicators (
  id,
  resident_id,
  indicator_type,
  value,
  unit,
  status,
  notes,
  recorded_by,
  recorded_at,
  created_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440020',
  '550e8400-e29b-41d4-a716-446655440011',
  'Dengue',
  24,
  'cases',
  'warning',
  'Disease surveillance record from Naga City CY 2023-2024',
  '550e8400-e29b-41d4-a716-446655440001',
  '2025-04-29T12:41:17.612353',
  now()
);
INSERT INTO public.health_indicators (
  id,
  resident_id,
  indicator_type,
  value,
  unit,
  status,
  notes,
  recorded_by,
  recorded_at,
  created_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440021',
  '550e8400-e29b-41d4-a716-446655440013',
  'Respiratory Infection',
  8,
  'count',
  'normal',
  'Disease surveillance record from Naga City CY 2023-2024',
  '550e8400-e29b-41d4-a716-446655440001',
  '2025-11-27T12:41:17.612356',
  now()
);
INSERT INTO public.health_indicators (
  id,
  resident_id,
  indicator_type,
  value,
  unit,
  status,
  notes,
  recorded_by,
  recorded_at,
  created_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440022',
  '550e8400-e29b-41d4-a716-446655440014',
  'Gastroenteritis',
  18,
  'cases',
  'warning',
  'Disease surveillance record from Naga City CY 2023-2024',
  '550e8400-e29b-41d4-a716-446655440001',
  '2025-12-04T12:41:17.612359',
  now()
);
INSERT INTO public.health_indicators (
  id,
  resident_id,
  indicator_type,
  value,
  unit,
  status,
  notes,
  recorded_by,
  recorded_at,
  created_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440023',
  '550e8400-e29b-41d4-a716-446655440012',
  'Hepatitis A',
  48,
  'cases',
  'normal',
  'Disease surveillance record from Naga City CY 2023-2024',
  '550e8400-e29b-41d4-a716-446655440001',
  '2025-05-28T12:41:17.612363',
  now()
);
INSERT INTO public.health_indicators (
  id,
  resident_id,
  indicator_type,
  value,
  unit,
  status,
  notes,
  recorded_by,
  recorded_at,
  created_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440024',
  '550e8400-e29b-41d4-a716-446655440014',
  'Measles',
  50,
  'cases',
  'warning',
  'Disease surveillance record from Naga City CY 2023-2024',
  '550e8400-e29b-41d4-a716-446655440001',
  '2025-10-20T12:41:17.612366',
  now()
);
INSERT INTO public.health_indicators (
  id,
  resident_id,
  indicator_type,
  value,
  unit,
  status,
  notes,
  recorded_by,
  recorded_at,
  created_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440025',
  '550e8400-e29b-41d4-a716-446655440012',
  'Typhoid',
  29,
  'cases',
  'normal',
  'Disease surveillance record from Naga City CY 2023-2024',
  '550e8400-e29b-41d4-a716-446655440001',
  '2025-08-09T12:41:17.612369',
  now()
);
INSERT INTO public.health_indicators (
  id,
  resident_id,
  indicator_type,
  value,
  unit,
  status,
  notes,
  recorded_by,
  recorded_at,
  created_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440026',
  '550e8400-e29b-41d4-a716-446655440011',
  'Hypertension',
  166,
  'mmHg',
  'critical',
  'Disease surveillance record from Naga City CY 2023-2024',
  '550e8400-e29b-41d4-a716-446655440001',
  '2025-05-16T12:41:17.612372',
  now()
);
INSERT INTO public.health_indicators (
  id,
  resident_id,
  indicator_type,
  value,
  unit,
  status,
  notes,
  recorded_by,
  recorded_at,
  created_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440027',
  '550e8400-e29b-41d4-a716-446655440014',
  'Heart Disease',
  25,
  'count',
  'normal',
  'Disease surveillance record from Naga City CY 2023-2024',
  '550e8400-e29b-41d4-a716-446655440001',
  '2025-12-25T12:41:17.612377',
  now()
);
INSERT INTO public.health_indicators (
  id,
  resident_id,
  indicator_type,
  value,
  unit,
  status,
  notes,
  recorded_by,
  recorded_at,
  created_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440028',
  '550e8400-e29b-41d4-a716-446655440014',
  'Stroke',
  5,
  'count',
  'warning',
  'Disease surveillance record from Naga City CY 2023-2024',
  '550e8400-e29b-41d4-a716-446655440001',
  '2025-06-20T12:41:17.612381',
  now()
);
INSERT INTO public.health_indicators (
  id,
  resident_id,
  indicator_type,
  value,
  unit,
  status,
  notes,
  recorded_by,
  recorded_at,
  created_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440029',
  '550e8400-e29b-41d4-a716-446655440010',
  'Chronic Kidney Disease',
  14,
  'count',
  'normal',
  'Disease surveillance record from Naga City CY 2023-2024',
  '550e8400-e29b-41d4-a716-446655440001',
  '2025-09-30T12:41:17.612384',
  now()
);
INSERT INTO public.health_indicators (
  id,
  resident_id,
  indicator_type,
  value,
  unit,
  status,
  notes,
  recorded_by,
  recorded_at,
  created_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440030',
  '550e8400-e29b-41d4-a716-446655440010',
  'COPD',
  29,
  'count',
  'warning',
  'Disease surveillance record from Naga City CY 2023-2024',
  '550e8400-e29b-41d4-a716-446655440001',
  '2025-02-04T12:41:17.612387',
  now()
);
INSERT INTO public.health_indicators (
  id,
  resident_id,
  indicator_type,
  value,
  unit,
  status,
  notes,
  recorded_by,
  recorded_at,
  created_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440031',
  '550e8400-e29b-41d4-a716-446655440014',
  'Malaria',
  13,
  'cases',
  'warning',
  'Disease surveillance record from Naga City CY 2023-2024',
  '550e8400-e29b-41d4-a716-446655440001',
  '2025-10-29T12:41:17.612390',
  now()
);
INSERT INTO public.health_indicators (
  id,
  resident_id,
  indicator_type,
  value,
  unit,
  status,
  notes,
  recorded_by,
  recorded_at,
  created_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440032',
  '550e8400-e29b-41d4-a716-446655440012',
  'Dengue',
  26,
  'cases',
  'warning',
  'Disease surveillance record from Naga City CY 2023-2024',
  '550e8400-e29b-41d4-a716-446655440001',
  '2025-04-09T12:41:17.612394',
  now()
);
INSERT INTO public.health_indicators (
  id,
  resident_id,
  indicator_type,
  value,
  unit,
  status,
  notes,
  recorded_by,
  recorded_at,
  created_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440033',
  '550e8400-e29b-41d4-a716-446655440012',
  'Leptospirosis',
  22,
  'cases',
  'warning',
  'Disease surveillance record from Naga City CY 2023-2024',
  '550e8400-e29b-41d4-a716-446655440001',
  '2025-09-21T12:41:17.612397',
  now()
);
INSERT INTO public.health_indicators (
  id,
  resident_id,
  indicator_type,
  value,
  unit,
  status,
  notes,
  recorded_by,
  recorded_at,
  created_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440034',
  '550e8400-e29b-41d4-a716-446655440011',
  'Typhoid',
  2,
  'cases',
  'normal',
  'Disease surveillance record from Naga City CY 2023-2024',
  '550e8400-e29b-41d4-a716-446655440001',
  '2026-01-26T12:41:17.612400',
  now()
);
INSERT INTO public.health_indicators (
  id,
  resident_id,
  indicator_type,
  value,
  unit,
  status,
  notes,
  recorded_by,
  recorded_at,
  created_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440035',
  '550e8400-e29b-41d4-a716-446655440011',
  'Pneumonia',
  40,
  'cases',
  'normal',
  'Disease surveillance record from Naga City CY 2023-2024',
  '550e8400-e29b-41d4-a716-446655440001',
  '2025-10-25T12:41:17.612403',
  now()
);