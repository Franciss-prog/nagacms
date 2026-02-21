-- ============================================================================
-- MEDICATION INVENTORY - SYNTHETIC SAMPLE DATA
-- For: medication_inventory, medication_allocations,
--      medication_distribution_history, medication_inventory_logs
-- ============================================================================
-- Safe to re-run (uses fixed UUIDs + ON CONFLICT updates)
--
-- Run after:
--   migrations/005_medication_inventory_module.sql
-- ============================================================================

-- Optional cleanup (uncomment if you want a full reset for this sample set)
-- DELETE FROM public.medication_inventory_logs
-- WHERE medication_id IN (
--   '91000000-0000-0000-0000-000000000001'::uuid,
--   '91000000-0000-0000-0000-000000000002'::uuid,
--   '91000000-0000-0000-0000-000000000003'::uuid,
--   '91000000-0000-0000-0000-000000000004'::uuid,
--   '91000000-0000-0000-0000-000000000005'::uuid,
--   '91000000-0000-0000-0000-000000000006'::uuid,
--   '91000000-0000-0000-0000-000000000007'::uuid,
--   '91000000-0000-0000-0000-000000000008'::uuid,
--   '91000000-0000-0000-0000-000000000009'::uuid,
--   '91000000-0000-0000-0000-000000000010'::uuid
-- );
--
-- DELETE FROM public.medication_distribution_history
-- WHERE medication_id IN (
--   '91000000-0000-0000-0000-000000000001'::uuid,
--   '91000000-0000-0000-0000-000000000002'::uuid,
--   '91000000-0000-0000-0000-000000000003'::uuid,
--   '91000000-0000-0000-0000-000000000004'::uuid,
--   '91000000-0000-0000-0000-000000000005'::uuid,
--   '91000000-0000-0000-0000-000000000006'::uuid,
--   '91000000-0000-0000-0000-000000000007'::uuid,
--   '91000000-0000-0000-0000-000000000008'::uuid,
--   '91000000-0000-0000-0000-000000000009'::uuid,
--   '91000000-0000-0000-0000-000000000010'::uuid
-- );
--
-- DELETE FROM public.medication_allocations
-- WHERE medication_id IN (
--   '91000000-0000-0000-0000-000000000001'::uuid,
--   '91000000-0000-0000-0000-000000000002'::uuid,
--   '91000000-0000-0000-0000-000000000003'::uuid,
--   '91000000-0000-0000-0000-000000000004'::uuid,
--   '91000000-0000-0000-0000-000000000005'::uuid,
--   '91000000-0000-0000-0000-000000000006'::uuid,
--   '91000000-0000-0000-0000-000000000007'::uuid,
--   '91000000-0000-0000-0000-000000000008'::uuid,
--   '91000000-0000-0000-0000-000000000009'::uuid,
--   '91000000-0000-0000-0000-000000000010'::uuid
-- );
--
-- DELETE FROM public.medication_inventory
-- WHERE id IN (
--   '91000000-0000-0000-0000-000000000001'::uuid,
--   '91000000-0000-0000-0000-000000000002'::uuid,
--   '91000000-0000-0000-0000-000000000003'::uuid,
--   '91000000-0000-0000-0000-000000000004'::uuid,
--   '91000000-0000-0000-0000-000000000005'::uuid,
--   '91000000-0000-0000-0000-000000000006'::uuid,
--   '91000000-0000-0000-0000-000000000007'::uuid,
--   '91000000-0000-0000-0000-000000000008'::uuid,
--   '91000000-0000-0000-0000-000000000009'::uuid,
--   '91000000-0000-0000-0000-000000000010'::uuid
-- );

WITH actor AS (
  SELECT id FROM public.users ORDER BY created_at ASC LIMIT 1
)
INSERT INTO public.medication_inventory (
  id,
  medicine_name,
  category,
  batch_number,
  quantity,
  expiration_date,
  low_stock_threshold,
  created_by,
  updated_by,
  created_at,
  updated_at
)
VALUES
  ('91000000-0000-0000-0000-000000000001'::uuid, 'Paracetamol 500mg', 'Analgesic', 'PCM-2026-A01', 320, CURRENT_DATE + INTERVAL '180 days', 60, (SELECT id FROM actor), (SELECT id FROM actor), NOW() - INTERVAL '30 days', NOW()),
  ('91000000-0000-0000-0000-000000000002'::uuid, 'Amoxicillin 500mg', 'Antibiotic', 'AMX-2026-B03', 140, CURRENT_DATE + INTERVAL '75 days', 50, (SELECT id FROM actor), (SELECT id FROM actor), NOW() - INTERVAL '28 days', NOW()),
  ('91000000-0000-0000-0000-000000000003'::uuid, 'ORS Sachet', 'Rehydration', 'ORS-2026-C11', 48, CURRENT_DATE + INTERVAL '120 days', 50, (SELECT id FROM actor), (SELECT id FROM actor), NOW() - INTERVAL '25 days', NOW()),
  ('91000000-0000-0000-0000-000000000004'::uuid, 'Vitamin C 500mg', 'Supplement', 'VTC-2026-D09', 500, CURRENT_DATE + INTERVAL '365 days', 80, (SELECT id FROM actor), (SELECT id FROM actor), NOW() - INTERVAL '24 days', NOW()),
  ('91000000-0000-0000-0000-000000000005'::uuid, 'Metformin 500mg', 'Anti-diabetic', 'MTF-2026-E02', 90, CURRENT_DATE + INTERVAL '28 days', 40, (SELECT id FROM actor), (SELECT id FROM actor), NOW() - INTERVAL '22 days', NOW()),
  ('91000000-0000-0000-0000-000000000006'::uuid, 'Losartan 50mg', 'Antihypertensive', 'LSR-2026-F07', 34, CURRENT_DATE + INTERVAL '12 days', 30, (SELECT id FROM actor), (SELECT id FROM actor), NOW() - INTERVAL '20 days', NOW()),
  ('91000000-0000-0000-0000-000000000007'::uuid, 'Salbutamol Nebules', 'Respiratory', 'SLB-2026-G04', 72, CURRENT_DATE + INTERVAL '9 days', 25, (SELECT id FROM actor), (SELECT id FROM actor), NOW() - INTERVAL '19 days', NOW()),
  ('91000000-0000-0000-0000-000000000008'::uuid, 'Cetirizine 10mg', 'Antihistamine', 'CTR-2026-H08', 210, CURRENT_DATE + INTERVAL '210 days', 35, (SELECT id FROM actor), (SELECT id FROM actor), NOW() - INTERVAL '18 days', NOW()),
  ('91000000-0000-0000-0000-000000000009'::uuid, 'Doxycycline 100mg', 'Antibiotic', 'DOX-2026-I06', 26, CURRENT_DATE + INTERVAL '6 days', 20, (SELECT id FROM actor), (SELECT id FROM actor), NOW() - INTERVAL '16 days', NOW()),
  ('91000000-0000-0000-0000-000000000010'::uuid, 'Insulin (Regular)', 'Endocrine', 'INS-2026-J10', 18, CURRENT_DATE + INTERVAL '4 days', 15, (SELECT id FROM actor), (SELECT id FROM actor), NOW() - INTERVAL '15 days', NOW())
ON CONFLICT (id) DO UPDATE SET
  medicine_name = EXCLUDED.medicine_name,
  category = EXCLUDED.category,
  batch_number = EXCLUDED.batch_number,
  quantity = EXCLUDED.quantity,
  expiration_date = EXCLUDED.expiration_date,
  low_stock_threshold = EXCLUDED.low_stock_threshold,
  updated_by = EXCLUDED.updated_by,
  updated_at = NOW();

-- --------------------------------------------------------------------------
-- Barangay allocations
-- --------------------------------------------------------------------------
WITH actor AS (
  SELECT id FROM public.users ORDER BY created_at ASC LIMIT 1
)
INSERT INTO public.medication_allocations (
  medication_id,
  barangay,
  allocated_quantity,
  updated_by,
  created_at,
  updated_at
)
VALUES
  ('91000000-0000-0000-0000-000000000001'::uuid, 'CONCEPCION PEQUEÑO', 45, (SELECT id FROM actor), NOW() - INTERVAL '14 days', NOW()),
  ('91000000-0000-0000-0000-000000000001'::uuid, 'PACOL', 32, (SELECT id FROM actor), NOW() - INTERVAL '14 days', NOW()),
  ('91000000-0000-0000-0000-000000000001'::uuid, 'TABUCO', 40, (SELECT id FROM actor), NOW() - INTERVAL '14 days', NOW()),

  ('91000000-0000-0000-0000-000000000002'::uuid, 'CAROLINA', 25, (SELECT id FROM actor), NOW() - INTERVAL '13 days', NOW()),
  ('91000000-0000-0000-0000-000000000002'::uuid, 'SAN FELIPE', 20, (SELECT id FROM actor), NOW() - INTERVAL '13 days', NOW()),

  ('91000000-0000-0000-0000-000000000003'::uuid, 'MABOLO', 12, (SELECT id FROM actor), NOW() - INTERVAL '12 days', NOW()),
  ('91000000-0000-0000-0000-000000000003'::uuid, 'DEL ROSARIO', 9, (SELECT id FROM actor), NOW() - INTERVAL '12 days', NOW()),

  ('91000000-0000-0000-0000-000000000005'::uuid, 'LIBOTON', 22, (SELECT id FROM actor), NOW() - INTERVAL '11 days', NOW()),
  ('91000000-0000-0000-0000-000000000005'::uuid, 'DINAGA', 18, (SELECT id FROM actor), NOW() - INTERVAL '11 days', NOW()),

  ('91000000-0000-0000-0000-000000000006'::uuid, 'TRIANGULO', 10, (SELECT id FROM actor), NOW() - INTERVAL '10 days', NOW()),
  ('91000000-0000-0000-0000-000000000006'::uuid, 'SABANG', 8, (SELECT id FROM actor), NOW() - INTERVAL '10 days', NOW()),

  ('91000000-0000-0000-0000-000000000007'::uuid, 'BAGUMBAYAN NORTE', 18, (SELECT id FROM actor), NOW() - INTERVAL '9 days', NOW()),
  ('91000000-0000-0000-0000-000000000007'::uuid, 'BAGUMBAYAN SUR', 14, (SELECT id FROM actor), NOW() - INTERVAL '9 days', NOW()),

  ('91000000-0000-0000-0000-000000000009'::uuid, 'PANICUASON', 9, (SELECT id FROM actor), NOW() - INTERVAL '8 days', NOW()),
  ('91000000-0000-0000-0000-000000000008'::uuid, 'CALAUAG', 16, (SELECT id FROM actor), NOW() - INTERVAL '8 days', NOW()),
  ('91000000-0000-0000-0000-000000000002'::uuid, 'CALAUAG', 11, (SELECT id FROM actor), NOW() - INTERVAL '8 days', NOW()),
  ('91000000-0000-0000-0000-000000000010'::uuid, 'CALAUAG', 7, (SELECT id FROM actor), NOW() - INTERVAL '8 days', NOW())
ON CONFLICT (medication_id, barangay) DO UPDATE SET
  allocated_quantity = EXCLUDED.allocated_quantity,
  updated_by = EXCLUDED.updated_by,
  updated_at = NOW();

-- --------------------------------------------------------------------------
-- Distribution history (audit trail)
-- --------------------------------------------------------------------------
WITH actor AS (
  SELECT id FROM public.users ORDER BY created_at ASC LIMIT 1
)
INSERT INTO public.medication_distribution_history (
  id,
  medication_id,
  action_type,
  quantity,
  barangay,
  from_barangay,
  to_barangay,
  notes,
  action_by,
  created_at
)
VALUES
  ('92000000-0000-0000-0000-000000000001'::uuid, '91000000-0000-0000-0000-000000000001'::uuid, 'restock', 120, NULL, NULL, NULL, 'Quarterly replenishment from central warehouse', (SELECT id FROM actor), NOW() - INTERVAL '14 days'),
  ('92000000-0000-0000-0000-000000000002'::uuid, '91000000-0000-0000-0000-000000000001'::uuid, 'allocate', 40, 'TABUCO', NULL, NULL, 'Routine allocation', (SELECT id FROM actor), NOW() - INTERVAL '13 days'),
  ('92000000-0000-0000-0000-000000000003'::uuid, '91000000-0000-0000-0000-000000000002'::uuid, 'allocate', 25, 'CAROLINA', NULL, NULL, 'Respiratory infection response allocation', (SELECT id FROM actor), NOW() - INTERVAL '12 days'),
  ('92000000-0000-0000-0000-000000000004'::uuid, '91000000-0000-0000-0000-000000000003'::uuid, 'dispense', 8, 'MABOLO', NULL, NULL, 'Acute diarrhea cases', (SELECT id FROM actor), NOW() - INTERVAL '10 days'),
  ('92000000-0000-0000-0000-000000000005'::uuid, '91000000-0000-0000-0000-000000000005'::uuid, 'dispense', 12, 'LIBOTON', NULL, NULL, 'Diabetes maintenance clients', (SELECT id FROM actor), NOW() - INTERVAL '9 days'),
  ('92000000-0000-0000-0000-000000000006'::uuid, '91000000-0000-0000-0000-000000000006'::uuid, 'redistribute', 5, NULL, 'TRIANGULO', 'SABANG', 'Shift stock to high-demand area', (SELECT id FROM actor), NOW() - INTERVAL '8 days'),
  ('92000000-0000-0000-0000-000000000007'::uuid, '91000000-0000-0000-0000-000000000007'::uuid, 'allocate', 14, 'BAGUMBAYAN SUR', NULL, NULL, 'Asthma episode preparedness', (SELECT id FROM actor), NOW() - INTERVAL '7 days'),
  ('92000000-0000-0000-0000-000000000008'::uuid, '91000000-0000-0000-0000-000000000009'::uuid, 'dispense', 6, 'PANICUASON', NULL, NULL, 'Community clinic treatment', (SELECT id FROM actor), NOW() - INTERVAL '6 days'),
  ('92000000-0000-0000-0000-000000000009'::uuid, '91000000-0000-0000-0000-000000000010'::uuid, 'adjust', 3, NULL, NULL, NULL, 'Cold-chain count reconciliation', (SELECT id FROM actor), NOW() - INTERVAL '5 days'),
  ('92000000-0000-0000-0000-000000000010'::uuid, '91000000-0000-0000-0000-000000000004'::uuid, 'allocate', 60, 'CONCEPCION PEQUEÑO', NULL, NULL, 'Supplement drive kickoff', (SELECT id FROM actor), NOW() - INTERVAL '4 days'),
  ('92000000-0000-0000-0000-000000000011'::uuid, '91000000-0000-0000-0000-000000000008'::uuid, 'allocate', 16, 'CALAUAG', NULL, NULL, 'Allergy season buffer stock', (SELECT id FROM actor), NOW() - INTERVAL '4 days'),
  ('92000000-0000-0000-0000-000000000012'::uuid, '91000000-0000-0000-0000-000000000002'::uuid, 'dispense', 5, 'CALAUAG', NULL, NULL, 'Upper respiratory infection treatment', (SELECT id FROM actor), NOW() - INTERVAL '3 days')
ON CONFLICT (id) DO UPDATE SET
  action_type = EXCLUDED.action_type,
  quantity = EXCLUDED.quantity,
  barangay = EXCLUDED.barangay,
  from_barangay = EXCLUDED.from_barangay,
  to_barangay = EXCLUDED.to_barangay,
  notes = EXCLUDED.notes,
  action_by = EXCLUDED.action_by,
  created_at = EXCLUDED.created_at;

-- --------------------------------------------------------------------------
-- Inventory logs (accountability)
-- --------------------------------------------------------------------------
WITH actor AS (
  SELECT id FROM public.users ORDER BY created_at ASC LIMIT 1
)
INSERT INTO public.medication_inventory_logs (
  id,
  medication_id,
  action,
  actor_id,
  details,
  created_at
)
VALUES
  (
    '93000000-0000-0000-0000-000000000001'::uuid,
    '91000000-0000-0000-0000-000000000003'::uuid,
    'auto_alert_low_stock',
    (SELECT id FROM actor),
    jsonb_build_object('reason', 'quantity_below_threshold', 'quantity', 48, 'threshold', 50),
    NOW() - INTERVAL '3 days'
  ),
  (
    '93000000-0000-0000-0000-000000000002'::uuid,
    '91000000-0000-0000-0000-000000000010'::uuid,
    'auto_alert_expiring_soon',
    (SELECT id FROM actor),
    jsonb_build_object('reason', 'expires_soon', 'days_to_expiry', 4),
    NOW() - INTERVAL '2 days'
  ),
  (
    '93000000-0000-0000-0000-000000000003'::uuid,
    '91000000-0000-0000-0000-000000000006'::uuid,
    'distribution_redistribute',
    (SELECT id FROM actor),
    jsonb_build_object('from_barangay', 'TRIANGULO', 'to_barangay', 'SABANG', 'quantity', 5),
    NOW() - INTERVAL '8 days'
  )
ON CONFLICT (id) DO UPDATE SET
  action = EXCLUDED.action,
  actor_id = EXCLUDED.actor_id,
  details = EXCLUDED.details,
  created_at = EXCLUDED.created_at;

-- Quick validation queries
-- SELECT medicine_name, quantity, low_stock_threshold, expiration_date FROM public.medication_inventory ORDER BY medicine_name;
-- SELECT medication_id, barangay, allocated_quantity FROM public.medication_allocations ORDER BY medication_id, barangay;
-- SELECT action_type, quantity, barangay, from_barangay, to_barangay, created_at FROM public.medication_distribution_history ORDER BY created_at DESC;
