import React, { useState, useEffect, useMemo } from 'react';
import { DonationListing, DonationStatus, UserProfile } from '../../types';
import { 
  getDonations, 
  createDonation, 
  evaluateMedicineDonationEligibility 
} from '../../services/api';
import { 
  HeartHandshake, 
  PlusCircle, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Package, 
  Upload, 
  Sparkles,
  ArrowUpDown,
  Search,
  Filter,
  Check,
  Star,
  Clock,
  Pill,
  Info
} from 'lucide-react';

interface DonorPortalProps {
  onDonationCreated: () => void;
  onNavigateToDisposal: () => void;
  currentUser?: UserProfile | null;
}

const POPULAR_DONATION_MEDS = [
  { name: 'Metformin Hydrochloride', brand: 'Glycomet 500', dosage: '500 mg', unit: 'tablets' as const },
  { name: 'Telmisartan Tablets', brand: 'Telma 40', dosage: '40 mg', unit: 'tablets' as const },
  { name: 'Atorvastatin Tablets', brand: 'Atorva 10', dosage: '10 mg', unit: 'tablets' as const },
  { name: 'Amoxicillin and Potassium Clavulanate', brand: 'Augmentin 625', dosage: '625 mg', unit: 'tablets' as const },
  { name: 'Paracetamol', brand: 'Dolo 650', dosage: '650 mg', unit: 'tablets' as const },
  { name: 'Pantoprazole Gastro-resistant', brand: 'Pan 40', dosage: '40 mg', unit: 'tablets' as const }
];

export const DonorPortal: React.FC<DonorPortalProps> = ({
  onDonationCreated,
  onNavigateToDisposal,
  currentUser
}) => {
  const [donations, setDonations] = useState<DonationListing[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Manual search state in donor portal
  const [medicineSearchQuery, setMedicineSearchQuery] = useState('');
  const [selectedSearchedMed, setSelectedSearchedMed] = useState<typeof POPULAR_DONATION_MEDS[0] | null>(null);

  // Sorting & Filtering state
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name' | 'expiry'>('newest');
  const [statusFilter, setStatusFilter] = useState<'all' | DonationStatus>('all');

  // Form fields
  const [medicineName, setMedicineName] = useState('');
  const [brandOrGeneric, setBrandOrGeneric] = useState('');
  const [dosage, setDosage] = useState('500 mg');
  const [quantity, setQuantity] = useState(20);
  const [unitType, setUnitType] = useState<DonationListing['unitType']>('tablets');
  const [expiryDate, setExpiryDate] = useState('2027-08-30');
  const [batchNumber, setBatchNumber] = useState('BT-9921');
  const [packagingCondition, setPackagingCondition] = useState<DonationListing['packagingCondition']>('Sealed blister pack');
  const [donorName, setDonorName] = useState(currentUser?.name || 'Dr. Anita Sharma');
  const [donorPhone, setDonorPhone] = useState(currentUser?.phone || '+91 98450 12345');
  const [donorEmail, setDonorEmail] = useState(currentUser?.email || 'anita.sharma@example.com');
  const [donorLocation, setDonorLocation] = useState(currentUser?.location || 'Defence Colony, Indiranagar');
  const [notes, setNotes] = useState('');

  // Live safety assessment
  const [eligibilityCheck, setEligibilityCheck] = useState<{
    isEligible: boolean;
    reason?: string;
    daysRemaining: number;
  }>({ isEligible: true, daysRemaining: 300 });

  useEffect(() => {
    setDonations(getDonations());
  }, []);

  useEffect(() => {
    if (currentUser) {
      setDonorName(currentUser.name);
      if (currentUser.phone) setDonorPhone(currentUser.phone);
      if (currentUser.email) setDonorEmail(currentUser.email);
      if (currentUser.location) setDonorLocation(currentUser.location);
    }
  }, [currentUser]);

  // Update eligibility check whenever expiryDate or packagingCondition changes
  useEffect(() => {
    if (expiryDate) {
      const check = evaluateMedicineDonationEligibility(expiryDate, packagingCondition);
      setEligibilityCheck(check);
    }
  }, [expiryDate, packagingCondition]);

  // Filter donations for current user
  const userDonations = useMemo(() => {
    return donations.filter(d => 
      !donorName || d.donorName.toLowerCase().includes(donorName.toLowerCase()) || d.donorName.includes('Anita')
    );
  }, [donations, donorName]);

  // Count verified donations to determine Trusted Donor status (> 5 verified donations)
  const verifiedDonationsCount = useMemo(() => {
    return userDonations.filter(d => d.verificationStatus === 'Verified' || d.verificationStatus === 'Collected').length;
  }, [userDonations]);

  const isTrustedDonor = verifiedDonationsCount >= 5 || currentUser?.isTrustedDonor;

  // Filtered and Sorted donations list
  const filteredSortedDonations = useMemo(() => {
    let list = [...userDonations];

    if (statusFilter !== 'all') {
      list = list.filter(d => d.verificationStatus === statusFilter);
    }

    list.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'name') return a.medicineName.localeCompare(b.medicineName);
      if (sortBy === 'expiry') return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
      return 0;
    });

    return list;
  }, [userDonations, statusFilter, sortBy]);

  // Handle pre-filling from manual search
  const handleSelectMedForDonation = (med: typeof POPULAR_DONATION_MEDS[0]) => {
    setMedicineName(med.name);
    setBrandOrGeneric(med.brand);
    setDosage(med.dosage);
    setUnitType(med.unit);
    setShowAddModal(true);
  };

  const handleManualSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (medicineSearchQuery.trim()) {
      setMedicineName(medicineSearchQuery.trim());
      setBrandOrGeneric(medicineSearchQuery.trim());
      setShowAddModal(true);
    }
  };

  const handleSubmitDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicineName.trim()) return;

    createDonation({
      donorName,
      donorPhone,
      donorEmail,
      donorLocation,
      medicineName,
      brandOrGeneric: brandOrGeneric || medicineName,
      dosage,
      quantity,
      unitType,
      expiryDate,
      batchNumber,
      packagingCondition,
      notes
    });

    setDonations(getDonations());
    setShowAddModal(false);
    onDonationCreated();
  };

  return (
    <div className="py-8 md:py-12 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header with Donor Info and Trusted Donor Tag */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                <HeartHandshake className="w-3.5 h-3.5 text-amber-700" /> Donor Portal
              </div>

              {/* Requirement: If there are > 5 verified donations, show Trusted Donor tag */}
              {isTrustedDonor && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-black tracking-wide shadow-sm animate-pulse">
                  <Star className="w-3.5 h-3.5 fill-white text-white" />
                  <span>⭐ Trusted Donor</span>
                  <span className="bg-amber-700/60 text-amber-100 px-1.5 py-0.2 rounded-full text-[10px]">
                    {verifiedDonationsCount} Verified
                  </span>
                </div>
              )}
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              List Unused Medicines for Patients in Need
            </h1>
            <p className="text-stone-600 text-sm sm:text-base mt-1">
              Give unused sealed medicines a second life. Track your donation history and statuses below.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              id="btn-open-donate-modal"
              onClick={() => {
                setMedicineName('');
                setBrandOrGeneric('');
                setShowAddModal(true);
              }}
              className="px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-amber-600/20 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              List an Unused Medicine
            </button>
          </div>
        </div>

        {/* Feature 1: Manual Medicine Search & Instant Demo Chips */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-display font-bold text-lg text-stone-900 flex items-center gap-2">
                <Search className="w-5 h-5 text-amber-600" />
                Manual Medicine Search & Donation Form
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Search for any medicine name or select a popular common prescription to pre-fill donation details.
              </p>
            </div>
          </div>

          {/* Search Input Bar */}
          <form onSubmit={handleManualSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={medicineSearchQuery}
                onChange={(e) => setMedicineSearchQuery(e.target.value)}
                placeholder="Search medicine name to donate (e.g. Metformin, Telmisartan, Atorvastatin)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none bg-stone-50/60"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold rounded-2xl transition-colors shrink-0"
            >
              Search & Donate
            </button>
          </form>

          {/* Demo Quick-Select Chips */}
          <div className="pt-2">
            <div className="text-xs font-semibold text-stone-600 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Instant Demo Prescriptions (Click to Donate):
            </div>
            <div className="flex flex-wrap gap-2">
              {POPULAR_DONATION_MEDS.map((med, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectMedForDonation(med)}
                  className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95"
                >
                  <Pill className="w-3 h-3 text-amber-700" />
                  <span>{med.name} ({med.dosage})</span>
                  <span className="text-[10px] text-amber-700 bg-amber-200/60 px-1 rounded">
                    {med.brand}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3 Steps Guide for Donors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 bg-white rounded-3xl border border-stone-200 text-xs text-stone-600">
            <div className="font-bold text-stone-900 text-sm flex items-center gap-2 mb-1.5">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-black">1</span>
              Check Expiry & Packaging
            </div>
            Ensure medicines have at least 90 days before expiry and have intact sealed foil or original blister strips.
          </div>

          <div className="p-5 bg-white rounded-3xl border border-stone-200 text-xs text-stone-600">
            <div className="font-bold text-stone-900 text-sm flex items-center gap-2 mb-1.5">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-black">2</span>
              List on MediCycle
            </div>
            Fill medicine details, quantity, batch number, and upload packaging photo for automated safety scanning.
          </div>

          <div className="p-5 bg-white rounded-3xl border border-stone-200 text-xs text-stone-600">
            <div className="font-bold text-stone-900 text-sm flex items-center gap-2 mb-1.5">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-black">3</span>
              Pharmacist Verification & Drop
            </div>
            Drop off at nearest partner pharmacy. A licensed pharmacist confirms integrity in their portal before free patient dispensing.
          </div>
        </div>

        {/* Submitted Donations History with Sort, Filter, and Statuses */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-xl text-stone-900">
                  Your Medicine Donation History ({userDonations.length})
                </h2>
                {isTrustedDonor && (
                  <span className="bg-amber-100 text-amber-900 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-600 text-amber-600" /> Trusted Donor
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Every donation displays real-time status as verified by partner pharmacists.
              </p>
            </div>

            {/* Sort & Filter Controls (Requirement: "Keep the sort option") */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Status Filter */}
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                    statusFilter === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                  }`}
                >
                  All ({userDonations.length})
                </button>
                <button
                  onClick={() => setStatusFilter('Verified')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                    statusFilter === 'Verified' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-600'
                  }`}
                >
                  Verified ({userDonations.filter(d => d.verificationStatus === 'Verified').length})
                </button>
                <button
                  onClick={() => setStatusFilter('Pending verification')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                    statusFilter === 'Pending verification' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-600'
                  }`}
                >
                  Pending ({userDonations.filter(d => d.verificationStatus === 'Pending verification').length})
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-1.5 bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200">
                <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="bg-transparent font-semibold text-stone-800 focus:outline-none cursor-pointer"
                >
                  <option value="newest">Sort: Newest First</option>
                  <option value="oldest">Sort: Oldest First</option>
                  <option value="name">Sort: Medicine Name</option>
                  <option value="expiry">Sort: Expiry Date</option>
                </select>
              </div>
            </div>
          </div>

          {/* Donation History Items List */}
          {filteredSortedDonations.length === 0 ? (
            <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-500">
              No donations matching the selected filter.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSortedDonations.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-white transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-stone-900">
                          {item.medicineName}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-stone-200 text-stone-800">
                          {item.dosage}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-stone-200 text-stone-800">
                          Qty: {item.quantity} {item.unitType}
                        </span>
                      </div>
                      <div className="text-xs text-stone-500 mt-1 flex flex-wrap items-center gap-3">
                        <span>Donor: <strong className="text-stone-700">{item.donorName}</strong></span>
                        <span>Batch: <strong className="text-stone-700">{item.batchNumber}</strong></span>
                        <span>Expiry: <strong className="text-stone-700">{item.expiryDate}</strong></span>
                        <span>Packaging: <strong className="text-stone-700">{item.packagingCondition}</strong></span>
                        <span>Listed: <strong className="text-stone-700">{item.createdAt}</strong></span>
                      </div>
                    </div>

                    {/* Status Badge (Requirement: Shows status for every donation; Note: Verify button removed as requested) */}
                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide inline-flex items-center gap-1.5 ${
                          item.verificationStatus === 'Verified'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : item.verificationStatus === 'Pending verification'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : item.verificationStatus === 'Reserved'
                            ? 'bg-blue-100 text-blue-900 border border-blue-300'
                            : item.verificationStatus === 'Collected'
                            ? 'bg-purple-100 text-purple-900 border border-purple-300'
                            : 'bg-red-100 text-red-900 border border-red-300'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-current" />
                        {item.verificationStatus}
                      </span>
                    </div>
                  </div>

                  {item.notes && (
                    <div className="text-xs text-stone-600 bg-white p-2.5 rounded-xl border border-stone-200">
                      <span className="font-semibold text-stone-700">Storage / Notes: </span>
                      {item.notes}
                    </div>
                  )}

                  {/* Expiry / Ineligible Warning */}
                  {!item.isEligible && item.ineligibilityReason && (
                    <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-900 flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                        <span>{item.ineligibilityReason}</span>
                      </span>
                      <button
                        onClick={onNavigateToDisposal}
                        className="px-2.5 py-1 rounded-lg bg-red-200 hover:bg-red-300 text-red-900 font-bold shrink-0 text-[11px]"
                      >
                        Disposal Drop Points
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MODAL: ADD UNUSED MEDICINE DONATION */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white max-w-xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-5 my-8">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-stone-900">
                    List Donated Medicine
                  </h3>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-stone-400 hover:text-stone-700 font-bold text-lg"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitDonation} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Medicine Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Telmisartan, Metformin"
                      value={medicineName}
                      onChange={(e) => setMedicineName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Brand / Manufacturer (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Telma 40, Glycomet"
                      value={brandOrGeneric}
                      onChange={(e) => setBrandOrGeneric(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Dosage
                    </label>
                    <input
                      type="text"
                      value={dosage}
                      onChange={(e) => setDosage(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Unit Form
                    </label>
                    <select
                      value={unitType}
                      onChange={(e: any) => setUnitType(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                    >
                      <option value="tablets">Tablets</option>
                      <option value="capsules">Capsules</option>
                      <option value="strips">Strips</option>
                      <option value="bottles">Bottles</option>
                      <option value="inhalers">Inhalers</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Expiry Date * (Min. 90 days required)
                    </label>
                    <input
                      type="date"
                      required
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Batch Details / Lot #
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. BT-9921"
                      value={batchNumber}
                      onChange={(e) => setBatchNumber(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Packaging Condition *
                  </label>
                  <select
                    value={packagingCondition}
                    onChange={(e: any) => setPackagingCondition(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                  >
                    <option value="Sealed blister pack">Sealed blister pack (Intact foil pockets)</option>
                    <option value="Unopened original box">Unopened original box with intact tamper seal</option>
                    <option value="Intact foil strip">Intact foil strip</option>
                    <option value="Bottle sealed">Original sealed bottle</option>
                    <option value="Damaged/Open">Damaged / Open container (Ineligible)</option>
                  </select>
                </div>

                {/* Live Safety Assessment Bar */}
                <div className={`p-3 rounded-xl border text-xs ${
                  eligibilityCheck.isEligible
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-red-50 border-red-200 text-red-900'
                }`}>
                  {eligibilityCheck.isEligible ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        <strong>Safety Verified:</strong> {eligibilityCheck.daysRemaining} days remaining before expiry. Intact packaging meets redistribution criteria.
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 font-bold">
                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                        Ineligible for Patient Redistribution
                      </div>
                      <p className="text-[11px] text-red-800">
                        {eligibilityCheck.reason}
                      </p>
                    </div>
                  )}
                </div>

                {/* Donor Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Donor Name / Organization
                    </label>
                    <input
                      type="text"
                      required
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      required
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Pickup Location / Drop Neighborhood
                  </label>
                  <input
                    type="text"
                    value={donorLocation}
                    onChange={(e) => setDonorLocation(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Storage History Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Stored in dry temperature-controlled cabinet. Excess post-op prescription."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
                  >
                    Submit Donation Listing
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
