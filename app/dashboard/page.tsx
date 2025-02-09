"use client"

import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore"
import { auth, db } from "../firebase"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Calendar, Pill } from "lucide-react"
import { AddMedication } from "../components/add-medication"

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
}

interface Appointment {
  id: string
  date: string
  doctor: string
  reason: string
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [medications, setMedications] = useState<Medication[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [nextTestDate, setNextTestDate] = useState<string | null>(null)
  const [followUps, setFollowUps] = useState<number>(0)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        // Fetch user data
        const userDoc = await getDoc(doc(db, "users", currentUser.uid))
        const userData = userDoc.data()
        if (userData) {
          setNextTestDate(userData.nextTestDate || null)
          setFollowUps(userData.followUps || 0)
        }
        // Fetch medications
        const medicationsQuery = query(collection(db, "medications"), where("userId", "==", currentUser.uid))
        onSnapshot(medicationsQuery, (snapshot) => {
          const meds = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Medication)
          setMedications(meds)
        })
        // Fetch appointments
        const appointmentsQuery = query(collection(db, "appointments"), where("userId", "==", currentUser.uid))
        onSnapshot(appointmentsQuery, (snapshot) => {
          const appts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Appointment)
          setAppointments(appts)
        })
      } else {
        router.push("/signin")
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleSignOut = () => {
    auth.signOut()
    router.push("/signin")
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={user.photoURL} />
              <AvatarFallback>{user.email[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <h1 className="text-2xl font-bold">Welcome, {user.displayName || user.email}</h1>
          </div>
          <Button onClick={handleSignOut}>Sign Out</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Pill className="mr-2" />
                  Active Medications
                </div>
                <AddMedication />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {medications.map((med) => (
                  <li key={med.id} className="flex justify-between items-center">
                    <span>{med.name}</span>
                    <span className="text-sm text-gray-500">
                      {med.dosage} - {med.frequency}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2" />
                Next Test Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              {nextTestDate ? (
                <p>Your next sputum test is scheduled for: {new Date(nextTestDate).toLocaleDateString()}</p>
              ) : (
                <p>No upcoming test scheduled. Please consult your healthcare provider.</p>
              )}
            </CardContent>
          </Card>
        </div>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2" />
              Progress Tracker
            </CardTitle>
            <CardDescription>Follow-up Progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${(followUps / 6) * 100}%` }}></div>
              </div>
              <span className="ml-4 text-sm font-medium text-gray-500">{followUps}/6 completed</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

