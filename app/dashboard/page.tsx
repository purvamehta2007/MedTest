"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Pill,
  Bell,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth-provider";
import type { Medicine, Reminder, AdherenceStats, Intake } from "@/types";

// Demo data for when backend is not connected
const demoMedicines: Medicine[] = [
  {
    id: "1",
    user_id: "demo",
    name: "Aspirin",
    description: "Pain reliever",
    dosage: "500",
    unit: "mg",
    frequency: "as needed",
    form: "tablet",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    user_id: "demo",
    name: "Vitamin D",
    description: "Supplement",
    dosage: "1000",
    unit: "IU",
    frequency: "daily",
    form: "capsule",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    user_id: "demo",
    name: "Metformin",
    description: "Blood sugar control",
    dosage: "500",
    unit: "mg",
    frequency: "twice daily",
    form: "tablet",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const demoReminders: Reminder[] = [
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
];

const demoStats: AdherenceStats = {
  total_scheduled: 28,
  taken: 25,
  missed: 3,
  adherence_rate: 89.3,
};

const demoTodayIntakes: Intake[] = [
  {
    id: "1",
    user_id: "demo",
    medicine_id: "2",
    scheduled_time: new Date().setHours(8, 0, 0, 0).toString(),
    status: "taken",
    actual_time: new Date().setHours(8, 15, 0, 0).toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    user_id: "demo",
    medicine_id: "3",
    scheduled_time: new Date().setHours(7, 0, 0, 0).toString(),
    status: "taken",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    user_id: "demo",
    medicine_id: "3",
    scheduled_time: new Date().setHours(19, 0, 0, 0).toString(),
    status: "pending",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    user_id: "demo",
    medicine_id: "2",
    scheduled_time: new Date().setHours(20, 0, 0, 0).toString(),
    status: "pending",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [medicines] = useState<Medicine[]>(demoMedicines);
  const [reminders] = useState<Reminder[]>(demoReminders);
  const [stats] = useState<AdherenceStats>(demoStats);
  const [todayIntakes] = useState<Intake[]>(demoTodayIntakes);

  const getMedicineName = (medicineId: string) => {
    return medicines.find((m) => m.id === medicineId)?.name || "Unknown";
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const upcomingReminders = reminders.filter((r) => r.is_active).slice(0, 3);
  const takenToday = todayIntakes.filter((i) => i.status === "taken").length;
  const pendingToday = todayIntakes.filter((i) => i.status === "pending").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pt-8 lg:pt-0">
        <h1 className="text-3xl font-bold text-foreground">
          {greeting()}, {user?.full_name?.split(" ")[0] || "User"}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {"Here's an overview of your medication schedule"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Pill className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{medicines.length}</p>
              <p className="text-sm text-muted-foreground">Active Medicines</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{takenToday}</p>
              <p className="text-sm text-muted-foreground">Taken Today</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
              <Clock className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{pendingToday}</p>
              <p className="text-sm text-muted-foreground">Pending Today</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
              <TrendingUp className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.adherence_rate.toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground">Adherence Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Schedule */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{"Today's Schedule"}</CardTitle>
              <CardDescription>Your medication schedule for today</CardDescription>
            </div>
            <Link href="/dashboard/intakes">
              <Button variant="ghost" size="sm" className="gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayIntakes.map((intake) => (
                <div
                  key={intake.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4"
                >
                  <div className="flex items-center gap-3">
                    {intake.status === "taken" ? (
                      <CheckCircle className="h-5 w-5 text-success" />
                    ) : intake.status === "missed" ? (
                      <XCircle className="h-5 w-5 text-destructive" />
                    ) : (
                      <Clock className="h-5 w-5 text-warning" />
                    )}
                    <div>
                      <p className="font-medium text-foreground">
                        {getMedicineName(intake.medicine_id)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(Number(intake.scheduled_time)).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      intake.status === "taken"
                        ? "success"
                        : intake.status === "missed"
                        ? "destructive"
                        : "warning"
                    }
                  >
                    {intake.status.charAt(0).toUpperCase() + intake.status.slice(1)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Reminders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Active Reminders</CardTitle>
              <CardDescription>Your current reminder schedule</CardDescription>
            </div>
            <Link href="/dashboard/reminders">
              <Button variant="ghost" size="sm" className="gap-1">
                Manage <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingReminders.length > 0 ? (
                upcomingReminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">
                          {getMedicineName(reminder.medicine_id)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {reminder.reminder_times.join(", ")} - {reminder.frequency}
                        </p>
                      </div>
                    </div>
                    <Badge variant={reminder.is_active ? "success" : "secondary"}>
                      {reminder.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Bell className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No active reminders</p>
                  <Link href="/dashboard/reminders" className="mt-2">
                    <Button variant="outline" size="sm">
                      Create Reminder
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks you can do right now</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/dashboard/medicines">
              <Button variant="outline" className="h-auto w-full flex-col gap-2 p-4">
                <Pill className="h-6 w-6 text-primary" />
                <span>Add Medicine</span>
              </Button>
            </Link>
            <Link href="/dashboard/reminders">
              <Button variant="outline" className="h-auto w-full flex-col gap-2 p-4">
                <Bell className="h-6 w-6 text-primary" />
                <span>Set Reminder</span>
              </Button>
            </Link>
            <Link href="/dashboard/intakes">
              <Button variant="outline" className="h-auto w-full flex-col gap-2 p-4">
                <CheckCircle className="h-6 w-6 text-success" />
                <span>Log Intake</span>
              </Button>
            </Link>
            <Link href="/dashboard/emergency">
              <Button variant="outline" className="h-auto w-full flex-col gap-2 p-4">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                <span>Emergency Alert</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
