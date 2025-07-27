// Mock API for doctor appointment system with Indian context
export interface Doctor {
  id: string
  name: string
  specialty: string
  qualifications: string
  experience: string
  rating: number
  reviewCount: number
  consultationFee: number
  videoConsultationFee: number
  image?: string
  about: string
  clinicAddress: string
  availability?: {
    clinic?: string[]
    online?: string[]
  }
  timeSlots?: string[]
  consultationType?: string[]
}

export interface Appointment {
  id?: string
  doctorId: string
  patientId: string
  doctorName: string
  patientName: string
  specialty: string
  date: string
  time: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  consultationType: string
  symptoms?: string
  fee: number
  createdAt?: string
}

export interface User {
  id: string
  name: string
  email: string
  role: "patient" | "doctor"
  phone?: string
  address?: string
}

// Mock data with Indian context
const mockDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Rajesh Kumar",
    specialty: "Cardiology",
    qualifications: "MBBS, MD (Cardiology), AIIMS Delhi",
    experience: "15 years",
    rating: 4.8,
    reviewCount: 245,
    consultationFee: 800,
    videoConsultationFee: 600,
    image: "/placeholder.svg?height=200&width=200&text=Dr.+Rajesh",
    about:
      "Dr. Rajesh Kumar is a renowned cardiologist with over 15 years of experience in treating heart conditions. He specializes in interventional cardiology and has performed over 2000 successful procedures.",
    clinicAddress: "Apollo Hospital, Sarita Vihar, New Delhi, Delhi 110076",
    availability: {
      clinic: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      online: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    },
    timeSlots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
    consultationType: ["clinic", "video", "call"],
  },
  {
    id: "2",
    name: "Dr. Priya Sharma",
    specialty: "Dermatology",
    qualifications: "MBBS, MD (Dermatology), PGIMER Chandigarh",
    experience: "12 years",
    rating: 4.9,
    reviewCount: 189,
    consultationFee: 700,
    videoConsultationFee: 500,
    image: "/placeholder.svg?height=200&width=200&text=Dr.+Priya",
    about:
      "Dr. Priya Sharma is a leading dermatologist specializing in cosmetic dermatology, acne treatment, and skin cancer prevention. She has helped thousands of patients achieve healthy, glowing skin.",
    clinicAddress: "Fortis Hospital, Sector 62, Noida, Uttar Pradesh 201301",
    availability: {
      clinic: ["Monday", "Wednesday", "Friday", "Saturday"],
      online: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    },
    timeSlots: ["10:00", "11:00", "12:00", "15:00", "16:00", "17:00", "18:00"],
    consultationType: ["clinic", "video", "call"],
  },
  {
    id: "3",
    name: "Dr. Amit Patel",
    specialty: "Neurology",
    qualifications: "MBBS, DM (Neurology), KEM Hospital Mumbai",
    experience: "18 years",
    rating: 4.7,
    reviewCount: 312,
    consultationFee: 1000,
    videoConsultationFee: 800,
    image: "/placeholder.svg?height=200&width=200&text=Dr.+Amit",
    about:
      "Dr. Amit Patel is a highly experienced neurologist specializing in stroke management, epilepsy treatment, and neurodegenerative disorders. He has been instrumental in establishing stroke care protocols in leading hospitals.",
    clinicAddress: "Kokilaben Dhirubhai Ambani Hospital, Andheri West, Mumbai, Maharashtra 400053",
    availability: {
      clinic: ["Tuesday", "Thursday", "Friday", "Saturday"],
      online: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
    timeSlots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
    consultationType: ["clinic", "video"],
  },
  {
    id: "4",
    name: "Dr. Sunita Reddy",
    specialty: "Pediatrics",
    qualifications: "MBBS, MD (Pediatrics), NIMHANS Bangalore",
    experience: "10 years",
    rating: 4.9,
    reviewCount: 156,
    consultationFee: 600,
    videoConsultationFee: 450,
    image: "/placeholder.svg?height=200&width=200&text=Dr.+Sunita",
    about:
      "Dr. Sunita Reddy is a compassionate pediatrician with expertise in child development, vaccination, and pediatric emergency care. She is known for her gentle approach with children and comprehensive care.",
    clinicAddress: "Manipal Hospital, HAL Airport Road, Bangalore, Karnataka 560017",
    availability: {
      clinic: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      online: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    },
    timeSlots: ["09:00", "10:00", "11:00", "12:00", "15:00", "16:00", "17:00", "18:00"],
    consultationType: ["clinic", "video", "call"],
  },
  {
    id: "5",
    name: "Dr. Vikram Singh",
    specialty: "Orthopedics",
    qualifications: "MBBS, MS (Orthopedics), PGIMER Chandigarh",
    experience: "14 years",
    rating: 4.6,
    reviewCount: 203,
    consultationFee: 900,
    videoConsultationFee: 700,
    image: "/placeholder.svg?height=200&width=200&text=Dr.+Vikram",
    about:
      "Dr. Vikram Singh is a skilled orthopedic surgeon specializing in joint replacement, sports injuries, and spine surgery. He has successfully performed over 1500 orthopedic procedures.",
    clinicAddress: "Max Super Speciality Hospital, Saket, New Delhi, Delhi 110017",
    availability: {
      clinic: ["Monday", "Wednesday", "Thursday", "Friday", "Saturday"],
      online: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    },
    timeSlots: ["08:00", "09:00", "10:00", "14:00", "15:00", "16:00", "17:00"],
    consultationType: ["clinic", "video"],
  },
  {
    id: "6",
    name: "Dr. Meera Joshi",
    specialty: "Psychiatry",
    qualifications: "MBBS, MD (Psychiatry), NIMHANS Bangalore",
    experience: "8 years",
    rating: 4.8,
    reviewCount: 134,
    consultationFee: 750,
    videoConsultationFee: 600,
    image: "/placeholder.svg?height=200&width=200&text=Dr.+Meera",
    about:
      "Dr. Meera Joshi is a dedicated psychiatrist specializing in anxiety disorders, depression, and cognitive behavioral therapy. She provides compassionate mental health care with a holistic approach.",
    clinicAddress: "Jaslok Hospital, Pedder Road, Mumbai, Maharashtra 400026",
    availability: {
      clinic: ["Monday", "Tuesday", "Thursday", "Friday"],
      online: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    },
    timeSlots: ["10:00", "11:00", "12:00", "15:00", "16:00", "17:00", "18:00"],
    consultationType: ["clinic", "video", "call"],
  },
]

const mockAppointments: Appointment[] = []

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock API functions
export const doctorsAPI = {
  async getAll(): Promise<Doctor[]> {
    await delay(800)
    return mockDoctors
  },

  async getById(id: string): Promise<Doctor | null> {
    await delay(500)
    return mockDoctors.find((doctor) => doctor.id === id) || null
  },

  async getBySpecialty(specialty: string): Promise<Doctor[]> {
    await delay(600)
    return mockDoctors.filter((doctor) => doctor.specialty.toLowerCase().includes(specialty.toLowerCase()))
  },
}

export const appointmentsAPI = {
  async getAll(): Promise<Appointment[]> {
    await delay(500)
    return mockAppointments
  },

  async getByPatientId(patientId: string): Promise<Appointment[]> {
    await delay(400)
    return mockAppointments.filter((apt) => apt.patientId === patientId)
  },

  async getByDoctorId(doctorId: string): Promise<Appointment[]> {
    await delay(400)
    return mockAppointments.filter((apt) => apt.doctorId === doctorId)
  },

  async create(appointment: Omit<Appointment, "id" | "createdAt">): Promise<Appointment> {
    await delay(1000)
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    mockAppointments.push(newAppointment)
    return newAppointment
  },

  async update(id: string, updates: Partial<Appointment>): Promise<Appointment | null> {
    await delay(600)
    const index = mockAppointments.findIndex((apt) => apt.id === id)
    if (index === -1) return null

    mockAppointments[index] = { ...mockAppointments[index], ...updates }
    return mockAppointments[index]
  },

  async cancel(id: string): Promise<boolean> {
    await delay(500)
    const index = mockAppointments.findIndex((apt) => apt.id === id)
    if (index === -1) return false

    mockAppointments[index].status = "cancelled"
    return true
  },
}

export const authAPI = {
  async login(email: string, password: string): Promise<User | null> {
    await delay(800)

    // Mock users for testing
    const mockUsers: User[] = [
      {
        id: "patient1",
        name: "Rahul Sharma",
        email: "rahul@example.com",
        role: "patient",
        phone: "+91 9876543210",
        address: "123 MG Road, Bangalore, Karnataka 560001",
      },
      {
        id: "doctor1",
        name: "Dr. Rajesh Kumar",
        email: "rajesh@example.com",
        role: "doctor",
        phone: "+91 9876543211",
        address: "Apollo Hospital, New Delhi",
      },
    ]

    // Simple mock authentication
    if (email === "rahul@example.com" && password === "password123") {
      return mockUsers[0]
    }
    if (email === "rajesh@example.com" && password === "doctor123") {
      return mockUsers[1]
    }

    return null
  },

  async register(userData: Omit<User, "id">): Promise<User> {
    await delay(1000)
    return {
      ...userData,
      id: Date.now().toString(),
    }
  },
}

// Utility functions for Indian context
export const formatIndianCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount)
}

export const formatIndianDate = (date: string): string => {
  return new Date(date).toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export const formatIndianTime = (time: string): string => {
  const [hours, minutes] = time.split(":")
  const date = new Date()
  date.setHours(Number.parseInt(hours), Number.parseInt(minutes))
  return date.toLocaleString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  })
}

export const getCurrentIndianTime = (): string => {
  return new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}
