"use client";

import { useState } from "react";
import {
  Users,
  Plus,
  Phone,
  Mail,
  MoreVertical,
  Edit,
  Trash2,
  Bell,
  BellOff,
  AlertTriangle,
  UserCircle,
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
import type { FamilyContact } from "@/types";

// Demo contacts
const initialContacts: FamilyContact[] = [
  {
    id: "1",
    user_id: "demo",
    name: "Jane Doe",
    relationship: "Spouse",
    phone_number: "+1 (555) 123-4567",
    email: "jane.doe@example.com",
    is_emergency_contact: true,
    notify_on_missed_dose: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    user_id: "demo",
    name: "Robert Smith",
    relationship: "Son",
    phone_number: "+1 (555) 234-5678",
    email: "robert.smith@example.com",
    is_emergency_contact: true,
    notify_on_missed_dose: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    user_id: "demo",
    name: "Dr. Sarah Johnson",
    relationship: "Primary Doctor",
    phone_number: "+1 (555) 345-6789",
    email: "dr.johnson@clinic.com",
    is_emergency_contact: true,
    notify_on_missed_dose: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    user_id: "demo",
    name: "Mary Williams",
    relationship: "Neighbor",
    phone_number: "+1 (555) 456-7890",
    is_emergency_contact: false,
    notify_on_missed_dose: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const relationshipOptions = [
  "Spouse",
  "Parent",
  "Child",
  "Sibling",
  "Friend",
  "Neighbor",
  "Caregiver",
  "Primary Doctor",
  "Specialist",
  "Other",
];

export default function ContactsPage() {
  const [contacts, setContacts] = useState<FamilyContact[]>(initialContacts);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedContact, setSelectedContact] = useState<FamilyContact | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    relationship: "Spouse",
    phone_number: "",
    email: "",
    is_emergency_contact: true,
    notify_on_missed_dose: false,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      relationship: "Spouse",
      phone_number: "",
      email: "",
      is_emergency_contact: true,
      notify_on_missed_dose: false,
    });
  };

  const handleAddContact = () => {
    const newContact: FamilyContact = {
      id: Date.now().toString(),
      user_id: "demo",
      ...formData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setContacts([...contacts, newContact]);
    setShowAddDialog(false);
    resetForm();
  };

  const handleEditContact = () => {
    if (!selectedContact) return;
    setContacts(
      contacts.map((contact) =>
        contact.id === selectedContact.id
          ? { ...contact, ...formData, updated_at: new Date().toISOString() }
          : contact
      )
    );
    setShowEditDialog(false);
    setSelectedContact(null);
    resetForm();
  };

  const handleDeleteContact = () => {
    if (!selectedContact) return;
    setContacts(contacts.filter((contact) => contact.id !== selectedContact.id));
    setShowDeleteDialog(false);
    setSelectedContact(null);
  };

  const openEditDialog = (contact: FamilyContact) => {
    setSelectedContact(contact);
    setFormData({
      name: contact.name,
      relationship: contact.relationship,
      phone_number: contact.phone_number,
      email: contact.email || "",
      is_emergency_contact: contact.is_emergency_contact,
      notify_on_missed_dose: contact.notify_on_missed_dose,
    });
    setShowEditDialog(true);
    setActiveMenu(null);
  };

  const openDeleteDialog = (contact: FamilyContact) => {
    setSelectedContact(contact);
    setShowDeleteDialog(true);
    setActiveMenu(null);
  };

  const toggleNotification = (contactId: string, field: "is_emergency_contact" | "notify_on_missed_dose") => {
    setContacts(
      contacts.map((contact) =>
        contact.id === contactId
          ? { ...contact, [field]: !contact[field], updated_at: new Date().toISOString() }
          : contact
      )
    );
  };

  const emergencyContacts = contacts.filter((c) => c.is_emergency_contact);
  const otherContacts = contacts.filter((c) => !c.is_emergency_contact);

  const ContactCard = ({ contact }: { contact: FamilyContact }) => (
    <Card className="transition-all hover:border-primary/30">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
              {contact.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{contact.name}</h3>
                {contact.is_emergency_contact && (
                  <Badge variant="destructive" className="text-xs">
                    Emergency
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{contact.relationship}</p>

              <div className="mt-3 space-y-1">
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${contact.phone_number}`} className="hover:text-primary">
                    {contact.phone_number}
                  </a>
                </div>
                {contact.email && (
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${contact.email}`} className="hover:text-primary">
                      {contact.email}
                    </a>
                  </div>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => toggleNotification(contact.id, "notify_on_missed_dose")}
                  className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors ${
                    contact.notify_on_missed_dose
                      ? "bg-success/10 text-success"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  }`}
                >
                  {contact.notify_on_missed_dose ? (
                    <Bell className="h-3 w-3" />
                  ) : (
                    <BellOff className="h-3 w-3" />
                  )}
                  Missed dose alerts
                </button>
              </div>
            </div>
          </div>

          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setActiveMenu(activeMenu === contact.id ? null : contact.id)}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
            {activeMenu === contact.id && (
              <div className="absolute right-0 top-10 z-10 w-40 rounded-lg border border-border bg-card p-1 shadow-lg">
                <button
                  onClick={() => openEditDialog(contact)}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-secondary"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => openDeleteDialog(contact)}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ContactForm = () => (
    <div className="grid gap-4 py-4">
      <Input
        label="Full Name"
        placeholder="e.g., Jane Doe"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Relationship</label>
        <select
          value={formData.relationship}
          onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
          className="h-10 rounded-lg border border-border bg-input px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {relationshipOptions.map((rel) => (
            <option key={rel} value={rel}>
              {rel}
            </option>
          ))}
        </select>
      </div>
      <Input
        label="Phone Number"
        type="tel"
        placeholder="+1 (555) 123-4567"
        value={formData.phone_number}
        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
        required
      />
      <Input
        label="Email (optional)"
        type="email"
        placeholder="email@example.com"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <div className="space-y-3 rounded-lg border border-border p-4">
        <p className="text-sm font-medium text-foreground">Notification Settings</p>
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={formData.is_emergency_contact}
            onChange={(e) => setFormData({ ...formData, is_emergency_contact: e.target.checked })}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
          />
          <div>
            <span className="text-sm font-medium text-foreground">Emergency Contact</span>
            <p className="text-xs text-muted-foreground">
              Will be notified in case of emergency alerts
            </p>
          </div>
        </label>
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={formData.notify_on_missed_dose}
            onChange={(e) => setFormData({ ...formData, notify_on_missed_dose: e.target.checked })}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
          />
          <div>
            <span className="text-sm font-medium text-foreground">Missed Dose Alerts</span>
            <p className="text-xs text-muted-foreground">
              Will be notified when you miss medication doses
            </p>
          </div>
        </label>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 pt-8 sm:flex-row sm:items-center sm:justify-between lg:pt-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Family Contacts</h1>
          <p className="mt-1 text-muted-foreground">
            Manage emergency contacts and notification preferences
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Contact
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{contacts.length}</p>
              <p className="text-sm text-muted-foreground">Total Contacts</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{emergencyContacts.length}</p>
              <p className="text-sm text-muted-foreground">Emergency Contacts</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
              <Bell className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {contacts.filter((c) => c.notify_on_missed_dose).length}
              </p>
              <p className="text-sm text-muted-foreground">Dose Notifications</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Contacts */}
      <div>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          Emergency Contacts ({emergencyContacts.length})
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {emergencyContacts.map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>
        {emergencyContacts.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertTriangle className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium text-foreground">No emergency contacts</p>
              <p className="text-sm text-muted-foreground">Add contacts to notify in emergencies</p>
              <Button onClick={() => setShowAddDialog(true)} className="mt-4">
                Add Contact
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Other Contacts */}
      {otherContacts.length > 0 && (
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
            <UserCircle className="h-5 w-5 text-primary" />
            Other Contacts ({otherContacts.length})
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {otherContacts.map((contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        </div>
      )}

      {/* Add Contact Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Contact</DialogTitle>
            <DialogDescription>
              Add a family member or caregiver to your contacts
            </DialogDescription>
          </DialogHeader>
          <ContactForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddContact}
              disabled={!formData.name || !formData.phone_number}
            >
              Add Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Contact Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Contact</DialogTitle>
            <DialogDescription>Update contact information</DialogDescription>
          </DialogHeader>
          <ContactForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditContact}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Contact</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedContact?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteContact}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
