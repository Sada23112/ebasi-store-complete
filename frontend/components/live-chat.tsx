"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MessageCircle,
  X,
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  CheckCheck,
  Star,
  Bot,
  User,
  Minimize2,
  Maximize2,
} from "lucide-react"

interface Message {
  id: string
  sender: "user" | "agent" | "bot"
  content: string
  timestamp: Date
  status?: "sent" | "delivered" | "read"
  type?: "text" | "image" | "file"
}

const initialMessages: Message[] = [
  {
    id: "1",
    sender: "bot",
    content: "Hello! I'm EBASI Assistant. How can I help you today?",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    status: "delivered",
  },
  {
    id: "2",
    sender: "bot",
    content:
      "I can help you with:\n• Product information\n• Order tracking\n• Size guidance\n• Store locations\n• Pickup scheduling\n• Returns & exchanges",
    timestamp: new Date(Date.now() - 4 * 60 * 1000),
    status: "delivered",
  },
]

const quickReplies = [
  "Track my order",
  "Size guide",
  "Return policy",
  "Store locations",
  "Schedule pickup",
  "Product availability",
  "Speak to agent",
]

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [agentConnected, setAgentConnected] = useState(false)
  const [currentAgent, setCurrentAgent] = useState({
    name: "Priya Sharma",
    avatar: "/agent-avatar.jpg",
    status: "online",
    rating: 4.9,
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      content,
      timestamp: new Date(),
      status: "sent",
    }

    setMessages((prev) => [...prev, userMessage])
    setNewMessage("")

    // Simulate typing indicator
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)

      // Auto-responses based on content
      let botResponse = "Thank you for your message. Let me help you with that."

      if (content.toLowerCase().includes("order") || content.toLowerCase().includes("track")) {
        botResponse =
          "I can help you track your order. Please provide your order number, and I'll get the latest status for you."
      } else if (content.toLowerCase().includes("size")) {
        botResponse =
          "I'd be happy to help with sizing! What product are you interested in? I can provide detailed measurements and fit guidance."
      } else if (content.toLowerCase().includes("return")) {
        botResponse =
          "Our return policy allows returns within 30 days of delivery. Items should be in original condition with tags. Would you like to start a return request?"
      } else if (content.toLowerCase().includes("pickup") || content.toLowerCase().includes("schedule")) {
        botResponse =
          "I can help you schedule a pickup for returns or exchanges. Would you like me to guide you through the pickup scheduling process or connect you with our pickup team?"
      } else if (content.toLowerCase().includes("store") || content.toLowerCase().includes("location")) {
        botResponse =
          "I can help you find our store locations! We have stores in Mumbai (Phoenix Mall), Delhi (Select City Walk), and Bangalore (Forum Mall). Would you like directions to any of these locations or help with store services?"
      } else if (content.toLowerCase().includes("agent") || content.toLowerCase().includes("human")) {
        setAgentConnected(true)
        botResponse = "I'm connecting you with one of our customer service agents. Please wait a moment..."
        setTimeout(() => {
          const agentMessage: Message = {
            id: (Date.now() + 1).toString(),
            sender: "agent",
            content: `Hi! I'm ${currentAgent.name} from EBASI customer service. I see you need assistance. How can I help you today?`,
            timestamp: new Date(),
            status: "delivered",
          }
          setMessages((prev) => [...prev, agentMessage])
        }, 2000)
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: agentConnected ? "agent" : "bot",
        content: botResponse,
        timestamp: new Date(),
        status: "delivered",
      }

      setMessages((prev) => [...prev, botMessage])
    }, 1500)
  }

  const handleQuickReply = (reply: string) => {
    sendMessage(reply)
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all"
          size="lg"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-80 shadow-2xl transition-all ${isMinimized ? "h-16" : "h-96"}`}>
        <CardHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {agentConnected ? (
                <div className="relative">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={currentAgent.avatar || "/placeholder.svg"} />
                    <AvatarFallback>PS</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
              ) : (
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
              <div>
                <CardTitle className="text-sm">{agentConnected ? currentAgent.name : "EBASI Assistant"}</CardTitle>
                <CardDescription className="text-xs flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{agentConnected ? "Customer Service" : "AI Assistant"}</span>
                  {agentConnected && (
                    <>
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{currentAgent.rating}</span>
                    </>
                  )}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={() => setIsMinimized(!isMinimized)} className="h-8 w-8 p-0">
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-8 w-8 p-0">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            <CardContent className="p-0 h-64 overflow-y-auto">
              <div className="p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.sender !== "user" && (
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            {message.sender === "bot" ? (
                              <Bot className="w-3 h-3 text-primary" />
                            ) : (
                              <User className="w-3 h-3 text-primary" />
                            )}
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm whitespace-pre-line">{message.content}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs opacity-70">
                              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                            {message.sender === "user" && (
                              <CheckCheck
                                className={`w-3 h-3 ${message.status === "read" ? "text-blue-400" : "opacity-50"}`}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            <div className="p-4 border-t space-y-3">
              {!agentConnected && (
                <div className="flex flex-wrap gap-1">
                  {quickReplies.slice(0, 3).map((reply) => (
                    <Button
                      key={reply}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickReply(reply)}
                      className="text-xs h-6 px-2"
                    >
                      {reply}
                    </Button>
                  ))}
                </div>
              )}

              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage(newMessage)}
                    className="pr-20"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Paperclip className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Smile className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={() => sendMessage(newMessage)}
                  disabled={!newMessage.trim()}
                  size="sm"
                  className="h-9 w-9 p-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              {agentConnected && (
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Connected to {currentAgent.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Phone className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Video className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
