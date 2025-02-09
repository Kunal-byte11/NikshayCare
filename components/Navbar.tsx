"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, User } from "lucide-react"
import { motion } from "framer-motion"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <img className="h-8 w-8" src="/logo.png" alt="NikshayCare" />
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/dashboard"
                className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/medications"
                className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
              >
                Medications
              </Link>
              <div className="relative">
                <button className="flex items-center text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">
                  <User className="h-5 w-5 mr-1" />
                  Profile
                </button>
              </div>
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/dashboard"
              className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/medications"
              className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium"
            >
              Medications
            </Link>
            <Link
              href="/profile"
              className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium"
            >
              Profile
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  )
}

export default Navbar

