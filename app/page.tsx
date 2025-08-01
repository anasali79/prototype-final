"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { ModernNavbar } from "@/components/ModernNavbar"
import { HeroSection } from "@/components/HeroSection"
import { SpecialtySlider } from "@/components/SpecialtySlider"
import { TestimonialSection } from "@/components/TestimonialSection"
import { ModernFooter } from "@/components/ModernFooter"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { doctorsAPI, appointmentsAPI, type Doctor } from "@/lib/api"
import { Search, MapPin, Star, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function HomePage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/auth")
      return
    }

    if (user.role === "doctor") {
      router.push("/doctor/dashboard")
      return
    }

    loadDoctors()
  }, [user, router])

  const loadDoctors = async () => {
    try {
      const doctorsData = await doctorsAPI.getAll()
      setDoctors(doctorsData)
      setFilteredDoctors(doctorsData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load doctors",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = () => {
    let filtered = doctors

    if (searchTerm) {
      filtered = filtered.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedSpecialty !== "all") {
      filtered = filtered.filter((doctor) => doctor.specialty.toLowerCase() === selectedSpecialty.toLowerCase())
    }

    setFilteredDoctors(filtered)
  }

  const bookAppointment = async (doctor: Doctor) => {
    if (!user) return

    try {
      const appointment = {
        doctorId: doctor.id,
        patientId: user.id,
        doctorName: doctor.name,
        patientName: user.name,
        specialty: doctor.specialty,
        date: new Date().toISOString().split("T")[0],
        time: "10:00",
        status: "pending" as const,
      }

      await appointmentsAPI.create(appointment)
      toast({
        title: "Success",
        description: "Appointment booked successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to book appointment",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    handleSearch()
  }, [searchTerm, selectedSpecialty, doctors])

  const handleSpecialtySelect = (specialty: string) => {
    router.push(`/find-doctors?specialty=${specialty}`)
  }

  const handleOnlineSpecialtySelect = (specialty: string) => {
    router.push(`/consultations?specialty=${specialty}&type=online`)
  }

  if (!user || user.role !== "patient") {
    return (
      <div className="min-h-screen bg-white">
        <ModernNavbar />
        <HeroSection />

        {/* Book Appointment in Clinic Section */}
        <SpecialtySlider title="Book Appointment in Clinic" onSpecialtySelect={handleSpecialtySelect} />

        {/* Online Consultation Section */}
        <SpecialtySlider title="Consult with Doctors Online" onSpecialtySelect={handleOnlineSpecialtySelect} />

        <TestimonialSection />
        <ModernFooter />
      </div>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["patient"]}>
      <div className="min-h-screen bg-white">
        <ModernNavbar />
        <HeroSection />

        {/* Book Appointment in Clinic Section */}
        <SpecialtySlider title="Book Appointment in Clinic" onSpecialtySelect={handleSpecialtySelect} />

        {/* Online Consultation Section */}
        <SpecialtySlider title="Consult with Doctors Online" onSpecialtySelect={handleOnlineSpecialtySelect} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Find & Book Appointments</h1>
            <p className="text-gray-300 text-lg">Connect with qualified doctors in your area</p>
          </div>

          {/* Search Section */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search doctors or specialties..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="md:w-64">
                  <Select onValueChange={setSelectedSpecialty}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Specialties" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Specialties</SelectItem>
                      <SelectItem value="cardiology">Cardiology</SelectItem>
                      <SelectItem value="dermatology">Dermatology</SelectItem>
                      <SelectItem value="neurology">Neurology</SelectItem>
                      <SelectItem value="orthopedics">Orthopedics</SelectItem>
                      <SelectItem value="pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="psychiatry">Psychiatry</SelectItem>
                      <SelectItem value="general">General Medicine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleSearch}>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Doctors Grid */}
          {isLoading ? (
            <div className="text-center text-white">Loading doctors...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor) => (
                <Card key={doctor.id} className="hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xl font-bold">
                          {doctor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-lg">{doctor.name}</CardTitle>
                        <CardDescription className="text-teal-400">{doctor.specialty}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-300">
                        <Star className="w-4 h-4 mr-2 text-yellow-400" />
                        {doctor.qualifications}
                      </div>
                      <div className="flex items-center text-sm text-gray-300">
                        <Calendar className="w-4 h-4 mr-2" />
                        {doctor.experience} experience
                      </div>
                      <div className="flex items-center text-sm text-gray-300">
                        <MapPin className="w-4 h-4 mr-2" />
                        {doctor.clinicAddress}
                      </div>
                    </div>
                    <Button className="w-full" onClick={() => bookAppointment(doctor)}>
                      Book Appointment
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredDoctors.length === 0 && !isLoading && (
            <div className="text-center text-white py-8">
              <p className="text-lg">No doctors found matching your criteria.</p>
            </div>
          )}
        </div>
        <TestimonialSection />
        <ModernFooter />
      </div>
    </ProtectedRoute>
  )
}
