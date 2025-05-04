"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { Pencil, Save, X, Loader2 } from "lucide-react"
// import { TicketCard } from "@/components/Reservation/TicketCard"

interface Profile {
  email: string
  profile: {
    firstName: string
    lastName: string
    image: string
  }
  mobile: string
  currentReservation?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<Profile | null>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/user/profile")
      if (!response.ok) {
        throw new Error("Failed to fetch profile")
      }
      const data = await response.json()
      setProfile(data)
      setFormData(data)
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast.error("Failed to load profile data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          [parent]: {
            ...(prev[parent as keyof Profile] as Record<string, unknown>),
            [child]: value,
          },
        }
      })
    } else {
      setFormData((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          [name]: value,
        }
      })
    }
  }

  const handleSave = async () => {
    if (!formData) return

    setIsSaving(true)
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      const updatedProfile = await response.json()
      setProfile(updatedProfile)
      setIsEditing(false)
      toast.success("Profile updated successfully")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData(profile)
    setIsEditing(false)
  }

  if (isLoading) {
    return <ProfileSkeleton />
  }

  return (
    <div className="container p-4 flex justify-center items-center w-full py-10">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Profile Information</CardTitle>
            <CardDescription>View and manage your personal information</CardDescription>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="outline" size="icon">
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit profile</span>
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleCancel} variant="outline" size="icon">
                <X className="h-4 w-4" />
                <span className="sr-only">Cancel</span>
              </Button>
              <Button onClick={handleSave} variant="default" size="icon" disabled={isSaving}>
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                <span className="sr-only">Save changes</span>
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex flex-col items-center space-y-2">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={formData?.profile.image || "/placeholder.svg?height=96&width=96"}
                  alt={`${formData?.profile.firstName} ${formData?.profile.lastName}`}
                />
                <AvatarFallback>
                  {formData?.profile.firstName?.[0]}
                  {formData?.profile.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <div className="text-center">
                  <Label htmlFor="image" className="text-sm text-muted-foreground">
                    Image URL
                  </Label>
                  <Input
                    id="image"
                    name="profile.image"
                    value={formData?.profile.image || ""}
                    onChange={handleInputChange}
                    className="mt-1 w-full"
                  />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-4 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  {isEditing ? (
                    <Input
                      id="firstName"
                      name="profile.firstName"
                      value={formData?.profile.firstName || ""}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="p-2 border rounded-md">{profile?.profile.firstName}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  {isEditing ? (
                    <Input
                      id="lastName"
                      name="profile.lastName"
                      value={formData?.profile.lastName || ""}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="p-2 border rounded-md">{profile?.profile.lastName}</div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData?.email || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="p-2 border rounded-md">{profile?.email}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile</Label>
                {isEditing ? (
                  <Input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    value={formData?.mobile || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="p-2 border rounded-md">{profile?.mobile}</div>
                )}
              </div>
            </div>
          </div>

          {profile?.currentReservation && (
            <>
              <Separator className="my-6" />
              <div>
                <h3 className="text-lg font-medium mb-4">Current Reservation</h3>
                {/* <ReservationCard reservation={profile.currentReservation} /> */}
              </div>
            </>
          )}
        </CardContent>
        {isEditing && (
          <CardFooter className="flex justify-end gap-2">
            <Button onClick={handleCancel} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="container max-w-4xl py-10">
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="flex-1 space-y-4 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
