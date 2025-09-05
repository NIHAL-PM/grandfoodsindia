export type Consultation = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  preferredDate?: string;
  preferredTime?: string;
  createdAt: string;
  status: "new" | "contacted" | "completed";
};

export type PaymentProof = {
  id: string;
  courseId: string;
  courseTitle: string;
  plan: string;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  fileDataUrl: string; // base64
  createdAt: string;
  status: "pending" | "approved" | "rejected";
};

// NEW: Enrollment related types
export interface EnrollmentParticipant {
  id: string;
  name: string;
  age?: string;
  occupation?: string;
  email?: string;
  phone?: string;
}

export interface Enrollment {
  id: string;
  courseId: string;
  courseTitle: string;
  enrollmentType: "individual" | "group";
  participants: EnrollmentParticipant[];
  payer: {
    name: string;
    email: string;
    phone?: string;
    organization?: string;
  };
  paymentMethod: "upi" | "card" | "bank";
  paymentProofDataUrl?: string;
  notes?: string;
  plan?: string; // added plan selected
  status: "submitted" | "processing" | "confirmed" | "rejected";
  createdAt: string;
}

const LS_KEYS = {
  consultations: "kaisan_consultations_v1",
  payments: "kaisan_payments_v1",
  enrollments: "kaisan_enrollments_v1", // NEW
  certificates: "kaisan_certificates_v1",
  trainerCalls: "kaisan_trainer_calls_v1",
};

function readArray<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function writeArray<T>(key: string, value: T[]) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const Storage = {
  getConsultations(): Consultation[] {
    return readArray<Consultation>(LS_KEYS.consultations);
  },
  addConsultation(c: Consultation) {
    const all = Storage.getConsultations();
    all.unshift(c);
    writeArray(LS_KEYS.consultations, all);
  },
  updateConsultation(id: string, patch: Partial<Consultation>) {
    const all = Storage.getConsultations().map((c) => (c.id === id ? { ...c, ...patch } : c));
    writeArray(LS_KEYS.consultations, all);
  },

  getPayments(): PaymentProof[] {
    return readArray<PaymentProof>(LS_KEYS.payments);
  },
  addPayment(p: PaymentProof) {
    const all = Storage.getPayments();
    all.unshift(p);
    writeArray(LS_KEYS.payments, all);
  },
  updatePayment(id: string, patch: Partial<PaymentProof>) {
    const all = Storage.getPayments().map((p) => (p.id === id ? { ...p, ...patch } : p));
    writeArray(LS_KEYS.payments, all);
  },

  // NEW Enrollment methods
  getEnrollments(): Enrollment[] {
    return readArray<Enrollment>(LS_KEYS.enrollments);
  },
  addEnrollment(e: Enrollment) {
    const all = Storage.getEnrollments();
    all.unshift(e);
    writeArray(LS_KEYS.enrollments, all);
  },
  updateEnrollment(id: string, patch: Partial<Enrollment>) {
    const all = Storage.getEnrollments().map((e) => (e.id === id ? { ...e, ...patch } : e));
    writeArray(LS_KEYS.enrollments, all);
  },
  // Certificates -------------------------------------------------
  getCertificates(): CertificateRecord[] {
    return readArray<CertificateRecord>(LS_KEYS.certificates);
  },
  addCertificate(c: CertificateRecord) {
    const all = Storage.getCertificates();
    all.push(c);
    writeArray(LS_KEYS.certificates, all);
  },
  bulkAddCertificates(certs: CertificateRecord[]) {
    const all = Storage.getCertificates();
    writeArray(LS_KEYS.certificates, [...all, ...certs]);
  },
  findCertificateByNumber(number: string): CertificateRecord | undefined {
    return Storage.getCertificates().find(c => c.certificateNumber.toUpperCase() === number.toUpperCase());
  },

  // Trainer Call Requests -----------------------------------------
  getTrainerCalls(): TrainerCallRequest[] {
    return readArray<TrainerCallRequest>(LS_KEYS.trainerCalls);
  },
  addTrainerCall(call: TrainerCallRequest) {
    const all = Storage.getTrainerCalls();
    all.unshift(call);
    writeArray(LS_KEYS.trainerCalls, all);
  },
  updateTrainerCall(id: string, patch: Partial<TrainerCallRequest>) {
    const all = Storage.getTrainerCalls().map(c => c.id === id ? { ...c, ...patch } : c);
    writeArray(LS_KEYS.trainerCalls, all);
  },
};

// ---------------- CERTIFICATES TYPES & HELPERS ------------------
export interface CertificateRecord {
  id: string; // uuid
  studentName: string;
  studentEmail?: string;
  courseId: string;
  courseTitle: string;
  courseSubtitle?: string;
  instructor?: string;
  issueDate: string; // ISO date
  certificateNumber: string; // e.g. KA-2025-PRP-00001
  hours?: string;
  grade?: string;
  sequence: number; // numeric sequence within year
  year: number;
  verificationUrl: string; // /verify-certificate?cert=...
  hash: string; // simple integrity hash
}

// ---------------- TRAINER CALL REQUESTS -------------------------
export interface TrainerCallRequest {
  id: string;
  trainerId: string;
  trainerName: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  callType: 'video' | 'phone' | 'whatsapp';
  date: string; // ISO
  slot: string; // e.g. 09:00 AM - 09:30 AM
  timezone: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

function shortCourseCode(courseId: string): string {
  // Take hyphen separated parts, first 2 letters of each up to 3 parts, uppercase
  return courseId
    .split('-')
    .slice(0, 3)
    .map(p => p.replace(/[^a-zA-Z0-9]/g, '').slice(0, 2))
    .join('')
    .toUpperCase();
}

export function nextCertificateNumber(courseId: string): { certificateNumber: string; sequence: number; year: number } {
  const year = new Date().getFullYear();
  const code = shortCourseCode(courseId);
  const existing = Storage.getCertificates().filter(c => c.year === year);
  const sequence = existing.length + 1; // simple sequential per year
  const certificateNumber = `KA-${year}-${code}-${String(sequence).padStart(5, '0')}`;
  return { certificateNumber, sequence, year };
}

export function computeCertificateHash(payload: Omit<CertificateRecord, 'hash'>): string {
  // Lightweight pseudo-hash (NOT cryptographically secure) – improves tamper detection for demo.
  const data = JSON.stringify(payload);
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = (hash * 31 + data.charCodeAt(i)) >>> 0;
  }
  return 'H' + hash.toString(16).padStart(8, '0');
}

