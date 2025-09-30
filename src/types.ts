export interface Resident {
  id: string;
  name: string;
  age: number;
  carePlan: string;
  medication: string;
  familyContact?: string;
  accessibility?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  availability: string; 
  qualifications?: string;
}

export interface ScheduleItem {
  id: string;
  staffId: string;
  residentId: string;
  shift: string;       
}

/** Service Management */
export interface ServiceDefinition {
  id: string;
  name: string;             
  defaultDurationMins: number;
}

export interface ServiceRecord {
  id: string;
  serviceId: string;
  residentId: string;
  staffId?: string;
  date: string;             
  durationMins: number;
  notes?: string;
}

/** Facility Management */
export interface Room {
  id: string;
  name: string;             
  capacity: number;         
  occupantResidentId?: string; 
}

/** Inventory Management */
export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  threshold: number;        
}

/** Billing */
export interface Invoice {
  id: string;
  residentId: string;
  description: string;
  amount: number;           
  paid: boolean;
  date: string;             
}
