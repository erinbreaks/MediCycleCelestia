import React, { useState, useEffect } from 'react';
import { PharmacyInventoryItem, MedicineRequest, DonationListing, UserProfile } from '../../types';
import { 
  getInventory, 
  addPharmacyInventory, 
  updatePharmacyStock, 
  getRequests, 
  updateRequestStatus,
  getDonations,
  verifyDonation
} from '../../services/api';
import { 
  Store, 
  Plus, 
  Check, 
  ShieldCheck, 
  Clock, 
  Building2,
  Layers,
  HeartHandshake,
  AlertTriangle,
  Sparkles,
  Calendar,
  CheckCircle2
} from 'lucide-react';

interface PharmacyPortalProps {
  onInventoryUpdated: () => void;
  currentUser?: UserProfile | null;
}

export const PharmacyPortal: React.FC<PharmacyPortalProps> = ({
  onInventoryUpdated,
  currentUser
}) => {
  const [inventory, setInventory] = useState<PharmacyInventoryItem[]>([]);
  const [requests, setRequests] = useState<MedicineRequest[]>([]);
  const [donations, setDonations] = useState<DonationListing[]>([]);
  const [activeTab, setActiveTab] = useState<'inventory' | 'requests' | 'donations'>('inventory');
  const [showAddModal, setShowAddModal] = useState(false);

  // Add Inventory Form state
  const [medicineName, setMedicineName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [dosage, setDosage] = useState('500 mg');
  const [category, setCategory] = useState('General Medicine');
  const [mrp, setMrp] = useState(100);
  const [sellingPrice, setSellingPrice] = useState(80);
  const [stockQuantity, setStockQuantity] = useState(50);
  const [expiryDate, setExpiryDate] = useState('2027-10-15');
  const [batchNumber, setBatchNumber] = useState('PH-8891');
  const [isJanAushadhi, setIsJanAushadhi] = useState(false);

  // Pharmacy Profile details
  const pharmacyName = currentUser?.pharmacyName || 'CarePlus Community Pharmacy & Dispensary';
  const pharmacyLocation = currentUser?.location || '100 Feet Rd, Indiranagar, Bengaluru';
  const pharmacyPhone = currentUser?.phone || '+91 80 2528 7766';

  const refreshAll = () => {
    setInventory(getInventory());
    setRequests(getRequests());
    setDonations(getDonations());
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const handleStockQuickChange = (id: string, delta: number) => {
    const item = inventory.find(i => i.id === id);
    if (item) {
      const newQty = Math.max(0, item.stockQuantity + delta);
      updatePharmacyStock(id, newQty);
      refreshAll();
      onInventoryUpdated();
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicineName.trim()) return;

    const discountPercent = mrp > 0 ? Math.max(0, Math.round(((mrp - sellingPrice) / mrp) * 100)) : 0;

    addPharmacyInventory({
      pharmacyId: 'ph-care',
      pharmacyName,
      location: pharmacyLocation,
      phone: pharmacyPhone,
      medicineName,
      genericName,
      dosage,
      category,
      mrp,
      sellingPrice,
      discountPercent,
      stockQuantity,
      expiryDate,
      batchNumber,
      status: stockQuantity === 0 ? 'Out of Stock' : stockQuantity < 20 ? 'Low Stock' : 'In Stock',
      isJanAushadhiOrSubsidized: isJanAushadhi
    });

    refreshAll();
    setShowAddModal(false);
    onInventoryUpdated();
  };

  const handleUpdateRequest = (reqId: string, newStatus: MedicineRequest['status']) => {
    updateRequestStatus(reqId, newStatus);
    refreshAll();
    onInventoryUpdated();
  };

  const handleVerifyDonation = (donationId: string) => {
    verifyDonation(donationId);
    refreshAll();
    onInventoryUpdated();
  };

  const pendingDonations = donations.filter(d => d.verificationStatus === 'Pending verification');

  return (
    <div className="py-8 md:py-12 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold mb-2">
              <Store className="w-3.5 h-3.5 text-blue-700" /> Pharmacy Portal
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Inventory & Fulfillment Management
            </h1>
            <p className="text-stone-600 text-sm sm:text-base mt-1">
              Manage live medicine inventory, verify community donations, and process patient pickup orders.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              id="btn-add-inventory-modal"
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-blue-700/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Add Stock Inventory
            </button>
          </div>
        </div>

        {/* Pharmacy Profile Bar */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-stone-900">{pharmacyName}</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-700" /> Verified Retail Partner
                </span>
              </div>
              <div className="text-xs text-stone-500 mt-0.5">
                License # KA-BLR-2024-8891 • {pharmacyLocation} • {pharmacyPhone}
              </div>
            </div>
          </div>

          {/* Sub-Tabs: Inventory, Patient Requests, and Verify Donations */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-2xl border border-stone-200 text-xs font-bold flex-wrap">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'inventory' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-950'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              Inventory ({inventory.length})
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'requests' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-950'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              Patient Requests ({requests.length})
            </button>
            <button
              onClick={() => setActiveTab('donations')}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'donations' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-950'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
              Verify Donations ({pendingDonations.length > 0 ? `${pendingDonations.length} Pending` : donations.length})
            </button>
          </div>
        </div>

        {/* TAB 1: INVENTORY MANAGER */}
        {activeTab === 'inventory' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-xl text-stone-900">
                  Live Pharmacy Medicine Inventory ({inventory.length})
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Update stock availability and pricing to allow instant matching with scanned prescriptions.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500 font-bold uppercase text-[11px] tracking-wider">
                    <th className="pb-3">Medicine & Dosage</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">MRP / Selling Price</th>
                    <th className="pb-3">Discount</th>
                    <th className="pb-3">Stock Units</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Quick Adjust</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {inventory.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50/70">
                      <td className="py-3.5">
                        <div className="font-bold text-stone-900">{item.medicineName}</div>
                        <div className="text-[11px] text-stone-500">
                          {item.dosage} • Batch: {item.batchNumber} • Exp: {item.expiryDate}
                        </div>
                      </td>
                      <td className="py-3.5 text-stone-600">
                        {item.category}
                      </td>
                      <td className="py-3.5">
                        <span className="font-bold text-stone-900">₹{item.sellingPrice}</span>
                        <span className="text-stone-400 text-[11px] line-through ml-1.5">₹{item.mrp}</span>
                      </td>
                      <td className="py-3.5">
                        {item.discountPercent > 0 ? (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-xs font-bold">
                            {item.discountPercent}% Off
                          </span>
                        ) : (
                          <span className="text-stone-400 text-xs">Standard</span>
                        )}
                      </td>
                      <td className="py-3.5">
                        <span className="font-bold text-stone-900 text-sm">{item.stockQuantity}</span> units
                      </td>
                      <td className="py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          item.status === 'In Stock'
                            ? 'bg-emerald-100 text-emerald-900'
                            : item.status === 'Low Stock'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-red-100 text-red-900'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleStockQuickChange(item.id, -10)}
                            className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold flex items-center justify-center text-xs transition-colors"
                            title="Decrease stock by 10"
                          >
                            -10
                          </button>
                          <button
                            onClick={() => handleStockQuickChange(item.id, 10)}
                            className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold flex items-center justify-center text-xs transition-colors"
                            title="Increase stock by 10"
                          >
                            +10
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: INCOMING PATIENT REQUESTS */}
        {activeTab === 'requests' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <h2 className="font-display font-bold text-xl text-stone-900">
                  Incoming Patient Prescription Requests ({requests.length})
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Action patient requests: Accept or reject requests, mark as Reserved, or complete collection upon physical prescription verification.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-white transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-stone-900">
                          {req.medicineName} ({req.dosage})
                        </span>
                        <span className="text-xs font-mono bg-stone-200 text-stone-800 px-2 py-0.5 rounded">
                          {req.requestId}
                        </span>
                      </div>
                      <div className="text-xs text-stone-600 mt-1">
                        Patient: <strong>{req.patientName}</strong> • Phone: <strong>{req.patientPhone}</strong> • 
                        Qty: <strong>{req.quantity} units</strong> • Value: <strong>₹{req.estimatedCost}</strong>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        req.status === 'Collected'
                          ? 'bg-emerald-100 text-emerald-900'
                          : req.status === 'Reserved'
                          ? 'bg-blue-100 text-blue-900'
                          : req.status === 'Accepted'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-stone-200 text-stone-800'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                  </div>

                  {/* Actions for Pharmacy Operator */}
                  <div className="pt-2 border-t border-stone-200/60 flex flex-wrap items-center justify-between gap-2">
                    <div className="text-xs text-stone-500">
                      Instruction: “{req.collectionInstructions}”
                    </div>

                    <div className="flex items-center gap-2">
                      {req.status === 'Requested' && (
                        <>
                          <button
                            onClick={() => handleUpdateRequest(req.id, 'Accepted')}
                            className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
                          >
                            Accept Request
                          </button>
                          <button
                            onClick={() => handleUpdateRequest(req.id, 'Cancelled')}
                            className="px-3 py-1.5 rounded-xl bg-stone-200 hover:bg-red-100 text-stone-700 hover:text-red-700 font-bold text-xs"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {req.status === 'Accepted' && (
                        <button
                          onClick={() => handleUpdateRequest(req.id, 'Reserved')}
                          className="px-3 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs"
                        >
                          Mark as Reserved on Counter
                        </button>
                      )}

                      {req.status === 'Reserved' && (
                        <button
                          onClick={() => handleUpdateRequest(req.id, 'Collected')}
                          className="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          Verify Rx & Mark Collected
                        </button>
                      )}

                      {req.status === 'Collected' && (
                        <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Order Completed & Handed Over
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: INCOMING DONATION VERIFICATION (Requirement: Pharmacist verifies donations here) */}
        {activeTab === 'donations' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <h2 className="font-display font-bold text-xl text-stone-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  Pharmacist Medicine Donation Verification Protocol
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Verify packaging integrity, minimum 90-day expiry threshold, and physical tamper seal before approving for free patient dispensing.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {donations.map((item) => (
                <div
                  key={item.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    item.verificationStatus === 'Pending verification'
                      ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                      : 'bg-stone-50/60 border-stone-200'
                  }`}
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
                      <div className="text-xs text-stone-600 mt-1 flex flex-wrap items-center gap-3">
                        <span>Donor: <strong>{item.donorName}</strong> ({item.donorPhone})</span>
                        <span>Batch: <strong>{item.batchNumber}</strong></span>
                        <span>Expiry: <strong>{item.expiryDate}</strong></span>
                        <span>Packaging: <strong>{item.packagingCondition}</strong></span>
                      </div>
                    </div>

                    {/* Verification Actions */}
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        item.verificationStatus === 'Verified'
                          ? 'bg-emerald-100 text-emerald-900'
                          : item.verificationStatus === 'Pending verification'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-blue-100 text-blue-900'
                      }`}>
                        {item.verificationStatus}
                      </span>

                      {item.verificationStatus === 'Pending verification' && (
                        <button
                          onClick={() => handleVerifyDonation(item.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
                          title="Verify packaging seal and approve for redistribution"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Verify & Approve Donation
                        </button>
                      )}

                      {item.verificationStatus === 'Verified' && (
                        <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Verified by Pharmacist
                        </span>
                      )}
                    </div>
                  </div>

                  {item.notes && (
                    <div className="mt-2 text-xs text-stone-600 bg-white p-2.5 rounded-xl border border-stone-200">
                      <strong>Donor Notes:</strong> {item.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODAL: ADD INVENTORY */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-4 my-8">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="font-display font-bold text-xl text-stone-900">
                  Add Stock to Pharmacy Inventory
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-stone-400 hover:text-stone-700 font-bold text-lg"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Medicine Trade / Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Metformin 500mg, Atorvastatin 10mg"
                    value={medicineName}
                    onChange={(e) => setMedicineName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Generic Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Metformin"
                      value={genericName}
                      onChange={(e) => setGenericName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Dosage Strength
                    </label>
                    <input
                      type="text"
                      value={dosage}
                      onChange={(e) => setDosage(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      MRP (₹)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={mrp}
                      onChange={(e) => setMrp(parseFloat(e.target.value) || 0)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Selling Price (₹)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Stock Units
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={stockQuantity}
                      onChange={(e) => setStockQuantity(parseInt(e.target.value) || 0)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Batch Number
                    </label>
                    <input
                      type="text"
                      value={batchNumber}
                      onChange={(e) => setBatchNumber(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700">
                    <input
                      type="checkbox"
                      checked={isJanAushadhi}
                      onChange={(e) => setIsJanAushadhi(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    Mark as Subsidized / Generic Jan Aushadhi item
                  </label>
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
                    className="px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-xs active:scale-95"
                  >
                    Save to Stock
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
