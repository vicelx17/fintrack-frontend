"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Save, Database, Mail, Shield, Bell } from "lucide-react"

export function SystemSettings() {
  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Configuración General
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="app-name">Nombre de la Aplicación</Label>
              <Input id="app-name" defaultValue="FinTrack" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="app-version">Versión</Label>
              <Input id="app-version" defaultValue="1.0.0" readOnly />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Modo de Mantenimiento</Label>
              <p className="text-sm text-muted-foreground">Activar para realizar mantenimiento del sistema</p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Registro de Nuevos Usuarios</Label>
              <p className="text-sm text-muted-foreground">Permitir que nuevos usuarios se registren</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Database Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Configuración de Base de Datos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="db-host">Host de Base de Datos</Label>
              <Input id="db-host" defaultValue="localhost" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="db-port">Puerto</Label>
              <Input id="db-port" defaultValue="5432" />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Database className="w-4 h-4 mr-2" />
              Probar Conexión
            </Button>
            <Button variant="outline">Respaldar Base de Datos</Button>
          </div>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            Configuración de Email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtp-host">Servidor SMTP</Label>
              <Input id="smtp-host" placeholder="smtp.gmail.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-port">Puerto SMTP</Label>
              <Input id="smtp-port" placeholder="587" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="from-email">Email de Remitente</Label>
            <Input id="from-email" placeholder="noreply@fintrack.com" />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notificaciones por Email</Label>
              <p className="text-sm text-muted-foreground">Enviar notificaciones automáticas a usuarios</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Configuración de Notificaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Alertas de Presupuesto</Label>
              <p className="text-sm text-muted-foreground">Notificar cuando se superen los límites de presupuesto</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Recordatorios de Transacciones</Label>
              <p className="text-sm text-muted-foreground">Recordar a usuarios registrar transacciones pendientes</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Reportes Mensuales</Label>
              <p className="text-sm text-muted-foreground">Enviar resúmenes financieros mensuales automáticamente</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>
          <Save className="w-4 h-4 mr-2" />
          Guardar Configuración
        </Button>
      </div>
    </div>
  )
}
