"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
    MessageSquare,
    Send,
    Search,
    Star,
    Clock,
    CheckCircle,
    AlertCircle,
    Phone,
    Mail,
    Calendar,
} from "lucide-react";
import { useState } from "react";

// Mock data for messages
const conversations = [
    {
        id: 1,
        guestName: "Sarah Johnson",
        avatar: "",
        propertyName: "Downtown Loft",
        lastMessage: "Hi! What time is check-in?",
        timestamp: "2 min ago",
        unread: true,
        status: "confirmed",
        checkIn: "2024-01-15",
        checkOut: "2024-01-18",
    },
    {
        id: 2,
        guestName: "Mike Chen",
        avatar: "",
        propertyName: "Beachfront Villa",
        lastMessage: "Thank you for the great stay!",
        timestamp: "1 hour ago",
        unread: false,
        status: "completed",
        checkIn: "2024-01-10",
        checkOut: "2024-01-14",
    },
    {
        id: 3,
        guestName: "Emma Wilson",
        avatar: "",
        propertyName: "Mountain Cabin",
        lastMessage: "Is parking available?",
        timestamp: "3 hours ago",
        unread: true,
        status: "pending",
        checkIn: "2024-01-20",
        checkOut: "2024-01-23",
    },
];

const selectedConversation = {
    id: 1,
    guestName: "Sarah Johnson",
    propertyName: "Downtown Loft",
    checkIn: "2024-01-15",
    checkOut: "2024-01-18",
    guestInfo: {
        joinDate: "2022",
        verified: true,
        rating: 4.8,
        reviews: 23,
    },
    messages: [
        {
            id: 1,
            sender: "guest",
            message: "Hi! I just booked your downtown loft for next week. Very excited!",
            timestamp: "2024-01-10 10:30",
            read: true,
        },
        {
            id: 2,
            sender: "host",
            message: "Thank you for booking! I'm excited to host you. Let me know if you have any questions.",
            timestamp: "2024-01-10 11:15",
            read: true,
        },
        {
            id: 3,
            sender: "guest",
            message: "What time is check-in? And is there parking available nearby?",
            timestamp: "2024-01-10 14:20",
            read: true,
        },
        {
            id: 4,
            sender: "host",
            message:
                "Check-in is anytime after 3 PM. There's free street parking right in front of the building, and a paid garage 2 blocks away if you prefer covered parking.",
            timestamp: "2024-01-10 14:45",
            read: true,
        },
        {
            id: 5,
            sender: "guest",
            message: "Hi! What time is check-in?",
            timestamp: "2024-01-10 16:30",
            read: false,
        },
    ],
};

export default function HostMessagesPage() {
    const [selectedConversationId, setSelectedConversationId] = useState(1);
    const [newMessage, setNewMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;
        // Handle sending message logic here
        setNewMessage("");
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "confirmed":
                return "bg-green-100 text-green-800 border-green-200";
            case "pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "completed":
                return "bg-blue-100 text-blue-800 border-blue-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Messages</h1>
                <p className="text-muted-foreground">
                    Communicate with your guests and provide excellent customer service
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
                {/* Conversations List */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center">
                                <MessageSquare className="w-5 h-5 mr-2" />
                                Conversations
                            </CardTitle>
                            <Badge variant="secondary">{conversations.filter((c) => c.unread).length} new</Badge>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search conversations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="space-y-0">
                            {conversations.map((conversation) => (
                                <div
                                    key={conversation.id}
                                    className={`p-4 cursor-pointer border-b hover:bg-muted/50 transition-colors ${
                                        selectedConversationId === conversation.id
                                            ? "bg-muted/50 border-l-4 border-l-primary"
                                            : ""
                                    }`}
                                    onClick={() => setSelectedConversationId(conversation.id)}
                                >
                                    <div className="flex items-start space-x-3">
                                        <Avatar className="w-10 h-10">
                                            <AvatarImage src={conversation.avatar} alt={conversation.guestName} />
                                            <AvatarFallback>
                                                {conversation.guestName
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="text-sm font-medium truncate">
                                                    {conversation.guestName}
                                                </h4>
                                                <div className="flex items-center space-x-1">
                                                    {conversation.unread && (
                                                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                                                    )}
                                                    <span className="text-xs text-muted-foreground">
                                                        {conversation.timestamp}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-muted-foreground mb-2">
                                                {conversation.propertyName}
                                            </p>
                                            <p className="text-sm text-muted-foreground truncate">
                                                {conversation.lastMessage}
                                            </p>
                                            <div className="flex items-center justify-between mt-2">
                                                <Badge
                                                    variant="outline"
                                                    className={getStatusColor(conversation.status)}
                                                >
                                                    {conversation.status}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    {conversation.checkIn} - {conversation.checkOut}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Chat Interface */}
                <Card className="lg:col-span-2 flex flex-col">
                    {/* Chat Header */}
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Avatar>
                                    <AvatarFallback>
                                        {selectedConversation.guestName
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-semibold">{selectedConversation.guestName}</h3>
                                    <p className="text-sm text-muted-foreground">{selectedConversation.propertyName}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm">
                                    <Phone className="w-4 h-4 mr-2" />
                                    Call
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Mail className="w-4 h-4 mr-2" />
                                    Email
                                </Button>
                            </div>
                        </div>

                        {/* Guest Info */}
                        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>Check-in: {selectedConversation.checkIn}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>Check-out: {selectedConversation.checkOut}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span>
                                    {selectedConversation.guestInfo.rating} ({selectedConversation.guestInfo.reviews}{" "}
                                    reviews)
                                </span>
                            </div>
                            {selectedConversation.guestInfo.verified && (
                                <div className="flex items-center space-x-1">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span>Verified</span>
                                </div>
                            )}
                        </div>
                    </CardHeader>

                    <Separator />

                    {/* Messages */}
                    <CardContent className="flex-1 overflow-y-auto p-4">
                        <div className="space-y-4">
                            {selectedConversation.messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.sender === "host" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[70%] p-3 rounded-lg ${
                                            message.sender === "host"
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted"
                                        }`}
                                    >
                                        <p className="text-sm">{message.message}</p>
                                        <div className="flex items-center justify-between mt-2">
                                            <span
                                                className={`text-xs ${
                                                    message.sender === "host"
                                                        ? "text-primary-foreground/70"
                                                        : "text-muted-foreground"
                                                }`}
                                            >
                                                {message.timestamp}
                                            </span>
                                            {message.sender === "host" && (
                                                <div className="flex items-center space-x-1">
                                                    {message.read ? (
                                                        <CheckCircle className="w-3 h-3 text-primary-foreground/70" />
                                                    ) : (
                                                        <Clock className="w-3 h-3 text-primary-foreground/70" />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>

                    <Separator />

                    {/* Message Input */}
                    <div className="p-4">
                        <div className="flex space-x-2">
                            <Input
                                placeholder="Type your message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                className="flex-1"
                            />
                            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                            <p>Press Enter to send, Shift + Enter for new line</p>
                            <div className="flex items-center space-x-2">
                                <AlertCircle className="w-3 h-3" />
                                <span>Be professional and helpful</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
