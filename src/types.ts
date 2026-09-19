export type PortalView = 'home' | 'patient' | 'donor' | 'pharmacy' | 'impact' | 'login';

export type UserRole = 'patient' | 'donor' | 'pharmacy';

export interface UserProfile {
  role: UserRole;
  name: string;
  phone?: string;
  email?: string;
  location?: string;
  pharmacyName?: string;
  isTrustedDonor?: boolean;
}

export interface ExtractedMedicine {
  id: string;
  name: string;
  dosage: string;
  quantity: string;
  instructions?: string;
  confidence: number; // 0 - 100
  needsVerification: boolean; // Flagged when confidence < 80% or OCR ambiguous
  edited?: boolean;
  category?: string;
}

export interface PrescriptionScanResult {
  id: string;
  patientName?: string;
  doctorName?: string;
  clinicName?: string;
  date?: string;
  medicines: ExtractedMedicine[];
  rawText?: string;
  imageUrl?: string;
  confidenceScore: number; // 0 - 100
  createdAt: string;
}

export type AvailabilitySourceType = 'pharmacy' | 'donor' | 'discounted' | 'jan_aushadhi';

export interface MedicineAvailabilitySource {
  id: string;
  sourceType: AvailabilitySourceType;
  providerName: string;
  medicineName: string;
  dosage: string;
  quantityAvailable: number;
  unitPrice: number; // In INR (₹)
  discountPercent?: number;
  finalPrice: number; // 0 if donor
  isDonation: boolean;
  distanceKm: number;
  address: string;
  phone: string;
  expiryDate: string;
  verificationStatus: 'verified' | 'pending' | 'certified';
  packagingCondition: string;
  collectionHours: string;
}

export interface PriceComparisonSource {
  id: string;
  sourceName: string;
  type: 'single_pharmacy' | 'hybrid_donation' | 'jan_aushadhi' | 'discount_chain';
  totalCost: number;
  savingsVsMrp: number;
  matchedItemsCount: number;
  totalItemsCount: number;
  includesDonatedSupplies: boolean;
  breakdown: {
    medicineName: string;
    source: string;
    price: number;
    isDonated: boolean;
  }[];
  distanceKm: number;
  address: string;
  phone: string;
  isLowestCost?: boolean;
}

export type RequestStatus = 'Requested' | 'Accepted' | 'Reserved' | 'Collected' | 'Cancelled';

export interface MedicineRequest {
  id: string;
  requestId: string; // e.g. MC-REQ-2041
  patientName: string;
  patientPhone: string;
  patientLocation: string;
  medicineName: string;
  dosage: string;
  quantity: number;
  sourceType: AvailabilitySourceType;
  providerId: string;
  providerName: string;
  providerPhone: string;
  providerAddress: string;
  estimatedCost: number;
  isDonation: boolean;
  status: RequestStatus;
  requestDate: string;
  statusUpdatedAt: string;
  collectionInstructions: string;
  prescriptionId?: string;
  notes?: string;
}

export type DonationStatus = 'Pending verification' | 'Verified' | 'Reserved' | 'Collected' | 'Expired or removed';

export interface DonationListing {
  id: string;
  donorName: string;
  donorPhone: string;
  donorEmail: string;
  donorLocation: string;
  medicineName: string;
  brandOrGeneric: string;
  dosage: string;
  quantity: number;
  unitType: 'tablets' | 'capsules' | 'bottles' | 'inhalers' | 'strips';
  expiryDate: string; // YYYY-MM-DD
  batchNumber: string;
  packagingCondition: 'Sealed blister pack' | 'Unopened original box' | 'Intact foil strip' | 'Bottle sealed' | 'Damaged/Open';
  proofImageUrl?: string;
  verificationStatus: DonationStatus;
  createdAt: string;
  notes?: string;
  isEligible: boolean;
  ineligibilityReason?: string;
}

export interface PharmacyInventoryItem {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  location: string;
  phone: string;
  medicineName: string;
  genericName?: string;
  dosage: string;
  category: string;
  mrp: number; // Maximum Retail Price
  sellingPrice: number;
  discountPercent: number;
  stockQuantity: number;
  expiryDate: string;
  batchNumber: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  isJanAushadhiOrSubsidized: boolean;
  lastUpdated: string;
}

export interface ImpactStats {
  medicinesMatched: number;
  patientRequestsServed: number;
  estimatedSavingsInr: number;
  verifiedDonorsCount: number;
  partnerPharmaciesCount: number;
  wastePreventedKg: number;
}
