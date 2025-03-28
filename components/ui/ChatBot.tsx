"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Send, AlertTriangle, BotMessageSquare } from "lucide-react";
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
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Show tooltip after 5 seconds
  useEffect(() => {
    if (isOpen) return; 

    let showTimeout: NodeJS.Timeout;
    let hideTimeout: NodeJS.Timeout;

    const startCycle = () => {
      showTimeout = setTimeout(() => {
        setShowTooltip(true);
        hideTimeout = setTimeout(() => {
          setShowTooltip(false);
          startCycle(); 
        }, 10000); 
      }, 8000); 
    };

    startCycle();

    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
    };
  }, [isOpen]);

  // Pulsing animation for the button when tooltip is visible
  useEffect(() => {
    if (!isOpen) {
      const interval = setInterval(() => {
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [ isOpen]);

  // Scroll to bottom when messages, loading state, or window open state changes
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "auto",
        block: "end",
      });
    }
  }, [messages, isLoading, isOpen]);

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Trigger Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-[5001]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: isOpen ? 14 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative">
          <motion.button
            onClick={toggleChat}
            className="flex justify-center items-center h-12 w-12 rounded-full shadow-black/50 shadow-lg bg-accent hover:bg-accent/90 transition-all"
            animate={
              !isOpen
                ? {
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                    transition: {
                      repeat: Infinity,
                      repeatType: "mirror",
                      duration: 1.5,
                    },
                  }
                : {}
            }
            whileHover={{ scale: 1.1 }}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={28} strokeWidth={2} />
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <BotMessageSquare size={28} strokeWidth={1.5} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Chat Tooltip */}
          <AnimatePresence>
            {showTooltip && !isOpen && (
              <motion.div
                className="absolute right-16 bottom-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm px-3 py-1 rounded-md whitespace-nowrap shadow-lg"
                initial={{ opacity: 0, x: 10, y: 10 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  y: 0,
                  transition: {
                    type: "spring",
                    stiffness: 500,
                    damping: 15,
                  },
                }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    transition: {
                      repeat: Infinity,
                      repeatType: "mirror",
                      duration: 2,
                    },
                  }}
                >
                  <div className="flex items-center gap-1">
                    👋 Chat with Me!
                  </div>
                </motion.div>
                <div className="absolute right-[-4px] top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gradient-to-l from-blue-600 to-blue-500 rotate-45"></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-x-0 mx-auto bottom-[72px] sm:inset-auto sm:bottom-16 sm:right-6 z-[5000] w-[90vw] sm:w-[calc(100%-2rem)] sm:max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="h-[70vh] sm:h-[80vh] flex flex-col border shadow-xl bg-gray-50/90 dark:bg-background/95 backdrop-blur-sm">
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

              <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                <CardContent className="space-y-4 pt-4 w-full p-1 sm:p-2">
                  {messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-center text-mutedforeground">
                      <p>
                        Hello! I&apos;m here to help You. Ask anything about
                        Owais Abdullah&apos;s services or tech!
                      </p>
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
