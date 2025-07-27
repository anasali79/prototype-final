"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { ModernNavbar } from "@/components/ModernNavbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { doctorsAPI, appointmentsAPI, type Doctor } from "@/lib/api"
import {
  Calendar,
  Clock,
  Video,
  Phone,
  Building,
  CreditCard,
  CheckCircle,
  Wifi,
  Shield,
  IndianRupee,
  MapPin,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"

export default function BookingPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { toast } = useToast()

  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [consultationType, setConsultationType] = useState(searchParams.get("type") || "clinic")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [symptoms, setSymptoms] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [showPayment, setShowPayment] = useState(false)
  const [bookingStage, setBookingStage] = useState(0)
  const [bookingComplete, setBookingComplete] = useState(false)

  // Booking stages with adequate durations to ensure proper transitions
  const bookingStages = [
    { title: "Checking Availability", icon: Calendar, color: "text-blue-500", duration: 1200 },
    { title: "Verifying Connection", icon: Wifi, color: "text-green-500", duration: 1000 },
    { title: "Processing Payment", icon: IndianRupee, color: "text-purple-500", duration: 1000 },
    { title: "Confirming Booking", icon: Shield, color: "text-emerald-500", duration: 1200 },
  ]

  useEffect(() => {
    if (params.id) {
      loadDoctor(params.id as string)
    }
  }, [params.id])

  useEffect(() => {
    // Set default date to today in Indian timezone
    const today = new Date()
    const indianDate = new Date(today.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
    setSelectedDate(indianDate.toISOString().split("T")[0])
  }, [])

  const loadDoctor = async (id: string) => {
    try {
      const doctorData = await doctorsAPI.getById(id)
      setDoctor(doctorData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load doctor information",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getConsultationFee = () => {
    if (!doctor) return 0
    return consultationType === "clinic" ? doctor.consultationFee : doctor.videoConsultationFee
  }

  const getAvailableDates = () => {
    const dates = []
    const today = new Date()

    for (let i = 0; i < 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const dayName = date.toLocaleDateString("en-IN", { weekday: "long", timeZone: "Asia/Kolkata" })

      // Check if doctor is available on this day
      const availabilityKey = consultationType === "clinic" ? "clinic" : "online"
      const isAvailable = doctor?.availability?.[availabilityKey]?.includes(dayName)

      if (isAvailable) {
        dates.push({
          date: date.toISOString().split("T")[0],
          display: date.toLocaleDateString("en-IN", {
            weekday: "short",
            month: "short",
            day: "numeric",
            timeZone: "Asia/Kolkata",
          }),
          dayName,
        })
      }
    }

    return dates
  }

  const formatIndianTime = (time: string) => {
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

  const handleBookAppointment = async () => {
    if (!doctor || !user || !selectedDate || !selectedTime) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setShowPayment(true)
  }

  const handlePayment = async () => {
    if (!doctor || !user) return

    try {
      // Start from stage 0
      setBookingStage(0)
      
      // Stage 0: Checking Availability
      await new Promise(resolve => setTimeout(resolve, 1500))
      setBookingStage(1)
      
      // Stage 1: Verifying Connection
      await new Promise(resolve => setTimeout(resolve, 1200))
      setBookingStage(2)
      
      // Stage 2: Processing Payment
      await new Promise(resolve => setTimeout(resolve, 1000))
      setBookingStage(3)
      
      // Stage 3: Confirming Booking
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Create the appointment
      const appointment = {
        doctorId: doctor.id,
        patientId: user.id,
        doctorName: doctor.name,
        patientName: user.name,
        specialty: doctor.specialty,
        date: selectedDate,
        time: selectedTime,
        status: "confirmed" as const,
        consultationType,
        symptoms,
        fee: getConsultationFee(),
      }
      
      await appointmentsAPI.create(appointment)
      
      // Complete the booking
      setBookingComplete(true)
      toast({
        title: "Success! 🎉",
        description: "Appointment booked successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to book appointment",
        variant: "destructive",
      })
      setShowPayment(false)
      setBookingStage(0)
    }
  }

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={["patient"]}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <ModernNavbar />
          <div className="max-w-4xl mx-auto px-4 py-8">
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative mx-auto w-16 h-16 mb-6">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-400"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
              </div>
              <motion.p
                className="mt-6 text-lg text-gray-600"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Loading booking information...
              </motion.p>
            </motion.div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!doctor) {
    return (
      <ProtectedRoute allowedRoles={["patient"]}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <ModernNavbar />
          <div className="max-w-4xl mx-auto px-4 py-8">
            <Card className="text-center py-12">
              <CardContent>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Doctor not found</h3>
                <Button onClick={() => router.push("/find-doctors")}>Back to Search</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (bookingComplete) {
    return (
      <ProtectedRoute allowedRoles={["patient"]}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <ModernNavbar />
          <div className="max-w-2xl mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Card className="text-center py-12 bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
                <CardContent className="px-4 sm:px-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                  </motion.div>
                  <motion.h2
                    className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    Booking Confirmed! 🎉
                  </motion.h2>
                  <motion.p
                    className="text-gray-600 mb-8 text-base sm:text-lg px-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    Your appointment with Dr. {doctor.name} has been successfully booked.
                  </motion.p>
                  <motion.div
                    className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 sm:p-6 rounded-2xl mb-8 mx-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <div className="space-y-3 text-sm sm:text-base">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-semibold text-gray-900">
                          {new Date(selectedDate).toLocaleDateString("en-IN", {
                            timeZone: "Asia/Kolkata",
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-semibold text-gray-900">{formatIndianTime(selectedTime)} IST</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-semibold text-gray-900 capitalize">{consultationType}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Fee:</span>
                        <span className="font-bold text-green-600 text-lg">₹{getConsultationFee()}</span>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    className="flex flex-col sm:flex-row gap-4 justify-center px-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                  >
                    <Button
                      onClick={() => router.push("/appointments")}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full sm:w-auto"
                    >
                      View Appointments
                    </Button>
                    <Button variant="outline" onClick={() => router.push("/")} className="w-full sm:w-auto">
                      Back to Home
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  // Booking stages animation - faster and smoother
  if (showPayment && bookingStage < bookingStages.length) {
    return (
      <ProtectedRoute allowedRoles={["patient"]}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto w-full"
          >
            <Card className="text-center py-8 sm:py-12 bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
              <CardContent className="px-4 sm:px-8">
                <motion.h2
                  className="text-xl sm:text-2xl font-bold text-gray-900 mb-8"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Booking Your Appointment
                </motion.h2>

                <div className="space-y-6">
                  {bookingStages.map((stage, index) => {
                    const Icon = stage.icon
                    const isActive = index === bookingStage
                    const isCompleted = index < bookingStage

                    return (
                      <motion.div
                        key={index}
                        className={`flex items-center space-x-4 p-3 sm:p-4 rounded-xl transition-all duration-300 ${
                          isActive
                            ? "bg-blue-50 border-2 border-blue-200 shadow-md"
                            : isCompleted
                              ? "bg-green-50 border-2 border-green-200"
                              : "bg-gray-50 border-2 border-gray-100"
                        }`}
                        initial={{ opacity: 0.3, x: -20 }}
                        animate={{
                          opacity: isActive || isCompleted ? 1 : 0.3,
                          x: 0,
                          scale: isActive ? 1.02 : 1,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <div
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                            isCompleted ? "bg-green-500" : isActive ? "bg-blue-500" : "bg-gray-300"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          ) : (
                            <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${isActive ? "text-white" : "text-gray-500"}`} />
                          )}
                        </div>
                        <div className="flex-1 text-left">
                          <h3
                            className={`font-semibold text-sm sm:text-base ${
                              isActive ? "text-blue-700" : isCompleted ? "text-green-700" : "text-gray-500"
                            }`}
                          >
                            {stage.title}
                          </h3>
                          {isActive && (
                            <motion.div
                              className="w-full bg-blue-200 rounded-full h-1.5 sm:h-2 mt-2"
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                            >
                              <motion.div
                                className="bg-blue-500 h-1.5 sm:h-2 rounded-full"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: stage.duration / 1000, ease: "linear" }}
                              />
                            </motion.div>
                          )}
                        </div>
                        {isActive && (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-blue-500 border-t-transparent rounded-full"
                          />
                        )}
                      </motion.div>
                    )
                  })}
                </div>

                <motion.p
                  className="mt-8 text-gray-600 text-sm sm:text-base"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Please wait while we process your booking...
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["patient"]}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <ModernNavbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <motion.div
            className="mb-6 sm:mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Book Appointment
            </h1>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
              Schedule your consultation with Dr. {doctor.name}
            </p>
            <div className="flex items-center mt-2 text-xs sm:text-sm text-blue-600">
              <MapPin className="w-4 h-4 mr-1" />
              <span>
                India •{" "}
                {new Date().toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}{" "}
                IST
              </span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Booking Form */}
            <div className="xl:col-span-2 space-y-4 sm:space-y-6">
              <AnimatePresence mode="wait">
                {!showPayment ? (
                  <motion.div
                    key="booking-form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4 sm:space-y-6"
                  >
                    {/* Doctor Info */}
                    <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                          <motion.img
                            src={doctor.image || "/placeholder.svg?height=80&width=80&text=Doctor"}
                            alt={doctor.name}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-blue-100"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                          />
                          <div className="text-center sm:text-left">
                            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{doctor.name}</h3>
                            <p className="text-blue-600 font-semibold text-sm sm:text-base">{doctor.specialty}</p>
                            <div className="flex items-center justify-center sm:justify-start mt-2">
                              {consultationType === "clinic" && <Building className="w-4 h-4 mr-2" />}
                              {consultationType === "video" && <Video className="w-4 h-4 mr-2" />}
                              {consultationType === "call" && <Phone className="w-4 h-4 mr-2" />}
                              <span className="text-xs sm:text-sm text-gray-600 capitalize">
                                {consultationType} Consultation
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Date Selection */}
                    <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center text-base sm:text-lg lg:text-xl">
                          <Calendar className="w-5 h-5 mr-2" />
                          Select Date
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                          {getAvailableDates().map((dateOption, index) => (
                            <motion.button
                              key={dateOption.date}
                              onClick={() => setSelectedDate(dateOption.date)}
                              className={`p-2 sm:p-3 text-center border-2 rounded-xl transition-all duration-200 ${
                                selectedDate === dateOption.date
                                  ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md"
                                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                              }`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <div className="text-xs sm:text-sm font-semibold">{dateOption.display}</div>
                              <div className="text-xs text-gray-500 mt-1">{dateOption.dayName}</div>
                            </motion.button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Time Selection */}
                    <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center text-base sm:text-lg lg:text-xl">
                          <Clock className="w-5 h-5 mr-2" />
                          Select Time (IST)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
                          {doctor.timeSlots?.map((time, index) => (
                            <motion.button
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={`p-2 sm:p-3 text-center border-2 rounded-xl transition-all duration-200 text-xs sm:text-sm font-medium ${
                                selectedTime === time
                                  ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md"
                                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                              }`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.03 }}
                            >
                              {formatIndianTime(time)}
                            </motion.button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Symptoms */}
                    <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-base sm:text-lg lg:text-xl">Describe Your Symptoms</CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                          Please provide details about your condition to help the doctor prepare
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          placeholder="Describe your symptoms, concerns, or reason for consultation..."
                          value={symptoms}
                          onChange={(e) => setSymptoms(e.target.value)}
                          rows={4}
                          className="resize-none text-sm sm:text-base"
                        />
                      </CardContent>
                    </Card>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 sm:py-4 text-sm sm:text-base lg:text-lg rounded-xl shadow-lg"
                        size="lg"
                        onClick={handleBookAppointment}
                        disabled={!selectedDate || !selectedTime}
                      >
                        Proceed to Payment
                      </Button>
                    </motion.div>
                  </motion.div>
                ) : (
                  /* Payment Form */
                  <motion.div
                    key="payment-form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center text-base sm:text-lg lg:text-xl">
                          <CreditCard className="w-5 h-5 mr-2" />
                          Payment Information
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                          Complete your payment to confirm the appointment
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="cardName" className="text-sm">
                              Cardholder Name
                            </Label>
                            <Input id="cardName" placeholder="John Doe" className="mt-1 text-sm sm:text-base" />
                          </div>
                          <div>
                            <Label htmlFor="cardNumber" className="text-sm">
                              Card Number
                            </Label>
                            <Input
                              id="cardNumber"
                              placeholder="1234 5678 9012 3456"
                              className="mt-1 text-sm sm:text-base"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiry" className="text-sm">
                              Expiry Date
                            </Label>
                            <Input id="expiry" placeholder="MM/YY" className="mt-1 text-sm sm:text-base" />
                          </div>
                          <div>
                            <Label htmlFor="cvv" className="text-sm">
                              CVV
                            </Label>
                            <Input id="cvv" placeholder="123" className="mt-1 text-sm sm:text-base" />
                          </div>
                        </div>

                        <div className="pt-6 border-t border-gray-200">
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 sm:py-4 text-sm sm:text-base lg:text-lg rounded-xl shadow-lg"
                              size="lg"
                              onClick={handlePayment}
                            >
                              <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                              Pay ₹{getConsultationFee()} & Book Appointment
                            </Button>
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Booking Summary */}
            <div className="xl:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="sticky top-8 bg-white/95 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg lg:text-xl">Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-gray-600 text-sm">Doctor:</span>
                        <span className="font-semibold text-gray-900 text-right text-sm">{doctor.name}</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-gray-600 text-sm">Specialty:</span>
                        <span className="font-semibold text-gray-900 text-right text-sm">{doctor.specialty}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">Type:</span>
                        <div className="flex items-center">
                          {consultationType === "clinic" && <Building className="w-4 h-4 mr-1" />}
                          {consultationType === "video" && <Video className="w-4 h-4 mr-1" />}
                          {consultationType === "call" && <Phone className="w-4 h-4 mr-1" />}
                          <span className="font-semibold text-gray-900 capitalize text-sm">{consultationType}</span>
                        </div>
                      </div>
                      {selectedDate && (
                        <motion.div
                          className="flex justify-between items-start"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <span className="text-gray-600 text-sm">Date:</span>
                          <span className="font-semibold text-gray-900 text-right text-sm">
                            {new Date(selectedDate).toLocaleDateString("en-IN", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              timeZone: "Asia/Kolkata",
                            })}
                          </span>
                        </motion.div>
                      )}
                      {selectedTime && (
                        <motion.div
                          className="flex justify-between items-center"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                        >
                          <span className="text-gray-600 text-sm">Time:</span>
                          <span className="font-semibold text-gray-900 text-sm">
                            {formatIndianTime(selectedTime)} IST
                          </span>
                        </motion.div>
                      )}
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-base sm:text-lg font-semibold text-gray-900">Total:</span>
                        <motion.span
                          className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          ₹{getConsultationFee()}
                        </motion.span>
                      </div>
                    </div>

                    {consultationType !== "clinic" && (
                      <motion.div
                        className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 sm:p-4 rounded-xl border border-blue-100"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                      >
                        <p className="text-xs sm:text-sm text-blue-800">
                          <strong>Note:</strong> You will receive a{" "}
                          {consultationType === "video" ? "video call" : "phone call"} link/number before your
                          appointment.
                        </p>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
