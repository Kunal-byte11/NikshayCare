"use client"

import { useState } from "react"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "../firebase"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

export default function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [diseaseIntensity, setDiseaseIntensity] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(userCredential.user, { displayName: name })

      // Create a user document in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name,
        email,
        weight,
        height,
        diseaseIntensity,
        createdAt: new Date().toISOString(),
      })

      toast({
        title: "Registration Successful",
        description: "Your account has been created.",
      })
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Register for NikshayCare</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input id="weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="height">Height (cm)</Label>
                <Input id="height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="diseaseIntensity">Disease Intensity (1-10)</Label>
                <Input
                  id="diseaseIntensity"
                  type="number"
                  min="1"
                  max="10"
                  value={diseaseIntensity}
                  onChange={(e) => setDiseaseIntensity(e.target.value)}
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/signin">Sign In</Link>
          </Button>
          <Button onClick={handleRegister}>Register</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

