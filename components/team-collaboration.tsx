"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Users } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  task: string;
  status: "completed" | "in-progress" | "pending";
}

const team: TeamMember[] = [
  {
    id: "1",
    name: "Ahmed Hassan",
    avatar: "AH",
    task: "Zone A Moisture Calibration",
    status: "completed",
  },
  {
    id: "2",
    name: "Sarah Ali",
    avatar: "SA",
    task: "Water Quality Testing System",
    status: "in-progress",
  },
  {
    id: "3",
    name: "Omar Khalil",
    avatar: "OK",
    task: "Fertigation Schedule Update",
    status: "pending",
  },
  {
    id: "4",
    name: "Fatima Noor",
    avatar: "FN",
    task: "Greenhouse Climate Control",
    status: "in-progress",
  },
];

export function TeamCollaboration() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-700 border-0 text-xs">Completed</Badge>;
      case "in-progress":
        return <Badge className="bg-yellow-100 text-yellow-700 border-0 text-xs">In Progress</Badge>;
      case "pending":
        return <Badge className="bg-red-100 text-red-700 border-0 text-xs">Pending</Badge>;
      default:
        return null;
    }
  };

  const getAvatarColor = (index: number) => {
    const colors = [
      "bg-gradient-to-br from-red-400 to-pink-500",
      "bg-gradient-to-br from-green-400 to-teal-500",
      "bg-gradient-to-br from-blue-400 to-indigo-500",
      "bg-gradient-to-br from-orange-400 to-yellow-500",
    ];
    return colors[index % colors.length];
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Team Collaboration
            </CardTitle>
          </div>
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Add Member
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {team.map((member, index) => (
          <div key={member.id} className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${getAvatarColor(index)} flex items-center justify-center text-white font-semibold text-sm`}>
              {member.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{member.name}</p>
              <p className="text-xs text-gray-500 truncate">Working on {member.task}</p>
            </div>
            {getStatusBadge(member.status)}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

