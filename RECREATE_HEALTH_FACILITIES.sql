-- ============================================================================
-- RECREATE HEALTH FACILITIES TABLE - BASED ON NAGA BHS CSV DATA
-- ============================================================================
-- This script will:
-- 1. Drop dependent tables (to avoid FK constraint issues)
-- 2. Drop health_facilities table
-- 3. Recreate health_facilities with proper structure
-- 4. Insert data from NAGA BHS CSV file
-- ============================================================================

-- STEP 1: Drop dependent tables (if they exist)
DROP TABLE IF EXISTS public.facility_schedules CASCADE;
DROP TABLE IF EXISTS public.personnel_availability CASCADE;

-- STEP 2: Drop health_facilities table
DROP TABLE IF EXISTS public.health_facilities CASCADE;

-- STEP 3: Create new health_facilities table based on CSV structure
CREATE TABLE public.health_facilities (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  barangay text NOT NULL,
  address text NOT NULL,
  operating_hours text,
  contact_json jsonb, -- Array of staff contacts with phone numbers
  general_services text, -- Comma-separated list of general services
  specialized_services text, -- Comma-separated list of specialized services
  service_capability text, -- e.g., "OPD, Primary Health Care Services"
  yakap_accredited boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT health_facilities_pkey PRIMARY KEY (id)
);

CREATE INDEX idx_health_facilities_barangay ON public.health_facilities(barangay);
CREATE INDEX idx_health_facilities_name ON public.health_facilities(name);
CREATE INDEX idx_health_facilities_yakap_accredited ON public.health_facilities(yakap_accredited);

-- ============================================================================
-- STEP 4: INSERT DATA FROM NAGA BHS CSV
-- ============================================================================

INSERT INTO public.health_facilities 
(name, barangay, address, operating_hours, contact_json, general_services, specialized_services, service_capability, yakap_accredited) 
VALUES
('Abella Barangay Health Station', 'Abella', 'Zone 4 Urban, Abella, Naga City', 'Monday - Friday 8:00 AM to 5:00 PM', 
 '[{"name":"Stephanie Mae C. Magistrado","role":"BHS MW","phone":"0961-995-0058"},{"name":"Raquel O. Benosa","role":"BNS","phone":"0998-279-3261"},{"name":"Amelia SA. Reyes","role":"BSPO","phone":"0981-189-7164"},{"name":"Mary Anne D. Navarro","role":"BSPO","phone":"0912-609-1244"}]',
 'Daily Consultation, Family Planning, Nutrition (Center-Based Feeding), NTP Day, Immunization Day, Prenatal Day/Counselling, Post-Partum/Home Visitation',
 'Adolescent Health Services (Daily), Mental Health Consultation (Daily), Women''s Health Services - VIA, Breast Cancer Screening (Quarterly), Medical Check Up (Quarterly), Dental Check Up (Monthly)',
 'OPD, Primary Health Care Services', false),

('Bagumbayan Norte Barangay Health Station', 'Bagumbayan Norte', 'Zone 5 Bagumbayan Norte, Naga City', 'Monday - Friday 8:00 AM to 5:00 PM',
 '[{"name":"Sarah Kay S. Cano","role":"BHS MW","phone":"0963-758-9088"},{"name":"Teresa R. Bachiller","role":"BHW Pres.","phone":"0930-674-2637"},{"name":"Merlina D. Camba","role":"BNS","phone":"0993-651-0036"},{"name":"Gina F. Avellano","role":"BSPO","phone":"0951-746-8427"},{"name":"Mary Mae A. Calalo","role":"K/H","phone":"0961-972-2373"}]',
 'Family Planning Services, Daily Consultation, Non Communicable Diseases Risk Assessment, NTP Dispensing of Medicines, Immunization Day, Prenatal Day',
 'PSI Insertion/Removal (Based on Clients Availability), Dental Check Up (Scheduled by Dentist - Monthly)',
 'OPD, Primary Health Care Services', false),

('Bagumbayan Sur Barangay Health Station', 'Bagumbayan Sur', 'Zone 1 P. Santos St., Bagumbayan Sur, Naga City', 'Monday - Friday 8:00 AM to 5:00 PM',
 '[{"name":"Gemma R. Paglinawan","role":"BHS MW","phone":"0916-823-9471"},{"name":"Eden P. Adupe","role":"BHW Pres.","phone":"0920-735-2604"},{"name":"Gemma L. Adupe","role":"BNS","phone":"0907-362-6175"},{"name":"Rosemarie P. Viñas","role":"BSPO","phone":"0951-016-7317"}]',
 'Daily Consultation, Family Planning (Counseling/Dispensing of FP commodities/New Acceptors), NTP (Enrollment/Drug Dispensing), YAKAP Profiling, Risk Assessment of Non Communicable Diseases, 4P''s Beneficiary Weight Monitoring (under 5 yrs old), Adolescent Counseling, Micronutrient Supplementation (6-59 mos), Prenatal Day, Immunization Day, Post-Partum/Home Visitation',
 'PSI Insertion/Removal (by Appointment), Mobile Blood Donation (April and December), Operation Tuli (Every Summer), Basic Oral Health Care (Scheduled by City Dentist), School Based Immunization (Scheduled by DOH/DEPED), School Based Deworming (Scheduled by DOH/DEPED), Community Based Deworming (January and July), HPV Immunization (9 to 14 yrs old, female only)',
 'OPD, Primary Health Care Services', false),

('Balatas Barangay Health Station', 'Balatas', 'Zone 3 Kayanga Street, Balatas, Naga City', 'Monday - Friday 8:00 AM to 5:00 PM',
 '[{"name":"Mariel San Agustin","role":"BHS MW","phone":"0950-868-2736"},{"name":"Luis Anthony Contreras","role":"DOH-HRH","phone":"0917-314-8740"},{"name":"Melba Tena","role":"BNS","phone":"0938-186-5252"},{"name":"Nova A. Atos","role":"BSPO","phone":"0950-578-3938"}]',
 'Daily Consultation, Family Planning, NTP (1-5pm, M-T-W-F), Prenatal Day/Counseling, Immunization Day, Prenatal Day, Post Partum/Home Visitation, Non-Communicable Disease Health Services and Risk Assessment',
 'Adolescent Health Services (every Tuesday and Thursday), Dental Check Up (Quarterly)',
 'OPD, Primary Health Care Services', false),

('Calauag Barangay Health Station', 'Calauag', 'Zone 6 Calauag, Naga City', 'Monday - Friday 8:00 AM to 5:00 PM',
 '[{"name":"Rowena F. Reondanga","role":"BHS MW","phone":"0910-153-7273"},{"name":"Zarina V. Ardeza","role":"DOH HRH","phone":"0916-552-2912"},{"name":"Zabeth Sto. Domingo","role":"BHW Pres.","phone":"0912-332-1668"},{"name":"Alma Plandes","role":"BSPO","phone":"0912-148-5435"},{"name":"Joana Carmela Clemente","role":"BSPO","phone":"0993-229-7680"},{"name":"Elizabeth Peñaflor","role":"BSPO","phone":"0970-492-3449"}]',
 'Adolescent Health Program Services, Prenatal Services (Tuesday & Thursday), Immunization Day, NTP (Friday)',
 'Monthly - VIA Screening, Oral Health and Dengue Program, Twice A Year - SBD (Jan & July), Blood Donation, Once A Year - SIA, SBI, Operation Tuli (May), Dog Vaccination (March), Flu vaccination (subject to availability)',
 'OPD, Primary Health Care Services', false),

('Cararayan Barangay Health Station', 'Cararayan', 'Zone 1A Cararayan, Naga City / Zone 6 San Rafael, Cararayan, Naga City (Annex BHS)', 'Monday - Friday 8:00 AM to 5:00 PM',
 '[{"name":"Rodrigo Agravante Jr","role":"Barangay Official","phone":"0907-129-4068"},{"name":"Janet Roslene Beloro","role":"BHS MW","phone":"0961-607-3195"}]',
 'Family Planning Services (DMPA Injection - every afternoon), Prenatal Day (Tuesday/Thursday), Immunization Day, NTP/TB PT (Thursday)',
 'Adolescent Counselling (Every Monday/Friday), PSI Insertion (based on Client''s Demand - by Schedule), 4P''s (under 5) Nutritional Monitoring (Every Friday)',
 'OPD, Primary Health Care Services', false),

('Carolina Barangay Health Station', 'Carolina', 'Zone 3 Carolina, Naga City', 'Monday - Friday 8:00 AM to 5:00 PM',
 '[{"name":"Contact","phone":"0946-360-4591"},{"name":"Contact","phone":"0948-902-1470"}]',
 'Daily Consultation, Family Planning, Non Communicable Diseases Health Services, Prenatal Day (Tuesday/Thursday), HIV Screening and Counseling (Tuesday), Immunization Day, NTP/Post-Partum/Home Visitation (Friday)',
 'Teenage Pregnancy & Adolescent Counseling (Every Friday), Women''s Day VIA and Breast Exam (Last Friday of the Month), Mental Health Counseling (Last Friday of the Month)',
 'OPD, Primary Health Care Services', false),

('Concepcion Grande Barangay Health Station', 'Concepcion Grande', 'Zone 4 Barangay Hall, Concepcion Grande, Naga City', 'Monday - Friday 8:00 AM to 5:00 PM',
 '[{"name":"Rosa M. Paa","role":"BHS MW","phone":"0992-646-0324"},{"name":"Angelica DR. Relos","role":"DOH - HRH","phone":"0981-010-0550"},{"name":"Cecilia O. San Pascual","role":"BNS","phone":"0960-225-3086"},{"name":"Isabel B. Baldemoro","role":"BSPO","phone":"0950-578-3938"}]',
 'Daily Consultation, Family Planning, Nutrition (Center-based Feeding), NTP Day (Tuesday), Immunization Day, Prenatal Day/Counselling (Thursday), Post-Partum/Home Visitation (Friday)',
 'Adolescent Health Services (every 1st Friday of the Month), Mental Health Consultation (every 2nd Friday of the Month), Women''s Day (VIA, Breast Cancer Screening - every 3rd Friday of the Month), Medical Check-up (every Saturday), Dental Check-up (every 1st Sunday of the Month)',
 'OPD, Primary Health Care Services', false),

('Concepcion Pequeña Barangay Health Station', 'Concepcion Pequeña', 'Zone 3 Greenland, Concepcion Pequeña, Naga City', 'Monday - Friday 8:00 AM to 5:00 PM',
 '[{"name":"Neliza G. Diaz","role":"DOH - HRH","phone":"0945-162-8425"},{"name":"Armida B. Sayson","role":"DOH - HRH","phone":"0927-410-0433"},{"name":"Prince Mark S. Apongol","role":"DOH - HRH","phone":"0919-826-0699"},{"name":"Lalaine C. Brito","role":"DOH - HRH","phone":"0929-786-1371"},{"name":"Eva C. Albao","role":"DOH - HRH","phone":"0928-691-2543"},{"name":"Preciosa Buenaflor","role":"BSPO","phone":""},{"name":"Nenita B. Omisal","role":"BSPO","phone":"0916-737-4870"},{"name":"Morie Buitzon","role":"BSPO","phone":"0970-980-6594"},{"name":"Julianne T. Rivera","role":"BSPO","phone":"0970-315-9524"}]',
 'Family Planning (Usapan Series, DMPA Injection, Pills/Condom, PSI Insertion and Removal, IUD/Tubal Ligation-Referral), Non Communicable Disease Program Health Services, Adolescent Health (Counseling and referral, HPV Vaccination), NTP (Tuesday and Friday), Immunization Day, Maternal Health Care Services (Prenatal Check up, BMI Monitoring, Ultra Sound Referral)',
 'Dental Tooth Extraction (Scheduled by Dentist), Search and Destroy activities, Dog and Cat Vaccination (Scheduled by DA), Pnuemo and FLU Vaccination, Garantisadong Pambata (April and October), Deworming Services (February and August), Nutrition Services (OPT - Quarterly, Feeding Program - July), Environmental Health Sanitation (Quarterly), Leprosy Prevention and Control',
 'OPD, Primary Health Care Services', false),

('Dayangdang Barangay Health Station', 'Dayangdang', 'Zone 5 Main Road, Dayangdang, Naga City', 'Monday - Friday 8:00 AM to 5:00 PM',
 '[{"name":"France Dorie B. Valencia","role":"BHS MW","phone":"0926-028-2335"},{"name":"Raymond P. Medina","role":"KGD. ON HEALTH","phone":"0992-548-0920"}]',
 'Daily Consultation, Non Com, Family Planning, NTP, Prenatal (Tuesday/Thursday), Immunization Day',
 'PSI Insertion and Removal (Based on Commodities and Clients), 4P''s Monitoring (Everyday)',
 'OPD, Primary Health Care Services', false),

('Del Rosario Barangay Health Station', 'Del Rosario', 'Zone 3 Maharlika Highway, Del Rosario, Naga City', 'Monday - Friday 8:00 AM to 5:00 PM',
 '[{"name":"Jose Peñas III","role":"Capt.","phone":"0917-183-8392"},{"name":"","phone":"881-86-43"}]',
 'Daily Consultation, NTP Enrollement, YAKAP profiling, PF Counseling, Philpen Risk Assessment, HPN/DM Dispensing of Medicine, Prenatal Check Up (sub center every Thursday), Immunization Day, Dispensing of Medicine, Weighing, Family Planning Services',
 'Adolescent Counselling (Every Monday to Friday), Dental Extraction (Every Month), Growth Monitoring/Weighing of Children (Every Wednesday), Home Visit (Pregnant Women, Postpartum, Newborns, Defaulters - as necessary)',
 'OPD, Primary Health Care Services', false),

('Dinaga Barangay Health Station', 'Dinaga', 'Zone 4 Brgy. Hall, Dinaga, Naga City', 'Monday - Friday 8:00 AM to 5:00 PM (Midwife available Monday and Tuesday)',
 '[{"name":"Nora P. Dizon","role":"BHS MW","phone":"0951-609-8464"},{"name":"Arsenio Dela Cruz","role":"BHW Pres.","phone":""},{"name":"Melanie Alarcon","role":"BNS","phone":"0907-122-3362"},{"name":"Eden Nazaria","role":"BSPO","phone":"0991-457-1861"}]',
 'Daily Consultation, Dispensing of Medicines, Prenatal, Immunization Day, Pre-natal Check Up, Post partum, Vitamin A During Immunizations for 6-12mos., Deworming House to house (February and August), Vitamin A for 12-59 mos, House to house visits for Case Findings, NTP',
 'Dental Check-up (Scheduled by Dentist), Blood Donation Activity (Twice a Year - January and August 2026), Meeting and Other Activities/Services Called of the Punong Barangay',
 'OPD, Primary Health Care Services', false),

('Igualdad Barangay Health Station', 'Igualdad', 'Zone 4 Igualdad, Naga City', 'Monday - Friday 8:00 AM to 5:00 PM',
 '[{"name":"Marilyn Nasayao","role":"BHS MW","phone":"0910-837-9979"}]',
 'Daily Consultation, NTP Med. Dispensing (Tuesday and Thursday), Prenatal, Immunization Day (Wednesday)',
 'Dental Check Up, Mobile Blood Donation, Operation Tuli, Post Partum Visit, FP Counseling (Friday)',
 'OPD, Primary Health Care Services', false),

('Lerma Barangay Health Station', 'Lerma', 'Zone 5, Lerma, Naga City', 'Monday - Friday 8:00 AM to 5:00 PM (Midwife available Wednesday, Thursday, Friday)',
 '[{"name":"Nora P. Dizon","role":"BHS MW","phone":"0951-609-8464"},{"name":"Raquel Roque","role":"BHW Pres.","phone":"0992-281-5369"},{"name":"Jeena C. Gonzaga","role":"BNS","phone":"0910-634-1803"},{"name":"Imelda M. Dawang","role":"BSPO","phone":"0948-101-6674"}]',
 'Daily Consultation, NTP Day (Dispensing of Medicine & New Registration - Tuesday/Thursday), Immunization Day, Prenatal Day and Post Partum Visits (Thursday), VIA Screening (Friday), Dispensing of Medicines if Available',
 'Dental Check-up (Scheduled by Dentist), Blood Donation Activity (Twice a Year - February and August), Meeting and Other Activities/Services Called of the Punong Barangay',
 'OPD, Primary Health Care Services', false),

('Liboton Barangay Health Station', 'Liboton', 'Liboton Barangay Hall, Villafrancia Subdivision, Naga City', 'Monday - Friday 8:00 AM to 5:00 PM',
 '[{"name":"Karen B. Pamor","role":"BHS MW","phone":"0966-179-4096"},{"name":"Rosario A. Rodriguez","role":"BHW(Z-1)","phone":"0951-184-0918"},{"name":"Magnolia Lourdes P. Recto","role":"BHW(Z-2)","phone":"0911-022-1169"},{"name":"Madonna A. France","role":"BHW(Z-3)","phone":"0908-184-7751"},{"name":"Geraldine F. Villegas","role":"BHW(Z-4)","phone":"0930-196-2275"}]',
 'Regular Consultation, BP Monitoring, Risk Assessment, Prenatal Check Up (Tuesday and Thursday), Immunization Day, NTP Dispensing Medicine (Friday)',
 'Adolescent Health Services (Everyday), Women''s Day (Twice A Year), Medical Check Up (Twice A Year), Dental Check Up (Monthly), Operation Tuli (Yearly)',
 'OPD, Primary Health Care Services', false),

('Mabolo Barangay Health Station', 'Mabolo', 'Zone 3 Pagdaicon, Mabolo, Naga City', 'Monday - Friday 8:00 AM to 5:00 PM',
 '[{"name":"Eva F. Alcozar","role":"BHS MW","phone":"0928-600-6000"},{"name":"Criselda S. Monte","role":"BHW Pres.","phone":"0998-217-0887"},{"name":"Donabel Rodriguez","role":"BNS","phone":"0907-195-0032"},{"name":"Gracel C. Diaz","role":"BSPO","phone":"0950-980-0841"}]',
 'Daily Consultation, Family Planning, NTP Enrollment, YAKAP profiling, Risk Assessment of Non Communicable Diseases, Adolescent Consultation, NTP Dispensing of Medicines and BP/Weight Monitoring (Tuesday), Immunization Day, Prenatal Day (Thursday), 4P''s Consultation, VIA for WRA (Friday)',
 'Dental Check-up (Scheduled by Dentist - Monthly), Blood Donation Activity (Scheduled by Blood Bank - February and August), Operation Tuli (May)',
 'OPD, Primary Health Care Services', false),

('Pacol Barangay Health Station', 'Pacol', 'Zone 2 Km 8 Pacol, Naga City', 'Monday - Sunday (Nutrition services Monday to Sunday)',
 '[{"name":"Marilyn Osabal","role":"BHS MW","phone":"0907-656-2472"},{"name":"Lemuel T. Luis","role":"NDP","phone":"0907-023-2272"},{"name":"Kristita P. Gonzales","role":"NDP","phone":"0917-815-3675"},{"name":"Yolanda G. Salvador","role":"BNS","phone":"0961-410-3394"},{"name":"Jane C. Andes","role":"BSPO","phone":"0930-412-4962"}]',
 'Daily Consultation, Family Planning, Nutrition (Supplementary Feeding - Monday to Sunday), Immunization and NTP Day (Tuesday), Immunization Day (Wednesday), Prenatal Day/Counselling/Immunization Day (Thursday), NTP Day/Home Visitation (Friday)',
 'Specialized/Additional Services, Adolescent (Everyday), HIV Testing (Thursday), VIA (Every Thursday)',
 'OPD, Primary Health Care Services', false),

('Panicuason Barangay Health Station', 'Panicuason', 'Zone 4 Panicuason, Naga City', 'Monday - Friday 8:00 AM to 5:00 PM',
 '[{"name":"Maria Isabel R. Agsangre","role":"BHS MW","phone":"0985-360-4982"}]',
 'Daily Consultation, Family Planning, Prenatal Day (Tuesday), Immunization Day, NTP Day (Thursday), House to House Visit, 4P''s Day (Friday)',
 'Adolescents Counseling (every Monday/Friday), 4P''s - Under 5yrs old, Nutritional Monitoring (every Friday)',
 'OPD, Primary Health Care Services', false),

('Peñafrancia Barangay Health Station', 'Peñafrancia', 'Zone 5A Peñafrancia, Naga City', 'Monday - Friday 8:00 AM to 5:00 PM',
 '[{"name":"Jennifer V. Bien","role":"BHS MW","phone":"0946-698-2991"},{"name":"Maribel T. Conchina","role":"K/H","phone":"0948-462-0384"},{"name":"Analisa P. Alde","role":"BHW Pres.","phone":"0951-873-5258"},{"name":"Gloria E. Muñoz","role":"BNS","phone":"0910-563-8006"},{"name":"Judina Rosalinda S. Ete","role":"BSPO","phone":"0909-093-4524"}]',
 'Daily Consultation, Family Planning, NTP Enrollment, YAKAP profiling, Risk Assestment of Non Communicable Diseases, Prenatal Day (Tuesday and Thursday), Immunization Day, Prenatal Day, NTP Day, Bp and Weight Monitoring (Thursday), Pospartum/Home Visitation (Friday)',
 'Dental Check-up (Scheduled by Dentist), Operation Tuli (Every Summer Vacation), Blood Donation Activity (Scheduled on May and December)',
 'OPD, Primary Health Care Services', false),

('Sabang Barangay Health Station', 'Sabang', 'Zone 1 Zamora St., Sabang, Naga City', 'Monday - Friday 8:00 AM to 5:00 PM, Saturday - Sunday 9:00 AM to 3:00 PM',
 '[{"name":"Eva V. Relato","role":"KGD. ON HEALTH","phone":"0950-660-6899"},{"name":"Louie Bombales","role":"BHS MW","phone":"0931-990-8974"},{"name":"Maria Cecilia M. Bidol","role":"BHW","phone":"0920-632-2876"},{"name":"Julieta G. San Jose","role":"BGY. NUTRITION SCHOLAR","phone":"0948-120-4960"},{"name":"Felvia J. Sibulo","role":"BGY. SERVICE POINT OFFICER","phone":"0963-021-3480"}]',
 'Daily Consultation, TB Day/HIV Test with Counseling (Tuesday), Immunization Day (9:00am to 12:00nn), Follow Up Defaulters (2:00PM to 4:30PM), Prenatal Day (9:00AM to 12:00NN), Adolescent Consultation Family Planning, PSI Insertion/Removal (by Schedule), DMPA, Pills Distribution (1:00PM to 5:00PM), Non Com (VIA/CBE to WRA, Immunization for Senior Citizen, HPV Vaccination to 9 - 14yrs old)',
 'WATSAN (Every Saturday/Sunday), Visitation of BHW by Zone, Case Findings, Operation Timbang (Monday to Friday)',
 'OPD, Primary Health Care Services', false),

('San Felipe Barangay Health Station', 'San Felipe', 'Zone 3 San Felipe, Naga City', 'Monday - Friday 8:00 AM to 5:00 PM',
 '[{"name":"Elisa R. Belen","role":"BHS MW","phone":"0947-311-3293"},{"name":"Gia A. Nasol","role":"BHS MW","phone":"0907-421-1846"},{"name":"Julie Ann S. Notado","role":"DOH HRH","phone":"0923-593-3081"},{"name":"Mae-Ann V. Bañadera","role":"DOH HRH","phone":"0906-484-9538"}]',
 'Family Planning, Risk Assestment, Adolescent Consultation (Tuesday & Friday), Immunization Day, Prenatal Check Up (Thursday)',
 'By Schedule: HIV/Syphilis/Hepa-B Screening, Visual Inspection using Acetic Acid, Dental Check-up/Tootk Extraction, Medical Check-up, Blood Donation',
 'OPD, Primary Health Care Services', false),

('San Francisco Barangay Health Station', 'San Francisco', 'Zone 2 San Francisco, Naga City', 'Monday - Friday 8:00 AM to 5:00 PM',
 '[{"name":"Marjile M. Mirabel","role":"BHS MW","phone":"0977-411-0272"},{"name":"Annalisa Riel Bok","role":"BHW Pres.","phone":""},{"name":"Rhea Policarpio","role":"BNS","phone":"0966-238-8001"}]',
 'Daily Consultation, Family Planning, NTP Enrollment, YAKAP profiling, Risk Assessment of Non Communicable Diseases, Adolescent Consultation, NTP Dispensing of Medicines and BP/Weight Monitoring (Tuesday), Immunization Day, Prenatal Consultation (Thursday), 4P''s Consultation, VIA for WRA (Friday)',
 'Dental Check-up (Scheduled by Dentist - Monthly), Blood Donation Activity (Scheduled by Blood Bank - February and August), Operation Tuli (Every Vacation of the Student''s - May)',
 'OPD, Primary Health Care Services', false),

('San Isidro Barangay Health Station', 'San Isidro', 'Zone 3 San Isidro, Naga City', 'Monday - Friday 8:00 AM to 5:00 PM',
 '[{"name":"Remedios C. Malanyaon","role":"BHS MW","phone":"0910-983-3870"},{"name":"Lanie R. Nacario","role":"BNS","phone":"0931-999-5256"},{"name":"Myra D. Puyot","role":"BSPO","phone":"0912-335-8610"}]',
 'Daily Consultation, Family Planning, Nutrition (Center Based Feeding), Prenatal Day (Tuesday), Immunization Day, NTP Day (Thursday), Family Planning (Friday)',
 'Adolescent Day (Every 1st Friday of the Month), Mental Health Consultation (Every 2nd Friday of the Monht), Women''s Day (VIA, Breast Cancer Screening - Every 3rd Friday of the Month), Medical Check Up (Every Saturday), Dental Check Up (Every 1st Sunday of the Month)',
 'OPD, Primary Health Care Services', false),

('Sta Cruz Barangay Health Station', 'Sta Cruz', 'Poro St., Sta. Cruz, Naga City', 'Monday - Friday 8:00 AM to 5:00 PM',
 '[{"name":"Shiela Marie B. Responde","role":"BHS MW","phone":"0909-337-2370"},{"name":"Elizabeth G. Amaro","role":"BHW PRES.","phone":""},{"name":"Ruth Roxas Dialogo","role":"BSPO","phone":"0915-776-2823"},{"name":"Ma. Elena J. Flores","role":"BNS","phone":"0912-837-3455"},{"name":"Ma. Carla A. Gomez","role":"KGD. ON HEALTH","phone":"0917-721-4206"}]',
 'Daily Consultation, Family Planning (Counselling/Dispensing/New Acceptors), NTP (Enrollment/Drug Dispensing), YAKAP profiling, Risk Assestment of Non Communicable Diseases, Adolescent Consultation, 4P''s Beneficiary Weight Monitoring (under 5 y/o), Micronutrients Supplementation (6-59 mos.), Prenatal (Tuesday/Thursday), Immunization Day',
 'ProgestinSub-Dermal Implant Insertion (PSI) - Removal by Appointment, Mobile Blood Donation (May and October), Operation Tuli (Every Summer Vacation), Basic Oral Health Care (Scheduled by City Dentist), School Based Immunization/Deworming (Scheduled by DOH/DEPED), Community Based Deworming (January and July), Human Papilloma Virus Immunization (14yrs old, Female, by schedule)',
 'OPD, Primary Health Care Services', false),

('Tabuco Barangay Health Station', 'Tabuco', 'Zone 3 Tabuco, Naga City', 'Monday - Friday 8:00 AM to 5:00 PM',
 '[{"name":"Elisa B. Carmona","role":"P/B","phone":"0930-190-7714"},{"name":"Susana D. Pabia","role":"K/H","phone":"0917-707-5379"},{"name":"Jessica Maleniza","role":"BNS","phone":""},{"name":"Emma Amor Perez","role":"BHW Pres.","phone":""}]',
 'Daily Consultation, NTP Dispensing of Medicines and BP/Weight Monitoring (Tuesday), Immunization Day, Prenatal Consultation (Thursday)',
 'Dental Check-up (Quarterly), Mobile Blood Donation (once a year), Operation Tuli (once a year)',
 'OPD, Primary Health Care Services', false),

('Tinago Barangay Health Station', 'Tinago', 'Zone 4 San Juan Street, Tinago, Naga City', 'Monday - Friday 8:00 AM to 5:00 PM',
 '[{"name":"Sarah Mae B. Osorio","role":"BHS MW","phone":"0919-581-4731"},{"name":"Julie R. Enriquez","role":"BHW Pres.","phone":"0912-913-6107"},{"name":"Ronnie A. Sayson","role":"KGD. ON HEALTH","phone":"0951-174-3319"},{"name":"Felicia D. Rita","role":"BSPO","phone":"0945-692-5022"}]',
 'Daily Consultation, Family Planning, NTP Enrollment, YAKAP profiling, Risk Assessment of Non Communicable Diseases, Adolescent Consultation, NTP Dispensing of Medicines and BP/Weight Monitoring, Prenatal Consultation/Breast Examination (Tuesday), Immunization Day, Under 1 Weighing and Monitoring (Wednesday), Prenatal Consultation/Breast Examination (Thursday), Postpartum/Home Visitation, 4P''s Consultation, VIA for WRA (Friday)',
 'Dental Check-up (Quarterly), PSI Insertion (Based on Clients - by Schedule)',
 'OPD, Primary Health Care Services', false),

('Triangulo Barangay Health Station', 'Triangulo', 'Zone 5 Triangulo, Naga City', 'Monday - Saturday 8:00 AM to 5:00 PM',
 '[{"name":"Maricris Muron","phone":"0963-639-8942"}]',
 'Non communicable Disease Examination (Monday), Communicable Disease HIV Testing (Tuesday), National Immunization Program (Routine and Catch Up Immunization), Nutrition Services (Wednesday), Maternal Care (Prenatal, TD Immunization to Pregnant, Risk Assestment, HIV Testing), Family Planning Counselling, Adolescent Health Program (Thursday), Dispensing of HPN Drugs, Defaulters Tracking, Household Visit (Friday)',
 'Oral Health Services (every Wednesday and Thursday)',
 'OPD, Primary Health Care Services', false);

-- ============================================================================
-- VERIFY INSERT
-- ============================================================================

SELECT COUNT(*) as total_facilities FROM public.health_facilities;
SELECT name, barangay, yakap_accredited FROM public.health_facilities ORDER BY name;
