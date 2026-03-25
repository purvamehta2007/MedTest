"use client";

import { useState } from "react";
import {
  ClipboardList,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  TrendingUp,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Intake, Medicine, AdherenceStats } from "@/types";

// Demo medicines
const demoMedicines: Medicine[] = [
  { id: "1", user_id: "demo", name: "Aspirin", dosage: "500", unit: "mg", frequency: "as needed", is_active: true, created_at: "", updated_at: "" },
  { id: "2", user_id: "demo", name: "Vitamin D3", dosage: "1000", unit: "IU", frequency: "daily", is_active: true, created_at: "", updated_at: "" },
  { id: "3", user_id: "demo", name: "Metformin", dosage: "500", unit: "mg", frequency: "twice daily", is_active: true, created_at: "", updated_at: "" },
  { id: "4", user_id: "demo", name: "Lisinopril", dosage: "10", unit: "mg", frequency: "once daily", is_active: true, created_at: "", updated_at: "" },
];

// Generate demo intakes for the past 7 days
const generateDemoIntakes = (): Intake[] => {
  const intakes: Intake[] = [];
  const now = new Date();
  
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const date = new Date(now);
    date.setDate(date.getDate() - dayOffset);
    
    // Vitamin D3 - 8:00 AM and 8:00 PM
    ["08:00", "20:00"].forEach((time, i) => {
      const scheduledTime = new Date(date);
      const [hours, minutes] = time.split(":");
      scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      const isFuture = scheduledTime > now;
      const status = isFuture ? "pending" : (Math.random() > 0.15 ? "taken" : "missed");
      
      intakes.push({
        id: `vit-d-${dayOffset}-${i}`,
        user_id: "demo",
        medicine_id: "2",
        scheduled_time: scheduledTime.toISOString(),
        actual_time: status === "taken" ? new Date(scheduledTime.getTime() + Math.random() * 1800000).toISOString() : undefined,
        status,
        created_at: scheduledTime.toISOString(),
        updated_at: scheduledTime.toISOString(),
      });
    });
    
    // Metformin - 7:00 AM and 7:00 PM
    ["07:00", "19:00"].forEach((time, i) => {
      const scheduledTime = new Date(date);
      const [hours, minutes] = time.split(":");
      scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      const isFuture = scheduledTime > now;
      const status = isFuture ? "pending" : (Math.random() > 0.1 ? "taken" : "missed");
      
      intakes.push({
        id: `met-${dayOffset}-${i}`,
        user_id: "demo",
        medicine_id: "3",
        scheduled_time: scheduledTime.toISOString(),
        actual_time: status === "taken" ? new Date(scheduledTime.getTime() + Math.random() * 1800000).toISOString() : undefined,
        status,
        created_at: scheduledTime.toISOString(),
        updated_at: scheduledTime.toISOString(),
      });
    });
    
    // Lisinopril - 9:00 AM
    const lisinoprilTime = new Date(date);
    lisinoprilTime.setHours(9, 0, 0, 0);
    
    const isFuture = lisinoprilTime > now;
    const lisinoprilStatus = isFuture ? "pending" : (Math.random() > 0.05 ? "taken" : "missed");
    
    intakes.push({
      id: `lis-${dayOffset}`,
      user_id: "demo",
      medicine_id: "4",
      scheduled_time: lisinoprilTime.toISOString(),
      actual_time: lisinoprilStatus === "taken" ? new Date(lisinoprilTime.getTime() + Math.random() * 1800000).toISOString() : undefined,
      status: lisinoprilStatus,
      created_at: lisinoprilTime.toISOString(),
      updated_at: lisinoprilTime.toISOString(),
    });
  }
  
  return intakes.sort((a, b) => new Date(b.scheduled_time).getTime() - new Date(a.scheduled_time).getTime());
};

export default function IntakesPage() {
  const [intakes, setIntakes] = useState<Intake[]>(generateDemoIntakes());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filterMedicine, setFilterMedicine] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const getMedicine = (medicineId: string) => {
    return demoMedicines.find((m) => m.id === medicineId);
  };

  // Calculate adherence stats
  const calculateStats = (): AdherenceStats => {
    const pastIntakes = intakes.filter((i) => i.status !== "pending");
    const taken = pastIntakes.filter((i) => i.status === "taken").length;
    const missed = pastIntakes.filter((i) => i.status === "missed").length;
    const total = pastIntakes.length;
    
    return {
      total_scheduled: total,
      taken,
      missed,
      adherence_rate: total > 0 ? (taken / total) * 100 : 0,
    };
  };

  const stats = calculateStats();

  // Filter intakes by selected date
  const filteredIntakes = intakes.filter((intake) => {
    const intakeDate = new Date(intake.scheduled_time);
    const sameDay = intakeDate.toDateString() === selectedDate.toDateString();
    const medicineMatch = filterMedicine === "all" || intake.medicine_id === filterMedicine;
    const statusMatch = filterStatus === "all" || intake.status === filterStatus;
    return sameDay && medicineMatch && statusMatch;
  });

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
    setSelectedDate(newDate);
  };

  const markIntake = (intakeId: string, status: "taken" | "missed") => {
    setIntakes(
      intakes.map((intake) =>
        intake.id === intakeId
          ? {
              ...intake,
              status,
              actual_time: status === "taken" ? new Date().toISOString() : undefined,
              updated_at: new Date().toISOString(),
            }
          : intake
      )
    );
  };

  const isToday = selectedDate.toDateString() === new Date().toDateString();
  const isPast = selectedDate < new Date(new Date().setHours(0, 0, 0, 0));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pt-8 lg:pt-0">
        <h1 className="text-3xl font-bold text-foreground">Intake Log</h1>
        <p className="mt-1 text-muted-foreground">Track your medication intake history</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <ClipboardList className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.total_scheduled}</p>
              <p className="text-sm text-muted-foreground">Total Scheduled</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.taken}</p>
              <p className="text-sm text-muted-foreground">Doses Taken</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
              <XCircle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.missed}</p>
              <p className="text-sm text-muted-foreground">Doses Missed</p>
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

      {/* Date Navigation & Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Date Navigation */}
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={() => navigateDate("prev")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold text-foreground">
                  {isToday ? "Today" : selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => navigateDate("next")}
                disabled={isToday}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              {!isToday && (
                <Button variant="ghost" size="sm" onClick={() => setSelectedDate(new Date())}>
                  Today
                </Button>
              )}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={filterMedicine}
                onChange={(e) => setFilterMedicine(e.target.value)}
                className="h-9 rounded-lg border border-border bg-input px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All Medicines</option>
                {demoMedicines.map((med) => (
                  <option key={med.id} value={med.id}>
                    {med.name}
                  </option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="h-9 rounded-lg border border-border bg-input px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All Status</option>
                <option value="taken">Taken</option>
                <option value="missed">Missed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Intake List */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Doses</CardTitle>
          <CardDescription>
            {filteredIntakes.length} dose{filteredIntakes.length !== 1 ? "s" : ""} scheduled for {isToday ? "today" : selectedDate.toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredIntakes.length > 0 ? (
            <div className="space-y-3">
              {filteredIntakes
                .sort((a, b) => new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime())
                .map((intake) => {
                  const medicine = getMedicine(intake.medicine_id);
                  const scheduledTime = new Date(intake.scheduled_time);
                  const isPastDue = scheduledTime < new Date() && intake.status === "pending";
                  
                  return (
                    <div
                      key={intake.id}
                      className={`flex items-center justify-between rounded-lg border p-4 transition-all ${
                        intake.status === "taken"
                          ? "border-success/30 bg-success/5"
                          : intake.status === "missed"
                          ? "border-destructive/30 bg-destructive/5"
                          : isPastDue
                          ? "border-warning/30 bg-warning/5"
                          : "border-border bg-secondary/30"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-card">
                          {intake.status === "taken" ? (
                            <CheckCircle className="h-5 w-5 text-success" />
                          ) : intake.status === "missed" ? (
                            <XCircle className="h-5 w-5 text-destructive" />
                          ) : (
                            <Clock className={`h-5 w-5 ${isPastDue ? "text-warning" : "text-muted-foreground"}`} />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">{medicine?.name}</p>
                            <Badge variant="outline" className="text-xs">
                              {medicine?.dosage} {medicine?.unit}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Scheduled: {scheduledTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            {intake.actual_time && (
                              <span className="ml-2 text-success">
                                Taken: {new Date(intake.actual_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            intake.status === "taken"
                              ? "success"
                              : intake.status === "missed"
                              ? "destructive"
                              : isPastDue
                              ? "warning"
                              : "secondary"
                          }
                        >
                          {isPastDue && intake.status === "pending" ? "Past Due" : intake.status.charAt(0).toUpperCase() + intake.status.slice(1)}
                        </Badge>
                        
                        {intake.status === "pending" && (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() => markIntake(intake.id, "taken")}
                              className="h-8"
                            >
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Take
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => markIntake(intake.id, "missed")}
                              className="h-8"
                            >
                              <XCircle className="mr-1 h-4 w-4" />
                              Skip
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ClipboardList className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium text-foreground">No doses scheduled</p>
              <p className="text-sm text-muted-foreground">
                {filterMedicine !== "all" || filterStatus !== "all"
                  ? "Try adjusting your filters"
                  : "No medications scheduled for this day"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Overview</CardTitle>
          <CardDescription>Your medication adherence for the past 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between gap-2">
            {Array.from({ length: 7 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - (6 - i));
              
              const dayIntakes = intakes.filter(
                (intake) =>
                  new Date(intake.scheduled_time).toDateString() === date.toDateString() &&
                  intake.status !== "pending"
              );
              
              const taken = dayIntakes.filter((i) => i.status === "taken").length;
              const total = dayIntakes.length;
              const adherence = total > 0 ? (taken / total) * 100 : 0;
              const isSelectedDay = date.toDateString() === selectedDate.toDateString();
              
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(date)}
                  className={`flex flex-1 flex-col items-center gap-2 rounded-lg p-3 transition-all ${
                    isSelectedDay ? "bg-primary/10 ring-2 ring-primary" : "hover:bg-secondary"
                  }`}
                >
                  <span className="text-xs text-muted-foreground">
                    {date.toLocaleDateString("en-US", { weekday: "short" })}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {date.getDate()}
                  </span>
                  <div
                    className={`h-2 w-2 rounded-full ${
                      total === 0
                        ? "bg-muted"
                        : adherence >= 80
                        ? "bg-success"
                        : adherence >= 50
                        ? "bg-warning"
                        : "bg-destructive"
                    }`}
                  />
                  <span className="text-xs text-muted-foreground">
                    {total > 0 ? `${taken}/${total}` : "-"}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
