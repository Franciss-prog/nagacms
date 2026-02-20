"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { BarangayProfileForm } from "@/components/barangay-profiling/barangay-profile-form";
import { BarangayProfilesList } from "@/components/barangay-profiling/barangay-profiles-list";
import { ViewProfileDialog } from "@/components/barangay-profiling/view-profile-dialog";
import type { BarangayProfileFormData } from "@/components/barangay-profiling/barangay-profile-form";
import type { BarangayProfile } from "@/components/barangay-profiling/barangay-profiles-list";
import { BookUser } from "lucide-react";

// ─── Page ────────────────────────────────────────────────────────────────────

export default function BarangayProfilingPage() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [profiles, setProfiles] = useState<BarangayProfile[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<BarangayProfile | null>(null);
  const [viewingProfile, setViewingProfile] = useState<BarangayProfile | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleAdd = () => {
    setEditingProfile(null);
    setIsFormOpen(true);
  };

  const handleEdit = (profile: BarangayProfile) => {
    setEditingProfile(profile);
    setIsFormOpen(true);
  };

  const handleView = (profile: BarangayProfile) => {
    setViewingProfile(profile);
  };

  const handleDeleteRequest = (id: string) => {
    setDeletingId(id);
  };

  const handleDeleteConfirm = () => {
    if (!deletingId) return;
    setProfiles((prev) => prev.filter((p) => p.id !== deletingId));
    setDeletingId(null);
  };

  const handleFormSubmit = async (data: BarangayProfileFormData) => {
    setIsSubmitting(true);
    // Simulate async save (replace with real API call later)
    await new Promise((r) => setTimeout(r, 600));

    if (editingProfile) {
      setProfiles((prev) =>
        prev.map((p) =>
          p.id === editingProfile.id ? { ...editingProfile, ...data } : p
        )
      );
    } else {
      const newProfile: BarangayProfile = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      setProfiles((prev) => [newProfile, ...prev]);
    }

    setIsSubmitting(false);
    setIsFormOpen(false);
    setEditingProfile(null);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingProfile(null);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950">
          <BookUser className="h-5 w-5 text-blue-700 dark:text-blue-300" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Barangay Profiling
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Manage barangay-level demographic and health-related member records
          </p>
        </div>
      </div>

      {/* Profiles List */}
      <BarangayProfilesList
        profiles={profiles}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDeleteRequest}
      />

      {/* Add / Edit Form Dialog */}
      <Dialog
        open={isFormOpen}
        onOpenChange={(v) => {
          if (!v) handleFormCancel();
        }}
      >
        <DialogContent className="max-w-4xl sm:max-w-4xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProfile ? "Edit Barangay Profile" : "New Barangay Profile"}
            </DialogTitle>
          </DialogHeader>
          <BarangayProfileForm
            key={editingProfile?.id ?? "new"}
            initialData={editingProfile ?? undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isSubmitting={isSubmitting}
            mode={editingProfile ? "edit" : "create"}
          />
        </DialogContent>
      </Dialog>

      {/* View Profile Dialog */}
      <ViewProfileDialog
        profile={viewingProfile}
        open={!!viewingProfile}
        onClose={() => setViewingProfile(null)}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deletingId}
        onOpenChange={(v) => !v && setDeletingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Profile?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The profile will be permanently
              removed from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
