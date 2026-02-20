"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface WorkerAnnouncement {
  id: string;
  title: string;
  content: string;
  poster_image_url?: string | null;
  published_at?: string | null;
  created_at: string;
  target_barangays: string[];
  is_read?: boolean;
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function WorkerAnnouncementsPage() {
  const [loading, setLoading] = useState(true);
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [announcements, setAnnouncements] = useState<WorkerAnnouncement[]>([]);
  const [error, setError] = useState<string>("");

  const loadAnnouncements = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/announcements?mode=worker");

      if (!response.ok) {
        const payload = await response
          .json()
          .catch(() => ({ error: "Failed to load announcements" }));
        throw new Error(payload.error || "Failed to load announcements");
      }

      const payload = await response.json();
      setAnnouncements(payload.data || []);
      setUnreadCount(payload.unreadCount || 0);
    } catch (loadError: unknown) {
      setError(getErrorMessage(loadError, "Failed to load announcements"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    setMarkingId(id);
    setError("");

    try {
      const response = await fetch(`/api/announcements/${id}/read`, {
        method: "PATCH",
      });

      if (!response.ok) {
        const payload = await response
          .json()
          .catch(() => ({ error: "Failed to mark announcement as read" }));
        throw new Error(payload.error || "Failed to mark announcement as read");
      }

      setAnnouncements((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, is_read: true } : item,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (markError: unknown) {
      setError(getErrorMessage(markError, "Failed to mark announcement as read"));
    } finally {
      setMarkingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Announcements
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            City Health Office updates targeted to your barangay.
          </p>
        </div>

        <Badge className="bg-blue-100 text-blue-700">{unreadCount} unread</Badge>
      </div>

      {error && (
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="py-4">
            <p className="text-sm text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Inbox</CardTitle>
          <CardDescription>
            Published announcements assigned to your barangay.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-slate-500">Loading announcements...</p>
          ) : announcements.length === 0 ? (
            <p className="text-sm text-slate-500">
              No announcements available for your barangay.
            </p>
          ) : (
            <div className="space-y-3">
              {announcements.map((item) => (
                <div key={item.id} className="rounded-lg border p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    {item.is_read ? (
                      <Badge variant="outline">Read</Badge>
                    ) : (
                      <Badge className="bg-amber-100 text-amber-700">New</Badge>
                    )}
                  </div>

                  <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                    {item.content}
                  </p>

                  {item.poster_image_url ? (
                    <Image
                      src={item.poster_image_url}
                      alt={`${item.title} poster`}
                      width={900}
                      height={700}
                      unoptimized
                      className="max-h-72 w-auto rounded-md border"
                    />
                  ) : null}

                  <p className="text-xs text-slate-500">
                    {item.published_at
                      ? `Published ${format(new Date(item.published_at), "PPP p")}`
                      : `Created ${format(new Date(item.created_at), "PPP p")}`}
                  </p>

                  {!item.is_read && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMarkAsRead(item.id)}
                      disabled={markingId === item.id}
                    >
                      {markingId === item.id ? "Marking..." : "Mark as read"}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
