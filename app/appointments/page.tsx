"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { ModernNavbar } from "@/components/ModernNavbar"
import { ModernFooter } from "@/components/ModernFooter"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { appointmentsAPI, type Appointment, formatIndianDate, formatIndianTime } from "@/lib/api"
import {
  Calendar,
  Clock,
  Video,
  Phone,
  Building,
  IndianRupee,
  RotateCcw,
  X,
  CheckCircle,
  AlertCircle,
  MapPin,
  User,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"

export default function AppointmentsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState("upcoming")
  const [rescheduleDialog, setRescheduleDialog] = useState<string | null>(null)
  const [cancelDialog, setCancelDialog] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadAppointments()
    }
  }, [user])

  const loadAppointments = async () => {
    if (!user) return

    try {
      const appointmentsData = await appointmentsAPI.getByPatientId(user.id)
      setAppointments(appointmentsData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load appointments",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReschedule = async (appointmentId: string) => {
    try {
      // In a real app, this would open a date/time picker
      toast({
        title: "Reschedule Request Sent",
        description: "We'll contact you shortly to confirm the new appointment time.",
      })
      setRescheduleDialog(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reschedule appointment",
        variant: "destructive",
      })
    }
  }

  const handleCancel = async (appointmentId: string) => {
    try {
      await appointmentsAPI.cancel(appointmentId)
      await loadAppointments()
      toast({
        title: "Appointment Cancelled",
        description: "Your appointment has been successfully cancelled.",
      })
      setCancelDialog(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel appointment",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "cancelled":
        return <X className="w-4 h-4" />
      case "pending":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const filterAppointments = (status: string) => {
    const now = new Date()
    const today = now.toISOString().split("T")[0]

    switch (status) {
      case "upcoming":
        return appointments.filter(
          (apt) => (apt.status === "confirmed" || apt.status === "pending") && apt.date >= today,
        )
      case "completed":
        return appointments.filter((apt) => apt.status === "completed")
      case "cancelled":
        return appointments.filter((apt) => apt.status === "cancelled")
      case "history":
        return appointments.filter(
          (apt) => apt.date < today || apt.status === "completed" || apt.status === "cancelled",
        )
      default:
        return appointments
    }
  }

  const AppointmentCard = ({ appointment, index }: { appointment: Appointment; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -2 }}
    >
      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start space-y-4 sm:space-y-0">
            <div className="flex-1 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">{appointment.doctorName}</h3>
                  <p className="text-blue-600 font-semibold text-sm sm:text-base">{appointment.specialty}</p>
                </div>
                <Badge className={`${getStatusColor(appointment.status)} border w-fit mt-2 sm:mt-0`}>
                  {getStatusIcon(appointment.status)}
                  <span className="ml-1 capitalize">{appointment.status}</span>
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{formatIndianDate(appointment.date)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{formatIndianTime(appointment.time)} IST</span>
                </div>
                <div className="flex items-center text-gray-600">
                  {appointment.consultationType === "clinic" && <Building className="w-4 h-4 mr-2" />}
                  {appointment.consultationType === "video" && <Video className="w-4 h-4 mr-2" />}
                  {appointment.consultationType === "call" && <Phone className="w-4 h-4 mr-2" />}
                  <span className="capitalize">{appointment.consultationType}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <IndianRupee className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>₹{appointment.fee}</span>
                </div>
              </div>

              {appointment.symptoms && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Symptoms:</strong> {appointment.symptoms}
                  </p>
                </div>
              )}
            </div>

            {appointment.status === "confirmed" && (
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Dialog
                  open={rescheduleDialog === appointment.id}
                  onOpenChange={(open) => !open && setRescheduleDialog(null)}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRescheduleDialog(appointment.id)}
                      className="w-full sm:w-auto"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reschedule
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Reschedule Appointment</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to reschedule your appointment with {appointment.doctorName}?
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button variant="outline" onClick={() => setRescheduleDialog(null)}>
                        Cancel
                      </Button>
                      <Button onClick={() => handleReschedule(appointment.id!)}>Confirm Reschedule</Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={cancelDialog === appointment.id} onOpenChange={(open) => !open && setCancelDialog(null)}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCancelDialog(appointment.id)}
                      className="text-red-600 border-red-200 hover:bg-red-50 w-full sm:w-auto"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Cancel Appointment</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to cancel your appointment with {appointment.doctorName}? This action
                        cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button variant="outline" onClick={() => setCancelDialog(null)}>
                        Keep Appointment
                      </Button>
                      <Button variant="destructive" onClick={() => handleCancel(appointment.id!)}>
                        Cancel Appointment
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={["patient"]}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <ModernNavbar />
          <div className="max-w-6xl mx-auto px-4 py-8">
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
              <p className="text-lg text-gray-600">Loading your appointments...</p>
            </motion.div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["patient"]}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <ModernNavbar />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <motion.div
            className="mb-6 sm:mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
              My Appointments
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">Manage your healthcare appointments</p>
            <div className="flex items-center mt-2 text-sm text-blue-600">
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

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6 sm:mb-8 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <TabsTrigger value="upcoming" className="text-xs sm:text-sm">
                  Upcoming ({filterAppointments("upcoming").length})
                </TabsTrigger>
                <TabsTrigger value="completed" className="text-xs sm:text-sm">
                  Completed ({filterAppointments("completed").length})
                </TabsTrigger>
                <TabsTrigger value="cancelled" className="text-xs sm:text-sm">
                  Cancelled ({filterAppointments("cancelled").length})
                </TabsTrigger>
                <TabsTrigger value="history" className="text-xs sm:text-sm">
                  History ({filterAppointments("history").length})
                </TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                <TabsContent value="upcoming" className="space-y-4 sm:space-y-6">
                  {filterAppointments("upcoming").length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card className="text-center py-16 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                        <CardContent>
                          <Calendar className="w-20 h-20 mx-auto text-gray-400 mb-6" />
                          <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Upcoming Appointments</h3>
                          <p className="text-gray-600 text-lg mb-6">
                            You don't have any upcoming appointments scheduled.
                          </p>
                          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            Book New Appointment
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ) : (
                    <div className="space-y-4 sm:space-y-6">
                      {filterAppointments("upcoming").map((appointment, index) => (
                        <AppointmentCard key={appointment.id} appointment={appointment} index={index} />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="completed" className="space-y-4 sm:space-y-6">
                  {filterAppointments("completed").length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card className="text-center py-16 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                        <CardContent>
                          <CheckCircle className="w-20 h-20 mx-auto text-gray-400 mb-6" />
                          <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Completed Appointments</h3>
                          <p className="text-gray-600 text-lg">Your completed appointments will appear here.</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ) : (
                    <div className="space-y-4 sm:space-y-6">
                      {filterAppointments("completed").map((appointment, index) => (
                        <AppointmentCard key={appointment.id} appointment={appointment} index={index} />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="cancelled" className="space-y-4 sm:space-y-6">
                  {filterAppointments("cancelled").length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card className="text-center py-16 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                        <CardContent>
                          <X className="w-20 h-20 mx-auto text-gray-400 mb-6" />
                          <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Cancelled Appointments</h3>
                          <p className="text-gray-600 text-lg">Your cancelled appointments will appear here.</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ) : (
                    <div className="space-y-4 sm:space-y-6">
                      {filterAppointments("cancelled").map((appointment, index) => (
                        <AppointmentCard key={appointment.id} appointment={appointment} index={index} />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="history" className="space-y-4 sm:space-y-6">
                  {filterAppointments("history").length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card className="text-center py-16 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                        <CardContent>
                          <User className="w-20 h-20 mx-auto text-gray-400 mb-6" />
                          <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Appointment History</h3>
                          <p className="text-gray-600 text-lg">Your appointment history will appear here.</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ) : (
                    <div className="space-y-4 sm:space-y-6">
                      {filterAppointments("history").map((appointment, index) => (
                        <AppointmentCard key={appointment.id} appointment={appointment} index={index} />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </motion.div>
        </div>

        <ModernFooter />
      </div>
    </ProtectedRoute>
  )
}
