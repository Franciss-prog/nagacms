// ============================================================================
// YAKAP SERVICE
// Handles PhilHealth Konsulta (Yakap) application submission and status
// ============================================================================

import { createServerSupabaseClient } from "@/lib/auth";

// Form data structure matching the PhilHealth Konsulta form
export interface YakapFormData {
  // Personal Information
  philhealthNo: string;
  lastName: string;
  firstName: string;
  middleName: string;
  suffix: string;
  sex: string;
  age: string;
  birthdate: string;
  birthPlace: string;
  civilStatus: string;
  maidenLastName: string;
  maidenMiddleName: string;
  educationalAttainment: string;
  employmentStatus: string;
  occupation: string;
  religion: string;
  indigenous: string;
  bloodType: string;

  // Family Information
  motherFirstName: string;
  motherLastName: string;
  motherMiddleName: string;
  motherBirthdate: string;
  fatherFirstName: string;
  fatherLastName: string;
  fatherMiddleName: string;
  fatherBirthdate: string;
  spouseFirstName: string;
  spouseLastName: string;
  spouseBirthdate: string;

  // Address & Contact
  streetAddress: string;
  province: string;
  cityMunicipality: string;
  barangay: string;
  email: string;
  mobile: string;

  // Membership
  membershipType: string;
  firstChoiceKPP: string;
  secondChoiceKPP: string;
}

export interface YakapApplication {
  id: string;
  resident_id: string;
  resident_name: string;
  barangay: string;
  membership_type: "individual" | "family" | "senior" | "pwd";
  philhealth_no: string | null;
  status: "pending" | "approved" | "returned" | "rejected";
  form_data: YakapFormData;
  applied_at: string;
  approved_by: string | null;
  approved_at: string | null;
  remarks: string | null;
  document_url: string | null;
  created_at: string;
  updated_at: string;
}

class YakapService {
  // ============================================================================
  // SUBMIT APPLICATION
  // ============================================================================
  async submitApplication(
    formData: YakapFormData,
    residentId: string,
  ): Promise<{
    success: boolean;
    application?: YakapApplication;
    error?: string;
  }> {
    try {
      const supabase = await createServerSupabaseClient();

      // Check if there's already a pending application
      const { data: existingApp } = (await supabase
        .from("yakap_applications")
        .select("id, status")
        .eq("resident_id", residentId)
        .in("status", ["pending", "approved"])
        .single()) as {
        data: { id: string; status: string } | null;
        error: any;
      };

      if (existingApp) {
        if (existingApp.status === "pending") {
          return {
            success: false,
            error:
              "You already have a pending application. Please wait for it to be reviewed.",
          };
        }
        if (existingApp.status === "approved") {
          return {
            success: false,
            error: "You already have an approved Yakap application.",
          };
        }
      }

      // Map membership type to database format
      const membershipTypeMap: Record<
        string,
        "individual" | "family" | "senior" | "pwd"
      > = {
        Individual: "individual",
        Family: "family",
        Senior: "senior",
        PWD: "pwd",
      };

      // Create new application
      const { data: newApp, error } = (await supabase
        .from("yakap_applications")
        .insert({
          resident_id: residentId,
          resident_name:
            `${formData.lastName}, ${formData.firstName} ${formData.middleName}`.trim(),
          barangay: formData.barangay,
          membership_type:
            membershipTypeMap[formData.membershipType] || "individual",
          philhealth_no: formData.philhealthNo || null,
          status: "pending",
          form_data: formData,
          applied_at: new Date().toISOString(),
        })
        .select()
        .single()) as { data: YakapApplication | null; error: any };

      if (error) {
        console.error("Yakap submission error:", error);
        return { success: false, error: "Failed to submit application" };
      }

      return { success: true, application: newApp! };
    } catch (error) {
      console.error("Yakap service error:", error);
      return { success: false, error: "An unexpected error occurred" };
    }
  }

  // ============================================================================
  // GET APPLICATION STATUS
  // ============================================================================
  async getApplicationStatus(residentId: string): Promise<{
    hasApplication: boolean;
    application?: YakapApplication;
    error?: string;
  }> {
    try {
      const supabase = await createServerSupabaseClient();

      const { data, error } = (await supabase
        .from("yakap_applications")
        .select("*")
        .eq("resident_id", residentId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()) as { data: YakapApplication | null; error: any };

      if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows returned
        console.error("Get application error:", error);
        return {
          hasApplication: false,
          error: "Failed to fetch application status",
        };
      }

      if (!data) {
        return { hasApplication: false };
      }

      return { hasApplication: true, application: data };
    } catch (error) {
      console.error("Yakap service error:", error);
      return {
        hasApplication: false,
        error: "An unexpected error occurred",
      };
    }
  }

  // ============================================================================
  // GET ALL APPLICATIONS FOR USER
  // ============================================================================
  async getApplicationHistory(residentId: string): Promise<{
    applications: YakapApplication[];
    error?: string;
  }> {
    try {
      const supabase = await createServerSupabaseClient();

      const { data, error } = (await supabase
        .from("yakap_applications")
        .select("*")
        .eq("resident_id", residentId)
        .order("created_at", { ascending: false })) as {
        data: YakapApplication[] | null;
        error: any;
      };

      if (error) {
        console.error("Get history error:", error);
        return {
          applications: [],
          error: "Failed to fetch application history",
        };
      }

      return { applications: data || [] };
    } catch (error) {
      console.error("Yakap service error:", error);
      return { applications: [], error: "An unexpected error occurred" };
    }
  }

  // ============================================================================
  // CHECK IF USER CAN APPLY
  // ============================================================================
  async canApply(residentId: string): Promise<{
    canApply: boolean;
    reason?: string;
  }> {
    try {
      const { hasApplication, application } =
        await this.getApplicationStatus(residentId);

      if (!hasApplication) {
        return { canApply: true };
      }

      if (application?.status === "pending") {
        return {
          canApply: false,
          reason: "You have a pending application being reviewed.",
        };
      }

      if (application?.status === "approved") {
        return {
          canApply: false,
          reason: "You are already Yakap-accredited!",
        };
      }

      // If rejected or returned, they can re-apply
      return { canApply: true };
    } catch (error) {
      return { canApply: true }; // Allow by default if error
    }
  }

  // ============================================================================
  // UPDATE APPLICATION (for re-submission after rejection)
  // ============================================================================
  async updateApplication(
    applicationId: string,
    formData: YakapFormData,
  ): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const supabase = await createServerSupabaseClient();

      const { error } = await supabase
        .from("yakap_applications")
        .update({
          resident_name:
            `${formData.lastName}, ${formData.firstName} ${formData.middleName}`.trim(),
          barangay: formData.barangay,
          philhealth_no: formData.philhealthNo || null,
          status: "pending", // Reset to pending for re-review
          form_data: formData,
          applied_at: new Date().toISOString(),
          remarks: null, // Clear previous remarks
        })
        .eq("id", applicationId);

      if (error) {
        console.error("Update application error:", error);
        return { success: false, error: "Failed to update application" };
      }

      return { success: true };
    } catch (error) {
      console.error("Yakap service error:", error);
      return { success: false, error: "An unexpected error occurred" };
    }
  }

  // ============================================================================
  // GET APPLICATION BY ID
  // ============================================================================
  async getApplicationById(applicationId: string): Promise<{
    application?: YakapApplication;
    error?: string;
  }> {
    try {
      const supabase = await createServerSupabaseClient();

      const { data, error } = (await supabase
        .from("yakap_applications")
        .select("*")
        .eq("id", applicationId)
        .single()) as { data: YakapApplication | null; error: any };

      if (error) {
        console.error("Get application error:", error);
        return { error: "Failed to fetch application" };
      }

      return { application: data || undefined };
    } catch (error) {
      console.error("Yakap service error:", error);
      return { error: "An unexpected error occurred" };
    }
  }
}

export const yakapService = new YakapService();
