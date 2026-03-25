"use client";

import { useState } from "react";
import {
  Bell,
  Plus,
  Clock,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Pill,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Reminder, Medicine } from "@/types";

// Demo medicines for dropdown
const demoMedicines: Medicine[] = [
  {
    id: "1",
    user_id: "demo",
    name: "Aspirin",
    dosage: "500",
    unit: "mg",
    frequency: "as needed",
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "2",
    user_id: "demo",
    name: "Vitamin D3",
    dosage: "1000",
    unit: "IU",
    frequency: "daily",
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "3",
    user_id: "demo",
    name: "Metformin",
    dosage: "500",
    unit: "mg",
    frequency: "twice daily",
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "4",
    user_id: "demo",
    name: "Lisinopril",
    dosage: "10",
    unit: "mg",
    frequency: "once daily",
    is_active: true,
    created_at: "",
    updated_at: "",
  },
];

// Demo reminders
const initialReminders: Reminder[] = [
  {
    id: "1",
    user_id: "demo",
    medicine_id: "2",
    reminder_times: ["08:00", "20:00"],
    frequency: "daily",
    start_date: new Date().toISOString(),
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    user_id: "demo",
    medicine_id: "3",
    reminder_times: ["07:00", "19:00"],
    frequency: "daily",
    start_date: new Date().toISOString(),
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    user_id: "demo",
    medicine_id: "4",
    reminder_times: ["09:00"],
    frequency: "daily",
    start_date: new Date().toISOString(),
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    user_id: "demo",
    medicine_id: "1",
    reminder_times: ["12:00"],
    frequency: "weekly",
    days_of_week: [1, 3, 5],
    start_date: new Date().toISOString(),
    is_active: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const frequencyOptions = ["daily", "weekly"];
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    medicine_id: "",
    reminder_times: ["08:00"],
    frequency: "daily",
    days_of_week: [] as number[],
    start_date: new Date().toISOString().split("T")[0],
    end_date: "",
  });

  const getMedicine = (medicineId: string) => {
    return demoMedicines.find((m) => m.id === medicineId);
  };

  const resetForm = () => {
    setFormData({
      medicine_id: "",
      reminder_times: ["08:00"],
      frequency: "daily",
      days_of_week: [],
      start_date: new Date().toISOString().split("T")[0],
      end_date: "",
    });
  };

  const addReminderTime = () => {
    setFormData({
      ...formData,
      reminder_times: [...formData.reminder_times, "12:00"],
    });
  };

  const removeReminderTime = (index: number) => {
    setFormData({
      ...formData,
      reminder_times: formData.reminder_times.filter((_, i) => i !== index),
    });
  };

  const updateReminderTime = (index: number, value: string) => {
    const newTimes = [...formData.reminder_times];
    newTimes[index] = value;
    setFormData({ ...formData, reminder_times: newTimes });
  };

  const toggleDayOfWeek = (day: number) => {
    if (formData.days_of_week.includes(day)) {
      setFormData({
        ...formData,
        days_of_week: formData.days_of_week.filter((d) => d !== day),
      });
    } else {
      setFormData({
        ...formData,
        days_of_week: [...formData.days_of_week, day].sort(),
      });
    }
  };

  const handleAddReminder = () => {
    const newReminder: Reminder = {
      id: Date.now().toString(),
      user_id: "demo",
      medicine_id: formData.medicine_id,
      reminder_times: formData.reminder_times,
      frequency: formData.frequency,
      days_of_week: formData.frequency === "weekly" ? formData.days_of_week : undefined,
      start_date: formData.start_date,
      end_date: formData.end_date || undefined,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setReminders([...reminders, newReminder]);
    setShowAddDialog(false);
    resetForm();
  };

  const handleEditReminder = () => {
    if (!selectedReminder) return;
    setReminders(
      reminders.map((rem) =>
        rem.id === selectedReminder.id
          ? {
              ...rem,
              ...formData,
              days_of_week: formData.frequency === "weekly" ? formData.days_of_week : undefined,
              updated_at: new Date().toISOString(),
            }
          : rem
      )
    );
    setShowEditDialog(false);
    setSelectedReminder(null);
    resetForm();
  };

  const handleDeleteReminder = () => {
    if (!selectedReminder) return;
    setReminders(reminders.filter((rem) => rem.id !== selectedReminder.id));
    setShowDeleteDialog(false);
    setSelectedReminder(null);
  };

  const toggleReminderActive = (reminder: Reminder) => {
    setReminders(
      reminders.map((rem) =>
        rem.id === reminder.id
          ? { ...rem, is_active: !rem.is_active, updated_at: new Date().toISOString() }
          : rem
      )
    );
  };

  const openEditDialog = (reminder: Reminder) => {
    setSelectedReminder(reminder);
    setFormData({
      medicine_id: reminder.medicine_id,
      reminder_times: reminder.reminder_times,
      frequency: reminder.frequency,
      days_of_week: reminder.days_of_week || [],
      start_date: reminder.start_date.split("T")[0],
      end_date: reminder.end_date ? reminder.end_date.split("T")[0] : "",
    });
    setShowEditDialog(true);
    setActiveMenu(null);
  };

  const openDeleteDialog = (reminder: Reminder) => {
    setSelectedReminder(reminder);
    setShowDeleteDialog(true);
    setActiveMenu(null);
  };

  const activeReminders = reminders.filter((r) => r.is_active);
  const inactiveReminders = reminders.filter((r) => !r.is_active);

  const ReminderCard = ({ reminder }: { reminder: Reminder }) => {
    const medicine = getMedicine(reminder.medicine_id);
    return (
      <Card className={`transition-all ${!reminder.is_active ? "opacity-60" : ""}`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Bell className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">
                    {medicine?.name || "Unknown Medicine"}
                  </h3>
                  <Badge variant={reminder.is_active ? "success" : "secondary"}>
                    {reminder.is_active ? "Active" : "Paused"}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {medicine?.dosage} {medicine?.unit}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5 text-sm text-foreground">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {reminder.reminder_times.join(", ")}
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {reminder.frequency}
                  </Badge>
                </div>

                {reminder.frequency === "weekly" && reminder.days_of_week && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {reminder.days_of_week.map((day) => (
                      <Badge key={day} variant="secondary" className="text-xs">
                        {daysOfWeek[day]}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Started {new Date(reminder.start_date).toLocaleDateString()}
                  {reminder.end_date && ` - Ends ${new Date(reminder.end_date).toLocaleDateString()}`}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleReminderActive(reminder)}
                className="rounded-lg p-2 transition-colors hover:bg-secondary"
                title={reminder.is_active ? "Pause reminder" : "Activate reminder"}
              >
                {reminder.is_active ? (
                  <ToggleRight className="h-5 w-5 text-success" />
                ) : (
                  <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setActiveMenu(activeMenu === reminder.id ? null : reminder.id)}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
                {activeMenu === reminder.id && (
                  <div className="absolute right-0 top-10 z-10 w-40 rounded-lg border border-border bg-card p-1 shadow-lg">
                    <button
                      onClick={() => openEditDialog(reminder)}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-secondary"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteDialog(reminder)}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const ReminderForm = () => (
    <div className="grid gap-4 py-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Medicine</label>
        <select
          value={formData.medicine_id}
          onChange={(e) => setFormData({ ...formData, medicine_id: e.target.value })}
          className="h-10 rounded-lg border border-border bg-input px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Select a medicine</option>
          {demoMedicines.map((med) => (
            <option key={med.id} value={med.id}>
              {med.name} ({med.dosage} {med.unit})
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Reminder Times</label>
        <div className="space-y-2">
          {formData.reminder_times.map((time, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                type="time"
                value={time}
                onChange={(e) => updateReminderTime(index, e.target.value)}
                className="flex-1"
              />
              {formData.reminder_times.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeReminderTime(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addReminderTime} className="mt-2">
          <Plus className="mr-2 h-4 w-4" />
          Add Time
        </Button>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Frequency</label>
        <select
          value={formData.frequency}
          onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
          className="h-10 rounded-lg border border-border bg-input px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {frequencyOptions.map((freq) => (
            <option key={freq} value={freq}>
              {freq.charAt(0).toUpperCase() + freq.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {formData.frequency === "weekly" && (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Days of Week</label>
          <div className="flex flex-wrap gap-2">
            {daysOfWeek.map((day, index) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDayOfWeek(index)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  formData.days_of_week.includes(index)
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Start Date"
          type="date"
          value={formData.start_date}
          onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
        />
        <Input
          label="End Date (optional)"
          type="date"
          value={formData.end_date}
          onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 pt-8 sm:flex-row sm:items-center sm:justify-between lg:pt-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reminders</h1>
          <p className="mt-1 text-muted-foreground">Set up medication reminder schedules</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Reminder
        </Button>
      </div>

      {/* Active Reminders */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Active Reminders ({activeReminders.length})
        </h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {activeReminders.map((reminder) => (
            <ReminderCard key={reminder.id} reminder={reminder} />
          ))}
        </div>
        {activeReminders.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium text-foreground">No active reminders</p>
              <p className="text-sm text-muted-foreground">Create a reminder for your medicines</p>
              <Button onClick={() => setShowAddDialog(true)} className="mt-4">
                Add Reminder
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Inactive Reminders */}
      {inactiveReminders.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Paused Reminders ({inactiveReminders.length})
          </h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {inactiveReminders.map((reminder) => (
              <ReminderCard key={reminder.id} reminder={reminder} />
            ))}
          </div>
        </div>
      )}

      {/* Add Reminder Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Reminder</DialogTitle>
            <DialogDescription>Set up a reminder schedule for your medication</DialogDescription>
          </DialogHeader>
          <ReminderForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddReminder}
              disabled={!formData.medicine_id || formData.reminder_times.length === 0}
            >
              Add Reminder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Reminder Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Reminder</DialogTitle>
            <DialogDescription>Update your reminder schedule</DialogDescription>
          </DialogHeader>
          <ReminderForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditReminder}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Reminder</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this reminder for{" "}
              {getMedicine(selectedReminder?.medicine_id || "")?.name}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteReminder}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
