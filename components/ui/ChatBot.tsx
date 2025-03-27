"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, X, Send, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/hooks/useChat";
import { ThemeToggle } from "./ThemeToggle";
import ReactMarkdown from "react-markdown";
import Image from "next/image";

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, setInput, handleSubmit, isLoading } = useChat();
  const scrollAreaRef = useRef<HTMLDivElement>(null); // Ref for the ScrollArea viewport
  const messagesEndRef = useRef<HTMLDivElement>(null); // Add this ref
  const [showTrigger, setShowTrigger] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Move scroll position logic to useEffect
  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setShowTrigger(position > window.innerHeight * 0.2);
    };

    // Only add listener on client-side
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to bottom when messages, loading state, or window open state changes
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "auto",
        block: "end",
      });
    }
  }, [messages, isLoading, isOpen]);

  return (
    <>
      {/* Chatbot Trigger Button */}
      <AnimatePresence>
        {showTrigger && (
          <motion.div
            className="fixed bottom-6 right-6 z-50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              onClick={() => setIsOpen(true)}
              size="lg"
              className="h-14 w-14 rounded-full shadow-lg"
            >
              <MessageSquare className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-6 right-6 w-[calc(100%-2rem)] z-[5000] max-w-md sm:w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border shadow-xl bg-gray-50/80 dark:bg-background/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between rounded-[10px] bg-gray-50 dark:bg-background border-b px-4 dark:border-gray-900">
                <div className="flex items-center gap-4">
                  <Avatar className="h-8 w-8">
                    <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground">
                      <Image
                        src="/assets/bot.png"
                        alt="AI Assistant"
                        width={32}
                        height={32}
                        className={`h-full w-full object-cover ${
                          imageLoaded ? "opacity-100" : "opacity-0"
                        }`}
                        onLoadingComplete={() => setImageLoaded(true)}
                      />
                    </div>
                  </Avatar>
                  <h3 className="font-semibold">Owais AI Assistant</h3>
                </div>
                <div className="flex items-center gap-1">
                  <ThemeToggle />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <ScrollArea
                className="h-[350px] md:h-[400px] p-4"
                ref={scrollAreaRef}
              >
                <CardContent className="space-y-4 pt-4 w-full p-1 sm:p-2">
                  {messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-center text-mutedforeground">
                      <p>Hello! I'm here to help You. Ask anything about Owais Abdullah's services or tech!</p>
                    </div>
                  ) : (
                    messages.map((message, index) =>
                      message.role === "user" ? (
                        <div
                          key={index}
                          className="flex flex-col gap-2 rounded-l-[20px] rounded-tr-[20px] p-3 break-words w-fit max-w-[80%] ml-auto bg-accent/95 text-foreground shadow-sm shadow-accent/20"
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {message.content}
                          </p>
                        </div>
                      ) : (
                        <div
                          key={index}
                          className="flex items-end gap-3 max-w-[90%]"
                        >
                          <Avatar className="h-8 w-8 flex-shrink-0 mb-1">
                            <div className="flex h-full w-full items-center justify-center bg-blue-300 dark:bg-accent text-foreground ">
                              <Image
                                src="/assets/bot.png"
                                alt="AI Assistant"
                                width={26}
                                height={26}
                                className={`h-full w-full object-cover ${
                                  imageLoaded ? "opacity-100" : "opacity-0"
                                }`}
                                onLoadingComplete={() => setImageLoaded(true)}
                              />
                            </div>
                          </Avatar>
                          <div className="flex flex-col gap-2 rounded-r-[20px] rounded-tl-[20px] p-3 break-words bg-muted/80 dark:bg-dmuted/80 text-mutedforeground dark:text-dmutedforeground shadow-sm shadow-accent/20">
                            {message.content.includes("rate limit") && (
                              <div className="mb-1 flex items-center gap-1 text-amber-500">
                                <AlertTriangle className="h-3 w-3" />
                                <span className="text-xs font-medium">
                                  Rate Limited
                                </span>
                              </div>
                            )}
                            <div className="text-sm whitespace-pre-wrap break-words">
                              <ReactMarkdown>{message.content}</ReactMarkdown>
                            </div>
                          </div>
                        </div>
                      )
                    )
                  )}

                  {isLoading && (
                    <div className="flex w-max max-w-[80%] flex-col gap-2 rounded-[10px] bg-muted dark:bg-dmuted p-3">
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div
                            className="h-2 w-2 animate-bounce rounded-full bg-mutedforeground dark:bg-dmutedforeground"
                            style={{ animationDelay: "0ms" }}
                          ></div>
                          <div
                            className="h-2 w-2 animate-bounce rounded-full bg-mutedforeground dark:bg-dmutedforeground"
                            style={{ animationDelay: "150ms" }}
                          ></div>
                          <div
                            className="h-2 w-2 animate-bounce rounded-full bg-mutedforeground dark:bg-dmutedforeground"
                            style={{ animationDelay: "300ms" }}
                          ></div>
                        </div>
                        <p className="text-xs text-mutedforeground dark:text-dmutedforeground">
                          Assistant is typing...
                        </p>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </CardContent>
              </ScrollArea>

              <CardFooter className="px-4">
                <form
                  onSubmit={handleSubmit}
                  className="flex w-full items-center gap-2"
                >
                  <Input
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 focus:outline-none focus:ring-0 dark:focus:ring-0 dark:border-gray-900"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isLoading || !input.trim()}
                    className="bg-accent dark:bg-accent text-foreground hover:bg-blue-900 dark:text-foreground dark:hover:bg-blue-400"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
