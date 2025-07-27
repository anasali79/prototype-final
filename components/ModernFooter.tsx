"use client"

import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export function ModernFooter() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                MediCare
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Your trusted healthcare companion. Connect with qualified doctors, book appointments, and take control of
              your health journey.
            </p>
            <div className="flex space-x-4">
              <Button size="icon" variant="ghost" className="hover:bg-blue-600">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="ghost" className="hover:bg-blue-400">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="ghost" className="hover:bg-pink-600">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="ghost" className="hover:bg-blue-700">
                <Linkedin className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-gray-400 hover:text-white transition-colors duration-200">
                Home
              </Link>
              <Link
                href="/find-doctors"
                className="block text-gray-400 hover:text-white transition-colors duration-200"
              >
                Find Doctors
              </Link>
              <Link
                href="/consultations"
                className="block text-gray-400 hover:text-white transition-colors duration-200"
              >
                Consultations
              </Link>
              <Link href="/about" className="block text-gray-400 hover:text-white transition-colors duration-200">
                About Us
              </Link>
              <Link href="/contact" className="block text-gray-400 hover:text-white transition-colors duration-200">
                Contact
              </Link>
            </div>
          </div>

          {/* For Patients */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">For Patients</h3>
            <div className="space-y-2">
              <Link
                href="/search-doctors"
                className="block text-gray-400 hover:text-white transition-colors duration-200"
              >
                Search Doctors
              </Link>
              <Link
                href="/nearby-clinics"
                className="block text-gray-400 hover:text-white transition-colors duration-200"
              >
                Nearby Clinics
              </Link>
              <Link
                href="/appointments"
                className="block text-gray-400 hover:text-white transition-colors duration-200"
              >
                My Appointments
              </Link>
              <Link href="/profile" className="block text-gray-400 hover:text-white transition-colors duration-200">
                My Profile
              </Link>
            </div>
          </div>

          {/* For Doctors */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">For Doctors</h3>
            <div className="space-y-2">
              <Link
                href="/doctor/dashboard"
                className="block text-gray-400 hover:text-white transition-colors duration-200"
              >
                Doctor Dashboard
              </Link>
              <Link
                href="/doctor/profile"
                className="block text-gray-400 hover:text-white transition-colors duration-200"
              >
                Manage Profile
              </Link>
              <Link
                href="/doctor/appointments"
                className="block text-gray-400 hover:text-white transition-colors duration-200"
              >
                Appointments
              </Link>
              <Link href="/auth" className="block text-gray-400 hover:text-white transition-colors duration-200">
                Join as Doctor
              </Link>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-blue-400" />
              <span className="text-gray-400">support@medicare.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-blue-400" />
              <span className="text-gray-400">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-blue-400" />
              <span className="text-gray-400">123 Healthcare St, Medical City</span>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div>
              <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
              <p className="text-gray-400">Subscribe to get health tips and updates</p>
            </div>
            <div className="flex space-x-2 w-full md:w-auto">
              <Input
                placeholder="Enter your email"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 md:w-64"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">© 2024 MediCare. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </footer>
  )
}
