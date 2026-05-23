/**
 * MealSaver — Supabase Database Types
 *
 * This file is the source of truth for TypeScript types.
 * For production, replace with auto-generated types:
 *   npx supabase gen types typescript --project-id your-ref > lib/supabase/types.ts
 */

// ─────────────────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────────────────
export type UserRole = 'donor' | 'receiver' | 'admin' | 'delivery_partner'
export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'suspended'
export type DonationStatus =
  | 'available'
  | 'pending_acceptance'
  | 'accepted'
  | 'pickup_assigned'
  | 'picked_up'
  | 'delivered'
  | 'expired'
  | 'cancelled'
  | 'rejected'
  | 'unsafe'
export type FoodType = 'veg' | 'non_veg' | 'vegan'
export type FoodCondition = 'cooked' | 'raw' | 'packaged'
export type FoodCategory = 'short_term' | 'long_term'
export type PickupType = 'ngo_pickup' | 'donor_dropoff' | 'delivery_partner'
export type PickupStatus = 'assigned' | 'in_progress' | 'verified' | 'completed' | 'failed'
export type NotificationType =
  | 'donation_available'
  | 'donation_accepted'
  | 'donation_rejected'
  | 'pickup_assigned'
  | 'pickup_completed'
  | 'delivery_confirmed'
  | 'donation_expired'
  | 'verification_update'
  | 'general'
export type BusinessType =
  | 'restaurant' | 'bakery' | 'cafe' | 'caterer'
  | 'supermarket' | 'vegetable_vendor' | 'individual' | 'grocery' | 'other'
export type OrganizationType =
  | 'ngo' | 'shelter' | 'orphanage' | 'community_kitchen'
  | 'animal_shelter' | 'feeding_program' | 'other'

// ─────────────────────────────────────────────────────────
// TABLE ROW TYPES
// ─────────────────────────────────────────────────────────
export interface User {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  role: UserRole
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface DonorProfile {
  id: string
  user_id: string
  business_name: string
  business_type: BusinessType
  phone: string | null
  address: string
  city: string
  state: string | null
  pincode: string | null
  location: unknown | null         // PostGIS GEOGRAPHY
  food_license_number: string | null
  gst_number: string | null
  verification_status: VerificationStatus
  verified_at: string | null
  verified_by: string | null
  created_at: string
  updated_at: string
}

export interface ReceiverProfile {
  id: string
  user_id: string
  organization_name: string
  organization_type: OrganizationType
  phone: string | null
  address: string
  city: string
  state: string | null
  pincode: string | null
  location: unknown | null
  service_area_km: number
  max_capacity_kg: number | null
  accepts_veg: boolean
  accepts_non_veg: boolean
  accepts_vegan: boolean
  accepts_cooked: boolean
  accepts_raw: boolean
  accepts_packaged: boolean
  accepts_short_term: boolean
  accepts_long_term: boolean
  registration_number: string | null
  verification_status: VerificationStatus
  verified_at: string | null
  verified_by: string | null
  created_at: string
  updated_at: string
}

export interface Donation {
  id: string
  donor_id: string
  donor_profile_id: string
  title: string
  description: string | null
  food_category: FoodCategory
  food_type: FoodType
  food_condition: FoodCondition
  quantity_kg: number
  quantity_description: string | null
  serves_approx: number | null
  preparation_time: string | null
  expiry_time: string
  preferred_pickup_time: string | null
  pickup_address: string
  pickup_city: string
  pickup_location: unknown | null
  pickup_instructions: string | null
  contact_number: string
  status: DonationStatus
  is_urgent: boolean
  admin_notes: string | null
  created_at: string
  updated_at: string
}

export interface DonationImage {
  id: string
  donation_id: string
  image_url: string
  storage_path: string | null
  is_primary: boolean
  uploaded_at: string
}

export interface DonationReceiverNotification {
  id: string
  donation_id: string
  receiver_id: string
  notified_at: string
  response: 'accepted' | 'rejected' | 'no_response'
  responded_at: string | null
  rejection_reason: string | null
}

export interface PickupAssignment {
  id: string
  donation_id: string
  receiver_id: string
  receiver_profile_id: string
  pickup_type: PickupType
  delivery_partner_id: string | null
  pickup_status: PickupStatus
  scheduled_pickup_time: string | null
  actual_pickup_time: string | null
  otp_code: string | null
  otp_verified: boolean
  pickup_notes: string | null
  assigned_at: string
  updated_at: string
}

export interface DeliveryConfirmation {
  id: string
  pickup_assignment_id: string
  donation_id: string
  receiver_id: string
  quantity_received_kg: number | null
  food_condition_on_arrival: string | null
  is_food_safe: boolean
  receiver_notes: string | null
  confirmed_at: string
}

export interface ImpactReport {
  id: string
  donation_id: string
  donor_id: string
  receiver_id: string
  meals_saved: number | null
  food_waste_reduced_kg: number | null
  co2_impact_kg: number | null
  people_served: number | null
  receiver_confirmed: boolean
  donor_report_generated: boolean
  report_generated_at: string | null
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string
  data: Record<string, unknown>
  is_read: boolean
  read_at: string | null
  created_at: string
}

export interface UserVerification {
  id: string
  user_id: string
  document_type: string
  document_url: string
  storage_path: string | null
  status: VerificationStatus
  reviewed_by: string | null
  reviewed_at: string | null
  rejection_reason: string | null
  uploaded_at: string
}

export interface AdminAction {
  id: string
  admin_id: string
  action_type: string
  target_type: string
  target_id: string
  description: string | null
  metadata: Record<string, unknown>
  created_at: string
}

// ─────────────────────────────────────────────────────────
// DATABASE TYPE (passed to createClient<Database>)
// ─────────────────────────────────────────────────────────
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, 'created_at' | 'updated_at'>
        Update: Partial<Omit<User, 'id' | 'created_at'>>
      }
      donor_profiles: {
        Row: DonorProfile
        Insert: Omit<DonorProfile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<DonorProfile, 'id' | 'created_at'>>
      }
      receiver_profiles: {
        Row: ReceiverProfile
        Insert: Omit<ReceiverProfile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<ReceiverProfile, 'id' | 'created_at'>>
      }
      donations: {
        Row: Donation
        Insert: Omit<Donation, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Donation, 'id' | 'created_at'>>
      }
      donation_images: {
        Row: DonationImage
        Insert: Omit<DonationImage, 'id' | 'uploaded_at'>
        Update: Partial<Omit<DonationImage, 'id'>>
      }
      donation_receiver_notifications: {
        Row: DonationReceiverNotification
        Insert: Omit<DonationReceiverNotification, 'id' | 'notified_at'>
        Update: Partial<Omit<DonationReceiverNotification, 'id'>>
      }
      pickup_assignments: {
        Row: PickupAssignment
        Insert: Omit<PickupAssignment, 'id' | 'assigned_at' | 'updated_at'>
        Update: Partial<Omit<PickupAssignment, 'id' | 'assigned_at'>>
      }
      delivery_confirmations: {
        Row: DeliveryConfirmation
        Insert: Omit<DeliveryConfirmation, 'id' | 'confirmed_at'>
        Update: Partial<Omit<DeliveryConfirmation, 'id'>>
      }
      impact_reports: {
        Row: ImpactReport
        Insert: Omit<ImpactReport, 'id' | 'created_at'>
        Update: Partial<Omit<ImpactReport, 'id'>>
      }
      notifications: {
        Row: Notification
        Insert: Omit<Notification, 'id' | 'created_at'>
        Update: Partial<Omit<Notification, 'id'>>
      }
      user_verifications: {
        Row: UserVerification
        Insert: Omit<UserVerification, 'id' | 'uploaded_at'>
        Update: Partial<Omit<UserVerification, 'id'>>
      }
      admin_actions: {
        Row: AdminAction
        Insert: Omit<AdminAction, 'id' | 'created_at'>
        Update: never
      }
    }
    Functions: {
      find_nearby_receivers: {
        Args: { p_donation_id: string }
        Returns: {
          receiver_id: string
          user_id: string
          organization_name: string
          organization_type: OrganizationType
          phone: string | null
          distance_km: number
          max_capacity_kg: number | null
          can_accept: boolean
        }[]
      }
      calculate_urgency_score: {
        Args: { p_expiry_time: string }
        Returns: number
      }
      generate_impact_report: {
        Args: { p_donation_id: string }
        Returns: string
      }
      expire_stale_donations: {
        Args: Record<never, never>
        Returns: number
      }
      get_donor_impact_summary: {
        Args: { p_donor_id: string }
        Returns: {
          total_donations: number
          total_meals_saved: number
          total_kg_rescued: number
          total_co2_saved_kg: number
          donations_delivered: number
          donations_expired: number
        }[]
      }
      get_receiver_impact_summary: {
        Args: { p_receiver_id: string }
        Returns: {
          total_accepted: number
          total_meals_served: number
          total_kg_received: number
          total_co2_impact_kg: number
        }[]
      }
    }
    Enums: {
      user_role: UserRole
      verification_status: VerificationStatus
      donation_status: DonationStatus
      food_type: FoodType
      food_condition: FoodCondition
      food_category: FoodCategory
      pickup_type: PickupType
      pickup_status: PickupStatus
      notification_type: NotificationType
      business_type: BusinessType
      organization_type: OrganizationType
    }
  }
}
