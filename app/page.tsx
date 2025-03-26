"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, FileText, MessageSquare, Users, Wrench } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useState } from "react"

export default function Dashboard() {
  const [occupancyRate, setOccupancyRate] = useState(85)
  const [maintenanceRequests, setMaintenanceRequests] = useState(12)
  const [pendingPayments, setPendingPayments] = useState(8)
  const [totalStudents, setTotalStudents] = useState(320)
  const [feedbackResponses, setFeedbackResponses] = useState(45)

  const recentActivities = [
    {
      id: 1,
      title: "New student registered",
      time: "10 minutes ago",
    },
    {
      id: 2,
      title: "Maintenance request submitted",
      time: "1 hour ago",
    },
    {
      id: 3,
      title: "Room assignment updated",
      time: "3 hours ago",
    },
    {
      id: 4,
      title: "Payment received",
      time: "5 hours ago",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row">
        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupancyRate}%</div>
            <Progress value={occupancyRate} className="mt-2" />
            <p className="mt-2 text-xs text-muted-foreground">{100 - occupancyRate}% rooms available</p>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Requests</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{maintenanceRequests}</div>
            <p className="text-xs text-muted-foreground">5 high priority requests</p>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPayments}</div>
            <p className="text-xs text-muted-foreground">3 payments overdue by more than 7 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">15 new students this month</p>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Feedback Responses</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feedbackResponses}</div>
            <p className="text-xs text-muted-foreground">Average rating: 4.2/5</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-sm font-medium">Database</p>
                  <span className="text-xs text-green-500">Operational</span>
                </div>
                <Progress value={100} className="h-1" />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-sm font-medium">API</p>
                  <span className="text-xs text-green-500">Operational</span>
                </div>
                <Progress value={100} className="h-1" />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-sm font-medium">Payment Gateway</p>
                  <span className="text-xs text-green-500">Operational</span>
                </div>
                <Progress value={100} className="h-1" />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-sm font-medium">Notification Service</p>
                  <span className="text-xs text-green-500">Operational</span>
                </div>
                <Progress value={100} className="h-1" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

