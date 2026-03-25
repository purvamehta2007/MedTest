// API configuration and utility functions for MedSync backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Type definitions based on backend schemas
export interface User {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  date_of_birth?: string;
  is_active: boolean;
  created_at: string;
}

export interface Medicine {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  dosage: string;
  unit: string;
  frequency: string;
  form?: string;
  manufacturer?: string;
  expiry_date?: string;
  instructions?: string;
  side_effects?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Reminder {
  id: string;
  user_id: string;
  medicine_id: string;
  reminder_times: string[];
  frequency: string;
  days_of_week?: number[];
  start_date: string;
  end_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Intake {
  id: string;
  user_id: string;
  medicine_id: string;
  reminder_id?: string;
  scheduled_time: string;
  actual_time?: string;
  status: "taken" | "missed" | "pending";
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AdherenceStats {
  total_scheduled: number;
  taken: number;
  missed: number;
  adherence_rate: number;
}

export interface HealthRecord {
  id: string;
  user_id: string;
  allergies: string[];
  existing_conditions: string[];
  medical_history?: string;
  blood_type?: string;
  height?: number;
  weight?: number;
  emergency_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface FamilyContact {
  id: string;
  user_id: string;
  name: string;
  relationship: string;
  phone_number: string;
  email?: string;
  is_emergency_contact: boolean;
  notify_on_missed_dose: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmergencyAlert {
  id: string;
  user_id: string;
  alert_type: string;
  message: string;
  location?: string;
  is_resolved: boolean;
  resolved_at?: string;
  notified_contacts: string[];
  created_at: string;
  updated_at: string;
}

// Auth token management
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("medsync_token");
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("medsync_token", token);
}

export function removeToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("medsync_token");
}

// API request helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "An error occurred" }));
    throw new Error(error.detail || `HTTP error ${response.status}`);
  }

  return response.json();
}

// Auth API
export const authApi = {
  signup: (data: { email: string; password: string; full_name: string; phone_number?: string }) =>
    apiRequest<{ access_token: string; token_type: string }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    apiRequest<{ access_token: string; token_type: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  me: () => apiRequest<User>("/auth/me"),
};

// Medicines API
export const medicinesApi = {
  getAll: () => apiRequest<Medicine[]>("/medicines"),
  getById: (id: string) => apiRequest<Medicine>(`/medicines/${id}`),
  create: (data: Omit<Medicine, "id" | "user_id" | "is_active" | "created_at" | "updated_at">) =>
    apiRequest<Medicine>("/medicines", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Medicine>) =>
    apiRequest<Medicine>(`/medicines/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest<void>(`/medicines/${id}`, { method: "DELETE" }),
};

// Reminders API
export const remindersApi = {
  getAll: () => apiRequest<Reminder[]>("/reminders"),
  getById: (id: string) => apiRequest<Reminder>(`/reminders/${id}`),
  create: (data: Omit<Reminder, "id" | "user_id" | "is_active" | "created_at" | "updated_at">) =>
    apiRequest<Reminder>("/reminders", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Reminder>) =>
    apiRequest<Reminder>(`/reminders/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest<void>(`/reminders/${id}`, { method: "DELETE" }),
};

// Intakes API
export const intakesApi = {
  getAll: (params?: { medicine_id?: string; start_date?: string; end_date?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.medicine_id) searchParams.set("medicine_id", params.medicine_id);
    if (params?.start_date) searchParams.set("start_date", params.start_date);
    if (params?.end_date) searchParams.set("end_date", params.end_date);
    const query = searchParams.toString();
    return apiRequest<Intake[]>(`/intakes${query ? `?${query}` : ""}`);
  },
  create: (data: { medicine_id: string; reminder_id?: string; scheduled_time: string; status: string; notes?: string }) =>
    apiRequest<Intake>("/intakes", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: { status: string; actual_time?: string; notes?: string }) =>
    apiRequest<Intake>(`/intakes/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  getAdherence: (params?: { start_date?: string; end_date?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.start_date) searchParams.set("start_date", params.start_date);
    if (params?.end_date) searchParams.set("end_date", params.end_date);
    const query = searchParams.toString();
    return apiRequest<AdherenceStats>(`/intakes/adherence${query ? `?${query}` : ""}`);
  },
};

// Health Records API
export const healthRecordsApi = {
  get: () => apiRequest<HealthRecord>("/health-records"),
  create: (data: Omit<HealthRecord, "id" | "user_id" | "created_at" | "updated_at">) =>
    apiRequest<HealthRecord>("/health-records", { method: "POST", body: JSON.stringify(data) }),
  update: (data: Partial<HealthRecord>) =>
    apiRequest<HealthRecord>("/health-records", { method: "PUT", body: JSON.stringify(data) }),
};

// Family Contacts API
export const familyContactsApi = {
  getAll: () => apiRequest<FamilyContact[]>("/family-contacts"),
  getById: (id: string) => apiRequest<FamilyContact>(`/family-contacts/${id}`),
  create: (data: Omit<FamilyContact, "id" | "user_id" | "created_at" | "updated_at">) =>
    apiRequest<FamilyContact>("/family-contacts", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<FamilyContact>) =>
    apiRequest<FamilyContact>(`/family-contacts/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest<void>(`/family-contacts/${id}`, { method: "DELETE" }),
};

// Emergency API
export const emergencyApi = {
  getAlerts: () => apiRequest<EmergencyAlert[]>("/emergency/alerts"),
  createAlert: (data: { alert_type: string; message: string; location?: string }) =>
    apiRequest<EmergencyAlert>("/emergency/alert", { method: "POST", body: JSON.stringify(data) }),
  resolveAlert: (id: string) =>
    apiRequest<EmergencyAlert>(`/emergency/alerts/${id}/resolve`, { method: "PUT" }),
};

// SWR fetcher
export const fetcher = async (url: string) => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "An error occurred" }));
    throw new Error(error.detail || `HTTP error ${response.status}`);
  }

  return response.json();
};
