"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Navbar } from "@/components/Navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { appointmentsAPI, type Appointment } from "@/lib/api"
import { Calendar, Users, Clock, TrendingUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function DoctorDashboard() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
  })
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
      setAppointments(appointmentsData)

      // Calculate stats
      const stats = {
        total: appointmentsData.length,
        pending: appointmentsData.filter((a) => a.status === "pending").length,
        confirmed: appointmentsData.filter((a) => a.status === "confirmed").length,
        completed: appointmentsData.filter((a) => a.status === "completed").length,
      }
      setStats(stats)
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

  const todayAppointments = appointments.filter(
    (appointment) => appointment.date === new Date().toISOString().split("T")[0],
  )

  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <div className="min-h-screen">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Welcome back, Dr. {user?.name?.split(" ")[1] || user?.name}
            </h1>
            <p className="text-gray-300 text-lg">Here's your practice overview</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-teal-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.total}</div>
                <p className="text-xs text-gray-400">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.pending}</div>
                <p className="text-xs text-gray-400">Awaiting confirmation</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
                <Users className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.confirmed}</div>
                <p className="text-xs text-gray-400">Ready to see</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.completed}</div>
                <p className="text-xs text-gray-400">This month</p>
              </CardContent>
            </Card>
          </div>

          {/* Today's Appointments */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Appointments</CardTitle>
              <CardDescription>{todayAppointments.length} appointments scheduled for today</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center text-white py-8">Loading appointments...</div>
              ) : todayAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-300">No appointments scheduled for today</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {todayAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {appointment.patientName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{appointment.patientName}</p>
                          <p className="text-gray-400 text-sm">{appointment.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            appointment.status === "confirmed"
                              ? "bg-green-600 text-white"
                              : appointment.status === "pending"
                                ? "bg-yellow-600 text-white"
                                : "bg-gray-600 text-white"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
