"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { GetContactos, GetContactoById, PutContacto, DeleteContacto } from "@/api/services/contactService"
import {
  Users,
  Mail,
  MessageSquare,
  Calendar,
  TrendingUp,
  Edit3,
  Trash2,
  Check,
  X,
  Filter,
  Search,
  BarChart3,
  UserCheck,
  UserX,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import type { IContacto } from "@/types/Contacto"
import NotificationManager from "@/components/NotificationManager"

const Dashboard = () => {
  const [leads, setLeads] = useState<IContacto[]>([])
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [newState, setNewState] = useState<string>("nuevo")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("")

  useEffect(() => {
    fetchLeads()
  }, [page, limit])

  const fetchLeads = async () => {
    const response = await GetContactos(page, limit)
    if (response && response.status === 200 && Array.isArray(response.data)) {
      setLeads(response.data)
      setTotalPages(Math.ceil(response.total / limit) || 1)
      processChartData(response.data)
    }
  }

  const fetchLeadForEdit = async (id: number) => {
    const response = await GetContactoById(id)
    if (response?.status === 200 && response.data) {
      setNewState(response.data.estado)
    }
  }

  const handleSaveState = async (id: number) => {
    if (newState) {
      const response = await PutContacto(id, { estado: newState })
      if (response?.status === 200) {
        setEditingId(null)
        fetchLeads()
      }
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de eliminar este lead?")) {
      const response = await DeleteContacto(id)
      if (response?.status === 200) {
        fetchLeads()
      }
    }
  }

  const processChartData = (data: IContacto[]) => {
    const statusCount = data.reduce(
      (acc, lead) => {
        acc[lead.estado] = (acc[lead.estado] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
    return Object.entries(statusCount).map(([estado, count]) => ({ estado, count }))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "nuevo":
        return <Clock className="w-4 h-4" />
      case "contactado":
        return <UserCheck className="w-4 h-4" />
      case "descartado":
        return <UserX className="w-4 h-4" />
      case "pendiente":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "nuevo":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "contactado":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "descartado":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      case "pendiente":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "" || lead.estado === filterStatus
    return matchesSearch && matchesFilter
  })
  
  const totalLeads = leads.length
  const newLeads = leads.filter((lead) => lead.estado === "nuevo").length
  const contactedLeads = leads.filter((lead) => lead.estado === "contactado").length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
            Dashboard de Leads
          </h1>
        </div>
        <p className="text-gray-400">Gestiona y monitorea todos tus contactos desde un solo lugar</p>
      </div>

      {/* Notification Manager - Sistema de notificaciones en tiempo real */}
      <NotificationManager />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Leads</p>
                <p className="text-2xl font-bold text-white">{totalLeads}</p>
              </div>
              <Users className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Nuevos</p>
                <p className="text-2xl font-bold text-blue-300">{newLeads}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Contactados</p>
                <p className="text-2xl font-bold text-green-300">{contactedLeads}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Tasa Conversión</p>
                <p className="text-2xl font-bold text-purple-300">
                  {totalLeads > 0 ? Math.round((contactedLeads / totalLeads) * 100) : 0}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="bg-gray-800/50 border-gray-700 mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48 bg-gray-700/50 border-gray-600 text-white">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="nuevo">Nuevo</SelectItem>
                  <SelectItem value="contactado">Contactado</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="descartado">Descartado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-purple-400" />
            <span>Lista de Leads</span>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              {filteredLeads.length} resultados
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700 hover:bg-gray-700/30">
                  <TableHead className="text-gray-300">ID</TableHead>
                  <TableHead className="text-gray-300">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>Nombre</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-300">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>Email</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-300">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-4 h-4" />
                      <span>Mensaje</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-300">Estado</TableHead>
                  <TableHead className="text-gray-300">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Fecha</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-300">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id} className="border-gray-700 hover:bg-gray-700/30 transition-colors">
                    <TableCell className="text-gray-300 font-mono">#{lead.id}</TableCell>
                    <TableCell className="text-white font-medium">{lead.nombre}</TableCell>
                    <TableCell className="text-gray-300">{lead.email}</TableCell>
                    <TableCell className="text-gray-300 max-w-xs">
                      <div className="truncate" title={lead.mensaje}>
                        {lead.mensaje}
                      </div>
                    </TableCell>
                    <TableCell>
                      {editingId === lead.id ? (
                        <div className="flex items-center space-x-2">
                          <Select value={newState} onValueChange={setNewState}>
                            <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-700 border-gray-600">
                              <SelectItem value="nuevo">Nuevo</SelectItem>
                              <SelectItem value="contactado">Contactado</SelectItem>
                              <SelectItem value="pendiente">Pendiente</SelectItem>
                              <SelectItem value="descartado">Descartado</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            size="sm"
                            onClick={() => handleSaveState(lead.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingId(null)}
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <Badge className={`${getStatusColor(lead.estado)} flex items-center space-x-1 w-fit`}>
                          {getStatusIcon(lead.estado)}
                          <span className="capitalize">{lead.estado}</span>
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingId(lead.id)
                            fetchLeadForEdit(lead.id)
                          }}
                          disabled={editingId !== null}
                          className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(lead.id)}
                          className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-400">
              Mostrando {filteredLeads.length} de {totalLeads} leads
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((old) => Math.max(old - 1, 1))}
                disabled={page === 1}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Anterior
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1
                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(pageNum)}
                      className={
                        page === pageNum
                          ? "bg-purple-600 hover:bg-purple-700"
                          : "border-gray-600 text-gray-300 hover:bg-gray-700"
                      }
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((old) => Math.min(old + 1, totalPages))}
                disabled={page === totalPages}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Siguiente
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard
