"use client";

import { useState } from "react";
import {
  Heart,
  Edit,
  Save,
  Plus,
  X,
  AlertCircle,
  Activity,
  Droplets,
  Scale,
  Ruler,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { HealthRecord } from "@/types";

// Demo health record
const initialHealthRecord: HealthRecord = {
  id: "1",
  user_id: "demo",
  allergies: ["Penicillin", "Shellfish", "Latex"],
  existing_conditions: ["Type 2 Diabetes", "Hypertension"],
  medical_history: "Appendectomy (2015), Knee surgery (2020)",
  blood_type: "O+",
  height: 175,
  weight: 78,
  emergency_notes: "Carries insulin at all times. Emergency contact: Jane Doe (spouse)",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function HealthRecordsPage() {
  const [healthRecord, setHealthRecord] = useState<HealthRecord>(initialHealthRecord);
  const [isEditing, setIsEditing] = useState(false);
  const [editedRecord, setEditedRecord] = useState<HealthRecord>(initialHealthRecord);
  const [newAllergy, setNewAllergy] = useState("");
  const [newCondition, setNewCondition] = useState("");

  const handleSave = () => {
    setHealthRecord({ ...editedRecord, updated_at: new Date().toISOString() });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedRecord(healthRecord);
    setIsEditing(false);
  };

  const addAllergy = () => {
    if (newAllergy.trim() && !editedRecord.allergies.includes(newAllergy.trim())) {
      setEditedRecord({
        ...editedRecord,
        allergies: [...editedRecord.allergies, newAllergy.trim()],
      });
      setNewAllergy("");
    }
  };

  const removeAllergy = (allergy: string) => {
    setEditedRecord({
      ...editedRecord,
      allergies: editedRecord.allergies.filter((a) => a !== allergy),
    });
  };

  const addCondition = () => {
    if (newCondition.trim() && !editedRecord.existing_conditions.includes(newCondition.trim())) {
      setEditedRecord({
        ...editedRecord,
        existing_conditions: [...editedRecord.existing_conditions, newCondition.trim()],
      });
      setNewCondition("");
    }
  };

  const removeCondition = (condition: string) => {
    setEditedRecord({
      ...editedRecord,
      existing_conditions: editedRecord.existing_conditions.filter((c) => c !== condition),
    });
  };

  const calculateBMI = () => {
    if (!healthRecord.height || !healthRecord.weight) return null;
    const heightInMeters = healthRecord.height / 100;
    const bmi = healthRecord.weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: "Underweight", color: "warning" };
    if (bmi < 25) return { label: "Normal", color: "success" };
    if (bmi < 30) return { label: "Overweight", color: "warning" };
    return { label: "Obese", color: "destructive" };
  };

  const bmi = calculateBMI();
  const bmiCategory = bmi ? getBMICategory(parseFloat(bmi)) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 pt-8 sm:flex-row sm:items-center sm:justify-between lg:pt-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Health Records</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your health information and medical history
          </p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="gap-2">
            <Edit className="h-4 w-4" />
            Edit Records
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
              <Droplets className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{healthRecord.blood_type || "N/A"}</p>
              <p className="text-sm text-muted-foreground">Blood Type</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Ruler className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {healthRecord.height ? `${healthRecord.height} cm` : "N/A"}
              </p>
              <p className="text-sm text-muted-foreground">Height</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
              <Scale className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {healthRecord.weight ? `${healthRecord.weight} kg` : "N/A"}
              </p>
              <p className="text-sm text-muted-foreground">Weight</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
              <Activity className="h-6 w-6 text-success" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-foreground">{bmi || "N/A"}</p>
                {bmiCategory && (
                  <Badge variant={bmiCategory.color as "success" | "warning" | "destructive"} className="text-xs">
                    {bmiCategory.label}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">BMI</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Allergies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Allergies
            </CardTitle>
            <CardDescription>Known allergies and sensitivities</CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {editedRecord.allergies.map((allergy) => (
                    <Badge key={allergy} variant="destructive" className="gap-1 pr-1">
                      {allergy}
                      <button
                        onClick={() => removeAllergy(allergy)}
                        className="ml-1 rounded-full p-0.5 hover:bg-destructive-foreground/20"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add new allergy"
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addAllergy()}
                  />
                  <Button onClick={addAllergy} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {healthRecord.allergies.length > 0 ? (
                  healthRecord.allergies.map((allergy) => (
                    <Badge key={allergy} variant="destructive">
                      {allergy}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No allergies recorded</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Existing Conditions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-warning" />
              Existing Conditions
            </CardTitle>
            <CardDescription>Current health conditions being managed</CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {editedRecord.existing_conditions.map((condition) => (
                    <Badge key={condition} variant="warning" className="gap-1 pr-1">
                      {condition}
                      <button
                        onClick={() => removeCondition(condition)}
                        className="ml-1 rounded-full p-0.5 hover:bg-warning-foreground/20"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add new condition"
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCondition()}
                  />
                  <Button onClick={addCondition} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {healthRecord.existing_conditions.length > 0 ? (
                  healthRecord.existing_conditions.map((condition) => (
                    <Badge key={condition} variant="warning">
                      {condition}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No conditions recorded</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Physical Measurements (Edit Mode) */}
      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>Physical Measurements</CardTitle>
            <CardDescription>Update your body measurements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">Blood Type</label>
                <select
                  value={editedRecord.blood_type || ""}
                  onChange={(e) => setEditedRecord({ ...editedRecord, blood_type: e.target.value })}
                  className="h-10 rounded-lg border border-border bg-input px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select blood type</option>
                  {bloodTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="Height (cm)"
                type="number"
                value={editedRecord.height || ""}
                onChange={(e) =>
                  setEditedRecord({ ...editedRecord, height: e.target.value ? parseFloat(e.target.value) : undefined })
                }
                placeholder="e.g., 175"
              />
              <Input
                label="Weight (kg)"
                type="number"
                value={editedRecord.weight || ""}
                onChange={(e) =>
                  setEditedRecord({ ...editedRecord, weight: e.target.value ? parseFloat(e.target.value) : undefined })
                }
                placeholder="e.g., 70"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Medical History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Medical History
          </CardTitle>
          <CardDescription>Previous surgeries, procedures, and significant health events</CardDescription>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <textarea
              value={editedRecord.medical_history || ""}
              onChange={(e) => setEditedRecord({ ...editedRecord, medical_history: e.target.value })}
              placeholder="Enter your medical history..."
              className="min-h-[120px] w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          ) : (
            <p className="text-foreground">
              {healthRecord.medical_history || "No medical history recorded"}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Emergency Notes */}
      <Card className="border-warning/50 bg-warning/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-warning" />
            Emergency Notes
          </CardTitle>
          <CardDescription>
            Important information for emergency responders
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <textarea
              value={editedRecord.emergency_notes || ""}
              onChange={(e) => setEditedRecord({ ...editedRecord, emergency_notes: e.target.value })}
              placeholder="Enter emergency notes..."
              className="min-h-[120px] w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          ) : (
            <p className="text-foreground">
              {healthRecord.emergency_notes || "No emergency notes recorded"}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Last Updated */}
      <p className="text-center text-sm text-muted-foreground">
        Last updated: {new Date(healthRecord.updated_at).toLocaleString()}
      </p>
    </div>
  );
}
