"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getStaffUsers, getBarangays } from "@/lib/queries/users";
import { deleteStaffUserAction } from "@/lib/actions/users";
import { StaffTable } from "@/components/staff/staff-table";
import { CreateStaffDialog } from "@/components/staff/create-staff-dialog";
import { EditStaffDialog } from "@/components/staff/edit-staff-dialog";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus } from "lucide-react";
import type { User } from "@/lib/types";

interface PageState {
  users: User[];
  isLoading: boolean;
  selectedRole: string;
  selectedUser: User | null;
  isCreateOpen: boolean;
  isEditOpen: boolean;
  isDeleteAlertOpen: boolean;
  userToDelete: User | null;
  barangays: string[];
}

export default function StaffPage() {
  const router = useRouter();
  const [state, setState] = useState<PageState>({
    users: [],
    isLoading: true,
    selectedRole: "all",
    selectedUser: null,
    isCreateOpen: false,
    isEditOpen: false,
    isDeleteAlertOpen: false,
    userToDelete: null,
    barangays: [],
  });

  // Check admin access
  useEffect(() => {
    const checkAccess = async () => {
      const session = await getSession();
      if (!session || session.user.role !== "admin") {
        router.push("/dashboard");
      }
    };
    checkAccess();
  }, [router]);

  // Fetch barangays on mount
  useEffect(() => {
    const fetchBarangays = async () => {
      const { data } = await getBarangays();
      setState((prev) => ({ ...prev, barangays: data }));
    };
    fetchBarangays();
  }, []);

  // Fetch staff users
  const fetchUsers = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const { data } = await getStaffUsers({
        role:
          state.selectedRole === "all"
            ? undefined
            : (state.selectedRole as any),
        limit: 50,
      });

      setState((prev) => ({
        ...prev,
        users: data,
        isLoading: false,
      }));
    } catch (error) {
      console.error("[fetchUsers]", error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [state.selectedRole]);

  // Initial load
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = (role: string) => {
    setState((prev) => ({ ...prev, selectedRole: role }));
  };

  const handleEdit = (id: string) => {
    const user = state.users.find((u) => u.id === id);
    if (user) {
      setState((prev) => ({
        ...prev,
        selectedUser: user,
        isEditOpen: true,
      }));
    }
  };

  const handleView = (id: string) => {
    // Same as edit for now
    handleEdit(id);
  };

  const handleDelete = (id: string) => {
    const user = state.users.find((u) => u.id === id);
    if (user) {
      setState((prev) => ({
        ...prev,
        userToDelete: user,
        isDeleteAlertOpen: true,
      }));
    }
  };

  const handleConfirmDelete = async () => {
    if (!state.userToDelete) return;

    const result = await deleteStaffUserAction(state.userToDelete.id);

    if (!result.success) {
      console.error("Delete failed:", result.error);
      return;
    }

    setState((prev) => ({
      ...prev,
      isDeleteAlertOpen: false,
      userToDelete: null,
    }));

    fetchUsers();
  };

  const handleCloseEditDialog = () => {
    setState((prev) => ({
      ...prev,
      isEditOpen: false,
      selectedUser: null,
    }));
  };

  const handleCreateSuccess = () => {
    fetchUsers();
  };

  const handleEditSuccess = () => {
    handleCloseEditDialog();
    fetchUsers();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Staff Management
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Manage barangay health workers and administrators
          </p>
        </div>
        <Button
          onClick={() => setState((prev) => ({ ...prev, isCreateOpen: true }))}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Staff Member
        </Button>
      </div>

      <StaffTable
        users={state.users}
        isLoading={state.isLoading}
        onRoleChange={handleRoleChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      <CreateStaffDialog
        isOpen={state.isCreateOpen}
        onClose={() => setState((prev) => ({ ...prev, isCreateOpen: false }))}
        onSuccess={handleCreateSuccess}
        barangays={state.barangays}
      />

      <EditStaffDialog
        user={state.selectedUser}
        isOpen={state.isEditOpen}
        onClose={handleCloseEditDialog}
        onSuccess={handleEditSuccess}
        barangays={state.barangays}
      />

      <AlertDialog
        open={state.isDeleteAlertOpen}
        onOpenChange={(open) =>
          setState((prev) => ({ ...prev, isDeleteAlertOpen: open }))
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Staff Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{state.userToDelete?.username}</strong>? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
