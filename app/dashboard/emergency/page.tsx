"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  Users,
  Shield,
  Heart,
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
import type { EmergencyAlert, FamilyContact } from "@/types";

// Demo emergency contacts
const emergencyContacts: FamilyContact[] = [
  {
    id: "1",
    user_id: "demo",
    name: "Jane Doe",
    relationship: "Spouse",
    phone_number: "+1 (555) 123-4567",
    email: "jane.doe@example.com",
    is_emergency_contact: true,
    notify_on_missed_dose: true,
    created_at: "",
    updated_at: "",
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
    created_at: "",
    updated_at: "",
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
    created_at: "",
    updated_at: "",
  },
];

// Demo alert history
const initialAlerts: EmergencyAlert[] = [
  {
    id: "1",
    user_id: "demo",
    alert_type: "Medical Emergency",
    message: "Feeling dizzy and short of breath",
    location: "123 Main St, Apt 4B",
    is_resolved: true,
    resolved_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    notified_contacts: ["1", "2", "3"],
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 - 3600000).toISOString(),
    updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    user_id: "demo",
    alert_type: "Medication Issue",
    message: "Unable to locate insulin supply",
    location: "Work Office",
    is_resolved: true,
    resolved_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    notified_contacts: ["1"],
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000 - 1800000).toISOString(),
    updated_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const alertTypes = [
  { value: "Medical Emergency", icon: Heart, color: "text-destructive" },
  { value: "Medication Issue", icon: AlertTriangle, color: "text-warning" },
  { value: "Fall/Injury", icon: AlertTriangle, color: "text-destructive" },
  { value: "Adverse Reaction", icon: Shield, color: "text-destructive" },
  { value: "Need Assistance", icon: Users, color: "text-primary" },
];

export default function EmergencyPage() {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>(initialAlerts);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [alertSending, setAlertSending] = useState(false);
  const [alertSent, setAlertSent] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    alert_type: "Medical Emergency",
    message: "",
    location: "",
  });

  const resetForm = () => {
    setFormData({
      alert_type: "Medical Emergency",
      message: "",
      location: "",
    });
  };

  const handleSendAlert = async () => {
    setShowConfirmDialog(false);
    setAlertSending(true);

    // Simulate sending alert
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newAlert: EmergencyAlert = {
      id: Date.now().toString(),
      user_id: "demo",
      alert_type: formData.alert_type,
      message: formData.message,
      location: formData.location || undefined,
      is_resolved: false,
      notified_contacts: emergencyContacts.map((c) => c.id),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setAlerts([newAlert, ...alerts]);
    setAlertSending(false);
    setAlertSent(true);

    // Reset after showing success
    setTimeout(() => {
      setAlertSent(false);
      setShowAlertDialog(false);
      resetForm();
    }, 3000);
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              is_resolved: true,
              resolved_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
          : alert
      )
    );
  };

  const getContactName = (contactId: string) => {
    return emergencyContacts.find((c) => c.id === contactId)?.name || "Unknown";
  };

  const activeAlerts = alerts.filter((a) => !a.is_resolved);
  const resolvedAlerts = alerts.filter((a) => a.is_resolved);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pt-8 lg:pt-0">
        <h1 className="text-3xl font-bold text-foreground">Emergency Alerts</h1>
        <p className="mt-1 text-muted-foreground">
          Send emergency alerts to your contacts instantly
        </p>
      </div>

      {/* Emergency Button */}
      <Card className="border-destructive/50 bg-gradient-to-br from-destructive/10 to-destructive/5">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-destructive/20">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-foreground">Send Emergency Alert</h2>
          <p className="mb-6 max-w-md text-center text-muted-foreground">
            This will immediately notify all your emergency contacts with your message and location
          </p>
          <Button
            size="lg"
            variant="destructive"
            className="h-14 px-8 text-lg"
            onClick={() => setShowAlertDialog(true)}
          >
            <AlertTriangle className="mr-2 h-6 w-6" />
            Send Emergency Alert
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            {emergencyContacts.length} contacts will be notified
          </p>
        </CardContent>
      </Card>

      {/* Emergency Contacts Quick View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Your Emergency Contacts
          </CardTitle>
          <CardDescription>
            These contacts will be notified when you send an alert
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {emergencyContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                  {contact.name.charAt(0)}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate font-medium text-foreground">{contact.name}</p>
                  <p className="truncate text-sm text-muted-foreground">{contact.relationship}</p>
                </div>
                <a
                  href={`tel:${contact.phone_number}`}
                  className="rounded-full bg-success/10 p-2 text-success hover:bg-success/20"
                >
                  <Phone className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
          {emergencyContacts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Users className="mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No emergency contacts configured</p>
              <Button variant="outline" size="sm" className="mt-2">
                Add Contacts
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <Card className="border-warning/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertTriangle className="h-5 w-5" />
              Active Alerts ({activeAlerts.length})
            </CardTitle>
            <CardDescription>
              These alerts are still active and being monitored
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="rounded-lg border border-warning/30 bg-warning/5 p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/20">
                        <AlertTriangle className="h-5 w-5 text-warning" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-foreground">{alert.alert_type}</h4>
                          <Badge variant="warning">Active</Badge>
                        </div>
                        <p className="mt-1 text-sm text-foreground">{alert.message}</p>
                        {alert.location && (
                          <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {alert.location}
                          </div>
                        )}
                        <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {new Date(alert.created_at).toLocaleString()}
                        </div>
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground">
                            Notified: {alert.notified_contacts.map(getContactName).join(", ")}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => resolveAlert(alert.id)}
                      className="gap-1"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Resolve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alert History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            Alert History
          </CardTitle>
          <CardDescription>Past emergency alerts and their resolution</CardDescription>
        </CardHeader>
        <CardContent>
          {resolvedAlerts.length > 0 ? (
            <div className="space-y-3">
              {resolvedAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                      <CheckCircle className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-foreground">{alert.alert_type}</h4>
                        <Badge variant="success">Resolved</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(alert.created_at).toLocaleDateString()} - Resolved{" "}
                        {alert.resolved_at && new Date(alert.resolved_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Shield className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium text-foreground">No alert history</p>
              <p className="text-sm text-muted-foreground">
                {"Previous emergency alerts will appear here"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Send Alert Dialog */}
      <Dialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
        <DialogContent>
          {alertSending ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-destructive border-t-transparent" />
              <p className="text-lg font-medium text-foreground">Sending Alert...</p>
              <p className="text-sm text-muted-foreground">
                Notifying your emergency contacts
              </p>
            </div>
          ) : alertSent ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <p className="text-lg font-medium text-foreground">Alert Sent Successfully</p>
              <p className="text-sm text-muted-foreground">
                {emergencyContacts.length} contacts have been notified
              </p>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Send Emergency Alert
                </DialogTitle>
                <DialogDescription>
                  Fill in the details below. This will notify all your emergency contacts immediately.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">Alert Type</label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {alertTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, alert_type: type.value })}
                          className={`flex flex-col items-center gap-2 rounded-lg border p-3 text-center transition-all ${
                            formData.alert_type === type.value
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <Icon className={`h-5 w-5 ${type.color}`} />
                          <span className="text-xs font-medium text-foreground">{type.value}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your emergency situation..."
                    className="min-h-[100px] w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>

                <Input
                  label="Location (optional)"
                  placeholder="Your current location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />

                <div className="rounded-lg border border-border bg-secondary/30 p-3">
                  <p className="mb-2 text-sm font-medium text-foreground">
                    Contacts to be notified:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {emergencyContacts.map((contact) => (
                      <Badge key={contact.id} variant="outline">
                        {contact.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAlertDialog(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setShowConfirmDialog(true)}
                  disabled={!formData.message.trim()}
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  Send Alert
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Confirm Emergency Alert</DialogTitle>
            <DialogDescription>
              Are you sure you want to send this emergency alert? All {emergencyContacts.length}{" "}
              emergency contacts will be notified immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <p className="font-medium text-foreground">{formData.alert_type}</p>
            <p className="mt-1 text-sm text-muted-foreground">{formData.message}</p>
            {formData.location && (
              <p className="mt-1 text-sm text-muted-foreground">
                Location: {formData.location}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleSendAlert}>
              Confirm & Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
