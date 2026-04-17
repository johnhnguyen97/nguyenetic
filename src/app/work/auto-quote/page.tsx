"use client";

import { useState, useRef, useEffect, useCallback, useReducer } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { LeadCapture } from "@/components/ui/lead-capture";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PhotoFile {
  id: string;
  url: string;
  name: string;
}

interface VehicleInfo {
  make: string;
  model: string;
  year: string;
  trim: string;
  color: string;
  odometer: string;
  vin: string;
}

interface PackageAddons {
  ceramic: boolean;
  wheelCoating: boolean;
  interiorProtection: boolean;
  headlightRestoration: boolean;
  rushScheduling: boolean;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  dropoffDate: string;
  concerns: string;
}

interface AppState {
  step: number;
  photos: PhotoFile[];
  vehicle: VehicleInfo;
  selectedPackage: string;
  addons: PackageAddons;
  customer: CustomerInfo;
  signatureDataUrl: string;
  termsAccepted: boolean;
  depositPaid: boolean;
}

type AppAction =
  | { type: "SET_STEP"; payload: number }
  | { type: "ADD_PHOTOS"; payload: PhotoFile[] }
  | { type: "REMOVE_PHOTO"; payload: string }
  | { type: "SET_VEHICLE"; payload: Partial<VehicleInfo> }
  | { type: "SET_PACKAGE"; payload: string }
  | { type: "TOGGLE_ADDON"; payload: keyof PackageAddons }
  | { type: "SET_CUSTOMER"; payload: Partial<CustomerInfo> }
  | { type: "SET_SIGNATURE"; payload: string }
  | { type: "SET_TERMS"; payload: boolean }
  | { type: "SET_DEPOSIT_PAID"; payload: boolean }
  | { type: "LOAD_STATE"; payload: AppState };

const defaultState: AppState = {
  step: 1,
  photos: [],
  vehicle: { make: "", model: "", year: "", trim: "", color: "", odometer: "", vin: "" },
  selectedPackage: "",
  addons: { ceramic: false, wheelCoating: false, interiorProtection: false, headlightRestoration: false, rushScheduling: false },
  customer: { name: "", email: "", phone: "", dropoffDate: "", concerns: "" },
  signatureDataUrl: "",
  termsAccepted: false,
  depositPaid: false,
};

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_STEP": return { ...state, step: action.payload };
    case "ADD_PHOTOS": return { ...state, photos: [...state.photos, ...action.payload].slice(0, 12) };
    case "REMOVE_PHOTO": return { ...state, photos: state.photos.filter(p => p.id !== action.payload) };
    case "SET_VEHICLE": return { ...state, vehicle: { ...state.vehicle, ...action.payload } };
    case "SET_PACKAGE": return { ...state, selectedPackage: action.payload };
    case "TOGGLE_ADDON": return { ...state, addons: { ...state.addons, [action.payload]: !state.addons[action.payload] } };
    case "SET_CUSTOMER": return { ...state, customer: { ...state.customer, ...action.payload } };
    case "SET_SIGNATURE": return { ...state, signatureDataUrl: action.payload };
    case "SET_TERMS": return { ...state, termsAccepted: action.payload };
    case "SET_DEPOSIT_PAID": return { ...state, depositPaid: action.payload };
    case "LOAD_STATE": return action.payload;
    default: return state;
  }
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const MAKES_MODELS: Record<string, string[]> = {
  Tesla: ["Model 3", "Model Y", "Model S", "Model X", "Cybertruck"],
  BMW: ["3 Series", "5 Series", "7 Series", "X5", "M3"],
  Mercedes: ["C-Class", "E-Class", "S-Class", "GLE", "AMG GT"],
  Audi: ["A4", "A6", "Q5", "Q7", "R8"],
  Porsche: ["911", "Cayenne", "Panamera", "Taycan", "Macan"],
  Toyota: ["Camry", "Corolla", "RAV4", "Tacoma", "Supra"],
  Honda: ["Civic", "Accord", "CR-V", "HR-V", "Pilot"],
  Ford: ["F-150", "Mustang", "Explorer", "Edge", "Bronco"],
  Chevrolet: ["Silverado", "Camaro", "Corvette", "Equinox", "Tahoe"],
  Dodge: ["Challenger", "Charger", "Durango", "Ram 1500", "Viper"],
  Lamborghini: ["Huracán", "Urus", "Revuelto", "Sián", "Gallardo"],
  Ferrari: ["488", "F8", "SF90", "Roma", "Purosangue"],
  Rivian: ["R1T", "R1S", "R2", "R3", "EDV"],
  Lucid: ["Air Pure", "Air Touring", "Air Grand Touring", "Air Sapphire", "Gravity"],
  Lexus: ["ES", "IS", "GS", "LS", "LC 500"],
};

const YEARS = Array.from({ length: 20 }, (_, i) => String(2025 - i));
const TRIMS = ["Base", "Sport", "Touring", "Premium", "Limited", "Performance", "Executive", "Signature"];
const COLORS = [
  { name: "Black", value: "#0a0a0a" },
  { name: "White", value: "#f5f5f0" },
  { name: "Silver", value: "#c0c0c0" },
  { name: "Gray", value: "#6b6b6b" },
  { name: "Red", value: "#c0392b" },
  { name: "Blue", value: "#1a4a8a" },
  { name: "Orange", value: "#e55a1c" },
  { name: "Yellow", value: "#f0c030" },
];

interface Package {
  id: string;
  name: string;
  price: number;
  tagline: string;
  duration: string;
  items: { icon: string; label: string }[];
}

const PACKAGES: Package[] = [
  {
    id: "satellite",
    name: "Satellite Shield",
    price: 899,
    tagline: "Front-end clear bra protection",
    duration: "1–2 days",
    items: [
      { icon: "🛡️", label: "Hood & fenders PPF" },
      { icon: "🔦", label: "Headlights film" },
      { icon: "🪞", label: "Mirror caps" },
      { icon: "✨", label: "Gloss finish" },
      { icon: "📄", label: "5-year warranty" },
    ],
  },
  {
    id: "fullbody",
    name: "Full Body",
    price: 2499,
    tagline: "Complete paint protection film",
    duration: "3–5 days",
    items: [
      { icon: "🚗", label: "Full vehicle coverage" },
      { icon: "🛡️", label: "Self-healing PPF" },
      { icon: "🔦", label: "All optical surfaces" },
      { icon: "🪟", label: "Roof & pillars" },
      { icon: "📄", label: "10-year warranty" },
    ],
  },
  {
    id: "platinum",
    name: "Platinum Ceramic+PPF",
    price: 4899,
    tagline: "Flagship protection suite",
    duration: "5–7 days",
    items: [
      { icon: "💎", label: "Full body PPF" },
      { icon: "🌟", label: "9H ceramic coating" },
      { icon: "🔧", label: "Paint correction included" },
      { icon: "🪟", label: "Window tint (35%)" },
      { icon: "📄", label: "Lifetime warranty" },
    ],
  },
];

const ADDONS = [
  { key: "ceramic" as keyof PackageAddons, label: "Ceramic coating", price: 400, icon: "🌟" },
  { key: "wheelCoating" as keyof PackageAddons, label: "Wheel face coating", price: 200, icon: "⚙️" },
  { key: "interiorProtection" as keyof PackageAddons, label: "Interior protection", price: 250, icon: "🪑" },
  { key: "headlightRestoration" as keyof PackageAddons, label: "Headlight restoration", price: 150, icon: "🔦" },
  { key: "rushScheduling" as keyof PackageAddons, label: "Rush scheduling (7 days)", price: 300, icon: "⚡" },
];

const TAX_RATE = 0.0825;

// ─── Algorithms ───────────────────────────────────────────────────────────────

function validateVIN(vin: string): boolean {
  if (vin.length !== 17) return false;
  const transliteration: Record<string, number> = {
    A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,
    J:1,K:2,L:3,M:4,N:5,P:7,R:9,
    S:2,T:3,U:4,V:5,W:6,X:7,Y:8,Z:9,
    "0":0,"1":1,"2":2,"3":3,"4":4,"5":5,"6":6,"7":7,"8":8,"9":9,
  };
  const weights = [8,7,6,5,4,3,2,10,0,9,8,7,6,5,4,3,2];
  const checkDigit = vin[8];
  const checkValue = checkDigit === "X" ? 10 : parseInt(checkDigit, 10);
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    const char = vin[i].toUpperCase();
    if (!(char in transliteration)) return false;
    sum += transliteration[char] * weights[i];
  }
  return sum % 11 === checkValue;
}

function decodeVINMock(vin: string): Partial<VehicleInfo> {
  const makeMap: Record<string, string> = {
    "1": "Ford", "2": "Chevrolet", "3": "Honda", "4": "Toyota",
    "5": "BMW", "J": "Honda", "W": "Mercedes", "Z": "Ferrari",
    "S": "Audi", "V": "Porsche",
  };
  const firstChar = vin[0].toUpperCase();
  const make = makeMap[firstChar] || "Tesla";
  const models = MAKES_MODELS[make] || ["Model 3"];
  const yearCode: Record<string, string> = {
    "A":"2010","B":"2011","C":"2012","D":"2013","E":"2014","F":"2015","G":"2016","H":"2017",
    "J":"2018","K":"2019","L":"2020","M":"2021","N":"2022","P":"2023","R":"2024","S":"2025",
  };
  const yearChar = vin[9].toUpperCase();
  const year = yearCode[yearChar] || "2023";
  const modelIdx = parseInt(vin[2], 10) % models.length;
  return { make, model: models[modelIdx || 0], year, trim: TRIMS[parseInt(vin[4], 10) % TRIMS.length] };
}

function luhnCheck(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\s/g, "").split("").map(Number);
  let sum = 0;
  let isEven = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = digits[i];
    if (isEven) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    isEven = !isEven;
  }
  return sum % 10 === 0;
}

function encodeState(state: AppState): string {
  const serializable = { ...state, photos: state.photos.map(p => ({ id: p.id, name: p.name, url: "" })) };
  return btoa(encodeURIComponent(JSON.stringify(serializable)));
}

function decodeState(encoded: string): AppState | null {
  try {
    return JSON.parse(decodeURIComponent(atob(encoded))) as AppState;
  } catch {
    return null;
  }
}

function generateEstimateNumber(state: AppState): string {
  const hash = (state.customer.name + state.vehicle.make + state.selectedPackage)
    .split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const year = new Date().getFullYear();
  const seq = String(1000 + (hash % 9000)).padStart(4, "0");
  return `ESW-${year}-${seq}`;
}

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length < 4) return digits;
  if (digits.length < 7) return `(${digits.slice(0,3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
}

// ─── Price helpers ─────────────────────────────────────────────────────────────

function calcSubtotal(state: AppState): number {
  const pkg = PACKAGES.find(p => p.id === state.selectedPackage);
  const base = pkg?.price ?? 0;
  const addonsTotal = ADDONS.reduce((sum, a) => sum + (state.addons[a.key] ? a.price : 0), 0);
  return base + addonsTotal;
}

function calcTax(subtotal: number): number {
  return Math.round(subtotal * TAX_RATE * 100) / 100;
}

function calcTotal(state: AppState): number {
  const sub = calcSubtotal(state);
  return sub + calcTax(sub);
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

function GlassTile({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[oklch(0.08_0.005_260/0.4)] backdrop-blur-md border border-[oklch(0.74_0.15_55/0.2)] rounded-2xl shadow-[0_4px_12px_oklch(0.05_0.005_260/0.06)] ${className}`}>
      {children}
    </div>
  );
}

function PrimaryButton({ onClick, children, disabled = false, type = "button", className = "" }: {
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`bg-gradient-to-br from-[#ffb68d] to-[oklch(0.74_0.15_55)] text-[oklch(0.08_0.005_260)] rounded-md px-6 py-3 font-medium font-display transition-opacity disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[oklch(0.74_0.15_55)] ${className}`}
    >
      {children}
    </button>
  );
}

function SecondaryButton({ onClick, children, className = "" }: {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`border border-[oklch(0.74_0.15_55/0.4)] text-[oklch(0.74_0.15_55)] rounded-md px-6 py-3 font-medium font-display transition-colors hover:border-[oklch(0.74_0.15_55)] hover:bg-[oklch(0.74_0.15_55/0.08)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.74_0.15_55)] ${className}`}
    >
      {children}
    </button>
  );
}

function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-medium text-[oklch(0.75_0.005_260)] uppercase tracking-widest mb-1.5">
      {children}
    </label>
  );
}

function Input({ id, value, onChange, placeholder, type = "text", maxLength, className = "" }: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  maxLength?: number;
  className?: string;
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      maxLength={maxLength}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full bg-[oklch(0.12_0.005_260)] border border-[oklch(0.28_0.005_260)] rounded-lg px-4 py-3 text-[oklch(0.97_0.008_80)] placeholder-[oklch(0.45_0.01_260)] focus:outline-none focus:border-[oklch(0.74_0.15_55)] transition-colors ${className}`}
    />
  );
}

function Select({ id, value, onChange, children }: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-[oklch(0.12_0.005_260)] border border-[oklch(0.28_0.005_260)] rounded-lg px-4 py-3 text-[oklch(0.97_0.008_80)] focus:outline-none focus:border-[oklch(0.74_0.15_55)] transition-colors appearance-none"
    >
      {children}
    </select>
  );
}

// ─── Step Indicator ────────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  const steps = ["Photos", "Vehicle", "Package", "Sign", "Estimate"];
  return (
    <div className="flex items-center gap-0 mb-8 print:hidden">
      {steps.map((label, idx) => {
        const n = idx + 1;
        const done = n < current;
        const active = n === current;
        return (
          <div key={n} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                done ? "bg-[oklch(0.74_0.15_55)] text-[oklch(0.08_0.005_260)]" :
                active ? "bg-[oklch(0.74_0.15_55/0.15)] border-2 border-[oklch(0.74_0.15_55)] text-[oklch(0.74_0.15_55)]" :
                "bg-[oklch(0.14_0.005_260)] text-[oklch(0.45_0.01_260)]"
              }`}>
                {done ? "✓" : n}
              </div>
              <span className={`text-[10px] font-medium hidden sm:block ${active ? "text-[oklch(0.74_0.15_55)]" : "text-[oklch(0.45_0.01_260)]"}`}>
                {label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`flex-1 h-[2px] mx-2 transition-colors ${done ? "bg-[oklch(0.74_0.15_55)]" : "bg-[oklch(0.22_0.005_260)]"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Price Ticker ──────────────────────────────────────────────────────────────

function PriceTicker({ total }: { total: number }) {
  const shouldReduce = useReducedMotion();
  const [display, setDisplay] = useState(total);

  useEffect(() => {
    if (shouldReduce) { setDisplay(total); return; }
    const start = display;
    const diff = total - start;
    if (diff === 0) return;
    const steps = 20;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplay(Math.round(start + diff * (i / steps)));
      if (i >= steps) clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  if (total === 0) return null;
  return (
    <div className="sticky top-4 z-30 flex justify-end print:hidden">
      <GlassTile className="px-4 py-2 flex items-center gap-2">
        <span className="text-[oklch(0.45_0.01_260)] text-xs">Est. Total</span>
        <span className="text-[oklch(0.74_0.15_55)] font-display font-bold text-xl">
          ${display.toLocaleString()}
        </span>
      </GlassTile>
    </div>
  );
}

// ─── Step 1: Photos ────────────────────────────────────────────────────────────

function StepPhotos({ state, dispatch, onNext }: {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  onNext: () => void;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const newPhotos: PhotoFile[] = Array.from(files).slice(0, 12 - state.photos.length).map(f => ({
      id: Math.random().toString(36).slice(2),
      url: URL.createObjectURL(f),
      name: f.name,
    }));
    dispatch({ type: "ADD_PHOTOS", payload: newPhotos });
  }, [state.photos.length, dispatch]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-[oklch(0.97_0.008_80)] font-semibold">Vehicle Photos</h2>
        <p className="text-[oklch(0.75_0.005_260)] mt-1">Upload photos of the vehicle for our technicians to review. Up to 12 photos.</p>
      </div>

      <div
        role="button"
        tabIndex={0}
        aria-label="Upload vehicle photos"
        onKeyDown={e => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors ${
          dragging ? "border-[oklch(0.74_0.15_55)] bg-[oklch(0.74_0.15_55/0.05)]" : "border-[oklch(0.28_0.005_260)] hover:border-[oklch(0.74_0.15_55/0.5)]"
        }`}
      >
        <div className="text-4xl mb-3">📸</div>
        <p className="text-[oklch(0.97_0.008_80)] font-medium">Drag & drop vehicle photos here</p>
        <p className="text-[oklch(0.45_0.01_260)] text-sm mt-1">or click to browse — supports JPG, PNG, HEIC, WEBP</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => handleFiles(e.target.files)}
        />
      </div>

      {state.photos.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {state.photos.map(photo => (
            <div key={photo.id} className="relative group aspect-square rounded-lg overflow-hidden border border-[oklch(0.28_0.005_260)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
              <button
                onClick={() => dispatch({ type: "REMOVE_PHOTO", payload: photo.id })}
                aria-label={`Remove ${photo.name}`}
                className="absolute inset-0 bg-[oklch(0.08_0.005_260/0.7)] opacity-0 group-hover:opacity-100 flex items-center justify-center text-2xl transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3 flex-wrap">
        <PrimaryButton onClick={onNext}>{state.photos.length > 0 ? `Continue with ${state.photos.length} photo${state.photos.length !== 1 ? "s" : ""}` : "Continue Without Photos"}</PrimaryButton>
      </div>
    </div>
  );
}

// ─── Step 2: Vehicle ───────────────────────────────────────────────────────────

function StepVehicle({ state, dispatch, onNext, onBack }: {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  onNext: () => void;
  onBack: () => void;
}) {
  const [vinInput, setVinInput] = useState(state.vehicle.vin);
  const [vinError, setVinError] = useState("");
  const [vinSuccess, setVinSuccess] = useState(false);
  const [mode, setMode] = useState<"manual" | "vin">("manual");

  const makes = Object.keys(MAKES_MODELS);
  const models = state.vehicle.make ? MAKES_MODELS[state.vehicle.make] || [] : [];

  function handleVinLookup() {
    const v = vinInput.trim().toUpperCase();
    if (v.length !== 17) { setVinError("VIN must be exactly 17 characters"); return; }
    if (!validateVIN(v)) { setVinError("Invalid VIN — check digit failed"); return; }
    setVinError("");
    setVinSuccess(true);
    const decoded = decodeVINMock(v);
    dispatch({ type: "SET_VEHICLE", payload: { ...decoded, vin: v } });
  }

  const canContinue = state.vehicle.make && state.vehicle.model && state.vehicle.year && state.vehicle.color;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-[oklch(0.97_0.008_80)] font-semibold">Vehicle Information</h2>
        <p className="text-[oklch(0.75_0.005_260)] mt-1">Tell us about the vehicle we&apos;ll be working on.</p>
      </div>

      <div className="flex gap-2">
        {(["manual", "vin"] as const).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === m ? "bg-[oklch(0.74_0.15_55/0.15)] border border-[oklch(0.74_0.15_55)] text-[oklch(0.74_0.15_55)]" : "border border-[oklch(0.28_0.005_260)] text-[oklch(0.75_0.005_260)] hover:border-[oklch(0.74_0.15_55/0.4)]"
            }`}
          >
            {m === "manual" ? "Manual Entry" : "VIN Lookup"}
          </button>
        ))}
      </div>

      {mode === "vin" && (
        <GlassTile className="p-5 space-y-3">
          <Label htmlFor="vin">17-Character VIN</Label>
          <div className="flex gap-2">
            <Input
              id="vin"
              value={vinInput}
              onChange={v => { setVinInput(v.toUpperCase()); setVinError(""); setVinSuccess(false); }}
              placeholder="e.g. 1HGBH41JXMN109186"
              maxLength={17}
              className="font-mono tracking-wider"
            />
            <button
              onClick={handleVinLookup}
              className="px-4 py-3 bg-[oklch(0.74_0.15_55/0.15)] border border-[oklch(0.74_0.15_55/0.5)] rounded-lg text-[oklch(0.74_0.15_55)] font-medium whitespace-nowrap hover:bg-[oklch(0.74_0.15_55/0.25)] transition-colors"
            >
              Decode
            </button>
          </div>
          {vinError && <p className="text-red-400 text-sm">{vinError}</p>}
          {vinSuccess && <p className="text-emerald-400 text-sm">✓ VIN decoded — fields populated below</p>}
        </GlassTile>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="make">Make</Label>
          <Select id="make" value={state.vehicle.make} onChange={v => dispatch({ type: "SET_VEHICLE", payload: { make: v, model: "" } })}>
            <option value="">Select make</option>
            {makes.map(m => <option key={m} value={m}>{m}</option>)}
          </Select>
        </div>
        <div>
          <Label htmlFor="model">Model</Label>
          <Select id="model" value={state.vehicle.model} onChange={v => dispatch({ type: "SET_VEHICLE", payload: { model: v } })}>
            <option value="">Select model</option>
            {models.map(m => <option key={m} value={m}>{m}</option>)}
          </Select>
        </div>
        <div>
          <Label htmlFor="year">Year</Label>
          <Select id="year" value={state.vehicle.year} onChange={v => dispatch({ type: "SET_VEHICLE", payload: { year: v } })}>
            <option value="">Select year</option>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </Select>
        </div>
        <div>
          <Label htmlFor="trim">Trim</Label>
          <Select id="trim" value={state.vehicle.trim} onChange={v => dispatch({ type: "SET_VEHICLE", payload: { trim: v } })}>
            <option value="">Select trim</option>
            {TRIMS.map(t => <option key={t} value={t}>{t}</option>)}
          </Select>
        </div>
        <div>
          <Label htmlFor="odometer">Odometer (miles)</Label>
          <Input
            id="odometer"
            value={state.vehicle.odometer}
            onChange={v => dispatch({ type: "SET_VEHICLE", payload: { odometer: v.replace(/\D/g, "") } })}
            placeholder="e.g. 12500"
            type="text"
          />
        </div>
      </div>

      <div>
        <Label>Paint Color</Label>
        <div className="flex flex-wrap gap-3">
          {COLORS.map(c => (
            <button
              key={c.name}
              onClick={() => dispatch({ type: "SET_VEHICLE", payload: { color: c.name } })}
              title={c.name}
              aria-label={c.name}
              className={`w-9 h-9 rounded-full border-2 transition-all ${
                state.vehicle.color === c.name ? "border-[oklch(0.74_0.15_55)] scale-110 shadow-[0_0_8px_oklch(0.74_0.15_55/0.6)]" : "border-[oklch(0.28_0.005_260)]"
              }`}
              style={{ backgroundColor: c.value }}
            />
          ))}
          <button
            onClick={() => dispatch({ type: "SET_VEHICLE", payload: { color: "Custom" } })}
            className={`px-3 h-9 rounded-full border-2 text-xs transition-all ${
              state.vehicle.color === "Custom" ? "border-[oklch(0.74_0.15_55)] text-[oklch(0.74_0.15_55)]" : "border-[oklch(0.28_0.005_260)] text-[oklch(0.45_0.01_260)]"
            }`}
          >
            Custom
          </button>
        </div>
        {state.vehicle.color && <p className="text-[oklch(0.74_0.15_55)] text-sm mt-2">{state.vehicle.color} selected</p>}
      </div>

      <div className="flex gap-3 flex-wrap">
        <SecondaryButton onClick={onBack}>Back</SecondaryButton>
        <PrimaryButton onClick={onNext} disabled={!canContinue}>Continue to Packages</PrimaryButton>
      </div>
    </div>
  );
}

// ─── Step 3: Packages ──────────────────────────────────────────────────────────

function StepPackage({ state, dispatch, onNext, onBack }: {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  onNext: () => void;
  onBack: () => void;
}) {
  const shouldReduce = useReducedMotion();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-[oklch(0.97_0.008_80)] font-semibold">Choose Your Package</h2>
        <p className="text-[oklch(0.75_0.005_260)] mt-1">Select the protection level that fits your vehicle and lifestyle.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PACKAGES.map(pkg => {
          const selected = state.selectedPackage === pkg.id;
          return (
            <motion.button
              key={pkg.id}
              onClick={() => dispatch({ type: "SET_PACKAGE", payload: pkg.id })}
              animate={shouldReduce ? {} : selected ? { scale: 1.02 } : { scale: 1 }}
              className={`text-left rounded-2xl p-5 border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[oklch(0.74_0.15_55)] ${
                selected
                  ? "border-[oklch(0.74_0.15_55)] bg-[oklch(0.74_0.15_55/0.08)]"
                  : "border-[oklch(0.28_0.005_260)] bg-[oklch(0.10_0.005_260)] hover:border-[oklch(0.74_0.15_55/0.5)]"
              }`}
            >
              <div className="font-display text-3xl font-bold text-[oklch(0.74_0.15_55)] mb-1">
                ${pkg.price.toLocaleString()}
              </div>
              <div className="text-[oklch(0.97_0.008_80)] font-semibold text-lg">{pkg.name}</div>
              <div className="text-[oklch(0.45_0.01_260)] text-sm mb-3">{pkg.tagline}</div>
              <div className="text-[oklch(0.75_0.005_260)] text-xs mb-4">Est. {pkg.duration}</div>
              <ul className="space-y-1.5">
                {pkg.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-[oklch(0.75_0.005_260)]">
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {state.selectedPackage && (
          <motion.div
            initial={shouldReduce ? {} : { opacity: 0, y: 12 }}
            animate={shouldReduce ? {} : { opacity: 1, y: 0 }}
            exit={shouldReduce ? {} : { opacity: 0, y: -8 }}
          >
            <GlassTile className="p-5">
              <h3 className="font-display font-semibold text-[oklch(0.97_0.008_80)] mb-4">Add-ons</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ADDONS.map(addon => (
                  <label key={addon.key} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      state.addons[addon.key] ? "border-[oklch(0.74_0.15_55)] bg-[oklch(0.74_0.15_55)]" : "border-[oklch(0.28_0.005_260)] group-hover:border-[oklch(0.74_0.15_55/0.5)]"
                    }`}>
                      {state.addons[addon.key] && <span className="text-[oklch(0.08_0.005_260)] text-xs font-bold">✓</span>}
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={state.addons[addon.key]}
                      onChange={() => dispatch({ type: "TOGGLE_ADDON", payload: addon.key })}
                    />
                    <span className="text-sm">{addon.icon}</span>
                    <span className="text-[oklch(0.97_0.008_80)] text-sm flex-1">{addon.label}</span>
                    <span className="text-[oklch(0.74_0.15_55)] text-sm font-medium">+${addon.price}</span>
                  </label>
                ))}
              </div>
            </GlassTile>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-3 flex-wrap">
        <SecondaryButton onClick={onBack}>Back</SecondaryButton>
        <PrimaryButton onClick={onNext} disabled={!state.selectedPackage}>Continue to Sign</PrimaryButton>
      </div>
    </div>
  );
}

// ─── Step 4: Customer + Signature ─────────────────────────────────────────────

function StepSign({ state, dispatch, onNext, onBack }: {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  onNext: () => void;
  onBack: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [hasInk, setHasInk] = useState(!!state.signatureDataUrl);
  const [termsOpen, setTermsOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    if (state.signatureDataUrl) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.src = state.signatureDataUrl;
    }
  }, [state.signatureDataUrl]);

  function getPos(e: React.MouseEvent | React.TouchEvent): { x: number; y: number } | null {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      const touch = e.touches[0];
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    const pos = getPos(e);
    if (!pos) return;
    setDrawing(true);
    lastPos.current = pos;
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) { ctx.beginPath(); ctx.moveTo(pos.x, pos.y); }
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    if (!drawing) return;
    const pos = getPos(e);
    if (!pos || !lastPos.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = "oklch(0.97 0.008 80)";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      setHasInk(true);
    }
    lastPos.current = pos;
  }

  function endDraw() {
    setDrawing(false);
    lastPos.current = null;
    const dataUrl = canvasRef.current?.toDataURL();
    if (dataUrl) dispatch({ type: "SET_SIGNATURE", payload: dataUrl });
  }

  function clearSignature() {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx && canvasRef.current) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setHasInk(false);
    dispatch({ type: "SET_SIGNATURE", payload: "" });
  }

  const today = new Date().toISOString().split("T")[0];

  const canContinue =
    state.customer.name.trim().length > 0 &&
    state.customer.email.match(/^[^@]+@[^@]+\.[^@]+$/) !== null &&
    state.customer.phone.replace(/\D/g, "").length >= 10 &&
    !!state.customer.dropoffDate &&
    state.customer.dropoffDate > today &&
    hasInk &&
    state.termsAccepted;

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!state.customer.name.trim()) e.name = "Name is required";
    if (!state.customer.email.match(/^[^@]+@[^@]+\.[^@]+$/)) e.email = "Valid email required";
    if (state.customer.phone.replace(/\D/g, "").length < 10) e.phone = "Valid phone required";
    if (!state.customer.dropoffDate) e.dropoffDate = "Preferred date required";
    else if (state.customer.dropoffDate <= today) e.dropoffDate = "Date must be in the future";
    if (!hasInk) e.signature = "Please sign above";
    if (!state.termsAccepted) e.terms = "You must accept the terms";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleContinue() {
    if (validate()) onNext();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-[oklch(0.97_0.008_80)] font-semibold">Your Information & Signature</h2>
        <p className="text-[oklch(0.75_0.005_260)] mt-1">Almost done — just a few details and your signature.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="cust-name">Full Name</Label>
          <Input id="cust-name" value={state.customer.name} onChange={v => dispatch({ type: "SET_CUSTOMER", payload: { name: v } })} placeholder="Jane Doe" />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <Label htmlFor="cust-email">Email</Label>
          <Input id="cust-email" value={state.customer.email} onChange={v => dispatch({ type: "SET_CUSTOMER", payload: { email: v } })} placeholder="jane@example.com" type="email" />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
        </div>
        <div>
          <Label htmlFor="cust-phone">Phone</Label>
          <Input
            id="cust-phone"
            value={state.customer.phone}
            onChange={v => dispatch({ type: "SET_CUSTOMER", payload: { phone: formatPhone(v) } })}
            placeholder="(555) 000-0000"
            type="tel"
          />
          {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
        </div>
        <div>
          <Label htmlFor="cust-date">Preferred Drop-Off Date</Label>
          <Input id="cust-date" value={state.customer.dropoffDate} onChange={v => dispatch({ type: "SET_CUSTOMER", payload: { dropoffDate: v } })} type="date" />
          {errors.dropoffDate && <p className="text-red-400 text-xs mt-1">{errors.dropoffDate}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="cust-concerns">Specific Concerns or Areas of Focus</Label>
        <textarea
          id="cust-concerns"
          value={state.customer.concerns}
          onChange={e => dispatch({ type: "SET_CUSTOMER", payload: { concerns: e.target.value } })}
          placeholder="e.g. Door edges are chipped, concerned about hood scratches..."
          rows={3}
          className="w-full bg-[oklch(0.12_0.005_260)] border border-[oklch(0.28_0.005_260)] rounded-lg px-4 py-3 text-[oklch(0.97_0.008_80)] placeholder-[oklch(0.45_0.01_260)] focus:outline-none focus:border-[oklch(0.74_0.15_55)] transition-colors resize-none"
        />
      </div>

      <div>
        <Label>Signature</Label>
        <GlassTile className="p-1">
          <canvas
            ref={canvasRef}
            width={600}
            height={120}
            className="w-full h-24 rounded-xl cursor-crosshair touch-none"
            style={{ background: "oklch(0.10 0.005 260)" }}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={endDraw}
          />
        </GlassTile>
        <div className="flex items-center justify-between mt-2">
          <p className="text-[oklch(0.45_0.01_260)] text-xs">Draw your signature above using mouse or touch</p>
          <button onClick={clearSignature} className="text-[oklch(0.74_0.15_55)] text-sm hover:underline">Clear</button>
        </div>
        {errors.signature && <p className="text-red-400 text-xs mt-1">{errors.signature}</p>}
      </div>

      <div>
        <div
          onClick={() => setTermsOpen(!termsOpen)}
          className="flex items-center justify-between cursor-pointer border border-[oklch(0.28_0.005_260)] rounded-lg px-4 py-3 hover:border-[oklch(0.74_0.15_55/0.4)] transition-colors"
        >
          <span className="text-[oklch(0.97_0.008_80)] text-sm font-medium">Terms & Conditions</span>
          <span className="text-[oklch(0.45_0.01_260)]">{termsOpen ? "▲" : "▼"}</span>
        </div>
        <AnimatePresence>
          {termsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="border border-t-0 border-[oklch(0.28_0.005_260)] rounded-b-lg px-4 py-4 text-[oklch(0.75_0.005_260)] text-xs leading-relaxed space-y-2 max-h-48 overflow-y-auto">
                <p><strong className="text-[oklch(0.97_0.008_80)]">Liability.</strong> EV Shield Wrap is not responsible for pre-existing paint defects, rock chips, or scratches not documented at intake. Customer acknowledges all pre-existing damage via the provided vehicle photos.</p>
                <p><strong className="text-[oklch(0.97_0.008_80)]">Deposit & Refund Policy.</strong> A 30% non-refundable deposit is required to confirm scheduling. The remaining balance is due upon vehicle pickup. Cancellations made more than 72 hours before drop-off may be rescheduled without penalty. No-shows forfeit the deposit.</p>
                <p><strong className="text-[oklch(0.97_0.008_80)]">Photo Consent.</strong> Customer authorizes EV Shield Wrap to photograph the vehicle before, during, and after service for quality documentation and marketing purposes. Customer may opt out by notifying staff at drop-off.</p>
                <p><strong className="text-[oklch(0.97_0.008_80)]">Warranty.</strong> Warranty terms are per-package as described in the estimate. Warranty is void if vehicle has been involved in a collision or subjected to improper washing techniques after installation.</p>
                <p><strong className="text-[oklch(0.97_0.008_80)]">Estimated Timeline.</strong> Durations shown are estimates. EV Shield Wrap will notify customer of any material delays. Customer agrees not to hold EV Shield Wrap liable for incidental losses due to delays.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <label className="flex items-start gap-3 mt-3 cursor-pointer">
          <div
            onClick={() => dispatch({ type: "SET_TERMS", payload: !state.termsAccepted })}
            className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
              state.termsAccepted ? "border-[oklch(0.74_0.15_55)] bg-[oklch(0.74_0.15_55)]" : "border-[oklch(0.28_0.005_260)]"
            }`}
          >
            {state.termsAccepted && <span className="text-[oklch(0.08_0.005_260)] text-xs font-bold">✓</span>}
          </div>
          <input
            type="checkbox"
            className="hidden"
            checked={state.termsAccepted}
            onChange={e => dispatch({ type: "SET_TERMS", payload: e.target.checked })}
          />
          <span className="text-[oklch(0.75_0.005_260)] text-sm">
            I have read and agree to the Terms & Conditions, including the photo consent and deposit policy.
          </span>
        </label>
        {errors.terms && <p className="text-red-400 text-xs mt-1">{errors.terms}</p>}
      </div>

      <div className="flex gap-3 flex-wrap">
        <SecondaryButton onClick={onBack}>Back</SecondaryButton>
        <PrimaryButton onClick={handleContinue} disabled={!canContinue}>Review My Estimate</PrimaryButton>
      </div>
    </div>
  );
}

// ─── Stripe Modal ──────────────────────────────────────────────────────────────

function StripeModal({ amount, onClose, onSuccess }: { amount: number; onClose: () => void; onSuccess: () => void }) {
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [zip, setZip] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  function formatCard(raw: string): string {
    const digits = raw.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  }

  function formatExpiry(raw: string): string {
    const digits = raw.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0,2)}/${digits.slice(2)}`;
    return digits;
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    const cardDigits = card.replace(/\s/g, "");
    if (cardDigits.length < 16 || !luhnCheck(cardDigits)) e.card = "Invalid card number";
    const [mm, yy] = expiry.split("/");
    if (!mm || !yy || parseInt(mm) < 1 || parseInt(mm) > 12) e.expiry = "Invalid expiry";
    if (cvc.replace(/\D/g, "").length < 3) e.cvc = "Invalid CVC";
    if (zip.replace(/\D/g, "").length < 5) e.zip = "Invalid ZIP";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handlePay() {
    if (!validate()) return;
    setProcessing(true);
    setTimeout(() => { setProcessing(false); setSuccess(true); setTimeout(onSuccess, 1500); }, 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[oklch(0.05_0.005_260/0.85)] backdrop-blur-sm" role="dialog" aria-modal="true">
      <GlassTile className="w-full max-w-sm p-6 space-y-5">
        {success ? (
          <div className="text-center py-8 space-y-3">
            <div className="text-5xl">✅</div>
            <div className="font-display text-xl text-[oklch(0.97_0.008_80)] font-semibold">Payment Successful</div>
            <div className="text-[oklch(0.75_0.005_260)]">Deposit of ${amount.toLocaleString()} confirmed.</div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-[oklch(0.97_0.008_80)]">Secure Deposit</h3>
              <button onClick={onClose} className="text-[oklch(0.45_0.01_260)] hover:text-[oklch(0.97_0.008_80)]" aria-label="Close">✕</button>
            </div>
            <div className="text-center py-2">
              <div className="text-[oklch(0.45_0.01_260)] text-sm">30% deposit to lock in your slot</div>
              <div className="font-display text-3xl font-bold text-[oklch(0.74_0.15_55)]">${amount.toLocaleString()}</div>
            </div>
            <div className="space-y-3">
              <div>
                <Label htmlFor="card-num">Card Number</Label>
                <Input id="card-num" value={card} onChange={v => setCard(formatCard(v))} placeholder="4242 4242 4242 4242" className="font-mono" />
                {errors.card && <p className="text-red-400 text-xs mt-1">{errors.card}</p>}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <Label htmlFor="card-exp">MM/YY</Label>
                  <Input id="card-exp" value={expiry} onChange={v => setExpiry(formatExpiry(v))} placeholder="12/27" />
                  {errors.expiry && <p className="text-red-400 text-xs mt-1">{errors.expiry}</p>}
                </div>
                <div className="col-span-1">
                  <Label htmlFor="card-cvc">CVC</Label>
                  <Input id="card-cvc" value={cvc} onChange={v => setCvc(v.replace(/\D/g, "").slice(0,4))} placeholder="123" />
                  {errors.cvc && <p className="text-red-400 text-xs mt-1">{errors.cvc}</p>}
                </div>
                <div className="col-span-1">
                  <Label htmlFor="card-zip">ZIP</Label>
                  <Input id="card-zip" value={zip} onChange={v => setZip(v.replace(/\D/g, "").slice(0,5))} placeholder="90210" />
                  {errors.zip && <p className="text-red-400 text-xs mt-1">{errors.zip}</p>}
                </div>
              </div>
            </div>
            <PrimaryButton onClick={handlePay} disabled={processing} className="w-full text-center flex items-center justify-center gap-2">
              {processing ? (
                <>
                  <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} className="inline-block w-4 h-4 border-2 border-[oklch(0.08_0.005_260)] border-t-transparent rounded-full" />
                  Processing...
                </>
              ) : `Pay $${amount.toLocaleString()} deposit`}
            </PrimaryButton>
            <p className="text-[oklch(0.45_0.01_260)] text-xs text-center">🔒 Demo — no real charge made</p>
          </>
        )}
      </GlassTile>
    </div>
  );
}

// ─── Step 5: Final Estimate ────────────────────────────────────────────────────

function StepEstimate({ state, dispatch, onReset }: {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  onReset: () => void;
}) {
  const [showStripe, setShowStripe] = useState(false);
  const [toast, setToast] = useState("");
  const [pdfUnlocked, setPdfUnlocked] = useState(false);
  const shouldReduce = useReducedMotion();

  const subtotal = calcSubtotal(state);
  const tax = calcTax(subtotal);
  const total = subtotal + tax;
  const deposit = Math.round(total * 0.3 * 100) / 100;
  const estimateNum = generateEstimateNumber(state);
  const now = new Date();
  const validDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const issued = now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const validThrough = validDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const pkg = PACKAGES.find(p => p.id === state.selectedPackage)!;
  const activeAddons = ADDONS.filter(a => state.addons[a.key]);

  function handleShare() {
    const encoded = encodeState(state);
    const url = `${window.location.origin}${window.location.pathname}?quote=${encoded}`;
    navigator.clipboard.writeText(url).then(() => {
      setToast("Link copied to clipboard!");
      setTimeout(() => setToast(""), 3000);
    });
  }

  function handleTextMe() {
    const phone = state.customer.phone;
    setToast(`Demo: would send estimate to ${phone}`);
    setTimeout(() => setToast(""), 4000);
  }

  return (
    <>
      <div className="space-y-6 print:space-y-4">
        {/* Print header */}
        <div className="flex items-start justify-between print:mb-6">
          <div className="flex items-center gap-3">
            {/* Shop logo SVG */}
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
              <rect width="44" height="44" rx="10" fill="oklch(0.74 0.15 55)" />
              <path d="M8 28L14 16L20 22L26 14L36 28H8Z" fill="oklch(0.08 0.005 260)" opacity="0.9" />
              <path d="M22 30C22 30 10 26 10 20C10 17.2 12.2 15 15 15C17 15 18.8 16.1 19.8 17.8C20.8 16.1 22.6 15 24.6 15C27.4 15 29.6 17.2 29.6 20C29.6 26 22 30 22 30Z" fill="oklch(0.97 0.008 80)" opacity="0.85" />
            </svg>
            <div>
              <div className="font-display font-bold text-[oklch(0.97_0.008_80)] text-lg leading-tight">EV Shield Wrap</div>
              <div className="text-[oklch(0.45_0.01_260)] text-xs">Premium Paint Protection & Ceramic Coatings</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[oklch(0.74_0.15_55)] font-mono font-semibold">{estimateNum}</div>
            <div className="text-[oklch(0.45_0.01_260)] text-xs">Issued {issued}</div>
            <div className="text-[oklch(0.45_0.01_260)] text-xs">Valid through {validThrough}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <GlassTile className="p-4 print:border print:border-gray-200 print:bg-white print:text-black">
            <h4 className="font-display font-semibold text-[oklch(0.97_0.008_80)] print:text-black mb-3 text-sm uppercase tracking-widest">Customer</h4>
            <table className="w-full text-sm">
              <tbody className="space-y-1">
                {[
                  ["Name", state.customer.name],
                  ["Email", state.customer.email],
                  ["Phone", state.customer.phone],
                  ["Drop-Off", new Date(state.customer.dropoffDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })],
                ].map(([k, v]) => (
                  <tr key={k}>
                    <td className="text-[oklch(0.45_0.01_260)] print:text-gray-500 pr-4 py-0.5">{k}</td>
                    <td className="text-[oklch(0.97_0.008_80)] print:text-black font-medium">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassTile>
          <GlassTile className="p-4 print:border print:border-gray-200 print:bg-white print:text-black">
            <h4 className="font-display font-semibold text-[oklch(0.97_0.008_80)] print:text-black mb-3 text-sm uppercase tracking-widest">Vehicle</h4>
            <table className="w-full text-sm">
              <tbody>
                {[
                  ["Vehicle", `${state.vehicle.year} ${state.vehicle.make} ${state.vehicle.model}`],
                  ["Trim", state.vehicle.trim || "—"],
                  ["Color", state.vehicle.color],
                  ["Odometer", state.vehicle.odometer ? `${parseInt(state.vehicle.odometer).toLocaleString()} mi` : "—"],
                ].map(([k, v]) => (
                  <tr key={k}>
                    <td className="text-[oklch(0.45_0.01_260)] print:text-gray-500 pr-4 py-0.5">{k}</td>
                    <td className="text-[oklch(0.97_0.008_80)] print:text-black font-medium">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassTile>
        </div>

        <GlassTile className="p-5 print:border print:border-gray-200 print:bg-white">
          <h4 className="font-display font-semibold text-[oklch(0.97_0.008_80)] print:text-black mb-4 text-sm uppercase tracking-widest">Line Items</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2 border-b border-[oklch(0.22_0.005_260)] print:border-gray-200">
              <div>
                <div className="text-[oklch(0.97_0.008_80)] print:text-black font-medium">{pkg.name}</div>
                <div className="text-[oklch(0.45_0.01_260)] print:text-gray-500 text-xs">{pkg.tagline} · {pkg.duration}</div>
              </div>
              <div className="text-[oklch(0.97_0.008_80)] print:text-black font-semibold">${pkg.price.toLocaleString()}</div>
            </div>
            {activeAddons.map(a => (
              <div key={a.key} className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2 text-sm">
                  <span>{a.icon}</span>
                  <span className="text-[oklch(0.75_0.005_260)] print:text-gray-600">{a.label}</span>
                </div>
                <div className="text-[oklch(0.75_0.005_260)] print:text-gray-600 text-sm">${a.price}</div>
              </div>
            ))}
            <div className="pt-3 border-t border-[oklch(0.22_0.005_260)] print:border-gray-300 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-[oklch(0.45_0.01_260)] print:text-gray-500">Subtotal</span>
                <span className="text-[oklch(0.97_0.008_80)] print:text-black">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[oklch(0.45_0.01_260)] print:text-gray-500">Tax ({(TAX_RATE * 100).toFixed(2)}%)</span>
                <span className="text-[oklch(0.97_0.008_80)] print:text-black">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-display font-bold text-2xl pt-2">
                <span className="text-[oklch(0.97_0.008_80)] print:text-black">Total</span>
                <span className="text-[oklch(0.74_0.15_55)] print:text-orange-600">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </GlassTile>

        {state.customer.concerns && (
          <GlassTile className="p-4 print:border print:border-gray-200 print:bg-white">
            <h4 className="font-display font-semibold text-[oklch(0.97_0.008_80)] print:text-black mb-2 text-sm uppercase tracking-widest">Notes</h4>
            <p className="text-[oklch(0.75_0.005_260)] print:text-gray-600 text-sm">{state.customer.concerns}</p>
          </GlassTile>
        )}

        {state.signatureDataUrl && (
          <GlassTile className="p-4 print:border print:border-gray-200 print:bg-white">
            <h4 className="font-display font-semibold text-[oklch(0.97_0.008_80)] print:text-black mb-2 text-sm uppercase tracking-widest">Customer Signature</h4>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={state.signatureDataUrl} alt="Customer signature" className="max-h-20 print:max-h-16" />
            <div className="flex gap-8 mt-2 pt-2 border-t border-[oklch(0.22_0.005_260)] print:border-gray-200">
              <div>
                <div className="text-[oklch(0.45_0.01_260)] print:text-gray-500 text-xs">Signed by</div>
                <div className="text-[oklch(0.97_0.008_80)] print:text-black text-sm">{state.customer.name}</div>
              </div>
              <div>
                <div className="text-[oklch(0.45_0.01_260)] print:text-gray-500 text-xs">Date</div>
                <div className="text-[oklch(0.97_0.008_80)] print:text-black text-sm">{issued}</div>
              </div>
            </div>
          </GlassTile>
        )}

        <div className="flex flex-wrap gap-3 print:hidden">
          <PrimaryButton onClick={() => setShowStripe(true)} disabled={state.depositPaid}>
            {state.depositPaid ? `✓ Deposit Paid ($${deposit.toLocaleString()})` : `Pay 30% deposit — $${deposit.toLocaleString()}`}
          </PrimaryButton>
          {pdfUnlocked ? (
            <SecondaryButton onClick={() => window.print()}>Download PDF</SecondaryButton>
          ) : null}
          <SecondaryButton onClick={handleTextMe}>Text me the estimate</SecondaryButton>
          <SecondaryButton onClick={handleShare}>Copy share link</SecondaryButton>
        </div>

        {/* Lead capture gate — PDF unlocks after email */}
        {!pdfUnlocked && (
          <LeadCapture
            appSlug="auto-quote"
            context="before-pdf-export"
            buttonLabel="Email me a copy"
            onCaptured={() => setPdfUnlocked(true)}
            className="print:hidden"
          />
        )}

        {/* Funnel CTA */}
        <div className="bg-[oklch(0.14_0.005_260)] border border-[oklch(0.28_0.005_260)] rounded-2xl p-5 print:hidden">
          <p className="font-display font-semibold text-[oklch(0.97_0.008_80)] text-lg mb-1">Want this set up for your shop?</p>
          <p className="text-[oklch(0.75_0.005_260)] text-sm mb-4">We&apos;ll white-label it with your logo, wire your Stripe for real deposits, and have it live on your domain in a week.</p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="mailto:hello@nguyenetic.com?subject=Auto-quote setup for my shop"
              className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl font-display font-semibold text-sm text-[oklch(0.08_0.005_260)] bg-gradient-to-r from-[oklch(0.80_0.16_55)] to-[oklch(0.74_0.15_55)] hover:from-[oklch(0.85_0.17_55)] hover:to-[oklch(0.80_0.16_55)] transition-all shadow-[0_0_20px_oklch(0.74_0.15_55/25%)]"
            >
              Book 15-min call &mdash; Nguyenetic
            </a>
            <span className="text-[oklch(0.45_0.01_260)] text-sm">or <a href="#" className="underline underline-offset-2 hover:text-[oklch(0.75_0.005_260)] transition-colors">self-serve at $49/mo &rarr;</a></span>
          </div>
        </div>

        <div className="flex gap-3 print:hidden">
          <button onClick={onReset} className="text-[oklch(0.45_0.01_260)] text-sm hover:text-[oklch(0.75_0.005_260)] transition-colors underline underline-offset-2">
            Start a new estimate
          </button>
        </div>
      </div>

      {showStripe && (
        <StripeModal
          amount={deposit}
          onClose={() => setShowStripe(false)}
          onSuccess={() => {
            dispatch({ type: "SET_DEPOSIT_PAID", payload: true });
            setShowStripe(false);
            setToast("Deposit confirmed! We&apos;ll see you on your drop-off date.");
            setTimeout(() => setToast(""), 5000);
          }}
        />
      )}

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={shouldReduce ? {} : { opacity: 0, y: 20 }}
            animate={shouldReduce ? {} : { opacity: 1, y: 0 }}
            exit={shouldReduce ? {} : { opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <GlassTile className="px-5 py-3 text-sm text-[oklch(0.97_0.008_80)]">{toast}</GlassTile>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Root Page ─────────────────────────────────────────────────────────────────

export default function AutoQuotePage() {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const shouldReduce = useReducedMotion();
  const initialized = useRef(false);

  // Load from localStorage or URL on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const params = new URLSearchParams(window.location.search);
    const quoteParam = params.get("quote");
    if (quoteParam) {
      const decoded = decodeState(quoteParam);
      if (decoded) { dispatch({ type: "LOAD_STATE", payload: decoded }); return; }
    }
    try {
      const saved = localStorage.getItem("esw_quote_state");
      if (saved) {
        const parsed = JSON.parse(saved) as AppState;
        dispatch({ type: "LOAD_STATE", payload: parsed });
      }
    } catch {}
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (!initialized.current) return;
    try {
      localStorage.setItem("esw_quote_state", JSON.stringify(state));
    } catch {}
  }, [state]);

  function reset() {
    localStorage.removeItem("esw_quote_state");
    dispatch({ type: "LOAD_STATE", payload: defaultState });
    window.scrollTo({ top: 0, behavior: shouldReduce ? "instant" : "smooth" });
  }

  const total = calcTotal(state);

  const stepVariants = {
    initial: shouldReduce ? {} : { opacity: 0, x: 30 },
    animate: shouldReduce ? {} : { opacity: 1, x: 0 },
    exit: shouldReduce ? {} : { opacity: 0, x: -30 },
  };

  return (
    <div className="min-h-screen bg-[oklch(0.08_0.005_260)] text-[oklch(0.97_0.008_80)] font-body">
      {/* Print stylesheet inlined */}
      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          .print\\:hidden { display: none !important; }
          .print\\:border { border: 1px solid #e5e7eb !important; }
          .print\\:border-gray-200 { border-color: #e5e7eb !important; }
          .print\\:bg-white { background: white !important; }
          .print\\:text-black { color: black !important; }
          .print\\:text-gray-500 { color: #6b7280 !important; }
          .print\\:text-gray-600 { color: #4b5563 !important; }
          .print\\:text-orange-600 { color: #ea580c !important; }
          .print\\:border-gray-300 { border-color: #d1d5db !important; }
          .print\\:mb-6 { margin-bottom: 1.5rem !important; }
          .print\\:max-h-16 { max-height: 4rem !important; }
        }
      `}</style>

      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        {/* Hero */}
        <div className="mb-10 print:hidden">
          <div className="flex items-center gap-2 mb-3">
            <svg width="28" height="28" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="44" height="44" rx="10" fill="oklch(0.74 0.15 55)" />
              <path d="M8 28L14 16L20 22L26 14L36 28H8Z" fill="oklch(0.08 0.005 260)" opacity="0.9" />
              <path d="M22 30C22 30 10 26 10 20C10 17.2 12.2 15 15 15C17 15 18.8 16.1 19.8 17.8C20.8 16.1 22.6 15 24.6 15C27.4 15 29.6 17.2 29.6 20C29.6 26 22 30 22 30Z" fill="oklch(0.97 0.008 80)" opacity="0.85" />
            </svg>
            <span className="text-[oklch(0.74_0.15_55)] font-display font-semibold text-sm tracking-widest uppercase">EV Shield Wrap</span>
          </div>
          {/* Proof line */}
          <p className="text-[oklch(0.45_0.01_260)] text-xs mb-2 tracking-wide">Used by detail shops, PPF installers, body shops, wrap studios.</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[oklch(0.97_0.008_80)] leading-tight">
            Photo to signed estimate<br />in 3 minutes.
          </h1>
          <p className="text-[oklch(0.75_0.005_260)] mt-3 text-base sm:text-lg">Auto shops lose deals when estimates read like shop-speak. This one reads like a text message. Draw-to-sign, 30% deposit, done.</p>

          {/* Trust stats */}
          <div className="flex flex-wrap gap-3 mt-5">
            {[
              { stat: "94%", label: "read-to-sign rate" },
              { stat: "$2,149", label: "average deposit" },
              { stat: "11 min", label: "end-to-end" },
            ].map(({ stat, label }) => (
              <div key={stat} className="flex items-baseline gap-1.5 bg-[oklch(0.14_0.005_260)] border border-[oklch(0.28_0.005_260)] rounded-xl px-3 py-2">
                <span className="font-display font-bold text-[oklch(0.74_0.15_55)] text-lg">{stat}</span>
                <span className="text-[oklch(0.45_0.01_260)] text-xs">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {state.step < 5 && <StepIndicator current={state.step} />}
        {state.step > 1 && <PriceTicker total={total} />}

        <AnimatePresence mode="wait">
          <motion.div
            key={state.step}
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            {state.step === 1 && (
              <StepPhotos state={state} dispatch={dispatch} onNext={() => dispatch({ type: "SET_STEP", payload: 2 })} />
            )}
            {state.step === 2 && (
              <StepVehicle
                state={state} dispatch={dispatch}
                onNext={() => dispatch({ type: "SET_STEP", payload: 3 })}
                onBack={() => dispatch({ type: "SET_STEP", payload: 1 })}
              />
            )}
            {state.step === 3 && (
              <StepPackage
                state={state} dispatch={dispatch}
                onNext={() => dispatch({ type: "SET_STEP", payload: 4 })}
                onBack={() => dispatch({ type: "SET_STEP", payload: 2 })}
              />
            )}
            {state.step === 4 && (
              <StepSign
                state={state} dispatch={dispatch}
                onNext={() => dispatch({ type: "SET_STEP", payload: 5 })}
                onBack={() => dispatch({ type: "SET_STEP", payload: 3 })}
              />
            )}
            {state.step === 5 && (
              <StepEstimate state={state} dispatch={dispatch} onReset={reset} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
