"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, X } from "lucide-react";

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    
    const userMessage = inputMessage.trim();
    setInputMessage("");
    
    // Add user message to chat
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    
    // Show loading state
    setIsLoading(true);
    
    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Add AI response to chat
        setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
      } else {
        // Handle error
        setMessages(prev => [...prev, { 
          role: "system", 
          content: "Sorry, there was an error processing your request." 
        }]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { 
        role: "system", 
        content: "Network error. Please check your connection and try again." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat toggle button */}
      <Button
        variant="default"
        size="icon"
        className="fixed bottom-6 right-6 rounded-full shadow-lg z-50"
        onClick={toggleChat}
      >
        {isOpen ? <X /> : <MessageSquare />}
      </Button>

      {/* Chat window */}
      {isOpen && (
        <Card className="fixed bottom-20 right-6 w-80 sm:w-96 h-96 shadow-xl z-50 flex flex-col overflow-hidden border">
          <div className="bg-primary p-3 text-primary-foreground font-medium">
            <h3>Jimmy-Your AI Tattoo Assistant 🐕 </h3>
          </div>
          
          {/* Messages area */}
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-3">
              {/* Welcome message */}
              {messages.length === 0 && (
                <div className="bg-secondary/30 rounded-lg p-3">
                  <p className="text-sm">
                    Hi there! I am Jimmy. Ask me anything about Inv Over Matter or Tattoos.
                  </p>
                </div>
              )}
              
              {/* Chat messages */}
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg max-w-[80%] ${
                    message.role === "user" 
                      ? "bg-primary text-primary-foreground ml-auto" 
                      : message.role === "assistant"
                        ? "bg-secondary/30 mr-auto"
                        : "bg-muted mr-auto"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="bg-secondary/30 rounded-lg p-3 mr-auto">
                  <div className="flex gap-1 items-center">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-75"></div>
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150"></div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          {/* Input area */}
          <form onSubmit={handleSendMessage} className="p-3 border-t flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              type="submit"
              disabled={isLoading || !inputMessage.trim()} 
              size="icon"
            >
              <Send size={18} />
            </Button>
          </form>
        </Card>
      )}
    </>
  );
};

export default ChatBox;