import { useState, useEffect, useRef } from 'react';
import { useDirectMessages } from '@/hooks/useDirectMessages';
import { useAuth } from '@/hooks/useAuth';
import { useActiveUsers } from '@/hooks/useActiveUsers';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, ArrowLeft, Users as UsersIcon, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const MessagingSidebar = () => {
  const { state, toggleSidebar } = useSidebar();
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

  const [view, setView] = useState<'list' | 'chat' | 'users'>('users');
  const [messageInput, setMessageInput] = useState('');
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const totalUnread = conversations.reduce((sum, c) => sum + c.unread_count, 0);
  const isCollapsed = state === 'collapsed';

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleStartChat = async (userId: string) => {
    const convId = await startConversation(userId);
    if (convId) {
      setActiveConversationId(convId);
      setView('chat');
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;
    
    await sendMessage(messageInput);
    setMessageInput('');
    updateTypingIndicator(false);
  };

  const handleTyping = (value: string) => {
    setMessageInput(value);
    
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    if (value.trim()) {
      updateTypingIndicator(true);
      const timeout = setTimeout(() => {
        updateTypingIndicator(false);
      }, 3000);
      setTypingTimeout(timeout);
    } else {
      updateTypingIndicator(false);
    }
  };

  if (isCollapsed) {
    return (
      <Sidebar className="w-14" collapsible="icon">
        <SidebarContent>
          <div className="p-2 flex flex-col items-center">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setView('users')}
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
    <Sidebar className="w-80" collapsible="icon">
      <SidebarContent>
        {/* Conversation List View */}
        {view === 'list' && (
          <>
            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center justify-between px-4">
                <span>Messages</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setView('users')}
                  >
                    <UsersIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleSidebar}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                {isLoading ? (
                  <div className="p-4 text-center text-muted-foreground">
                    Loading...
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    <p className="mb-2">No conversations yet</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setView('users')}
                    >
                      Start a conversation
                    </Button>
                  </div>
                ) : (
                  <ScrollArea className="h-[calc(100vh-200px)]">
                    <SidebarMenu>
                      {conversations.map((conv) => (
                        <SidebarMenuItem key={conv.id}>
                          <SidebarMenuButton
                            onClick={() => {
                              setActiveConversationId(conv.id);
                              setView('chat');
                            }}
                            className="w-full justify-start gap-3 h-auto py-3"
                          >
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={conv.other_user.avatar_url || undefined} />
                              <AvatarFallback>
                                {conv.other_user.display_name?.charAt(0) || '?'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 text-left overflow-hidden">
                              <div className="flex items-center justify-between">
                                <span className="font-medium truncate">
                                  {conv.other_user.display_name}
                                </span>
                                {conv.unread_count > 0 && (
                                  <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
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
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </ScrollArea>
                )}
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        {/* Active Users View */}
        {view === 'users' && (
          <>
            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setView('list')}
                    className="h-6 w-6"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <span>Active Users</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSidebar}
                >
                  <X className="h-4 w-4" />
                </Button>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <SidebarMenu>
                    {activeUsers
                      .filter(u => u.id !== user?.id)
                      .map((activeUser) => (
                        <SidebarMenuItem key={activeUser.id}>
                          <SidebarMenuButton
                            onClick={() => handleStartChat(activeUser.id)}
                            className="w-full justify-start gap-3 h-auto py-3"
                          >
                            <div className="relative">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={activeUser.avatar_url || undefined} />
                                <AvatarFallback>
                                  {activeUser.display_name?.charAt(0) || '?'}
                                </AvatarFallback>
                              </Avatar>
                              <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
                            </div>
                            <span className="font-medium">{activeUser.display_name}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                  </SidebarMenu>
                </ScrollArea>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        {/* Chat View */}
        {view === 'chat' && activeConversation && (
          <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="flex items-center gap-2 p-3 border-b">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setActiveConversationId(null);
                  setView('list');
                }}
                className="h-7 w-7"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Avatar className="h-8 w-8">
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setView('users')}
                className="h-7 w-7"
                title="Browse active users"
              >
                <UsersIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="h-7 w-7"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
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
                        className={`max-w-[75%] rounded-lg px-3 py-2 ${
                          isOwn
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
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
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={messageInput}
                  onChange={(e) => handleTyping(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
};