"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { updateAppointmentStatus } from "@/lib/actions/appointments";
import type { AppointmentWithDetails } from "@/lib/queries/appointments";

interface AppointmentsTableProps {
  appointments: AppointmentWithDetails[];
  isLoading?: boolean;
  onStatusUpdated?: () => void;
  isStaff?: boolean;
}

const statusConfig: Record<string, { variant: any; label: string }> = {
  available: { variant: "secondary", label: "Available" },
  booked: { variant: "default", label: "Booked" },
  completed: { variant: "outline", label: "Completed" },
  cancelled: { variant: "destructive", label: "Cancelled" },
  no_show: { variant: "destructive", label: "No Show" },
};

const availableStatuses = ["booked", "completed", "cancelled", "no_show"];

export function AppointmentsTable({
  appointments,
  isLoading,
  onStatusUpdated,
  isStaff = false,
}: AppointmentsTableProps) {
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentWithDetails | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async () => {
    if (!selectedAppointment || !newStatus) return;

    setIsUpdating(true);
    try {
      const result = await updateAppointmentStatus(
        selectedAppointment.id,
        newStatus,
        notes,
      );

      if (result.success) {
        setSelectedAppointment(null);
        setNewStatus("");
        setNotes("");
        onStatusUpdated?.();
      } else {
        alert("Failed to update appointment: " + result.error);
      }
    } catch (error) {
      alert("Error updating appointment");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-slate-500">Loading appointments...</p>
      </div>
    );
  }

  if (!appointments || appointments.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-slate-500">No appointments found</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-900">
              <TableHead className="font-semibold">Resident</TableHead>
              <TableHead className="font-semibold">Facility</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold">Time Slot</TableHead>
              <TableHead className="font-semibold">Service Type</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Booked</TableHead>
              {isStaff && (
                <TableHead className="font-semibold text-right">
                  Action
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow
                key={appointment.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium text-slate-900 dark:text-white">
                      {appointment.resident?.full_name || "N/A"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {appointment.resident?.contact_number || "No phone"}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium text-slate-900 dark:text-white">
                      {appointment.facility?.name || "N/A"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {appointment.facility?.barangay}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm font-medium">
                    {new Date(
                      appointment.appointment_date,
                    ).toLocaleDateString()}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="text-sm font-medium">{appointment.time_slot}</p>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {appointment.service_type || "General"}
                  </p>
                </TableCell>
                <TableCell>
                  <Badge variant={statusConfig[appointment.status]?.variant}>
                    {statusConfig[appointment.status]?.label ||
                      appointment.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <p className="text-xs text-slate-500">
                    {appointment.booked_at
                      ? formatDistanceToNow(new Date(appointment.booked_at), {
                          addSuffix: true,
                        })
                      : "Not booked"}
                  </p>
                </TableCell>
                {isStaff && (
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setNewStatus(appointment.status);
                        setNotes(appointment.notes || "");
                      }}
                    >
                      Update Status
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Status Update Dialog */}
      <Dialog
        open={!!selectedAppointment}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedAppointment(null);
            setNewStatus("");
            setNotes("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Appointment Status</DialogTitle>
            <DialogDescription>
              Resident: {selectedAppointment?.resident?.full_name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">New Status</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  {availableStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {statusConfig[status]?.label || status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Notes (Optional)</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this status change..."
                className="min-h-24"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedAppointment(null);
                setNewStatus("");
                setNotes("");
              }}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleStatusChange}
              disabled={isUpdating || !newStatus}
            >
              {isUpdating ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
