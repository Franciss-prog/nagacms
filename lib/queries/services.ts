import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// ============================================================================
// FACILITIES QUERIES
// ============================================================================

export async function getFacilities(barangay?: string) {
  try {
    let query = supabase.from("health_facilities").select("*");

    if (barangay) {
      query = query.eq("barangay", barangay);
    }

    const { data, error } = await query.order("name");

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching facilities:", error);
    return [];
  }
}

export async function getFacilityById(facilityId: string) {
  try {
    const { data, error } = await supabase
      .from("health_facilities")
      .select("*")
      .eq("id", facilityId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching facility:", error);
    return null;
  }
}

export async function getYakapAccreditedFacilities(barangay?: string) {
  try {
    let query = supabase
      .from("health_facilities")
      .select("*")
      .eq("yakap_accredited", true);

    if (barangay) {
      query = query.eq("barangay", barangay);
    }

    const { data, error } = await query.order("name");

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching YAKAP accredited facilities:", error);
    return [];
  }
}

export async function getFacilitiesByServices(serviceKeyword: string) {
  try {
    const { data, error } = await supabase
      .from("health_facilities")
      .select("*")
      .or(
        `general_services.ilike.%${serviceKeyword}%,specialized_services.ilike.%${serviceKeyword}%`,
      );

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching facilities by services:", error);
    return [];
  }
}

// ============================================================================
// STAFF/USERS QUERIES
// ============================================================================

export async function getStaffByBarangay(barangay: string, role?: string) {
  try {
    let query = supabase
      .from("users")
      .select("*")
      .eq("assigned_barangay", barangay);

    if (role) {
      query = query.eq("role", role);
    }

    const { data, error } = await query.order("username");

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching staff:", error);
    return [];
  }
}

export async function getUserById(userId: string) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function getBarangays() {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("assigned_barangay")
      .eq("role", "barangay_admin")
      .order("assigned_barangay");

    if (error) throw error;

    // Get unique barangays
    const barangays = [
      ...new Set((data || []).map((u) => u.assigned_barangay)),
    ];
    return barangays;
  } catch (error) {
    console.error("Error fetching barangays:", error);
    return [];
  }
}

// ============================================================================
// SUBMISSIONS QUERIES
// ============================================================================

export async function getSubmissions(
  barangay?: string,
  status?: "pending" | "approved" | "returned" | "rejected",
) {
  try {
    let query = supabase.from("submissions").select(
      `
        id,
        health_concern,
        status,
        created_at,
        resident_id,
        residents(full_name, barangay, contact_number)
      `,
    );

    if (barangay) {
      query = query.eq("residents.barangay", barangay);
    }

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return [];
  }
}

export async function getSubmissionById(submissionId: string) {
  try {
    const { data, error } = await supabase
      .from("submissions")
      .select(
        `
        id,
        health_concern,
        status,
        notes,
        created_at,
        resident_id,
        residents(full_name, barangay, contact_number, birth_date)
      `,
      )
      .eq("id", submissionId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching submission:", error);
    return null;
  }
}

export async function getPendingSubmissions(barangay?: string) {
  try {
    let query = supabase
      .from("submissions")
      .select(
        `
        id,
        health_concern,
        created_at,
        resident_id,
        residents(full_name, contact_number)
      `,
      )
      .eq("status", "pending");

    if (barangay) {
      query = query.eq("residents.barangay", barangay);
    }

    const { data, error } = await query.order("created_at", {
      ascending: true,
    });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching pending submissions:", error);
    return [];
  }
}

// ============================================================================
// YAKAP APPLICATIONS QUERIES
// ============================================================================

export async function getYakakApplications(
  barangay?: string,
  status?: "pending" | "approved" | "returned" | "rejected",
) {
  try {
    let query = supabase.from("yakap_applications").select(
      `
        id,
        membership_type,
        status,
        created_at,
        resident_id,
        residents(full_name, barangay, contact_number, philhealth_no)
      `,
    );

    if (barangay) {
      query = query.eq("residents.barangay", barangay);
    }

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching YAKAP applications:", error);
    return [];
  }
}

export async function getYakakApplicationById(applicationId: string) {
  try {
    const { data, error } = await supabase
      .from("yakap_applications")
      .select(
        `
        id,
        membership_type,
        philhealth_no,
        status,
        notes,
        created_at,
        resident_id,
        residents(
          full_name,
          barangay,
          contact_number,
          birth_date,
          sex,
          purok,
          philhealth_no
        )
      `,
      )
      .eq("id", applicationId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching YAKAP application:", error);
    return null;
  }
}

export async function getPendingYakakApplications(barangay?: string) {
  try {
    let query = supabase
      .from("yakap_applications")
      .select(
        `
        id,
        membership_type,
        created_at,
        resident_id,
        residents(full_name, contact_number)
      `,
      )
      .eq("status", "pending");

    if (barangay) {
      query = query.eq("residents.barangay", barangay);
    }

    const { data, error } = await query.order("created_at", {
      ascending: true,
    });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching pending YAKAP applications:", error);
    return [];
  }
}

export async function getYakakStatistics(barangay?: string) {
  try {
    let query = supabase
      .from("yakap_applications")
      .select("id, status, residents(barangay)");

    if (barangay) {
      query = query.eq("residents.barangay", barangay);
    }

    const { data, error } = await query;

    if (error) throw error;

    const stats = {
      total: data?.length || 0,
      pending: (data || []).filter((a) => a.status === "pending").length,
      approved: (data || []).filter((a) => a.status === "approved").length,
      returned: (data || []).filter((a) => a.status === "returned").length,
      rejected: (data || []).filter((a) => a.status === "rejected").length,
    };

    return stats;
  } catch (error) {
    console.error("Error fetching YAKAP statistics:", error);
    return { total: 0, pending: 0, approved: 0, returned: 0, rejected: 0 };
  }
}
