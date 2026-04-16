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
import { MessageCircle, Users as UsersIcon, X, BellRing, ArrowLeft, Search, Sparkles } from 'lucide-react';
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

  // Auto-expand sidebar when a conversation is set
  useEffect(() => {
    if (activeConversationId && isCollapsed) {
      setOpen?.(true);
      setActiveTab('conversations');
      if (isMobile) setMobileShowChat(true);
    }
  }, [activeConversationId, isCollapsed, setOpen, isMobile]);

  useEffect(() => {
    if (isCollapsed) setMobileShowChat(false);
  }, [isCollapsed]);

  // Listen for window event to force sidebar open
  useEffect(() => {
    const handleOpenChat = async (e: CustomEvent) => {
      if (e.detail?.conversationId) {
        setActiveConversationId(e.detail.conversationId);
        if (isMobile) {
          setOpenMobile(true);
          setMobileShowChat(true);
        } else if (setOpen) {
          setOpen(true);
        }
        setActiveTab('conversations');
        setTimeout(() => {
          if (isMobile) {
            setOpenMobile(true);
            setMobileShowChat(true);
          } else if (setOpen) {
            setOpen(true);
          }
        }, 100);
      }

      if (e.detail?.userId) {
        const convId = await startConversation(e.detail.userId);
        if (convId) {
          setActiveConversationId(convId);
          if (isMobile) {
            setOpenMobile(true);
            setMobileShowChat(true);
          } else if (setOpen) {
            setOpen(true);
          }
          setActiveTab('conversations');
        }
      }

      if (!e.detail?.conversationId && !e.detail?.userId) {
        setActiveTab('conversations');
        if (isMobile) {
          setOpenMobile(true);
        } else if (setOpen) {
          setOpen(true);
        }
      }
    };

    window.addEventListener('open-chat-sidebar' as any, handleOpenChat);
    return () => window.removeEventListener('open-chat-sidebar' as any, handleOpenChat);
  }, [setActiveConversationId, setOpen, setOpenMobile, state, startConversation, setActiveTab, isMobile]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleStartChat = async (userId: string) => {
    const convId = await startConversation(userId);
    if (convId) {
      setActiveConversationId(convId);
      if (isMobile) setMobileShowChat(true);
    }
  };

  const handleConversationClick = (convId: string) => {
    setActiveConversationId(convId);
    if (isMobile) setMobileShowChat(true);
  };

  const handleMobileBack = () => {
    setMobileShowChat(false);
    setActiveConversationId(null);
  };

  const closeSidebar = () => {
    setActiveConversationId(null);
    if (isMobile) setOpenMobile(false);
    if (setOpen) setOpen(false);
    else toggleSidebar();
  };

  if (isCollapsed && !openMobile) return null;

  const onlineUsers = activeUsers.filter(u => u.id !== user?.id);

  return (
    <>
      {/* Mobile backdrop */}
      {!isCollapsed && isMobile && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={closeSidebar}
          aria-label="Close sidebar"
        />
      )}

      <Sidebar
        className="w-full md:w-[520px] lg:w-[640px] border-r border-border/40 bg-background z-50 max-w-full"
        collapsible="icon"
        side="left"
      >
        <SidebarContent className="flex flex-col h-full relative">
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border/40">
            <Button variant="ghost" size="icon" onClick={closeSidebar} className="h-8 w-8 shrink-0 rounded-full hover:bg-muted">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <h2 className="font-bold text-lg tracking-tight">Messages</h2>
              <p className="text-xs text-muted-foreground">{onlineUsers.length} people online</p>
            </div>
            <Button variant="ghost" size="icon" onClick={closeSidebar} className="h-8 w-8 shrink-0 rounded-full hover:bg-muted">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Split Layout */}
          <div className="flex-1 flex overflow-hidden min-w-0">
            {/* Left Panel - User/Conv List */}
            <div className={`w-full md:w-64 lg:w-72 md:border-r border-border/30 flex flex-col shrink-0 ${isMobile && mobileShowChat ? 'hidden' : 'flex'}`}>
              {/* Tab Switcher */}
              <div className="flex gap-2 px-4 pt-4 pb-2">
                <button
                  onClick={() => setActiveTab('active')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeTab === 'active'
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <UsersIcon className="h-3.5 w-3.5" />
                  Online ({onlineUsers.length})
                </button>
                <button
                  onClick={() => setActiveTab('conversations')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all relative ${
                    activeTab === 'conversations'
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Chats
                  {totalUnread > 0 && (
                    <Badge variant="destructive" className="ml-1 h-5 min-w-5 px-1.5 rounded-full text-[10px] font-bold">
                      {totalUnread}
                    </Badge>
                  )}
                </button>
              </div>

              {/* Active Users Tab */}
              {activeTab === 'active' && (
                <ScrollArea className="flex-1">
                  <div className="px-3 py-2 space-y-1">
                    {onlineUsers.length === 0 ? (
                      <div className="py-12 text-center">
                        <UsersIcon className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
                        <p className="text-sm text-muted-foreground">No one else online right now</p>
                      </div>
                    ) : (
                      onlineUsers.map((activeUser) => {
                        const isActive = conversations.find(c => c.other_user.id === activeUser.id)?.id === activeConversationId;
                        return (
                          <button
                            key={activeUser.id}
                            onClick={() => handleStartChat(activeUser.id)}
                            className={`w-full px-3 py-3 rounded-xl hover:bg-accent/60 transition-all text-left group ${
                              isActive ? 'bg-accent' : ''
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative flex-shrink-0">
                                <Avatar className="h-11 w-11 ring-2 ring-background shadow-sm">
                                  <AvatarImage src={activeUser.avatar_url || undefined} />
                                  <AvatarFallback className="text-sm font-semibold bg-primary/10 text-primary">
                                    {activeUser.display_name?.charAt(0) || '?'}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background" style={{ background: 'hsl(140 70% 45%)' }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="font-semibold text-sm block truncate">
                                  {activeUser.display_name}
                                </span>
                                <span className="text-xs text-muted-foreground">Online now</span>
                              </div>
                              <MessageCircle className="h-4 w-4 text-muted-foreground/0 group-hover:text-primary transition-colors" />
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </ScrollArea>
              )}

              {/* Conversations Tab */}
              {activeTab === 'conversations' && (
                <>
                  {isLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
                    </div>
                  ) : conversations.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center p-6">
                      <div className="text-center">
                        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                          <Sparkles className="h-8 w-8 text-primary" />
                        </div>
                        <p className="text-sm font-medium mb-1">No conversations yet</p>
                        <p className="text-xs text-muted-foreground mb-4">Start chatting with someone online!</p>
                        <Button variant="outline" size="sm" onClick={() => setActiveTab('active')} className="rounded-full">
                          <UsersIcon className="h-3.5 w-3.5 mr-1.5" />
                          View online users
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <ScrollArea className="flex-1">
                      <div className="px-3 py-2 space-y-1">
                        {conversations.map((conv) => {
                          const isActive = conv.id === activeConversationId;
                          return (
                            <button
                              key={conv.id}
                              onClick={() => handleConversationClick(conv.id)}
                              className={`w-full px-3 py-3 rounded-xl hover:bg-accent/60 transition-all text-left ${
                                isActive ? 'bg-accent' : ''
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <Avatar className="h-11 w-11 flex-shrink-0 ring-2 ring-background shadow-sm">
                                  <AvatarImage src={conv.other_user.avatar_url || undefined} />
                                  <AvatarFallback className="text-sm font-semibold bg-primary/10 text-primary">
                                    {conv.other_user.display_name?.charAt(0) || '?'}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="font-semibold text-sm truncate">
                                      {conv.other_user.display_name}
                                    </span>
                                    {conv.last_message && (
                                      <span className="text-[10px] text-muted-foreground flex-shrink-0">
                                        {formatDistanceToNow(new Date(conv.last_message.created_at), { addSuffix: false })}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center justify-between gap-2 mt-0.5">
                                    {conv.last_message ? (
                                      <p className="text-xs text-muted-foreground truncate">
                                        {conv.last_message.content}
                                      </p>
                                    ) : (
                                      <p className="text-xs text-muted-foreground italic">No messages yet</p>
                                    )}
                                    {conv.unread_count > 0 && (
                                      <Badge variant="destructive" className="h-5 min-w-5 px-1.5 rounded-full text-[10px] font-bold flex-shrink-0">
                                        {conv.unread_count}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  )}
                </>
              )}
            </div>

            {/* Right Panel - Chat Window */}
            <div className={`flex-1 flex flex-col min-w-0 ${isMobile && !mobileShowChat ? 'hidden' : 'flex'}`}>
              {activeConversationId ? (
                activeConversation ? (
                  <>
                    {/* Chat Header */}
                    <div className="flex items-center gap-3 px-5 py-4 border-b border-border/40 bg-background/80 backdrop-blur-sm">
                      {isMobile && (
                        <Button variant="ghost" size="icon" onClick={handleMobileBack} className="h-8 w-8 rounded-full hover:bg-muted">
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                      )}
                      <Avatar className="h-10 w-10 ring-2 ring-background shadow-sm">
                        <AvatarImage src={activeConversation.other_user.avatar_url || undefined} />
                        <AvatarFallback className="font-semibold bg-primary/10 text-primary">
                          {activeConversation.other_user.display_name?.charAt(0) || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">
                          {activeConversation.other_user.display_name}
                        </h3>
                        {activeConversation.other_user.last_seen && (
                          <p className="text-xs text-muted-foreground">
                            Active {formatDistanceToNow(new Date(activeConversation.other_user.last_seen), { addSuffix: true })}
                          </p>
                        )}
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={sendNudge} className="h-9 w-9 rounded-full hover:bg-accent">
                              <BellRing className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent><p>Send a nudge 👋</p></TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    {/* Messages Area */}
                    <ScrollArea className="flex-1 min-w-0">
                      <div className="px-5 py-6 space-y-5 min-w-0 w-full">
                        {messages.map((message) => {
                          const isOwn = message.sender_id === user?.id;
                          const isRead = message.read_by && message.read_by.length > 1;

                          return (
                            <div
                              key={message.id}
                              className={`flex min-w-0 ${isOwn ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 overflow-hidden ${
                                  isOwn
                                    ? 'bg-primary text-primary-foreground rounded-br-md shadow-lg shadow-primary/10'
                                    : 'bg-muted rounded-bl-md shadow-sm'
                                }`}
                              >
                                {message.images && message.images.length > 0 && (
                                  <div className="flex gap-2 mb-3 flex-wrap">
                                    {message.images.map((img: string, imgIdx: number) => (
                                      <img
                                        key={imgIdx}
                                        src={img}
                                        alt={`Attached image ${imgIdx + 1}`}
                                        className="max-w-[220px] rounded-xl border border-border/20"
                                      />
                                    ))}
                                  </div>
                                )}
                                {message.content && (
                                  <p className="text-[15px] leading-relaxed" style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
                                    {message.content}
                                  </p>
                                )}
                                <div className="flex items-center gap-1.5 mt-1.5">
                                  <span className="text-[10px] opacity-60">
                                    {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                                  </span>
                                  {isOwn && isRead && (
                                    <span className="text-[10px] opacity-60">• Read</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        {/* Typing Indicator */}
                        {typingUsers.size > 0 && (
                          <div className="flex justify-start">
                            <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                              <div className="flex gap-1.5">
                                <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                              </div>
                            </div>
                          </div>
                        )}

                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>

                    {/* Message Input */}
                    <div className="px-5 py-4 border-t border-border/40 bg-background/80 backdrop-blur-sm">
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
                  <div className="flex-1 flex items-center justify-center p-8">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground">Loading conversation...</p>
                    </div>
                  </div>
                )
              ) : (
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="h-20 w-20 rounded-3xl bg-muted/60 flex items-center justify-center mx-auto mb-5">
                      <MessageCircle className="h-10 w-10 text-muted-foreground/40" />
                    </div>
                    <p className="text-base font-medium mb-1">Start a conversation</p>
                    <p className="text-sm text-muted-foreground max-w-[240px] mx-auto">
                      Select someone from the list or pick an online user to begin
                    </p>
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
