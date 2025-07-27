"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { appointmentsAPI, type Appointment } from "@/lib/api"
import { Calendar, Clock, User, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function DoctorAppointmentsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadAppointments()
    }
  }, [user])

  const loadAppointments = async () => {
    if (!user) return

    try {
      const appointmentsData = await appointmentsAPI.getByDoctorId(user.id)
      setAppointments(appointmentsData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()))
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

  const updateAppointmentStatus = async (appointmentId: string, status: Appointment["status"]) => {
    try {
      await appointmentsAPI.updateStatus(appointmentId, status)
      setAppointments((prev) => prev.map((apt) => (apt.id === appointmentId ? { ...apt, status } : apt)))
      toast({
        title: "Success",
        description: `Appointment ${status} successfully!`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update appointment",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-600"
      case "pending":
        return "bg-yellow-600"
      case "cancelled":
        return "bg-red-600"
      case "completed":
        return "bg-blue-600"
      default:
        return "bg-gray-600"
    }
  }

  const groupAppointmentsByDate = (appointments: Appointment[]) => {
    const grouped: { [key: string]: Appointment[] } = {}
    appointments.forEach((appointment) => {
      const date = appointment.date
      if (!grouped[date]) {
        grouped[date] = []
      }
      grouped[date].push(appointment)
    })
    return grouped
  }

  const groupedAppointments = groupAppointmentsByDate(appointments)

  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <div className="min-h-screen">
        <Navbar />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">My Appointments</h1>
            <p className="text-gray-300">Manage your patient appointments</p>
          </div>

          {isLoading ? (
            <div className="text-center text-white">Loading appointments...</div>
          ) : appointments.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Appointments</h3>
                <p className="text-gray-300">You don't have any appointments scheduled yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedAppointments).map(([date, dayAppointments]) => (
                <div key={date}>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {new Date(date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dayAppointments.map((appointment) => (
                      <Card key={appointment.id} className="hover:shadow-xl transition-shadow">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg flex items-center">
                              <User className="w-5 h-5 mr-2" />
                              {appointment.patientName}
                            </CardTitle>
                            <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                          </div>
                          <CardDescription className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {appointment.time}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {appointment.status === "pending" && (
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  onClick={() => updateAppointmentStatus(appointment.id, "confirmed")}
                                  className="flex-1"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Confirm
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateAppointmentStatus(appointment.id, "cancelled")}
                                  className="flex-1"
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Cancel
                                </Button>
                              </div>
                            )}

                            {appointment.status === "confirmed" && (
                              <Button
                                size="sm"
                                onClick={() => updateAppointmentStatus(appointment.id, "completed")}
                                className="w-full"
                              >
                                Mark as Completed
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
