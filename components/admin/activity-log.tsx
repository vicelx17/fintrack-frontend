"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Download, Filter } from "lucide-react"
import { useState } from "react"

export function ActivityLog() {
  const [searchTerm, setSearchTerm] = useState("")

  const activities = [
    {
      id: 1,
      timestamp: "2024-03-21 14:30:25",
      user: "juan@example.com",
      action: "LOGIN",
      description: "Usuario inició sesión",
      ip: "192.168.1.100",
      status: "success",
    },
    {
      id: 2,
      timestamp: "2024-03-21 14:25:10",
      user: "maria@example.com",
      action: "TRANSACTION_CREATE",
      description: "Creó nueva transacción: Compra supermercado",
      ip: "192.168.1.101",
      status: "success",
    },
    {
      id: 3,
      timestamp: "2024-03-21 14:20:45",
      user: "carlos@example.com",
      action: "BUDGET_UPDATE",
      description: "Actualizó presupuesto de alimentación",
      ip: "192.168.1.102",
      status: "success",
    },
    {
      id: 4,
      timestamp: "2024-03-21 14:15:30",
      user: "ana@example.com",
      action: "LOGIN_FAILED",
      description: "Intento de inicio de sesión fallido",
      ip: "192.168.1.103",
      status: "error",
    },
    {
      id: 5,
      timestamp: "2024-03-21 14:10:15",
      user: "admin@fintrack.com",
      action: "USER_SUSPEND",
      description: "Suspendió usuario: test@example.com",
      ip: "192.168.1.1",
      status: "warning",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">Éxito</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Advertencia</Badge>
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  const getActionBadge = (action: string) => {
    const actionMap: { [key: string]: string } = {
      LOGIN: "Inicio de Sesión",
      LOGIN_FAILED: "Login Fallido",
      TRANSACTION_CREATE: "Crear Transacción",
      BUDGET_UPDATE: "Actualizar Presupuesto",
      USER_SUSPEND: "Suspender Usuario",
    }
    return actionMap[action] || action
  }

  const filteredActivities = activities.filter(
    (activity) =>
      activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.action.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Registro de Actividad</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar en el registro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha y Hora</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Acción</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>IP</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredActivities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell className="font-mono text-sm">{activity.timestamp}</TableCell>
                <TableCell>{activity.user}</TableCell>
                <TableCell>
                  <Badge variant="outline">{getActionBadge(activity.action)}</Badge>
                </TableCell>
                <TableCell>{activity.description}</TableCell>
                <TableCell className="font-mono text-sm">{activity.ip}</TableCell>
                <TableCell>{getStatusBadge(activity.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
