"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, X, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { sendChatMessage } from "@/lib/services/api";

const MAX_RETRIES = 2;

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [failedMessage, setFailedMessage] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { toast } = useToast();
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    // If first opening, add welcome message
    if (!isOpen && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: "Hi there! I am Jimmy. Ask me anything about Ink Over Matter or Tattoos."
        }
      ]);
    }
  };

  const handleRetry = async () => {
    if (failedMessage) {
      await handleSendMessage(null, failedMessage);
      setFailedMessage(null);
    }
  };

  const handleSendMessage = async (e, retryContent = null) => {
    if (e) e.preventDefault();
    
    const messageContent = retryContent || inputMessage.trim();
    if (!messageContent) return;
    
    if (!retryContent) {
      setInputMessage("");
      setMessages(prev => [...prev, { role: "user", content: messageContent }]);
    }
    
    setIsLoading(true);
    const currentRetryCount = retryContent ? retryCount + 1 : 0;
    
    try {
      // Call the backend API
      const response = await sendChatMessage(messageContent);
      
      setMessages(prev => [...prev, { 
        role: "assistant",
        content: response.response 
      }]);
      
      setRetryCount(0);
      setFailedMessage(null);
      
      if (currentRetryCount > 0) {
        toast({
          title: "Message sent successfully",
          description: "Your message was delivered after retrying",
          duration: 3000,
        });
      }
    } catch (err) {
      console.error("Error sending message:", err);
      
      if (currentRetryCount < MAX_RETRIES) {
        setRetryCount(currentRetryCount);
        setFailedMessage(messageContent);
        
        setMessages(prev => [
          ...prev, 
          { 
            role: "error", 
            content: "Failed to send message. Please check your connection and try again.",
            retryable: true 
          }
        ]);
      } else {
        setMessages(prev => [
          ...prev, 
          { 
            role: "error", 
            content: "Network error. Please check your connection and try again." 
          }
        ]);
        
        toast({
          title: "Communication error",
          description: "Couldn't connect to our servers. Please try again later.",
          variant: "destructive",
          duration: 5000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat toggle button with aria label */}
      <Button
        variant="default"
        size="icon"
        className="fixed bottom-6 right-6 rounded-full shadow-lg z-50"
        onClick={toggleChat}
        aria-label={isOpen ? "Close chat" : "Open chat assistant"}
        aria-expanded={isOpen}
        aria-controls="chat-panel"
      >
        {isOpen ? <X aria-hidden="true" /> : <MessageSquare aria-hidden="true" />}
      </Button>

      {/* Chat window */}
      {isOpen && (
        <Card 
          id="chat-panel"
          className="fixed bottom-20 right-6 w-80 sm:w-96 h-96 shadow-xl z-50 flex flex-col overflow-hidden border"
          role="region"
          aria-label="Chat with Jimmy"
        >
          <div className="bg-primary p-3 text-primary-foreground font-medium flex justify-between items-center">
            <h3>Jimmy-Your AI Tattoo Assistant 🐕</h3>
            <Button 
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-primary-foreground" 
              onClick={toggleChat}
              aria-label="Close chat"
            >
              <X size={16} aria-hidden="true" />
            </Button>
          </div>
          
          {/* Messages area */}
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-3">
              {/* Messages */}
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg max-w-[80%] ${
                    message.role === "user" 
                      ? "bg-primary text-primary-foreground ml-auto" 
                      : message.role === "assistant"
                        ? "bg-secondary/30 mr-auto"
                        : "bg-destructive/20 text-destructive-foreground mr-auto flex flex-col gap-2"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">
                    {message.role === "error" && <AlertCircle size={14} className="inline-block mr-1" />}
                    {message.content}
                  </p>
                  
                  {message.retryable && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2 h-7 text-xs"
                      onClick={handleRetry}
                      disabled={isLoading}
                    >
                      Try again
                    </Button>
                  )}
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="bg-secondary/30 rounded-lg p-3 mr-auto">
                  <div className="flex gap-1 items-center" aria-hidden="true">
                    <Loader2 size={14} className="animate-spin" />
                    <span className="text-sm">Jimmy is typing...</span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          {/* Input area */}
          <form onSubmit={handleSendMessage} className="p-3 border-t flex gap-2">
            <Input
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1"
              aria-label="Type message"
            />
            <Button 
              type="submit"
              disabled={isLoading || !inputMessage.trim()} 
              size="icon"
              aria-label="Send message"
            >
              <Send size={18} aria-hidden="true" />
            </Button>
          </form>
        </Card>
      )}
    </>
  );
};

export default ChatBox;