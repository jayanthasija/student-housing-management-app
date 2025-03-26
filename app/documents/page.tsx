"use client"

import type React from "react"

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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Download, File, FileText, MoreHorizontal, Upload } from "lucide-react"
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

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  category: z.string(),
  description: z.string().optional(),
})

interface Document {
  id: number
  title: string
  category: string
  description?: string
  fileName: string
  fileSize: string
  uploadedAt: Date
  status: string
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 1,
      title: "Housing Contract",
      category: "Contracts",
      description: "Signed housing contract for the academic year 2023-2024",
      fileName: "housing-contract-2023.pdf",
      fileSize: "1.2 MB",
      uploadedAt: new Date(2023, 3, 15),
      status: "approved",
    },
    {
      id: 2,
      title: "Proof of Insurance",
      category: "Insurance",
      description: "Proof of renter's insurance coverage",
      fileName: "insurance-proof.pdf",
      fileSize: "850 KB",
      uploadedAt: new Date(2023, 3, 18),
      status: "pending",
    },
    {
      id: 3,
      title: "Medical Information",
      category: "Medical",
      description: "Medical information and emergency contacts",
      fileName: "medical-info.pdf",
      fileSize: "1.5 MB",
      uploadedAt: new Date(2023, 3, 10),
      status: "approved",
    },
  ])

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "Contracts",
      description: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!selectedFile) {
      toast.error("Please select a file to upload")
      return
    }

    const newDocument: Document = {
      id: documents.length > 0 ? Math.max(...documents.map((d) => d.id)) + 1 : 1,
      title: values.title,
      category: values.category,
      description: values.description,
      fileName: selectedFile.name,
      fileSize: formatFileSize(selectedFile.size),
      uploadedAt: new Date(),
      status: "pending",
    }

    setDocuments([...documents, newDocument])
    setIsDialogOpen(false)
    form.reset()
    setSelectedFile(null)
    toast.success("Document uploaded successfully")
  }

  const handleDeleteDocument = () => {
    if (!currentDocument) return

    const updatedDocuments = documents.filter((document) => document.id !== currentDocument.id)
    setDocuments(updatedDocuments)
    setIsDeleteDialogOpen(false)

    toast("Document deleted", {
      action: {
        label: "Undo",
        onClick: () => {
          setDocuments([...updatedDocuments, currentDocument])
          toast.success("Deletion undone")
        },
      },
    })
  }

  const handleStatusChange = (documentId: number, newStatus: string) => {
    const updatedDocuments = documents.map((document) =>
      document.id === documentId ? { ...document, status: newStatus } : document,
    )
    setDocuments(updatedDocuments)
    toast.success(`Document status updated to ${newStatus}`)
  }

  const openDeleteDialog = (document: Document) => {
    setCurrentDocument(document)
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
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Contracts":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "Insurance":
        return <FileText className="h-4 w-4 text-green-500" />
      case "Medical":
        return <FileText className="h-4 w-4 text-red-500" />
      case "Financial":
        return <FileText className="h-4 w-4 text-yellow-500" />
      default:
        return <File className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-2xl font-bold">Documents</CardTitle>
            <CardDescription>Upload and manage your housing-related documents</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Upload Document</DialogTitle>
                <DialogDescription>Upload a document related to your housing.</DialogDescription>
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
                          <Input placeholder="Document title" {...field} />
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Contracts">Contracts</SelectItem>
                            <SelectItem value="Insurance">Insurance</SelectItem>
                            <SelectItem value="Medical">Medical</SelectItem>
                            <SelectItem value="Financial">Financial</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Brief description of the document" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid gap-2">
                    <Label htmlFor="file">File</Label>
                    <Input id="file" type="file" onChange={handleFileChange} />
                    {selectedFile && (
                      <p className="text-xs text-muted-foreground">
                        Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                      </p>
                    )}
                  </div>
                  <DialogFooter>
                    <Button type="submit">Upload</Button>
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
                <TableHead>Document</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.length > 0 ? (
                documents.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(document.category)}
                        <div>
                          <div>{document.title}</div>
                          <div className="text-xs text-muted-foreground">{document.fileName}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{document.category}</TableCell>
                    <TableCell>{document.fileSize}</TableCell>
                    <TableCell>{getStatusBadge(document.status)}</TableCell>
                    <TableCell>{format(document.uploadedAt, "MMM d, yyyy")}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleStatusChange(document.id, "pending")}>
                            Mark as Pending
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(document.id, "approved")}>
                            Mark as Approved
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(document.id, "rejected")}>
                            Mark as Rejected
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => openDeleteDialog(document)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No documents found.
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
              This action cannot be undone. This will permanently delete the document from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDocument}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

