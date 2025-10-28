import { useState, useEffect, useRef } from 'react';
import { useDirectMessages } from '@/hooks/useDirectMessages';
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
import { MessageCircle, Users as UsersIcon, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const MessagingSidebar = () => {
  const { state, toggleSidebar, open, setOpen, isMobile } = useSidebar();
  const { user } = useAuth();
  const { activeUsers } = useActiveUsers();
  const {
    conversations,
    messages,
    activeConversationId,
    setActiveConversationId,
    startConversation,
    sendMessage,
    updateTypingIndicator,
    typingUsers,
    isLoading
  } = useDirectMessages();

  const [activeTab, setActiveTab] = useState<'active' | 'conversations'>('active');
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
    }
  }, [activeConversationId, isCollapsed, setOpen]);

  // Listen for window event to force sidebar open (for deep-linked notifications)
  useEffect(() => {
    const handleOpenChat = (e: CustomEvent) => {
      console.log('Open chat sidebar event received:', e.detail);
      if (e.detail?.conversationId) {
        setActiveConversationId(e.detail.conversationId);
        // Use setOpen to force sidebar open if it's available
        if (setOpen) {
          setOpen(true);
        } else if (state === 'collapsed') {
          toggleSidebar();
        }
        setActiveTab('conversations');
      }
    };
    
    window.addEventListener('open-chat-sidebar' as any, handleOpenChat);
    return () => window.removeEventListener('open-chat-sidebar' as any, handleOpenChat);
  }, [setActiveConversationId, toggleSidebar, setOpen, state]);

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
    } else {
      console.error('❌ Failed to create/find conversation');
    }
  };

  if (isCollapsed) {
    return (
      <Sidebar className="w-14 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" collapsible="icon" side="left">
        <SidebarContent>
          <div className="p-2 flex flex-col items-center">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => {
                console.log('🔄 Expanding sidebar from collapsed state');
                toggleSidebar();
              }}
              aria-label="Open messages"
            >
              <MessageCircle className="h-5 w-5" />
              {totalUnread > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                >
                  {totalUnread > 9 ? '9+' : totalUnread}
                </Badge>
              )}
            </Button>
          </div>
        </SidebarContent>
      </Sidebar>
    );
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
        className="w-96 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50" 
        collapsible="icon" 
        side="left"
      >
        <SidebarContent className="flex flex-col h-full relative">
          {/* Floating Close Button - Always Visible */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              console.log('❌ Closing sidebar via floating button');
              if (setOpen) {
                setOpen(false);
              } else {
                toggleSidebar();
              }
            }}
            className="absolute top-2 right-2 z-50 h-8 w-8 hover:bg-destructive/10 bg-background/80 backdrop-blur-sm shadow-sm"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-background pt-12">
            <h2 className="font-semibold text-lg">Messages</h2>
          </div>

        {/* Split Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - User List */}
          <div className="w-64 border-r flex flex-col">
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
                            onClick={() => {
                              console.log('📱 Conversation clicked:', conv.id);
                              console.log('Other user:', conv.other_user.display_name);
                              setActiveConversationId(conv.id);
                            }}
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

          {/* Right Panel - Chat Window */}
          <div className="flex-1 flex flex-col">
            {activeConversationId ? (
              activeConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="flex items-center gap-2 p-3 border-b">
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
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-3">
                    {messages.map((message) => {
                      const isOwn = message.sender_id === user?.id;
                      const isRead = message.read_by && message.read_by.length > 1;

                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[75%] rounded-lg px-3 py-2 ${
                              isOwn
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <p className="text-sm break-words">{message.content}</p>
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
                <div className="p-3 border-t">
                  <ChatInput
                    onSend={async (message) => {
                      await sendMessage(message);
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