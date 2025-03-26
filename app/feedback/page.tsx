"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { MoreHorizontal, Plus, Star } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  category: z.string(),
  rating: z.string(),
  comment: z.string().min(10, {
    message: "Comment must be at least 10 characters.",
  }),
})

interface FeedbackItem {
  id: number
  title: string
  category: string
  rating: string
  comment: string
  createdAt: Date
  status: string
}

export default function FeedbackPage() {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([
    {
      id: 1,
      title: "Great housing experience",
      category: "Facilities",
      rating: "5",
      comment: "The facilities are excellent and well-maintained.",
      createdAt: new Date(2023, 3, 15),
      status: "reviewed",
    },
    {
      id: 2,
      title: "Noise issues in Building B",
      category: "Environment",
      rating: "2",
      comment: "There's too much noise in the evenings, making it difficult to study.",
      createdAt: new Date(2023, 3, 18),
      status: "pending",
    },
    {
      id: 3,
      title: "Suggestion for common areas",
      category: "Suggestions",
      rating: "4",
      comment: "It would be great to have more study spaces in the common areas.",
      createdAt: new Date(2023, 3, 10),
      status: "in-progress",
    },
  ])

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentFeedback, setCurrentFeedback] = useState<FeedbackItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "Facilities",
      rating: "3",
      comment: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newFeedback: FeedbackItem = {
      id: feedbackItems.length > 0 ? Math.max(...feedbackItems.map((f) => f.id)) + 1 : 1,
      title: values.title,
      category: values.category,
      rating: values.rating,
      comment: values.comment,
      createdAt: new Date(),
      status: "pending",
    }

    setFeedbackItems([...feedbackItems, newFeedback])
    setIsDialogOpen(false)
    form.reset()
    toast.success("Feedback submitted successfully")
  }

  const handleDeleteFeedback = () => {
    if (!currentFeedback) return

    const updatedFeedbackItems = feedbackItems.filter((feedback) => feedback.id !== currentFeedback.id)
    setFeedbackItems(updatedFeedbackItems)
    setIsDeleteDialogOpen(false)

    toast("Feedback deleted", {
      action: {
        label: "Undo",
        onClick: () => {
          setFeedbackItems([...updatedFeedbackItems, currentFeedback])
          toast.success("Deletion undone")
        },
      },
    })
  }

  const handleStatusChange = (feedbackId: number, newStatus: string) => {
    const updatedFeedbackItems = feedbackItems.map((feedback) =>
      feedback.id === feedbackId ? { ...feedback, status: newStatus } : feedback,
    )
    setFeedbackItems(updatedFeedbackItems)
    toast.success(`Feedback status updated to ${newStatus}`)
  }

  const openDeleteDialog = (feedback: FeedbackItem) => {
    setCurrentFeedback(feedback)
    setIsDeleteDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            In Progress
          </Badge>
        )
      case "reviewed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Reviewed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const renderStars = (rating: string) => {
    const ratingNumber = Number.parseInt(rating)
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < ratingNumber ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-2xl font-bold">Feedback</CardTitle>
            <CardDescription>Submit feedback and suggestions about your housing experience</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Feedback
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Submit Feedback</DialogTitle>
                <DialogDescription>
                  Share your thoughts and suggestions about your housing experience.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Brief title for your feedback" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Facilities" />
                              </FormControl>
                              <FormLabel className="font-normal">Facilities</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Services" />
                              </FormControl>
                              <FormLabel className="font-normal">Services</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Environment" />
                              </FormControl>
                              <FormLabel className="font-normal">Environment</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Suggestions" />
                              </FormControl>
                              <FormLabel className="font-normal">Suggestions</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rating</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex space-x-1"
                          >
                            <FormItem className="flex flex-col items-center space-y-1">
                              <FormControl>
                                <RadioGroupItem value="1" className="sr-only" />
                              </FormControl>
                              <Star
                                className={`h-6 w-6 cursor-pointer ${
                                  Number.parseInt(field.value) >= 1
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                                onClick={() => form.setValue("rating", "1")}
                              />
                            </FormItem>
                            <FormItem className="flex flex-col items-center space-y-1">
                              <FormControl>
                                <RadioGroupItem value="2" className="sr-only" />
                              </FormControl>
                              <Star
                                className={`h-6 w-6 cursor-pointer ${
                                  Number.parseInt(field.value) >= 2
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                                onClick={() => form.setValue("rating", "2")}
                              />
                            </FormItem>
                            <FormItem className="flex flex-col items-center space-y-1">
                              <FormControl>
                                <RadioGroupItem value="3" className="sr-only" />
                              </FormControl>
                              <Star
                                className={`h-6 w-6 cursor-pointer ${
                                  Number.parseInt(field.value) >= 3
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                                onClick={() => form.setValue("rating", "3")}
                              />
                            </FormItem>
                            <FormItem className="flex flex-col items-center space-y-1">
                              <FormControl>
                                <RadioGroupItem value="4" className="sr-only" />
                              </FormControl>
                              <Star
                                className={`h-6 w-6 cursor-pointer ${
                                  Number.parseInt(field.value) >= 4
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                                onClick={() => form.setValue("rating", "4")}
                              />
                            </FormItem>
                            <FormItem className="flex flex-col items-center space-y-1">
                              <FormControl>
                                <RadioGroupItem value="5" className="sr-only" />
                              </FormControl>
                              <Star
                                className={`h-6 w-6 cursor-pointer ${
                                  Number.parseInt(field.value) >= 5
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                                onClick={() => form.setValue("rating", "5")}
                              />
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Comment</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Share your detailed feedback or suggestions"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">Submit Feedback</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedbackItems.length > 0 ? (
                feedbackItems.map((feedback) => (
                  <TableRow key={feedback.id}>
                    <TableCell className="font-medium">{feedback.title}</TableCell>
                    <TableCell>{feedback.category}</TableCell>
                    <TableCell>{renderStars(feedback.rating)}</TableCell>
                    <TableCell>{getStatusBadge(feedback.status)}</TableCell>
                    <TableCell>{format(feedback.createdAt, "MMM d, yyyy")}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleStatusChange(feedback.id, "pending")}>
                            Mark as Pending
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(feedback.id, "in-progress")}>
                            Mark as In Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(feedback.id, "reviewed")}>
                            Mark as Reviewed
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => openDeleteDialog(feedback)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No feedback found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the feedback from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteFeedback}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

