export type PartnerProfile = {
  id: string;
  email: string;
  full_name: string;
  role: 'client' | 'partner' | 'admin';
  status: 'pending' | 'approved' | 'rejected';
  partner_id?: string;
};

export type PartnerHour = {
  id?: string;
  partner_id: string;
  day_of_week: string;
  open_time: string;
  close_time: string;
  is_closed: boolean;
};

export type PartnerStaffMember = {
  id?: string;
  partner_id: string;
  name: string;
  role: string;
  hourly_rate: number;
  email?: string;
  phone?: string;
  is_active: boolean;
};

export type InventoryPart = {
  id?: string;
  partner_id: string;
  sku: string;
  part_name: string;
  category?: string;
  unit_price: number;
  stock_quantity: number;
};

export type QuotationRecord = {
  id: string;
  partner_id: string;
  partner_name?: string;
  full_name: string;
  phone: string;
  notes?: string;
  status: string;
  created_at: string;
  guest_name?: string;
  guest_email?: string;
  guest_phone?: string;
};

export type AppointmentRecord = {
  id: string;
  partner_id: string;
  partner_name?: string;
  full_name: string;
  phone: string;
  appointment_date: string;
  appointment_time: string;
  notes?: string;
  status: string;
  created_at: string;
};
