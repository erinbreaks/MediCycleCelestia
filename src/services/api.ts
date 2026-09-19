import {
  PharmacyInventoryItem,
  DonationListing,
  MedicineRequest,
  ImpactStats,
  PrescriptionScanResult,
  ExtractedMedicine,
  PriceComparisonSource,
  MedicineAvailabilitySource
} from '../types';
import {
  INITIAL_PHARMACY_INVENTORY,
  INITIAL_DONATIONS,
  INITIAL_REQUESTS,
  INITIAL_IMPACT_STATS,
  SAMPLE_PRESCRIPTIONS
} from '../data/mockData';

const LOCAL_STORAGE_KEYS = {
  INVENTORY: 'medicycle_inventory_v1',
  DONATIONS: 'medicycle_donations_v1',
  REQUESTS: 'medicycle_requests_v1',
  STATS: 'medicycle_stats_v1',
  SAVED_PRESCRIPTIONS: 'medicycle_saved_prescriptions_v1'
};

function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Storage save error:', err);
  }
}

// Storage helpers
export function getInventory(): PharmacyInventoryItem[] {
  return getStored(LOCAL_STORAGE_KEYS.INVENTORY, INITIAL_PHARMACY_INVENTORY);
}

export function saveInventory(items: PharmacyInventoryItem[]): void {
  setStored(LOCAL_STORAGE_KEYS.INVENTORY, items);
}

export function getDonations(): DonationListing[] {
  return getStored(LOCAL_STORAGE_KEYS.DONATIONS, INITIAL_DONATIONS);
}

export function saveDonations(items: DonationListing[]): void {
  setStored(LOCAL_STORAGE_KEYS.DONATIONS, items);
}

export function getRequests(): MedicineRequest[] {
  return getStored(LOCAL_STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
}

export function saveRequests(items: MedicineRequest[]): void {
  setStored(LOCAL_STORAGE_KEYS.REQUESTS, items);
}

export function getStats(): ImpactStats {
  return getStored(LOCAL_STORAGE_KEYS.STATS, INITIAL_IMPACT_STATS);
}

export function saveStats(stats: ImpactStats): void {
  setStored(LOCAL_STORAGE_KEYS.STATS, stats);
}

export function getSavedPrescriptions(): PrescriptionScanResult[] {
  return getStored(LOCAL_STORAGE_KEYS.SAVED_PRESCRIPTIONS, SAMPLE_PRESCRIPTIONS);
}

export function savePrescription(rx: PrescriptionScanResult): void {
  const current = getSavedPrescriptions();
  const updated = [rx, ...current.filter(item => item.id !== rx.id)];
  setStored(LOCAL_STORAGE_KEYS.SAVED_PRESCRIPTIONS, updated);
}

// Scan prescription via backend Gemini API or fallback
export async function scanPrescriptionApi(payload: {
  imageBase64?: string;
  mimeType?: string;
  fileName?: string;
  textPrompt?: string;
}): Promise<PrescriptionScanResult> {
  try {
    const res = await fetch('/api/ocr-prescription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const json = await res.json();
      if (json.data) {
        savePrescription(json.data);
        return json.data;
      }
    }
  } catch (err) {
    console.warn('API fetch failed, utilizing client fallback:', err);
  }

  // Graceful client fallback
  const sample = SAMPLE_PRESCRIPTIONS[0];
  const newRx: PrescriptionScanResult = {
    ...sample,
    id: `rx-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  savePrescription(newRx);
  return newRx;
}

// Search matching availability for a list of medicine names
export function findMedicineAvailability(medicines: ExtractedMedicine[]): {
  sourcesByMed: Record<string, MedicineAvailabilitySource[]>;
  comparisonOptions: PriceComparisonSource[];
} {
  const inventory = getInventory();
  const donations = getDonations();
  const sourcesByMed: Record<string, MedicineAvailabilitySource[]> = {};

  // For each medicine, find available pharmacy stock & verified donations
  medicines.forEach(med => {
    const medSources: MedicineAvailabilitySource[] = [];
    const query = med.name.toLowerCase().trim();

    // 1. Search verified donations (100% Free)
    donations
      .filter(d => d.verificationStatus === 'Verified' && d.quantity > 0)
      .filter(d => {
        const dName = d.medicineName.toLowerCase();
        const dBrand = (d.brandOrGeneric || '').toLowerCase();
        return (
          dName.includes(query) ||
          query.includes(dName) ||
          (dBrand && (dBrand.includes(query) || query.includes(dBrand)))
        );
      })
      .forEach(d => {
        medSources.push({
          id: `src-don-${d.id}`,
          sourceType: 'donor',
          providerName: `${d.donorName} (Verified Donor)`,
          medicineName: `${d.medicineName} (${d.brandOrGeneric})`,
          dosage: d.dosage,
          quantityAvailable: d.quantity,
          unitPrice: 0,
          finalPrice: 0,
          isDonation: true,
          distanceKm: 1.4,
          address: d.donorLocation,
          phone: d.donorPhone,
          expiryDate: d.expiryDate,
          verificationStatus: 'verified',
          packagingCondition: d.packagingCondition,
          collectionHours: '10:00 AM - 6:00 PM via MediCycle Drop Center'
        });
      });

    // 2. Search pharmacy inventory
    inventory
      .filter(item => item.stockQuantity > 0)
      .filter(item => {
        const iName = item.medicineName.toLowerCase();
        const iGen = (item.genericName || '').toLowerCase();
        return (
          iName.includes(query) ||
          query.includes(iName) ||
          (iGen && (iGen.includes(query) || query.includes(iGen)))
        );
      })
      .forEach(item => {
        medSources.push({
          id: `src-inv-${item.id}`,
          sourceType: item.isJanAushadhiOrSubsidized
            ? 'jan_aushadhi'
            : item.discountPercent > 15
            ? 'discounted'
            : 'pharmacy',
          providerName: item.pharmacyName,
          medicineName: item.medicineName,
          dosage: item.dosage,
          quantityAvailable: item.stockQuantity,
          unitPrice: item.mrp,
          discountPercent: item.discountPercent,
          finalPrice: item.sellingPrice,
          isDonation: false,
          distanceKm: item.pharmacyId === 'ph-care' ? 0.8 : item.pharmacyId === 'ph-apollo' ? 1.2 : 2.4,
          address: item.location,
          phone: item.phone,
          expiryDate: item.expiryDate,
          verificationStatus: 'certified',
          packagingCondition: 'Sealed Commercial Pack',
          collectionHours: '08:00 AM - 10:00 PM (Instant Pickup)'
        });
      });

    sourcesByMed[med.id] = medSources;
  });

  // Generate Price Comparison options (Feature 3 in Tab 1)
  // Example from doc:
  // Pharmacy A: ₹420
  // Pharmacy B: ₹350
  // Pharmacy + donated stock: ₹160 (Lowest estimated cost highlighted)
  const comparisonOptions: PriceComparisonSource[] = [];

  // 1. CarePlus Community Pharmacy Option (Partner Retail)
  const careplusBreakdown = medicines.map(m => {
    const s = (sourcesByMed[m.id] || []).find(src => src.providerName.includes('CarePlus'));
    return {
      medicineName: m.name,
      source: s ? s.providerName : 'CarePlus Community Pharmacy',
      price: s ? s.finalPrice : 120,
      isDonated: false
    };
  });
  const careplusTotal = careplusBreakdown.reduce((acc, b) => acc + b.price, 0);

  comparisonOptions.push({
    id: 'cmp-careplus',
    sourceName: 'CarePlus Community Pharmacy & Dispensary',
    type: 'single_pharmacy',
    totalCost: careplusTotal,
    savingsVsMrp: Math.round(careplusTotal * 0.20),
    matchedItemsCount: medicines.length,
    totalItemsCount: medicines.length,
    includesDonatedSupplies: false,
    breakdown: careplusBreakdown,
    distanceKm: 0.8,
    address: '100 Feet Rd, Indiranagar',
    phone: '+91 80 2528 7766'
  });

  // 2. MedPlus / Discount Pharmacy Option
  const medplusBreakdown = medicines.map(m => {
    const s = (sourcesByMed[m.id] || []).find(src => src.providerName.includes('MedPlus'));
    return {
      medicineName: m.name,
      source: s ? s.providerName : 'MedPlus Discount Store',
      price: s ? s.finalPrice : 115,
      isDonated: false
    };
  });
  const medplusTotal = medplusBreakdown.reduce((acc, b) => acc + b.price, 0);

  comparisonOptions.push({
    id: 'cmp-medplus',
    sourceName: 'MedPlus Store (20%+ Discount)',
    type: 'discount_chain',
    totalCost: medplusTotal,
    savingsVsMrp: Math.round(medplusTotal * 0.28),
    matchedItemsCount: medicines.length,
    totalItemsCount: medicines.length,
    includesDonatedSupplies: false,
    breakdown: medplusBreakdown,
    distanceKm: 2.1,
    address: 'Old Airport Rd, Kodihalli',
    phone: '+91 80 4122 8844'
  });

  // 3. Jan Aushadhi Generic Center Option
  const janBreakdown = medicines.map(m => {
    const s = (sourcesByMed[m.id] || []).find(src => src.providerName.includes('Jan Aushadhi'));
    return {
      medicineName: m.name,
      source: s ? s.providerName : 'Jan Aushadhi Kendra',
      price: s ? s.finalPrice : 35,
      isDonated: false
    };
  });
  const janTotal = janBreakdown.reduce((acc, b) => acc + b.price, 0);

  comparisonOptions.push({
    id: 'cmp-janaushadhi',
    sourceName: 'Jan Aushadhi Kendra (Govt Generics)',
    type: 'jan_aushadhi',
    totalCost: janTotal,
    savingsVsMrp: Math.round(Math.max(0, careplusTotal - janTotal)),
    matchedItemsCount: medicines.length,
    totalItemsCount: medicines.length,
    includesDonatedSupplies: false,
    breakdown: janBreakdown,
    distanceKm: 2.8,
    address: 'HAL 2nd Stage, Domlur',
    phone: '+91 80 2535 0022'
  });

  // 4. SMART HYBRID MATCH: Pharmacy + Verified Donated Stock (Lowest Cost Option!)
  const hybridBreakdown = medicines.map(m => {
    const don = (sourcesByMed[m.id] || []).find(src => src.isDonation);
    if (don) {
      return {
        medicineName: m.name,
        source: `${don.providerName} (Free Supply)`,
        price: 0,
        isDonated: true
      };
    }
    const genericOrDiscount = (sourcesByMed[m.id] || []).find(
      src => src.sourceType === 'jan_aushadhi' || src.sourceType === 'discounted'
    );
    return {
      medicineName: m.name,
      source: genericOrDiscount ? genericOrDiscount.providerName : 'CarePlus Partner Pharmacy',
      price: genericOrDiscount ? genericOrDiscount.finalPrice : 45,
      isDonated: false
    };
  });
  const hybridTotal = hybridBreakdown.reduce((acc, b) => acc + b.price, 0);

  comparisonOptions.push({
    id: 'cmp-hybrid',
    sourceName: 'MediCycle Smart Combo (Pharmacy + Donated Stock)',
    type: 'hybrid_donation',
    totalCost: hybridTotal,
    savingsVsMrp: Math.round(Math.max(0, careplusTotal - hybridTotal)),
    matchedItemsCount: medicines.length,
    totalItemsCount: medicines.length,
    includesDonatedSupplies: true,
    breakdown: hybridBreakdown,
    distanceKm: 1.4,
    address: 'MediCycle Hub & Partner Network, Indiranagar',
    phone: '1800-MED-CYCLE (Toll-Free)',
    isLowestCost: true
  });

  // Sort by total cost ascending so user can see lowest first
  comparisonOptions.sort((a, b) => a.totalCost - b.totalCost);

  return { sourcesByMed, comparisonOptions };
}

// Request submission & status management
export function createMedicineRequest(params: {
  patientName: string;
  patientPhone: string;
  patientLocation: string;
  medicineName: string;
  dosage: string;
  quantity: number;
  source: MedicineAvailabilitySource;
  prescriptionId?: string;
  notes?: string;
}): MedicineRequest {
  const requests = getRequests();
  const newReq: MedicineRequest = {
    id: `req-${Date.now()}`,
    requestId: `MC-REQ-${Math.floor(4000 + Math.random() * 5000)}`,
    patientName: params.patientName,
    patientPhone: params.patientPhone,
    patientLocation: params.patientLocation || 'Bengaluru',
    medicineName: params.medicineName,
    dosage: params.dosage,
    quantity: params.quantity,
    sourceType: params.source.sourceType,
    providerId: params.source.id,
    providerName: params.source.providerName,
    providerPhone: params.source.phone,
    providerAddress: params.source.address,
    estimatedCost: params.source.finalPrice,
    isDonation: params.source.isDonation,
    status: 'Requested',
    requestDate: new Date().toISOString(),
    statusUpdatedAt: new Date().toISOString(),
    collectionInstructions: params.source.isDonation
      ? 'Bring your valid prescription and photo ID. Reserved at MediCycle Drop Center. Pharmacist verification will be conducted on handover.'
      : `Visit ${params.source.providerName} at ${params.source.address}. Show Request ID at counter.`,
    prescriptionId: params.prescriptionId,
    notes: params.notes
  };

  saveRequests([newReq, ...requests]);

  // Update stats
  const stats = getStats();
  stats.patientRequestsServed += 1;
  stats.medicinesMatched += 1;
  stats.estimatedSavingsInr += params.source.isDonation ? (params.source.unitPrice || 120) : (params.source.discountPercent ? 50 : 20);
  saveStats(stats);

  return newReq;
}

export function updateRequestStatus(
  requestId: string,
  newStatus: MedicineRequest['status'],
  notes?: string
): MedicineRequest | null {
  const requests = getRequests();
  const idx = requests.findIndex(r => r.id === requestId);
  if (idx === -1) return null;

  requests[idx].status = newStatus;
  requests[idx].statusUpdatedAt = new Date().toISOString();
  if (notes) {
    requests[idx].notes = (requests[idx].notes ? requests[idx].notes + ' | ' : '') + notes;
  }
  saveRequests(requests);
  return requests[idx];
}

// Donor listing submission & safety validation
export function evaluateMedicineDonationEligibility(expiryDateStr: string, condition: string): {
  isEligible: boolean;
  reason?: string;
  daysRemaining: number;
} {
  const expiry = new Date(expiryDateStr);
  const now = new Date();
  const diffTime = expiry.getTime() - now.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (daysRemaining <= 0) {
    return {
      isEligible: false,
      reason: 'This medicine has expired. Per safety protocols, expired medicines cannot be accepted for patient redistribution.',
      daysRemaining
    };
  }

  // MediCycle requires at least 90 days before expiry to allow safe verification & patient use
  if (daysRemaining < 90) {
    return {
      isEligible: false,
      reason: `Medicine expires in ${daysRemaining} days (less than minimum 90 days safety threshold). Please utilize our Safe Disposal Routing.`,
      daysRemaining
    };
  }

  if (condition === 'Damaged/Open') {
    return {
      isEligible: false,
      reason: 'Open or unsealed containers cannot be accepted due to contamination risk.',
      daysRemaining
    };
  }

  return {
    isEligible: true,
    daysRemaining
  };
}

export function createDonation(listing: Omit<DonationListing, 'id' | 'createdAt' | 'verificationStatus' | 'isEligible' | 'ineligibilityReason'>): DonationListing {
  const donations = getDonations();
  const check = evaluateMedicineDonationEligibility(listing.expiryDate, listing.packagingCondition);

  const newDonation: DonationListing = {
    ...listing,
    id: `don-${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0],
    verificationStatus: check.isEligible ? 'Pending verification' : 'Expired or removed',
    isEligible: check.isEligible,
    ineligibilityReason: check.reason
  };

  saveDonations([newDonation, ...donations]);

  if (check.isEligible) {
    const stats = getStats();
    stats.medicinesMatched += Number(listing.quantity) || 10;
    saveStats(stats);
  }

  return newDonation;
}

export function verifyDonation(donationId: string): void {
  const donations = getDonations();
  const item = donations.find(d => d.id === donationId);
  if (item) {
    item.verificationStatus = 'Verified';
    saveDonations(donations);
  }
}

// Pharmacy inventory operations
export function addPharmacyInventory(item: Omit<PharmacyInventoryItem, 'id' | 'lastUpdated'>): PharmacyInventoryItem {
  const inventory = getInventory();
  const newItem: PharmacyInventoryItem = {
    ...item,
    id: `inv-${Date.now()}`,
    lastUpdated: 'Just now'
  };
  saveInventory([newItem, ...inventory]);
  return newItem;
}

export function updatePharmacyStock(
  itemId: string,
  stockQuantity: number,
  sellingPrice?: number
): PharmacyInventoryItem | null {
  const inventory = getInventory();
  const item = inventory.find(i => i.id === itemId);
  if (item) {
    item.stockQuantity = stockQuantity;
    if (sellingPrice !== undefined) item.sellingPrice = sellingPrice;
    item.status = stockQuantity === 0 ? 'Out of Stock' : stockQuantity < 20 ? 'Low Stock' : 'In Stock';
    item.lastUpdated = 'Just now';
    saveInventory(inventory);
    return item;
  }
  return null;
}
