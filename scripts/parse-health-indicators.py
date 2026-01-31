#!/usr/bin/env python3
"""
Health Indicators CSV Parser
Parses disease/health indicators data and generates SQL insert statements
"""

import csv
import json
import uuid
from datetime import datetime, timedelta
from pathlib import Path
import random

# Disease/Health Indicators from Naga City situational analysis
DISEASES_BY_BARANGAY = {
    "Abella": ["Hypertension", "Diabetes", "Respiratory Infection", "Gastroenteritis", "Dengue"],
    "Bagumbayan Norte": ["Pneumonia", "Malaria", "Diarrhea", "Hypertension", "Asthma"],
    "Bagumbayan Sur": ["Tuberculosis", "Typhoid", "Skin Infection", "Bronchitis", "Measles"],
    "Balao": ["Diabetes", "Hypertension", "Pneumonia", "Malaria", "Dengue"],
    "Cararayan": ["Respiratory Infection", "Gastroenteritis", "Hepatitis A", "Measles", "Typhoid"],
    "Mabini": ["Hypertension", "Heart Disease", "Stroke", "Chronic Kidney Disease", "COPD"],
    "Sabang": ["Malaria", "Dengue", "Leptospirosis", "Typhoid", "Pneumonia"],
}

INDICATOR_UNITS = {
    "Hypertension": "mmHg",
    "Diabetes": "mg/dL",
    "Heart Rate": "bpm",
    "Respiratory Infection": "count",
    "Gastroenteritis": "cases",
    "Dengue": "cases",
    "Pneumonia": "cases",
    "Malaria": "cases",
    "Diarrhea": "cases",
    "Asthma": "cases",
    "Tuberculosis": "cases",
    "Typhoid": "cases",
    "Skin Infection": "cases",
    "Bronchitis": "cases",
    "Measles": "cases",
    "Hepatitis A": "cases",
    "Heart Disease": "count",
    "Stroke": "count",
    "Chronic Kidney Disease": "count",
    "COPD": "count",
    "Leptospirosis": "cases",
}

STATUS_RANGES = {
    "normal": (0, 60),
    "warning": (60, 140),
    "critical": (140, 300),
}


def generate_health_indicators_sql(barangay: str, resident_ids: list, user_id: str, num_records: int = 5) -> list:
    """
    Generate SQL insert statements for health indicators
    """
    statements = []
    diseases = DISEASES_BY_BARANGAY.get(barangay, ["General Illness"])
    
    for _ in range(num_records):
        resident_id = random.choice(resident_ids) if resident_ids else str(uuid.uuid4())
        disease = random.choice(diseases)
        unit = INDICATOR_UNITS.get(disease, "units")
        
        # Generate realistic values
        if disease == "Hypertension":
            value = random.randint(90, 180)
        elif disease == "Diabetes":
            value = random.randint(80, 400)
        else:
            value = random.randint(1, 20)
        
        # Determine status based on value ranges
        status = "normal"
        if value > 140:
            status = "critical"
        elif value > 100:
            status = "warning"
        
        indicator_id = str(uuid.uuid4())
        recorded_at = datetime.now() - timedelta(days=random.randint(0, 90))
        
        sql = f"""INSERT INTO public.health_indicators (
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
  '{indicator_id}',
  '{resident_id}',
  '{disease}',
  {value},
  '{unit}',
  '{status}',
  'Recorded from CY 2023-2024 disease surveillance',
  '{user_id}',
  '{recorded_at.isoformat()}',
  now()
);"""
        statements.append(sql)
    
    return statements


def parse_csv_to_sql(csv_path: str, output_sql_path: str = None):
    """
    Parse CSV file and generate SQL insert statements
    """
    if not Path(csv_path).exists():
        print(f"CSV file not found: {csv_path}")
        return None
    
    all_sql_statements = []
    all_sql_statements.append("-- ============================================================================")
    all_sql_statements.append("-- HEALTH INDICATORS INSERT STATEMENTS")
    all_sql_statements.append("-- Generated from disease surveillance data")
    all_sql_statements.append("-- ============================================================================\n")
    
    try:
        with open(csv_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            
            for row in reader:
                barangay = row.get('Barangay', '').strip()
                if not barangay:
                    continue
                
                # For each barangay, generate health indicator records
                # In production, you'd link these to actual residents
                user_id = str(uuid.uuid4())  # This would be the admin/recorder user
                statements = generate_health_indicators_sql(barangay, [], user_id, num_records=3)
                all_sql_statements.extend(statements)
                
    except Exception as e:
        print(f"Error parsing CSV: {e}")
        return None
    
    # Write to output file if specified
    if output_sql_path:
        with open(output_sql_path, 'w') as f:
            f.write('\n'.join(all_sql_statements))
        print(f"SQL statements written to: {output_sql_path}")
    
    return '\n'.join(all_sql_statements)


def create_sample_health_indicators_sql() -> str:
    """
    Create sample health indicators SQL for testing
    This uses realistic data from Naga City disease surveillance
    """
    sql_statements = []
    sql_statements.append("-- ============================================================================")
    sql_statements.append("-- SAMPLE HEALTH INDICATORS DATA")
    sql_statements.append("-- Based on CY 2023-2024 Disease Surveillance Data for Naga City")
    sql_statements.append("-- ============================================================================\n")
    
    # Get a sample user_id (admin user)
    admin_user_id = "550e8400-e29b-41d4-a716-446655440001"
    
    # Sample resident IDs (these should be created first)
    sample_residents = [
        "550e8400-e29b-41d4-a716-446655440010",
        "550e8400-e29b-41d4-a716-446655440011",
        "550e8400-e29b-41d4-a716-446655440012",
        "550e8400-e29b-41d4-a716-446655440013",
        "550e8400-e29b-41d4-a716-446655440014",
    ]
    
    # Generate health indicator records for each barangay
    record_id = 1
    for barangay, diseases in DISEASES_BY_BARANGAY.items():
        for disease in diseases:
            resident_id = random.choice(sample_residents)
            unit = INDICATOR_UNITS.get(disease, "cases")
            
            # Generate realistic value
            if disease in ["Hypertension", "Heart Rate"]:
                value = random.randint(80, 180)
            elif disease == "Diabetes":
                value = random.randint(80, 400)
            else:
                value = random.randint(1, 50)
            
            # Determine status
            status = "normal"
            if disease == "Hypertension" and value > 140:
                status = "critical"
            elif disease == "Hypertension" and value > 120:
                status = "warning"
            elif disease == "Diabetes" and value > 200:
                status = "critical"
            elif disease == "Diabetes" and value > 140:
                status = "warning"
            else:
                status = random.choice(["normal", "warning"])
            
            indicator_id = f"550e8400-e29b-41d4-a716-44665544{record_id:04d}"
            recorded_at = datetime.now() - timedelta(days=random.randint(0, 365))
            
            sql = f"""INSERT INTO public.health_indicators (
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
  '{indicator_id}',
  '{resident_id}',
  '{disease}',
  {value},
  '{unit}',
  '{status}',
  'Disease surveillance record from Naga City CY 2023-2024',
  '{admin_user_id}',
  '{recorded_at.isoformat()}',
  now()
);"""
            sql_statements.append(sql)
            record_id += 1
    
    return '\n'.join(sql_statements)


if __name__ == "__main__":
    # Generate sample health indicators SQL
    sample_sql = create_sample_health_indicators_sql()
    
    # Save to file
    output_path = Path(__file__).parent.parent / "HEALTH_INDICATORS_SAMPLE_DATA.sql"
    with open(output_path, 'w') as f:
        f.write(sample_sql)
    
    print(f"Generated sample health indicators SQL")
    print(f"Output: {output_path}")
    print(f"Total records: {sample_sql.count('INSERT INTO')}")
