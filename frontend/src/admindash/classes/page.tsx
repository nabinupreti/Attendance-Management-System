"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getClasses, addClass, updateClass, deleteClass } from "@/lib/api"

interface Class {
  class_id: number
  name: string
  section: string
  semester: string
  year: number
  admin: string
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>(getClasses())
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentClass, setCurrentClass] = useState<Class | null>(null)

  const handleAddClass = (newClass: Omit<Class, "class_id">) => {
    const addedClass = addClass(newClass)
    setClasses([...classes, addedClass])
    setIsAddDialogOpen(false)
  }

  const handleUpdateClass = (updatedClass: Class) => {
    const updated = updateClass(updatedClass)
    setClasses(classes.map((c) => (c.class_id === updated.class_id ? updated : c)))
    setIsEditDialogOpen(false)
  }

  const handleDeleteClass = (classId: number) => {
    deleteClass(classId)
    setClasses(classes.filter((c) => c.class_id !== classId))
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Classes</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Class</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Class</DialogTitle>
            </DialogHeader>
            <ClassForm onSubmit={handleAddClass} />
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Section</TableHead>
            <TableHead>Semester</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Admin</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((cls) => (
            <TableRow key={cls.class_id}>
              <TableCell>{cls.name}</TableCell>
              <TableCell>{cls.section}</TableCell>
              <TableCell>{cls.semester}</TableCell>
              <TableCell>{cls.year}</TableCell>
              <TableCell>{cls.admin}</TableCell>
              <TableCell>
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="mr-2" onClick={() => setCurrentClass(cls)}>
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Class</DialogTitle>
                    </DialogHeader>
                    {currentClass && <ClassForm onSubmit={handleUpdateClass} initialData={currentClass} />}
                  </DialogContent>
                </Dialog>
                <Button variant="destructive" onClick={() => handleDeleteClass(cls.class_id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

interface ClassFormProps {
  onSubmit: (classData: Omit<Class, "class_id">) => void
  initialData?: Class
}

function ClassForm({ onSubmit, initialData }: ClassFormProps) {
  const [formData, setFormData] = useState<Omit<Class, "class_id">>(
    initialData || {
      name: "",
      section: "",
      semester: "",
      year: new Date().getFullYear(),
      admin: "",
    },
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: name === "year" ? Number.parseInt(value) : value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Class Name</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="section">Section</Label>
        <Input id="section" name="section" value={formData.section} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="semester">Semester</Label>
        <Select
          name="semester"
          value={formData.semester}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, semester: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select semester" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Fall">Fall</SelectItem>
            <SelectItem value="Spring">Spring</SelectItem>
            <SelectItem value="Summer">Summer</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="year">Year</Label>
        <Input id="year" name="year" type="number" value={formData.year} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="admin">Admin</Label>
        <Input id="admin" name="admin" value={formData.admin} onChange={handleChange} required />
      </div>
      <Button type="submit">{initialData ? "Update" : "Add"} Class</Button>
    </form>
  )
}

