export type AppointmentStatus = "new" | "contacted" | "advised" | "completed";
export type LeadStatus = "new" | "contacted" | "done";

export interface Appointment {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
  need?: string;
  area?: string;
  budget?: string;
  preferred_time?: string;
  appointment_time?: string;
  contact_method?: string;
  source?: string;
  note?: string;
  status: AppointmentStatus;
  created_at: string;
}

export interface ChatbotLead {
  id: string;
  full_name?: string;
  phone?: string;
  need?: string;
  area?: string;
  budget?: string;
  bedrooms?: string;
  needed_time?: string;
  purpose?: string;
  appointment_time?: string;
  contact_method?: string;
  conversation?: ChatMessage[];
  status: LeadStatus;
  created_at: string;
}

export interface NewsPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  thumbnail_url?: string;
  published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
  message?: string;
  created_at: string;
}

export interface ChatMessage {
  role: "user" | "model";
  content: string;
  timestamp?: string;
}
