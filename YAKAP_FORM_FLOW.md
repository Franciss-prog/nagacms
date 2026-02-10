# YAKAP Form Flow & Architecture

## Form Navigation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                   YAKAP Application Entry                        │
│              (Check if resident can apply)                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                    Can Apply?
                    /        \
                  YES         NO
                  │           └──> Show Status & Reason
                  │               (Pending/Approved/etc.)
                  ▼
        ┌─────────────────────────┐
        │   STEP 1 OF 3           │
        │ Personal Information    │
        │                         │
        │ □ Last Name *           │
        │ □ First Name *          │
        │ □ Middle Name           │
        │ □ Suffix                │
        │ □ Date of Birth *       │
        │ □ Age                   │
        │ □ Sex *                 │
        │ □ Place of Birth        │
        │ □ Civil Status          │
        │ □ Blood Type            │
        │ □ Education             │
        │ □ Employment Status     │
        │ □ Occupation            │
        │ □ Religion              │
        │ □ Indigenous Group      │
        │ □ PhilHealth Number     │
        │                         │
        │ [Previous] [Next →]     │
        └────────────┬────────────┘
                     │
                     ▼
        ┌─────────────────────────┐
        │   STEP 2 OF 3           │
        │ Address & Contact       │
        │                         │
        │ □ Street Address *      │
        │ □ Province              │
        │ □ City/Municipality     │
        │ □ Barangay *            │
        │ □ Email *               │
        │ □ Mobile Number *       │
        │                         │
        │ [← Previous] [Next →]   │
        └────────────┬────────────┘
                     │
                     ▼
        ┌─────────────────────────┐
        │   STEP 3 OF 3           │
        │ Family & Membership     │
        │                         │
        │ Mother's Info           │
        │ □ First Name            │
        │ □ Last Name             │
        │ □ Middle Name           │
        │ □ Date of Birth         │
        │                         │
        │ Father's Info           │
        │ □ First Name            │
        │ □ Last Name             │
        │ □ Middle Name           │
        │ □ Date of Birth         │
        │                         │
        │ Spouse Info (optional)  │
        │ □ First Name            │
        │ □ Last Name             │
        │ □ Date of Birth         │
        │                         │
        │ Membership              │
        │ □ Type (I/F/S/PWD) *    │
        │ □ 1st Choice KPP        │
        │ □ 2nd Choice KPP        │
        │                         │
        │ [← Previous] [Submit ✓] │
        └────────────┬────────────┘
                     │
                     ▼
        ┌─────────────────────────┐
        │  Submitting to Server   │
        │   (Validation Check)    │
        └────────────┬────────────┘
                     │
            Success?
            /        \
          YES        NO
          │          └──> Show Error Message
          │              [Retry]
          ▼
        ✓ Success Message
        Application Submitted!

        Redirect to Success Page
```

## Data Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    YakapFormStep Component                  │
│                    (Client-side React)                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ State Management:                                           │
│ ├─ currentStep (1-3)                                       │
│ ├─ formData (YakapFormData)                               │
│ ├─ errors (Record<string, string>)                        │
│ ├─ isSubmitting (boolean)                                 │
│ └─ error/success messages                                 │
│                                                              │
│ Methods:                                                     │
│ ├─ validateStep(step) → checks required fields           │
│ ├─ handleNext() → move to next step                       │
│ ├─ handlePrevious() → move to previous step              │
│ ├─ handleFormSubmit() → submit to service               │
│ └─ updateField() → update form data & clear errors      │
│                                                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ (calls)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              YakapService (lib/services/)                   │
│              (Server-side TypeScript)                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Methods:                                                     │
│ ├─ submitApplication()                                     │
│ │  ├─ Check for existing pending/approved apps           │
│ │  ├─ Map membership type                                │
│ │  ├─ Insert into database                              │
│ │  └─ Return success/error                              │
│ │                                                          │
│ ├─ getApplicationStatus()                                 │
│ │  ├─ Query latest application                          │
│ │  └─ Return status & data                              │
│ │                                                          │
│ ├─ getApplicationHistory()                                │
│ │  ├─ Query all applications                            │
│ │  └─ Sort by date                                      │
│ │                                                          │
│ ├─ canApply()                                             │
│ │  ├─ Check application status                          │
│ │  └─ Return ability & reason                           │
│ │                                                          │
│ ├─ updateApplication()                                    │
│ │  ├─ Reset status to pending                           │
│ │  ├─ Clear remarks                                     │
│ │  └─ Update database                                   │
│ │                                                          │
│ └─ getApplicationById()                                   │
│    └─ Fetch specific application                        │
│                                                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ (uses Supabase client)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│            Supabase PostgreSQL Database                      │
│            yakap_applications Table                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Columns:                                                     │
│ ├─ id (UUID) - Primary Key                               │
│ ├─ resident_id (UUID) - Foreign Key to residents        │
│ ├─ resident_name (TEXT)                                 │
│ ├─ barangay (TEXT)                                      │
│ ├─ membership_type (TEXT)                               │
│ │  └─ CHECK: individual|family|senior|pwd              │
│ ├─ philhealth_no (TEXT, nullable)                       │
│ ├─ status (TEXT)                                         │
│ │  └─ CHECK: pending|approved|returned|rejected         │
│ ├─ form_data (JSONB) - Complete form data              │
│ ├─ applied_at (TIMESTAMP)                               │
│ ├─ approved_by (UUID) - FK to users                     │
│ ├─ approved_at (TIMESTAMP, nullable)                    │
│ ├─ remarks (TEXT, nullable)                             │
│ ├─ document_url (TEXT, nullable)                        │
│ ├─ created_at (TIMESTAMP)                               │
│ └─ updated_at (TIMESTAMP)                               │
│                                                              │
│ Indexes:                                                     │
│ ├─ PRIMARY KEY (id)                                      │
│ ├─ idx_resident_id (resident_id)                        │
│ ├─ idx_barangay (barangay)                             │
│ ├─ idx_status (status)                                 │
│ ├─ idx_applied_at (applied_at)                         │
│ ├─ idx_membership_type (membership_type)               │
│ └─ idx_form_data (form_data) USING GIN               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Validation Flow

```
┌──────────────────┐
│ Form Submission  │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────┐
│ Validate Current Step        │
├──────────────────────────────┤
│                              │
│ STEP 1 Validation:          │
│ ✓ lastName required         │
│ ✓ firstName required        │
│ ✓ sex required              │
│ ✓ birthdate required        │
│                              │
│ STEP 2 Validation:          │
│ ✓ streetAddress required    │
│ ✓ barangay required         │
│ ✓ email required            │
│ ✓ mobile required           │
│                              │
│ STEP 3 Validation:          │
│ ✓ membershipType required   │
│                              │
└────────┬─────────────────────┘
         │
    All Valid?
    /        \
  YES       NO
   │        │
   │        └──> Show Error Messages
   │            Highlight Fields
   │            Stay on Step
   │
   ▼
┌──────────────────────────┐
│ Can Proceed to Next?     │
├──────────────────────────┤
│ Step 1 → Step 2? ✓      │
│ Step 2 → Step 3? ✓      │
│ Step 3 → Submit? ✓      │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Server-Side Validation   │
├──────────────────────────┤
│                          │
│ Check:                   │
│ ✓ User authenticated    │
│ ✓ No duplicate pending  │
│ ✓ No duplicate approved │
│ ✓ Valid resident_id     │
│ ✓ Form data complete    │
│                          │
└────────┬─────────────────┘
         │
    Valid?
    /    \
  YES    NO
   │      └──> Error Response
   │          Show to User
   │          Allow Retry
   │
   ▼
┌──────────────────────────┐
│ Save to Database         │
├──────────────────────────┤
│ INSERT yakap_applications│
│   status: pending        │
│   form_data: JSONB      │
│   applied_at: NOW()     │
└────────┬─────────────────┘
         │
    Saved?
    /    \
  YES    NO
   │      └──> Database Error
   │          Retry/Support
   │
   ▼
┌──────────────────────────┐
│ Success Message          │
│ Application Submitted!   │
└──────────────────────────┘
```

## Data Flow Example

```
User fills form:
├─ Step 1: "Juan" + "Dela Cruz" + DOB "1990-01-01"
├─ Step 2: "123 Main St" + "Bagumbayan" + "juan@email.com"
└─ Step 3: "Individual" + "Hospital A" + "Hospital B"

     ↓

YakapFormData object created:
{
  firstName: "Juan",
  lastName: "Dela Cruz",
  birthdate: "1990-01-01",
  streetAddress: "123 Main St",
  barangay: "Bagumbayan",
  email: "juan@email.com",
  membershipType: "Individual",
  firstChoiceKPP: "Hospital A",
  secondChoiceKPP: "Hospital B",
  ... (other fields)
}

     ↓

submitApplication(formData, residentId) called

     ↓

Server validates:
├─ Check existing apps: NONE ✓
├─ Map membership: "Individual" → "individual"
└─ Validate all fields: OK ✓

     ↓

Insert to database:
{
  id: "uuid-generated",
  resident_id: "uuid-from-param",
  resident_name: "Dela Cruz, Juan",
  barangay: "Bagumbayan",
  membership_type: "individual",
  status: "pending",
  form_data: { ...complete YakapFormData },
  applied_at: "2026-02-01T10:30:00Z",
  created_at: "2026-02-01T10:30:00Z",
  updated_at: "2026-02-01T10:30:00Z"
}

     ↓

Response sent to client:
{
  success: true,
  application: { ...full YakapApplication object }
}

     ↓

UI shows success message and redirects
```

## Status Workflow

```
Submitted → Review Process → Decision
   │
   └─ Status: pending
      visible to: resident, admin
      can re-submit: NO
      can view details: YES

          ↓ (Admin reviews and decides)

       ┌─ APPROVED ✓
       │  Status: approved
       │  Visible to: resident, admin
       │  Can apply again: NO
       │  Next step: Enrollment
       │
       ├─ RETURNED ↩
       │  Status: returned
       │  Remarks: "Missing documents"
       │  Can re-submit: YES
       │  Next: Fix & re-submit
       │
       └─ REJECTED ✗
          Status: rejected
          Remarks: "Does not meet criteria"
          Can re-submit: NO (contact support)
          Next: Contact health office
```
