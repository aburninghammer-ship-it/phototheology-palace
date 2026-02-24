import { useState, useEffect, useRef } from 'react';
import { useDirectMessagesContext } from '@/contexts/DirectMessagesContext';
import { useAuth } from '@/hooks/useAuth';
import { useActiveUsers } from '@/hooks/useActiveUsers';
import { ChatInput } from '@/components/ChatInput';
import {
  Sidebar,
  SidebarContent,
  useSidebar
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MessageCircle, Users as UsersIcon, X, BellRing, ArrowLeft } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const MessagingSidebar = () => {
  const { state, toggleSidebar, open, setOpen, openMobile, setOpenMobile, isMobile } = useSidebar();
  const { user } = useAuth();
  const { activeUsers } = useActiveUsers();
  const {
    conversations,
    messages,
    activeConversationId,
    setActiveConversationId,
    startConversation,
    sendMessage,
    sendNudge,
    updateTypingIndicator,
    typingUsers,
    isLoading
  } = useDirectMessagesContext();

  const [activeTab, setActiveTab] = useState<'active' | 'conversations'>('active');
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const totalUnread = conversations.reduce((sum, c) => sum + c.unread_count, 0);
  const isCollapsed = state === 'collapsed';

  // Log sidebar state changes
  useEffect(() => {
    console.log('📊 Sidebar state:', { state, isCollapsed, isMobile, open });
  }, [state, isCollapsed, isMobile, open]);

  // Auto-expand sidebar when a conversation is set (e.g., from notification)
  useEffect(() => {
    if (activeConversationId && isCollapsed) {
      console.log('Auto-expanding sidebar due to active conversation:', activeConversationId);
      setOpen?.(true);
      setActiveTab('conversations');
      if (isMobile) {
        setMobileShowChat(true);
      }
    }
  }, [activeConversationId, isCollapsed, setOpen, isMobile]);

  // Reset mobile view when sidebar closes
  useEffect(() => {
    if (isCollapsed) {
      setMobileShowChat(false);
    }
  }, [isCollapsed]);

  // Listen for window event to force sidebar open (for deep-linked notifications)
  // IMPORTANT: This must run even when collapsed, so we can open from notifications
  useEffect(() => {
    console.log('📬 MessagingSidebar: Setting up event listener for open-chat-sidebar');
    
    const handleOpenChat = async (e: CustomEvent) => {
      console.log('📬 MessagingSidebar: Event received!', {
        type: e.type,
        detail: e.detail,
        conversationId: e.detail?.conversationId,
        userId: e.detail?.userId,
        isMobile,
        isCollapsed: state === 'collapsed'
      });
      
      // Handle conversationId (from notifications)
      if (e.detail?.conversationId) {
        console.log('📬 MessagingSidebar: Setting conversation:', e.detail.conversationId);
        setActiveConversationId(e.detail.conversationId);
        
        // Force open the sidebar - use correct method for mobile vs desktop
        console.log('📬 MessagingSidebar: Opening sidebar (isMobile:', isMobile, ')');
        if (isMobile) {
          console.log('📬 MessagingSidebar: Using setOpenMobile(true) for mobile');
          setOpenMobile(true);
          setMobileShowChat(true); // Show chat view directly on mobile
        } else {
          console.log('📬 MessagingSidebar: Using setOpen(true) for desktop');
          if (setOpen) {
            setOpen(true);
          }
        }
        setActiveTab('conversations');
        
        // Small delay to ensure UI updates
        setTimeout(() => {
          if (isMobile) {
            setOpenMobile(true);
            setMobileShowChat(true);
          } else if (setOpen) {
            setOpen(true);
          }
        }, 100);
      }
      
      // Handle userId (from community page)
      if (e.detail?.userId) {
        console.log('📬 MessagingSidebar: Starting conversation with user:', e.detail.userId);
        const convId = await startConversation(e.detail.userId);
        if (convId) {
          console.log('📬 MessagingSidebar: Conversation started:', convId);
          setActiveConversationId(convId);
          if (isMobile) {
            setOpenMobile(true);
            setMobileShowChat(true); // Show chat view directly on mobile
          } else if (setOpen) {
            setOpen(true);
          }
          setActiveTab('conversations');
        } else {
          console.error('📬 MessagingSidebar: Failed to start conversation');
        }
      }
      
      if (!e.detail?.conversationId && !e.detail?.userId) {
        console.error('📬 MessagingSidebar: No conversationId or userId in event detail!');
      }
    };
    
    window.addEventListener('open-chat-sidebar' as any, handleOpenChat);
    console.log('📬 MessagingSidebar: Event listener registered');
    
    return () => {
      console.log('📬 MessagingSidebar: Removing event listener');
      window.removeEventListener('open-chat-sidebar' as any, handleOpenChat);
    };
  }, [setActiveConversationId, setOpen, setOpenMobile, state, startConversation, setActiveTab, isMobile]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleStartChat = async (userId: string) => {
    console.log('👤 Starting chat with user:', userId);
    const convId = await startConversation(userId);
    if (convId) {
      console.log('✅ Conversation created/found:', convId);
      setActiveConversationId(convId);
      if (isMobile) {
        setMobileShowChat(true);
      }
    } else {
      console.error('❌ Failed to create/find conversation');
    }
  };

  // When a conversation is selected on mobile, show chat view
  const handleConversationClick = (convId: string) => {
    console.log('📱 Conversation clicked:', convId);
    setActiveConversationId(convId);
    if (isMobile) {
      setMobileShowChat(true);
    }
  };

  // Back button handler for mobile
  const handleMobileBack = () => {
    setMobileShowChat(false);
    setActiveConversationId(null);
  };

  // Return null for UI when collapsed on desktop AND not open on mobile
  // On mobile, we use openMobile state; on desktop, we use open/isCollapsed state
  if (isCollapsed && !openMobile) {
    return null;
  }

  return (
    <>
      {/* Backdrop overlay for mobile - click to close */}
      {!isCollapsed && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => {
            console.log('🎭 Backdrop clicked - closing sidebar');
            if (setOpen) {
              setOpen(false);
            } else {
              toggleSidebar();
            }
          }}
          aria-label="Close sidebar"
        />
      )}
      
      <Sidebar 
        className="w-full md:w-[500px] lg:w-[600px] border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 max-w-full" 
        collapsible="icon" 
        side="left"
      >
      <SidebarContent className="flex flex-col h-full relative">
          {/* Mobile Header with Back Button */}
          <div className="flex items-center gap-2 p-3 border-b bg-background/95 backdrop-blur-lg sticky top-0 z-50">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                console.log('❌ Closing sidebar via back button');
                setActiveConversationId(null);
                if (isMobile) {
                  setOpenMobile(false);
                }
                if (setOpen) {
                  setOpen(false);
                } else {
                  toggleSidebar();
                }
              }}
              className="h-9 w-9 shrink-0"
              aria-label="Close messages"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="font-semibold text-lg flex-1">Messages</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setActiveConversationId(null);
                if (isMobile) {
                  setOpenMobile(false);
                }
                if (setOpen) {
                  setOpen(false);
                } else {
                  toggleSidebar();
                }
              }}
              className="h-9 w-9 shrink-0"
              aria-label="Close messages"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

        {/* Split Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - User List - Show on mobile when not in chat view */}
          <div className={`w-full md:w-72 lg:w-80 md:border-r flex flex-col ${isMobile && mobileShowChat ? 'hidden' : 'flex'} ${!isMobile ? '' : ''}`}>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex flex-col h-full">
              <TabsList className="grid w-full grid-cols-2 m-2">
                <TabsTrigger value="active" className="text-xs">
                  <UsersIcon className="h-3 w-3 mr-1" />
                  Active ({activeUsers.filter(u => u.id !== user?.id).length})
                </TabsTrigger>
                <TabsTrigger value="conversations" className="text-xs relative">
                  <MessageCircle className="h-3 w-3 mr-1" />
                  Chats
                  {totalUnread > 0 && (
                    <Badge variant="destructive" className="ml-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                      {totalUnread}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="flex-1 m-0 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="space-y-1 p-2">
                    {activeUsers
                      .filter(u => u.id !== user?.id)
                      .map((activeUser) => {
                        const isActive = conversations.find(c => c.other_user.id === activeUser.id)?.id === activeConversationId;
                        return (
                          <button
                            key={activeUser.id}
                            onClick={() => handleStartChat(activeUser.id)}
                            className={`w-full p-2 rounded-lg hover:bg-accent transition-colors text-left ${
                              isActive ? 'bg-accent' : ''
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className="relative flex-shrink-0">
                                <Avatar className="h-9 w-9">
                                  <AvatarImage src={activeUser.avatar_url || undefined} />
                                  <AvatarFallback className="text-xs">
                                    {activeUser.display_name?.charAt(0) || '?'}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-background" />
                              </div>
                              <span className="font-medium text-sm truncate">
                                {activeUser.display_name}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="conversations" className="flex-1 m-0 overflow-hidden">
                {isLoading ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    Loading...
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    <p className="mb-2">No conversations yet</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab('active')}
                    >
                      Find someone to chat with
                    </Button>
                  </div>
                ) : (
                  <ScrollArea className="h-full">
                    <div className="space-y-1 p-2">
                       {conversations.map((conv) => {
                        const isActive = conv.id === activeConversationId;
                        return (
                          <button
                            key={conv.id}
                            onClick={() => handleConversationClick(conv.id)}
                            className={`w-full p-2 rounded-lg hover:bg-accent transition-colors text-left ${
                              isActive ? 'bg-accent' : ''
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Avatar className="h-9 w-9 flex-shrink-0">
                                <AvatarImage src={conv.other_user.avatar_url || undefined} />
                                <AvatarFallback className="text-xs">
                                  {conv.other_user.display_name?.charAt(0) || '?'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="font-medium text-sm truncate">
                                    {conv.other_user.display_name}
                                  </span>
                                  {conv.unread_count > 0 && (
                                    <Badge variant="destructive" className="h-4 w-4 p-0 flex items-center justify-center text-[10px] flex-shrink-0">
                                      {conv.unread_count}
                                    </Badge>
                                  )}
                                </div>
                                {conv.last_message && (
                                  <p className="text-xs text-muted-foreground truncate">
                                    {conv.last_message.content}
                                  </p>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </ScrollArea>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Panel - Chat Window - Hide on mobile when showing list */}
          <div className={`flex-1 flex flex-col ${isMobile && !mobileShowChat ? 'hidden' : 'flex'}`}>
            {activeConversationId ? (
              activeConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="flex items-center gap-2 p-3 border-b">
                  {/* Back button for mobile */}
                  {isMobile && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleMobileBack}
                      className="h-8 w-8 mr-1"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  )}
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={activeConversation.other_user.avatar_url || undefined} />
                    <AvatarFallback>
                      {activeConversation.other_user.display_name?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">
                      {activeConversation.other_user.display_name}
                    </h3>
                    {activeConversation.other_user.last_seen && (
                      <p className="text-xs text-muted-foreground truncate">
                        {formatDistanceToNow(new Date(activeConversation.other_user.last_seen), { 
                          addSuffix: true 
                        })}
                      </p>
                    )}
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={sendNudge}
                          className="h-8 w-8 hover:bg-accent"
                        >
                          <BellRing className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Send a nudge 👋</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                 {/* Messages */}
                <ScrollArea className="flex-1 p-4 md:p-6">
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const isOwn = message.sender_id === user?.id;
                      const isRead = message.read_by && message.read_by.length > 1;

                      return (
                         <div
                          key={message.id}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 ${
                              isOwn
                                ? 'bg-primary text-primary-foreground shadow-md'
                                : 'bg-muted shadow-sm'
                            }`}
                          >
                            {message.images && message.images.length > 0 && (
                              <div className="flex gap-2 mb-2 flex-wrap">
                                {message.images.map((img: string, imgIdx: number) => (
                                  <img
                                    key={imgIdx}
                                    src={img}
                                    alt={`Attached image ${imgIdx + 1}`}
                                    className="max-w-[200px] rounded-lg border"
                                  />
                                ))}
                              </div>
                            )}
                            {message.content && (
                              <p className="text-base break-words leading-relaxed">{message.content}</p>
                            )}
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-[10px] opacity-70">
                                {formatDistanceToNow(new Date(message.created_at), { 
                                  addSuffix: true 
                                })}
                              </span>
                              {isOwn && isRead && (
                                <span className="text-[10px] opacity-70">• Read</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Typing Indicator */}
                    {typingUsers.size > 0 && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-lg px-3 py-2">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 md:p-6 border-t bg-background/50">
                  <ChatInput
                    onSend={async (message, images) => {
                      await sendMessage(message, images);
                      updateTypingIndicator(false);
                    }}
                    placeholder="Type a message..."
                  />
                </div>
              </>
              ) : (
                <div className="flex-1 flex items-center justify-center p-6">
                  <div className="text-center text-muted-foreground">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3" />
                    <p className="text-sm">Loading conversation...</p>
                  </div>
                </div>
              )
            ) : (
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="text-center text-muted-foreground">
                  <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Select a conversation or active user to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
    </>
  );
};