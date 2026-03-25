"use client";

import { useState } from "react";
import {
  Pill,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  AlertCircle,
  Calendar,
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
import type { Medicine } from "@/types";

// Demo data
const initialMedicines: Medicine[] = [
  {
    id: "1",
    user_id: "demo",
    name: "Aspirin",
    description: "Pain reliever and blood thinner",
    dosage: "500",
    unit: "mg",
    frequency: "as needed",
    form: "tablet",
    manufacturer: "Bayer",
    instructions: "Take with food or milk to reduce stomach upset",
    side_effects: "May cause stomach upset, heartburn",
    expiry_date: "2025-12-31",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    user_id: "demo",
    name: "Vitamin D3",
    description: "Vitamin supplement for bone health",
    dosage: "1000",
    unit: "IU",
    frequency: "daily",
    form: "capsule",
    manufacturer: "Nature Made",
    instructions: "Take with a meal for better absorption",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    user_id: "demo",
    name: "Metformin",
    description: "Blood sugar control medication",
    dosage: "500",
    unit: "mg",
    frequency: "twice daily",
    form: "tablet",
    manufacturer: "Generic",
    instructions: "Take with meals to reduce GI side effects",
    side_effects: "Nausea, diarrhea, stomach upset",
    expiry_date: "2026-06-30",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    user_id: "demo",
    name: "Lisinopril",
    description: "ACE inhibitor for blood pressure",
    dosage: "10",
    unit: "mg",
    frequency: "once daily",
    form: "tablet",
    manufacturer: "Lupin",
    instructions: "Take at the same time each day",
    side_effects: "Dry cough, dizziness",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "5",
    user_id: "demo",
    name: "Omeprazole",
    description: "Proton pump inhibitor for acid reflux",
    dosage: "20",
    unit: "mg",
    frequency: "once daily",
    form: "capsule",
    manufacturer: "Generic",
    instructions: "Take 30 minutes before a meal",
    is_active: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const formOptions = ["tablet", "capsule", "liquid", "injection", "cream", "inhaler", "patch", "drops"];
const unitOptions = ["mg", "g", "ml", "IU", "mcg", "units"];
const frequencyOptions = ["once daily", "twice daily", "three times daily", "as needed", "weekly", "monthly"];

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    dosage: "",
    unit: "mg",
    frequency: "once daily",
    form: "tablet",
    manufacturer: "",
    instructions: "",
    side_effects: "",
    expiry_date: "",
  });

  const filteredMedicines = medicines.filter(
    (med) =>
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeMedicines = filteredMedicines.filter((med) => med.is_active);
  const inactiveMedicines = filteredMedicines.filter((med) => !med.is_active);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      dosage: "",
      unit: "mg",
      frequency: "once daily",
      form: "tablet",
      manufacturer: "",
      instructions: "",
      side_effects: "",
      expiry_date: "",
    });
  };

  const handleAddMedicine = () => {
    const newMedicine: Medicine = {
      id: Date.now().toString(),
      user_id: "demo",
      ...formData,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setMedicines([...medicines, newMedicine]);
    setShowAddDialog(false);
    resetForm();
  };

  const handleEditMedicine = () => {
    if (!selectedMedicine) return;
    setMedicines(
      medicines.map((med) =>
        med.id === selectedMedicine.id
          ? { ...med, ...formData, updated_at: new Date().toISOString() }
          : med
      )
    );
    setShowEditDialog(false);
    setSelectedMedicine(null);
    resetForm();
  };

  const handleDeleteMedicine = () => {
    if (!selectedMedicine) return;
    setMedicines(
      medicines.map((med) =>
        med.id === selectedMedicine.id ? { ...med, is_active: false } : med
      )
    );
    setShowDeleteDialog(false);
    setSelectedMedicine(null);
  };

  const openEditDialog = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setFormData({
      name: medicine.name,
      description: medicine.description || "",
      dosage: medicine.dosage,
      unit: medicine.unit,
      frequency: medicine.frequency,
      form: medicine.form || "tablet",
      manufacturer: medicine.manufacturer || "",
      instructions: medicine.instructions || "",
      side_effects: medicine.side_effects || "",
      expiry_date: medicine.expiry_date ? medicine.expiry_date.split("T")[0] : "",
    });
    setShowEditDialog(true);
    setActiveMenu(null);
  };

  const openDeleteDialog = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setShowDeleteDialog(true);
    setActiveMenu(null);
  };

  const MedicineCard = ({ medicine }: { medicine: Medicine }) => (
    <Card className={`relative transition-all ${!medicine.is_active ? "opacity-60" : ""}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Pill className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{medicine.name}</h3>
                <Badge variant={medicine.is_active ? "success" : "secondary"}>
                  {medicine.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{medicine.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="outline">
                  {medicine.dosage} {medicine.unit}
                </Badge>
                <Badge variant="outline">{medicine.frequency}</Badge>
                {medicine.form && <Badge variant="outline">{medicine.form}</Badge>}
              </div>
              {medicine.expiry_date && (
                <div className="mt-3 flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Expires: {new Date(medicine.expiry_date).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setActiveMenu(activeMenu === medicine.id ? null : medicine.id)}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
            {activeMenu === medicine.id && (
              <div className="absolute right-0 top-10 z-10 w-40 rounded-lg border border-border bg-card p-1 shadow-lg">
                <button
                  onClick={() => openEditDialog(medicine)}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-secondary"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => openDeleteDialog(medicine)}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
        {medicine.instructions && (
          <div className="mt-4 rounded-lg bg-secondary/30 p-3">
            <p className="text-sm text-foreground">
              <span className="font-medium">Instructions:</span> {medicine.instructions}
            </p>
          </div>
        )}
        {medicine.side_effects && (
          <div className="mt-2 flex items-start gap-2 text-sm text-warning">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{medicine.side_effects}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 pt-8 sm:flex-row sm:items-center sm:justify-between lg:pt-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Medicines</h1>
          <p className="mt-1 text-muted-foreground">Manage your medications and supplements</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Medicine
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search medicines..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Active Medicines */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Active Medicines ({activeMedicines.length})
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {activeMedicines.map((medicine) => (
            <MedicineCard key={medicine.id} medicine={medicine} />
          ))}
        </div>
        {activeMedicines.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Pill className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium text-foreground">No active medicines</p>
              <p className="text-sm text-muted-foreground">Add your first medicine to get started</p>
              <Button onClick={() => setShowAddDialog(true)} className="mt-4">
                Add Medicine
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Inactive Medicines */}
      {inactiveMedicines.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Inactive Medicines ({inactiveMedicines.length})
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {inactiveMedicines.map((medicine) => (
              <MedicineCard key={medicine.id} medicine={medicine} />
            ))}
          </div>
        </div>
      )}

      {/* Add Medicine Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Medicine</DialogTitle>
            <DialogDescription>
              Enter the details of your medication
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              label="Medicine Name"
              placeholder="e.g., Aspirin"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Description"
              placeholder="Brief description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Dosage"
                placeholder="e.g., 500"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                required
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">Unit</label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="h-10 rounded-lg border border-border bg-input px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {unitOptions.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">Frequency</label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="h-10 rounded-lg border border-border bg-input px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {frequencyOptions.map((freq) => (
                    <option key={freq} value={freq}>
                      {freq}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">Form</label>
                <select
                  value={formData.form}
                  onChange={(e) => setFormData({ ...formData, form: e.target.value })}
                  className="h-10 rounded-lg border border-border bg-input px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {formOptions.map((form) => (
                    <option key={form} value={form}>
                      {form}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Input
              label="Manufacturer"
              placeholder="e.g., Generic Pharma"
              value={formData.manufacturer}
              onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
            />
            <Input
              label="Expiry Date"
              type="date"
              value={formData.expiry_date}
              onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
            />
            <Input
              label="Instructions"
              placeholder="How to take this medicine"
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            />
            <Input
              label="Side Effects"
              placeholder="Known side effects"
              value={formData.side_effects}
              onChange={(e) => setFormData({ ...formData, side_effects: e.target.value })}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMedicine} disabled={!formData.name || !formData.dosage}>
              Add Medicine
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Medicine Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Medicine</DialogTitle>
            <DialogDescription>Update the details of your medication</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              label="Medicine Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Dosage"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                required
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">Unit</label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="h-10 rounded-lg border border-border bg-input px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {unitOptions.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">Frequency</label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="h-10 rounded-lg border border-border bg-input px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {frequencyOptions.map((freq) => (
                    <option key={freq} value={freq}>
                      {freq}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">Form</label>
                <select
                  value={formData.form}
                  onChange={(e) => setFormData({ ...formData, form: e.target.value })}
                  className="h-10 rounded-lg border border-border bg-input px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {formOptions.map((form) => (
                    <option key={form} value={form}>
                      {form}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Input
              label="Manufacturer"
              value={formData.manufacturer}
              onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
            />
            <Input
              label="Expiry Date"
              type="date"
              value={formData.expiry_date}
              onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
            />
            <Input
              label="Instructions"
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            />
            <Input
              label="Side Effects"
              value={formData.side_effects}
              onChange={(e) => setFormData({ ...formData, side_effects: e.target.value })}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditMedicine}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Medicine</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedMedicine?.name}? This will mark it as inactive.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteMedicine}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
