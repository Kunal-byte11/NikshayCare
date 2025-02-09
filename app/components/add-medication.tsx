"use client"

import { useState } from "react"
import { addDoc, collection } from "firebase/firestore"
import { db, auth } from "../firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

export function AddMedication() {
  const [name, setName] = useState("")
  const [dosage, setDosage] = useState("")
  const [frequency, setFrequency] = useState("")
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const handleAddMedication = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const user = auth.currentUser
      if (!user) throw new Error("No authenticated user")

      await addDoc(collection(db, "medications"), {
        userId: user.uid,
        name,
        dosage,
        frequency,
        createdAt: new Date().toISOString(),
      })

      toast({
        title: "Medication Added",
        description: "Your medication has been added successfully.",
      })
      setOpen(false)
      setName("")
      setDosage("")
      setFrequency("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add medication. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Medication</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Medication</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAddMedication}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dosage" className="text-right">
                Dosage
              </Label>
              <Input id="dosage" value={dosage} onChange={(e) => setDosage(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="frequency" className="text-right">
                Frequency
              </Label>
              <Input
                id="frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit">Add Medication</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

