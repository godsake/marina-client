"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Save, ArrowLeft, Trash2, ImageIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"

const boatFormSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom du bateau doit contenir au moins 2 caractères.",
  }),
  type: z.string({
    required_error: "Veuillez sélectionner un type de bateau.",
  }),
  description: z.string().min(10, {
    message: "La description doit contenir au moins 10 caractères.",
  }),
  capacity: z.coerce.number().int().min(1, {
    message: "La capacité doit être d'au moins 1 personne.",
  }),
  status: z.string({
    required_error: "Veuillez sélectionner un statut.",
  }),
  image: z.string().url({
    message: "Veuillez entrer une URL d'image valide.",
  }),
  price4h: z.coerce.number().min(1, {
    message: "Le prix doit être supérieur à 0.",
  }),
  price6h: z.coerce.number().min(1, {
    message: "Le prix doit être supérieur à 0.",
  }),
  price8h: z.coerce.number().min(1, {
    message: "Le prix doit être supérieur à 0.",
  }),
  lastMaintenance: z.string(),
  nextMaintenance: z.string(),
})

interface BoatFormProps {
  boatId?: string
}

export function BoatForm({ boatId }: BoatFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)

  const form = useForm<z.infer<typeof boatFormSchema>>({
    resolver: zodResolver(boatFormSchema),
    defaultValues: {
      name: "",
      type: "",
      description: "",
      capacity: 1,
      status: "available",
      image: "/lakeside-rowboat.png",
      price4h: 0,
      price6h: 0,
      price8h: 0,
      lastMaintenance: new Date().toISOString().split("T")[0],
      nextMaintenance: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    },
  })

  // Mettre à jour l'aperçu de l'image lorsque l'URL change
  useEffect(() => {
    const imageUrl = form.watch("image")
    if (imageUrl) {
      setImagePreview(imageUrl)
      setImageError(false)
    }
  }, [form.watch("image")])

  useEffect(() => {
    if (boatId) {
      setIsLoading(true)
      // Simuler un appel API pour récupérer les données du bateau
      setTimeout(() => {
        // Données fictives pour la démonstration
        const boatData = {
          name: "Voilier Étoile de Mer",
          type: "sailboat",
          description:
            "Notre voilier de 14 pieds de long en fibre de verre comporte un moteur de 15 HP. Il peut accueillir jusqu'à 6 personnes.",
          capacity: 6,
          status: "available",
          image: "/serene-coastal-sail.png",
          price4h: 150,
          price6h: 200,
          price8h: 250,
          lastMaintenance: "2025-04-15",
          nextMaintenance: "2025-07-15",
        }

        form.reset({
          name: boatData.name,
          type: boatData.type,
          description: boatData.description,
          capacity: boatData.capacity,
          status: boatData.status,
          image: boatData.image,
          price4h: boatData.price4h,
          price6h: boatData.price6h,
          price8h: boatData.price8h,
          lastMaintenance: boatData.lastMaintenance,
          nextMaintenance: boatData.nextMaintenance,
        })

        setImagePreview(boatData.image)
        setIsLoading(false)
      }, 1000)
    }
  }, [boatId, form])

  async function onSubmit(values: z.infer<typeof boatFormSchema>) {
    setIsLoading(true)

    try {
      // Simuler un appel API pour enregistrer les données
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log(values)

      toast({
        title: boatId ? "Bateau modifié" : "Bateau ajouté",
        description: boatId
          ? `Le bateau ${values.name} a été modifié avec succès.`
          : `Le bateau ${values.name} a été ajouté avec succès.`,
      })

      router.push("/admin/boats")
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du bateau.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function onDelete() {
    if (!boatId) return

    setIsDeleting(true)

    try {
      // Simuler un appel API pour supprimer le bateau
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Bateau supprimé",
        description: "Le bateau a été supprimé avec succès.",
      })

      router.push("/admin/boats")
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du bateau.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleImageError = () => {
    setImageError(true)
    // Utiliser une image de placeholder en cas d'erreur
    setImagePreview("/lakeside-rowboat.png")
  }

  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={() => router.push("/admin/boats")} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour à la liste
      </Button>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">Informations générales</TabsTrigger>
              <TabsTrigger value="pricing">Tarification</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informations générales</CardTitle>
                  <CardDescription>Informations de base sur le bateau</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom du bateau</FormLabel>
                          <FormControl>
                            <Input placeholder="Nom du bateau" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type de bateau</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="sailboat">Voilier</SelectItem>
                              <SelectItem value="yacht">Yacht</SelectItem>
                              <SelectItem value="catamaran">Catamaran</SelectItem>
                              <SelectItem value="motorboat">Bateau à moteur</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Description du bateau" className="min-h-[100px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="capacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Capacité (personnes)</FormLabel>
                          <FormControl>
                            <Input type="number" min={1} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Statut</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un statut" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="available">Disponible</SelectItem>
                              <SelectItem value="rented">En location</SelectItem>
                              <SelectItem value="maintenance">En maintenance</SelectItem>
                              <SelectItem value="outofservice">Hors service</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL de l'image</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.jpg" {...field} />
                        </FormControl>
                        <FormDescription>URL de l'image du bateau</FormDescription>
                        <FormMessage />
                        <div className="mt-2">
                          <div className="relative h-40 w-full overflow-hidden rounded-md border bg-gray-100">
                            {imagePreview && !imageError ? (
                              <Image
                                src={imagePreview || "/placeholder.svg"}
                                alt="Aperçu du bateau"
                                fill
                                className="object-cover"
                                onError={handleImageError}
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <div className="flex flex-col items-center text-gray-400">
                                  <ImageIcon className="h-10 w-10" />
                                  <span className="mt-2 text-sm">Aperçu non disponible</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tarification</CardTitle>
                  <CardDescription>Définir les tarifs pour différentes durées de location</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="price4h"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prix pour 4 heures (€)</FormLabel>
                          <FormControl>
                            <Input type="number" min={0} step={10} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price6h"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prix pour 6 heures (€)</FormLabel>
                          <FormControl>
                            <Input type="number" min={0} step={10} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price8h"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prix pour 8 heures (€)</FormLabel>
                          <FormControl>
                            <Input type="number" min={0} step={10} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="maintenance" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Maintenance</CardTitle>
                  <CardDescription>Informations sur la maintenance du bateau</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="lastMaintenance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dernière maintenance</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nextMaintenance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prochaine maintenance</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between">
            <div>
              {boatId && (
                <Button type="button" variant="destructive" onClick={onDelete} disabled={isDeleting || isLoading}>
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Suppression...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </>
                  )}
                </Button>
              )}
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
