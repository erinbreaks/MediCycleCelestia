import React, { useState, useEffect, useRef } from 'react';
import { 
  PrescriptionScanResult, 
  ExtractedMedicine, 
  PriceComparisonSource, 
  MedicineAvailabilitySource,
  MedicineRequest,
  AvailabilitySourceType
} from '../../types';
import { 
  scanPrescriptionApi, 
  findMedicineAvailability, 
  createMedicineRequest, 
  getRequests, 
  getSavedPrescriptions 
} from '../../services/api';
import { SAMPLE_PRESCRIPTIONS } from '../../data/mockData';
import { 
  Upload, 
  FileText, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Coins, 
  Phone, 
  MapPin, 
  Clock, 
  Plus, 
  Trash2, 
  Edit3, 
  Heart, 
  ShieldCheck, 
  Check, 
  Mic, 
  RefreshCw, 
  ArrowRight,
  Info,
  Calendar
} from 'lucide-react';

interface PatientPortalProps {
  initialSearchQuery?: string;
  selectedSampleRxId?: string;
  onRequestCreated: () => void;
}

export const PatientPortal: React.FC<PatientPortalProps> = ({
  initialSearchQuery,
  selectedSampleRxId,
  onRequestCreated
}) => {
  // Navigation tabs within patient portal
  const [activeTab, setActiveTab] = useState<'scan' | 'availability' | 'price' | 'history'>('scan');

  // Scanner state
  const [isScanning, setIsScanning] = useState(false);
  const [activePrescription, setActivePrescription] = useState<PrescriptionScanResult | null>(null);
  const [medicinesList, setMedicinesList] = useState<ExtractedMedicine[]>([]);
  const [editingMedId, setEditingMedId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; dosage: string; quantity: string }>({
    name: '',
    dosage: '',
    quantity: ''
  });

  // Availability & Comparison state
  const [sourcesByMed, setSourcesByMed] = useState<Record<string, MedicineAvailabilitySource[]>>({});
  const [comparisonOptions, setComparisonOptions] = useState<PriceComparisonSource[]>([]);
  const [selectedMedForDetail, setSelectedMedForDetail] = useState<string | null>(null);

  // Request modal state
  const [requestModalSource, setRequestModalSource] = useState<{
    source: MedicineAvailabilitySource;
    medicine: ExtractedMedicine;
  } | null>(null);
  const [patientName, setPatientName] = useState('Ananya Sen');
  const [patientPhone, setPatientPhone] = useState('+91 98451 99221');
  const [patientLocation, setPatientLocation] = useState('Indiranagar, Bengaluru');
  const [requestNotes, setRequestNotes] = useState('');
  const [isSubmittingReq, setIsSubmittingReq] = useState(false);
  const [successReq, setSuccessReq] = useState<MedicineRequest | null>(null);

  // History state
  const [requestsHistory, setRequestsHistory] = useState<MedicineRequest[]>([]);
  const [savedPrescriptions, setSavedPrescriptions] = useState<PrescriptionScanResult[]>([]);

  // Voice input
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load initial data
  useEffect(() => {
    setRequestsHistory(getRequests());
    setSavedPrescriptions(getSavedPrescriptions());
  }, []);

  // Handle selected sample Rx from hero
  useEffect(() => {
    if (selectedSampleRxId) {
      const sample = SAMPLE_PRESCRIPTIONS.find(s => s.id === selectedSampleRxId) || SAMPLE_PRESCRIPTIONS[0];
      handleLoadPrescription(sample);
    }
  }, [selectedSampleRxId]);

  // Handle quick search query from hero
  useEffect(() => {
    if (initialSearchQuery) {
      handleManualAddMedicine(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  const handleLoadPrescription = (rx: PrescriptionScanResult) => {
    setActivePrescription(rx);
    setMedicinesList(rx.medicines);
    const { sourcesByMed: sm, comparisonOptions: co } = findMedicineAvailability(rx.medicines);
    setSourcesByMed(sm);
    setComparisonOptions(co);
    if (rx.medicines.length > 0) {
      setSelectedMedForDetail(rx.medicines[0].id);
    }
    setActiveTab('scan');
  };

  // Upload file handler
  const handleFileUpload = async (file: File) => {
    setIsScanning(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        const scanResult = await scanPrescriptionApi({
          imageBase64: base64,
          mimeType: file.type || 'image/jpeg',
          fileName: file.name
        });
        handleLoadPrescription(scanResult);
        setIsScanning(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setIsScanning(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Voice speech recognition
  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice recognition not supported in this browser. Please type medicine details.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleManualAddMedicine(transcript);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Manual Medicine Editing & Confirmation (Requirement: "option to manually change the name of any medicine anytime")
  const startEditMedicine = (med: ExtractedMedicine) => {
    setEditingMedId(med.id);
    setEditForm({
      name: med.name,
      dosage: med.dosage,
      quantity: med.quantity
    });
  };

  const saveEditMedicine = (medId: string) => {
    const updated = medicinesList.map(m => {
      if (m.id === medId) {
        return {
          ...m,
          name: editForm.name.trim() || m.name,
          dosage: editForm.dosage.trim() || m.dosage,
          quantity: editForm.quantity.trim() || m.quantity,
          needsVerification: false, // User confirmed manually!
          edited: true
        };
      }
      return m;
    });
    setMedicinesList(updated);
    setEditingMedId(null);

    // Refresh matching availability
    const { sourcesByMed: sm, comparisonOptions: co } = findMedicineAvailability(updated);
    setSourcesByMed(sm);
    setComparisonOptions(co);
  };

  const confirmMedicineName = (medId: string) => {
    const updated = medicinesList.map(m => {
      if (m.id === medId) {
        return { ...m, needsVerification: false };
      }
      return m;
    });
    setMedicinesList(updated);
  };

  const removeMedicine = (medId: string) => {
    const updated = medicinesList.filter(m => m.id !== medId);
    setMedicinesList(updated);
    const { sourcesByMed: sm, comparisonOptions: co } = findMedicineAvailability(updated);
    setSourcesByMed(sm);
    setComparisonOptions(co);
    if (selectedMedForDetail === medId && updated.length > 0) {
      setSelectedMedForDetail(updated[0].id);
    }
  };

  const handleManualAddMedicine = (rawName: string) => {
    const newMed: ExtractedMedicine = {
      id: `med-custom-${Date.now()}`,
      name: rawName || 'Metformin Hydrochloride',
      dosage: '500 mg',
      quantity: '30 tablets',
      instructions: 'As directed by physician',
      confidence: 100,
      needsVerification: false,
      edited: true
    };
    const updated = [...medicinesList, newMed];
    setMedicinesList(updated);

    if (!activePrescription) {
      setActivePrescription({
        id: `rx-manual-${Date.now()}`,
        patientName: 'Self (Prescription Search)',
        doctorName: 'Prescribing Physician',
        clinicName: 'Verified Healthcare Provider',
        date: new Date().toISOString().split('T')[0],
        confidenceScore: 100,
        createdAt: new Date().toISOString(),
        medicines: updated
      });
    }

    const { sourcesByMed: sm, comparisonOptions: co } = findMedicineAvailability(updated);
    setSourcesByMed(sm);
    setComparisonOptions(co);
    setSelectedMedForDetail(newMed.id);
  };

  // Submit request handler
  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestModalSource) return;

    setIsSubmittingReq(true);
    try {
      const created = createMedicineRequest({
        patientName,
        patientPhone,
        patientLocation,
        medicineName: requestModalSource.medicine.name,
        dosage: requestModalSource.medicine.dosage,
        quantity: parseInt(requestModalSource.medicine.quantity) || 30,
        source: requestModalSource.source,
        prescriptionId: activePrescription?.id,
        notes: requestNotes
      });

      setSuccessReq(created);
      setRequestsHistory(getRequests());
      setIsSubmittingReq(false);
      onRequestCreated();
    } catch {
      setIsSubmittingReq(false);
    }
  };

  return (
    <div className="py-8 md:py-12 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Patient Portal
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Prescription Scanner & Affordable Medicine Finder
            </h1>
            <p className="text-stone-600 text-sm sm:text-base mt-1">
              Upload your prescription to locate nearby pharmacy stock, generic options, and 100% free eligible donations.
            </p>
          </div>

          {/* Sub-Tabs Navigation */}
          <div className="flex items-center gap-1 bg-stone-200/80 p-1 rounded-2xl border border-stone-300/80 self-start md:self-auto text-xs font-bold">
            <button
              id="tab-btn-scan"
              onClick={() => setActiveTab('scan')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'scan' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              1. Scan & Edit
            </button>
            <button
              id="tab-btn-availability"
              onClick={() => setActiveTab('availability')}
              disabled={medicinesList.length === 0}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'availability'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : medicinesList.length === 0
                  ? 'text-stone-400 cursor-not-allowed'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-emerald-600" />
              2. Availability Finder
            </button>
            <button
              id="tab-btn-price"
              onClick={() => setActiveTab('price')}
              disabled={medicinesList.length === 0}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'price'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : medicinesList.length === 0
                  ? 'text-stone-400 cursor-not-allowed'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Coins className="w-3.5 h-3.5 text-amber-600" />
              3. Price Comparison
            </button>
            <button
              id="tab-btn-history"
              onClick={() => setActiveTab('history')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'history' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              Requests ({requestsHistory.length})
            </button>
          </div>
        </div>

        {/* TAB 1: SCAN & EDIT MEDICINES */}
        {activeTab === 'scan' && (
          <div className="space-y-8">
            {/* Upload Prescription Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="max-w-xl">
                  <h2 className="font-display font-bold text-xl text-stone-900 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-emerald-700" />
                    Feature 1: AI Prescription Scanner
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 mt-1">
                    Upload doctor prescription photo, PDF, or scan. Gemini AI extracts medicines, dosages, and quantities with confidence scoring and manual editing safeguards.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    id="btn-voice-input-rx"
                    onClick={handleVoiceInput}
                    className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                      isListening
                        ? 'bg-red-500 text-white border-red-600 animate-pulse'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-300'
                    }`}
                  >
                    <Mic className="w-4 h-4 text-emerald-600" />
                    {isListening ? 'Listening...' : 'Voice-First Access'}
                  </button>

                  <button
                    id="btn-load-sample-rx-1"
                    onClick={() => handleLoadPrescription(SAMPLE_PRESCRIPTIONS[0])}
                    className="px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-semibold transition-colors"
                  >
                    Demo: Diabetes Rx (94% Conf.)
                  </button>

                  <button
                    id="btn-load-sample-rx-2"
                    onClick={() => handleLoadPrescription(SAMPLE_PRESCRIPTIONS[1])}
                    className="px-3.5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold transition-colors"
                  >
                    Demo: Ambiguous Handwriting (Alert Flag)
                  </button>
                </div>
              </div>

              {/* Drag & Drop Upload Zone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="mt-6 border-2 border-dashed border-stone-300 hover:border-emerald-600 rounded-3xl p-8 text-center cursor-pointer bg-stone-50/70 hover:bg-emerald-50/30 transition-colors"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                />
                <div className="w-14 h-14 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center justify-center mx-auto text-emerald-700 mb-3">
                  {isScanning ? (
                    <RefreshCw className="w-7 h-7 animate-spin text-emerald-600" />
                  ) : (
                    <Upload className="w-7 h-7" />
                  )}
                </div>
                <div className="font-bold text-stone-900 text-base">
                  {isScanning ? 'Extracting Medicines with Gemini OCR...' : 'Click or Drag & Drop Prescription Photo / PDF'}
                </div>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  Supports JPG, PNG, WEBP, and PDF files. Handwritten clinic prescriptions and printed hospital discharge summaries.
                </p>
              </div>
            </div>

            {/* Extracted Medicines Card */}
            {medicinesList.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-display font-bold text-xl text-stone-900">
                        Extracted Prescribed Medicines ({medicinesList.length})
                      </h2>
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full">
                        Scan Verified
                      </span>
                    </div>
                    {activePrescription && (
                      <p className="text-xs text-stone-500 mt-1">
                        Doctor: <span className="font-medium text-stone-700">{activePrescription.doctorName}</span> • 
                        Patient: <span className="font-medium text-stone-700">{activePrescription.patientName}</span> • 
                        Date: <span className="font-medium text-stone-700">{activePrescription.date}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id="btn-add-manual-med"
                      onClick={() => handleManualAddMedicine('New Prescribed Medicine')}
                      className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Medicine
                    </button>
                    <button
                      id="btn-proceed-availability"
                      onClick={() => setActiveTab('availability')}
                      className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <span>Find Availability</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Medicine Items List */}
                <div className="space-y-4">
                  {medicinesList.map((med) => (
                    <div
                      key={med.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                        med.needsVerification
                          ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-300/50'
                          : 'bg-stone-50/80 border-stone-200 hover:border-emerald-300'
                      }`}
                    >
                      {editingMedId === med.id ? (
                        /* Inline Edit Form (Tab 1 Requirement: "option to manually change the name of any medicine anytime") */
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-stone-700 mb-1">
                                Medicine Name
                              </label>
                              <input
                                type="text"
                                value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                className="w-full text-xs sm:text-sm p-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-stone-700 mb-1">
                                Dosage Strength
                              </label>
                              <input
                                type="text"
                                value={editForm.dosage}
                                onChange={(e) => setEditForm({ ...editForm, dosage: e.target.value })}
                                className="w-full text-xs sm:text-sm p-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-stone-700 mb-1">
                                Quantity Prescribed
                              </label>
                              <input
                                type="text"
                                value={editForm.quantity}
                                onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })}
                                className="w-full text-xs sm:text-sm p-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-end gap-2 pt-2">
                            <button
                              onClick={() => setEditingMedId(null)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-200"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => saveEditMedicine(med.id)}
                              className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800"
                            >
                              Save & Update Availability
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Standard Display */
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-bold text-base text-stone-900">
                                {med.name}
                              </span>
                              <span className="px-2 py-0.5 rounded-md bg-stone-200 text-stone-800 text-xs font-semibold">
                                {med.dosage}
                              </span>
                              <span className="px-2 py-0.5 rounded-md bg-stone-200 text-stone-800 text-xs font-semibold">
                                Qty: {med.quantity}
                              </span>
                              {med.edited && (
                                <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                  Manually Edited
                                </span>
                              )}
                            </div>

                            {med.instructions && (
                              <p className="text-xs text-stone-600 italic">
                                “{med.instructions}”
                              </p>
                            )}

                            {/* CRITICAL TAB 1 REQUIREMENT: If AI is unsure, display: "Please verify this medicine name before continuing." */}
                            {med.needsVerification && (
                              <div className="mt-2 p-2.5 bg-amber-100/90 rounded-xl border border-amber-300 text-amber-900 text-xs font-medium flex items-center justify-between gap-2">
                                <span className="flex items-center gap-1.5">
                                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                                  <strong>Please verify this medicine name before continuing.</strong>
                                  <span className="text-stone-600 hidden md:inline">
                                    (Handwriting ambiguous or OCR confidence: {med.confidence}%)
                                  </span>
                                </span>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <button
                                    onClick={() => startEditMedicine(med)}
                                    className="px-2.5 py-1 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950 text-xs font-bold"
                                  >
                                    Edit Name
                                  </button>
                                  <button
                                    onClick={() => confirmMedicineName(med.id)}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1"
                                  >
                                    <Check className="w-3 h-3" /> Confirm Correct
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              med.confidence >= 90
                                ? 'bg-emerald-100 text-emerald-800'
                                : med.confidence >= 80
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {med.confidence}% Match
                            </span>

                            <button
                              onClick={() => startEditMedicine(med)}
                              title="Edit medicine name or dosage"
                              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => removeMedicine(med.id)}
                              title="Delete medicine"
                              className="p-1.5 rounded-lg text-stone-400 hover:text-red-700 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MEDICINE AVAILABILITY FINDER */}
        {activeTab === 'availability' && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-100">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1.5">
                    Feature 2 • Medicine Availability Finder
                  </div>
                  <h2 className="font-display font-bold text-2xl text-stone-900">
                    Nearby Pharmacies, Donated Stock & Discounted Sources
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 mt-1">
                    Showing verified inventory matched to your scanned prescription in Bengaluru.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('price')}
                  className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors self-start md:self-auto"
                >
                  <Coins className="w-4 h-4" />
                  Compare All Source Prices
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Medicine Selector Pills */}
              <div className="mt-6 flex flex-wrap gap-2">
                {medicinesList.map(med => (
                  <button
                    key={med.id}
                    onClick={() => setSelectedMedForDetail(med.id)}
                    className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                      selectedMedForDetail === med.id
                        ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    <span>{med.name}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      selectedMedForDetail === med.id ? 'bg-emerald-900/60 text-emerald-100' : 'bg-stone-200 text-stone-600'
                    }`}>
                      {(sourcesByMed[med.id] || []).length} sources
                    </span>
                  </button>
                ))}
              </div>

              {/* Sources for Selected Medicine */}
              {selectedMedForDetail && (
                <div className="mt-6 space-y-4">
                  {(() => {
                    const currentMed = medicinesList.find(m => m.id === selectedMedForDetail);
                    const sources = sourcesByMed[selectedMedForDetail] || [];

                    if (!currentMed) return null;

                    if (sources.length === 0) {
                      return (
                        <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200">
                          <p className="text-stone-600 font-medium">
                            No immediate inventory matched for “{currentMed.name}”.
                          </p>
                          <p className="text-xs text-stone-500 mt-1">
                            We have broadcasted an anonymous request to 24 partner pharmacies. You can also edit the medicine name if needed.
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {sources.map(src => (
                          <div
                            key={src.id}
                            className={`p-5 rounded-3xl border transition-all ${
                              src.isDonation
                                ? 'bg-gradient-to-br from-amber-50/90 to-orange-50/70 border-amber-300 shadow-xs'
                                : src.sourceType === 'jan_aushadhi'
                                ? 'bg-emerald-50/60 border-emerald-300'
                                : 'bg-white border-stone-200 hover:border-stone-300'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-display font-bold text-base text-stone-900">
                                    {src.providerName}
                                  </span>
                                </div>
                                {src.isDonation ? (
                                  <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                                    <Heart className="w-3 h-3 fill-amber-700 text-amber-700" />
                                    100% Free Donated Stock
                                  </span>
                                ) : src.sourceType === 'jan_aushadhi' ? (
                                  <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                                    <ShieldCheck className="w-3 h-3 text-emerald-800" />
                                    Subsidized Jan Aushadhi Generic
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-semibold text-stone-500">
                                    Commercial Pharmacy
                                  </span>
                                )}
                              </div>

                              {/* Price Pill */}
                              <div className="text-right">
                                {src.isDonation ? (
                                  <div>
                                    <div className="text-lg font-black text-amber-800">FREE</div>
                                    <div className="text-[10px] text-stone-500 line-through">MRP ₹{src.unitPrice}</div>
                                  </div>
                                ) : (
                                  <div>
                                    <div className="text-lg font-black text-stone-900">₹{src.finalPrice}</div>
                                    {src.discountPercent ? (
                                      <div className="text-[11px] text-emerald-700 font-semibold">
                                        {src.discountPercent}% Off MRP ₹{src.unitPrice}
                                      </div>
                                    ) : (
                                      <div className="text-[10px] text-stone-500">Estimated cost</div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Location & Packaging */}
                            <div className="mt-4 pt-3 border-t border-stone-200/60 space-y-1.5 text-xs text-stone-600">
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                                <span>{src.address} ({src.distanceKm} km away)</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                                <span>{src.phone}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>Packaging: {src.packagingCondition} • Expiry: {src.expiryDate}</span>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-5 flex items-center justify-between gap-2">
                              <a
                                href={`tel:${src.phone}`}
                                className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition-colors"
                              >
                                Contact
                              </a>

                              <button
                                id={`btn-reserve-${src.id}`}
                                onClick={() => setRequestModalSource({ source: src, medicine: currentMed })}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                                  src.isDonation
                                    ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                                    : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                                }`}
                              >
                                {src.isDonation ? 'Request Donation & Reserve' : 'Reserve at Pharmacy'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: PRICE COMPARISON TABLE (Feature 3 from Tab 1) */}
        {activeTab === 'price' && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs">
              <div className="max-w-3xl mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
                  Feature 3 • Multi-Source Price Comparison
                </div>
                <h2 className="font-display font-bold text-2xl text-stone-900">
                  Estimated Total Prescription Cost Comparison
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  Based on prototype inventory across connected retail pharmacies, government Jan Aushadhi generic outlets, and verified community donations.
                </p>
                <div className="mt-2 text-xs text-stone-500 italic bg-stone-100 px-3 py-1.5 rounded-lg inline-block">
                  * Clearly labeled as an estimate based on current verified supplies.
                </div>
              </div>

              {/* Side by side comparison cards matching prompt example */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {comparisonOptions.map((opt) => (
                  <div
                    key={opt.id}
                    className={`p-6 rounded-3xl border flex flex-col justify-between relative transition-all ${
                      opt.isLowestCost
                        ? 'bg-gradient-to-b from-emerald-50 to-white border-emerald-500 ring-2 ring-emerald-500/30 shadow-md'
                        : 'bg-stone-50/70 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    {opt.isLowestCost && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-700 text-white text-[11px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Lowest Estimated Cost
                      </div>
                    )}

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
                        {opt.type === 'hybrid_donation'
                          ? 'Smart Hybrid Match'
                          : opt.type === 'jan_aushadhi'
                          ? 'Govt Generics'
                          : 'Retail Pharmacy'}
                      </div>
                      <h3 className="font-display font-bold text-base text-stone-900 leading-snug">
                        {opt.sourceName}
                      </h3>

                      {/* Total Cost Display */}
                      <div className="my-5">
                        <div className="text-xs text-stone-500">Total Estimated Cost</div>
                        <div className="text-3xl font-display font-black text-stone-900 mt-0.5">
                          ₹{opt.totalCost}
                        </div>
                        {opt.savingsVsMrp > 0 && (
                          <div className="text-xs text-emerald-700 font-bold mt-1">
                            Save approx. ₹{opt.savingsVsMrp} vs MRP
                          </div>
                        )}
                      </div>

                      {/* Itemized breakdown */}
                      <div className="space-y-2 pt-3 border-t border-stone-200/70 text-xs">
                        <div className="font-semibold text-stone-700 text-[11px] uppercase tracking-wide">
                          Prescription Items:
                        </div>
                        {opt.breakdown.map((b, i) => (
                          <div key={i} className="flex justify-between items-center text-stone-600">
                            <span className="truncate max-w-[140px]">{b.medicineName}</span>
                            <span className="font-bold">
                              {b.isDonated ? (
                                <span className="text-amber-700 font-extrabold">FREE (Donated)</span>
                              ) : (
                                `₹${b.price}`
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-stone-200/80">
                      <div className="text-[11px] text-stone-500 mb-3">
                        {opt.address} ({opt.distanceKm} km away)
                      </div>
                      <button
                        onClick={() => setActiveTab('availability')}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold transition-colors ${
                          opt.isLowestCost
                            ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                            : 'bg-stone-200 hover:bg-stone-300 text-stone-800'
                        }`}
                      >
                        {opt.isLowestCost ? 'Select Smart Combo' : 'View Stock'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: REQUEST HISTORY & SAVED PRESCRIPTIONS (Feature 6) */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold mb-1.5">
                    Feature 6 • Medicine Request System
                  </div>
                  <h2 className="font-display font-bold text-2xl text-stone-900">
                    Active & Historic Medicine Requests
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 mt-1">
                    Lifecycle tracker: <span className="font-semibold text-stone-800">Requested → Accepted → Reserved → Collected</span>
                  </p>
                </div>
              </div>

              {requestsHistory.length === 0 ? (
                <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200">
                  <p className="text-stone-600">No requests submitted yet.</p>
                  <button
                    onClick={() => setActiveTab('scan')}
                    className="mt-3 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold"
                  >
                    Scan a Prescription to Start
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {requestsHistory.map((req) => (
                    <div
                      key={req.id}
                      className="p-5 rounded-2xl border border-stone-200 bg-stone-50/60 hover:bg-white transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-base text-stone-900">
                              {req.medicineName} ({req.dosage})
                            </span>
                            <span className="text-xs bg-stone-200 text-stone-700 px-2 py-0.5 rounded-md font-mono">
                              {req.requestId}
                            </span>
                          </div>
                          <div className="text-xs text-stone-500 mt-0.5">
                            Provider: <span className="font-medium text-stone-700">{req.providerName}</span> • 
                            Qty: <span className="font-medium text-stone-700">{req.quantity} units</span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide inline-flex items-center gap-1 ${
                              req.status === 'Collected'
                                ? 'bg-emerald-100 text-emerald-900'
                                : req.status === 'Reserved'
                                ? 'bg-blue-100 text-blue-900'
                                : req.status === 'Accepted'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-stone-200 text-stone-800'
                            }`}
                          >
                            <span className="w-2 h-2 rounded-full bg-current" />
                            {req.status}
                          </span>
                        </div>
                      </div>

                      {/* Request Lifecycle Steps */}
                      <div className="grid grid-cols-4 gap-2 pt-2 text-center text-[11px] font-semibold text-stone-400">
                        <div className={`p-1.5 rounded-lg ${req.status ? 'bg-emerald-50 text-emerald-800' : 'bg-stone-100'}`}>
                          1. Requested
                        </div>
                        <div className={`p-1.5 rounded-lg ${['Accepted', 'Reserved', 'Collected'].includes(req.status) ? 'bg-emerald-50 text-emerald-800' : 'bg-stone-100'}`}>
                          2. Accepted
                        </div>
                        <div className={`p-1.5 rounded-lg ${['Reserved', 'Collected'].includes(req.status) ? 'bg-emerald-50 text-emerald-800' : 'bg-stone-100'}`}>
                          3. Reserved
                        </div>
                        <div className={`p-1.5 rounded-lg ${req.status === 'Collected' ? 'bg-emerald-600 text-white' : 'bg-stone-100'}`}>
                          4. Collected
                        </div>
                      </div>

                      {/* Collection Instructions */}
                      <div className="p-3 bg-white rounded-xl border border-stone-200/80 text-xs text-stone-600 flex items-start gap-2">
                        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-stone-800">Collection Instructions: </span>
                          {req.collectionInstructions}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL: SUBMIT MEDICINE REQUEST / DONATION RESERVATION */}
        {requestModalSource && (
          <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="font-display font-bold text-xl text-stone-900">
                  {requestModalSource.source.isDonation ? 'Request Free Donated Medicine' : 'Reserve Pharmacy Medicine'}
                </h3>
                <button
                  onClick={() => {
                    setRequestModalSource(null);
                    setSuccessReq(null);
                  }}
                  className="text-stone-400 hover:text-stone-700 font-bold text-lg"
                >
                  ✕
                </button>
              </div>

              {successReq ? (
                /* Success screen */
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-xl text-stone-900">
                      Request Confirmed!
                    </h4>
                    <p className="text-xs text-stone-500 mt-1">
                      Request ID: <span className="font-mono font-bold text-stone-800">{successReq.requestId}</span>
                    </p>
                  </div>
                  <div className="p-4 bg-stone-50 rounded-2xl text-xs text-stone-600 text-left space-y-1 border border-stone-200">
                    <p><strong>Provider:</strong> {successReq.providerName}</p>
                    <p><strong>Address:</strong> {successReq.providerAddress}</p>
                    <p><strong>Instructions:</strong> {successReq.collectionInstructions}</p>
                  </div>
                  <button
                    onClick={() => {
                      setRequestModalSource(null);
                      setSuccessReq(null);
                      setActiveTab('history');
                    }}
                    className="w-full py-3 rounded-xl bg-emerald-700 text-white text-xs font-bold shadow-xs hover:bg-emerald-800"
                  >
                    View in Request History
                  </button>
                </div>
              ) : (
                /* Form */
                <form onSubmit={handleSubmitRequest} className="space-y-4">
                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-700 space-y-1">
                    <div className="font-bold text-stone-900">
                      {requestModalSource.medicine.name} ({requestModalSource.medicine.dosage})
                    </div>
                    <div>Source: {requestModalSource.source.providerName}</div>
                    <div className="font-semibold text-emerald-800">
                      Estimated Cost: {requestModalSource.source.isDonation ? 'FREE (Donated)' : `₹${requestModalSource.source.finalPrice}`}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Patient Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Contact Phone (for pickup SMS & confirmation)
                    </label>
                    <input
                      type="tel"
                      required
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Delivery / Pickup Area
                    </label>
                    <input
                      type="text"
                      value={patientLocation}
                      onChange={(e) => setPatientLocation(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Optional Notes (Doctor instructions or urgent timing)
                    </label>
                    <textarea
                      rows={2}
                      value={requestNotes}
                      onChange={(e) => setRequestNotes(e.target.value)}
                      placeholder="e.g. Need by evening, caregiver collecting on behalf"
                      className="w-full p-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900">
                    ⚠️ <strong>Clinical Safeguard:</strong> Bring your original physical doctor's prescription when collecting. Pharmacist will verify before dispensing.
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setRequestModalSource(null)}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingReq}
                      className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs flex items-center gap-2"
                    >
                      {isSubmittingReq ? 'Reserving...' : 'Confirm Request'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
