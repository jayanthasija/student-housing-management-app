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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { MoreHorizontal, Plus, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Student {
  id: number
  name: string
  email: string
  roomNumber: string
  program: string
  year: string
  status: "Active" | "Inactive" | "Pending"
  avatar?: string
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      roomNumber: "A-101",
      program: "Computer Science",
      year: "2nd Year",
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      roomNumber: "B-205",
      program: "Business Administration",
      year: "3rd Year",
      status: "Active",
    },
    {
      id: 3,
      name: "Michael Johnson",
      email: "michael.johnson@example.com",
      roomNumber: "C-310",
      program: "Engineering",
      year: "1st Year",
      status: "Active",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily.davis@example.com",
      roomNumber: "A-105",
      program: "Psychology",
      year: "4th Year",
      status: "Inactive",
    },
    {
      id: 5,
      name: "David Wilson",
      email: "david.wilson@example.com",
      roomNumber: "B-210",
      program: "Medicine",
      year: "2nd Year",
      status: "Pending",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null)
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    name: "",
    email: "",
    roomNumber: "",
    program: "",
    year: "",
    status: "Pending",
  })
  const [showUndoToast, setShowUndoToast] = useState(false)
  const [deletedStudent, setDeletedStudent] = useState<Student | null>(null)

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.program.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.email || !newStudent.roomNumber || !newStudent.program || !newStudent.year) {
      toast.error("Please fill in all required fields")
      return
    }

    const id = students.length > 0 ? Math.max(...students.map((s) => s.id)) + 1 : 1
    const student = {
      id,
      name: newStudent.name,
      email: newStudent.email,
      roomNumber: newStudent.roomNumber,
      program: newStudent.program,
      year: newStudent.year,
      status: newStudent.status as "Active" | "Inactive" | "Pending",
    }

    setStudents([...students, student])
    setNewStudent({
      name: "",
      email: "",
      roomNumber: "",
      program: "",
      year: "",
      status: "Pending",
    })
    setIsAddDialogOpen(false)
    toast.success("Student added successfully")
  }

  const handleEditStudent = () => {
    if (!currentStudent) return

    if (
      !currentStudent.name ||
      !currentStudent.email ||
      !currentStudent.roomNumber ||
      !currentStudent.program ||
      !currentStudent.year
    ) {
      toast.error("Please fill in all required fields")
      return
    }

    const updatedStudents = students.map((student) => (student.id === currentStudent.id ? currentStudent : student))

    setStudents(updatedStudents)
    setIsEditDialogOpen(false)
    toast.success("Student updated successfully")
  }

  const handleDeleteStudent = () => {
    if (!currentStudent) return

    setDeletedStudent(currentStudent)
    const updatedStudents = students.filter((student) => student.id !== currentStudent.id)
    setStudents(updatedStudents)
    setIsDeleteDialogOpen(false)

    toast("Student deleted", {
      action: {
        label: "Undo",
        onClick: () => {
          if (deletedStudent) {
            setStudents([...updatedStudents, deletedStudent])
            toast.success("Deletion undone")
          }
        },
      },
    })
  }

  const openEditDialog = (student: Student) => {
    setCurrentStudent(student)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (student: Student) => {
    setCurrentStudent(student)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <CardTitle>Students</CardTitle>
            <CardDescription>Manage student profiles and information</CardDescription>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search students..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Student</DialogTitle>
                  <DialogDescription>Enter the details of the new student</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={newStudent.name}
                      onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newStudent.email}
                      onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="roomNumber">Room Number</Label>
                    <Input
                      id="roomNumber"
                      value={newStudent.roomNumber}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          roomNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="program">Program</Label>
                    <Input
                      id="program"
                      value={newStudent.program}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          program: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="year">Year</Label>
                      <Select
                        value={newStudent.year}
                        onValueChange={(value) => setNewStudent({ ...newStudent, year: value })}
                      >
                        <SelectTrigger id="year">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1st Year">1st Year</SelectItem>
                          <SelectItem value="2nd Year">2nd Year</SelectItem>
                          <SelectItem value="3rd Year">3rd Year</SelectItem>
                          <SelectItem value="4th Year">4th Year</SelectItem>
                          <SelectItem value="5th Year">5th Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={newStudent.status}
                        onValueChange={(value) =>
                          setNewStudent({
                            ...newStudent,
                            status: value as "Active" | "Inactive" | "Pending",
                          })
                        }
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddStudent}>Add Student</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={student.avatar || "/placeholder-user.jpg"} alt={student.name} />
                          <AvatarFallback>
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div>{student.name}</div>
                          <div className="text-xs text-muted-foreground">{student.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{student.roomNumber}</TableCell>
                    <TableCell>{student.program}</TableCell>
                    <TableCell>{student.year}</TableCell>
                    <TableCell>
                      <div
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          student.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : student.status === "Inactive"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {student.status}
                      </div>
                    </TableCell>
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
                          <DropdownMenuItem onClick={() => openEditDialog(student)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openDeleteDialog(student)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No students found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Student Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>Update the student's information</DialogDescription>
          </DialogHeader>
          {currentStudent && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={currentStudent.name}
                  onChange={(e) =>
                    setCurrentStudent({
                      ...currentStudent,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={currentStudent.email}
                  onChange={(e) =>
                    setCurrentStudent({
                      ...currentStudent,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-roomNumber">Room Number</Label>
                <Input
                  id="edit-roomNumber"
                  value={currentStudent.roomNumber}
                  onChange={(e) =>
                    setCurrentStudent({
                      ...currentStudent,
                      roomNumber: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-program">Program</Label>
                <Input
                  id="edit-program"
                  value={currentStudent.program}
                  onChange={(e) =>
                    setCurrentStudent({
                      ...currentStudent,
                      program: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-year">Year</Label>
                  <Select
                    value={currentStudent.year}
                    onValueChange={(value) => setCurrentStudent({ ...currentStudent, year: value })}
                  >
                    <SelectTrigger id="edit-year">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1st Year">1st Year</SelectItem>
                      <SelectItem value="2nd Year">2nd Year</SelectItem>
                      <SelectItem value="3rd Year">3rd Year</SelectItem>
                      <SelectItem value="4th Year">4th Year</SelectItem>
                      <SelectItem value="5th Year">5th Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={currentStudent.status}
                    onValueChange={(value) =>
                      setCurrentStudent({
                        ...currentStudent,
                        status: value as "Active" | "Inactive" | "Pending",
                      })
                    }
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditStudent}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the student record from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteStudent}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

