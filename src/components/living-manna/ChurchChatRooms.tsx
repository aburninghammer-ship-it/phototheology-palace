import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { useChurchChatRooms, ChatRoom, ChatMessage } from "@/hooks/useChurchChatRooms";
import { Loader2, MessageCircle, Send, ArrowLeft, Pin, MoreVertical, Plus, Hash, Heart, Bell, BookOpen, Users, Sparkles } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChurchChatRoomsProps {
  churchId: string;
  userRole?: 'admin' | 'leader' | 'member';
}

const ROOM_ICONS: Record<string, React.ReactNode> = {
  general: <Hash className="h-4 w-4" />,
  prayer: <Heart className="h-4 w-4" />,
  announcements: <Bell className="h-4 w-4" />,
  bible_study: <BookOpen className="h-4 w-4" />,
  fellowship: <Users className="h-4 w-4" />,
  custom: <Sparkles className="h-4 w-4" />,
};

export function ChurchChatRooms({ churchId, userRole = 'member' }: ChurchChatRoomsProps) {
  const { user } = useAuth();
  const {
    rooms,
    messages,
    activeRoomId,
    setActiveRoomId,
    typingUsers,
    isLoading,
    sendMessage,
    updateTypingIndicator,
    pinMessage,
    deleteMessage,
    createRoom,
  } = useChurchChatRooms(churchId);

  const [messageInput, setMessageInput] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDescription, setNewRoomDescription] = useState("");
  const [newRoomType, setNewRoomType] = useState<ChatRoom['room_type']>('custom');
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeRoom = rooms.find(r => r.id === activeRoomId);
  const isLeader = userRole === 'admin' || userRole === 'leader';
  const pinnedMessages = messages.filter(m => m.is_pinned);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    await sendMessage(messageInput, 'text', undefined, replyTo?.id);
    setMessageInput("");
    setReplyTo(null);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    updateTypingIndicator(e.target.value.length > 0);
  };

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return;

    await createRoom(newRoomName, newRoomDescription, newRoomType);
    setShowCreateDialog(false);
    setNewRoomName("");
    setNewRoomDescription("");
    setNewRoomType('custom');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-6">
      {/* Rooms List */}
      <Card variant="glass" className={`lg:col-span-1 ${activeRoomId && 'hidden lg:block'}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2 text-foreground">
              <MessageCircle className="h-5 w-5" />
              Chat Rooms
            </CardTitle>
            {isLeader && (
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Chat Room</DialogTitle>
                    <DialogDescription>
                      Create a new chat room for your church community.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="room-name">Room Name</Label>
                      <Input
                        id="room-name"
                        value={newRoomName}
                        onChange={(e) => setNewRoomName(e.target.value)}
                        placeholder="e.g., Youth Group Chat"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="room-description">Description</Label>
                      <Input
                        id="room-description"
                        value={newRoomDescription}
                        onChange={(e) => setNewRoomDescription(e.target.value)}
                        placeholder="What's this room for?"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="room-type">Room Type</Label>
                      <Select value={newRoomType} onValueChange={(v) => setNewRoomType(v as ChatRoom['room_type'])}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="prayer">Prayer</SelectItem>
                          <SelectItem value="bible_study">Bible Study</SelectItem>
                          <SelectItem value="fellowship">Fellowship</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateRoom} disabled={!newRoomName.trim()}>
                      Create Room
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[350px] lg:h-[450px]">
            <div className="p-2 space-y-1">
              {rooms.length === 0 ? (
                <p className="text-center text-foreground/50 py-8 text-sm">
                  No chat rooms yet
                </p>
              ) : (
                rooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => setActiveRoomId(room.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left hover:bg-primary/10 ${
                      activeRoomId === room.id ? 'bg-primary/20' : ''
                    }`}
                  >
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      {room.icon ? (
                        <span className="text-lg">{room.icon}</span>
                      ) : (
                        ROOM_ICONS[room.room_type] || <Hash className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground truncate">
                          {room.name}
                        </p>
                        {room.is_default && (
                          <Badge variant="secondary" className="text-[10px] px-1">
                            Default
                          </Badge>
                        )}
                      </div>
                      {room.description && (
                        <p className="text-xs text-foreground/50 truncate">
                          {room.description}
                        </p>
                      )}
                    </div>
                    {room.unread_count > 0 && (
                      <Badge variant="destructive" className="h-5 min-w-5 flex items-center justify-center text-xs shrink-0">
                        {room.unread_count > 99 ? '99+' : room.unread_count}
                      </Badge>
                    )}
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card variant="glass" className={`lg:col-span-2 ${!activeRoomId && 'hidden lg:block'}`}>
        <CardHeader className="pb-3 border-b border-border/30">
          {activeRoom ? (
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-9 w-9 shrink-0"
                onClick={() => setActiveRoomId(null)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                {activeRoom.icon ? (
                  <span className="text-lg">{activeRoom.icon}</span>
                ) : (
                  ROOM_ICONS[activeRoom.room_type] || <Hash className="h-4 w-4" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-lg text-foreground truncate">
                  {activeRoom.name}
                </CardTitle>
                {activeRoom.description && (
                  <p className="text-sm text-foreground/60 truncate">{activeRoom.description}</p>
                )}
              </div>
            </div>
          ) : (
            <CardTitle className="text-lg text-foreground/60">
              Select a room to start chatting
            </CardTitle>
          )}
        </CardHeader>
        <CardContent className="p-0 flex flex-col h-[350px] lg:h-[450px]">
          {activeRoomId ? (
            <>
              {/* Pinned Messages */}
              {pinnedMessages.length > 0 && (
                <div className="p-2 border-b border-border/30 bg-amber-500/10">
                  <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 mb-1">
                    <Pin className="h-3 w-3" />
                    Pinned Messages
                  </div>
                  <ScrollArea className="max-h-20">
                    {pinnedMessages.map((msg) => (
                      <div key={msg.id} className="text-xs text-foreground/70 truncate py-0.5">
                        <span className="font-medium">{msg.sender?.display_name}: </span>
                        {msg.content}
                      </div>
                    ))}
                  </ScrollArea>
                </div>
              )}

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((msg) => {
                    const isOwn = msg.sender_id === user?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}
                      >
                        <div className={`flex gap-2 max-w-[85%] lg:max-w-[70%] ${isOwn ? 'flex-row-reverse' : ''}`}>
                          {!isOwn && (
                            <Avatar className="h-8 w-8 shrink-0">
                              <AvatarImage src={msg.sender?.avatar_url || undefined} />
                              <AvatarFallback className="text-xs">
                                {msg.sender?.display_name?.charAt(0) || '?'}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div className="space-y-1">
                            {!isOwn && (
                              <p className="text-xs text-foreground/60 font-medium">
                                {msg.sender?.display_name || 'Unknown'}
                              </p>
                            )}

                            {/* Reply preview */}
                            {msg.reply_to && (
                              <div className="text-xs bg-background/50 p-2 rounded border-l-2 border-primary/50 mb-1">
                                <span className="font-medium">{msg.reply_to.sender?.display_name}: </span>
                                <span className="text-foreground/60 line-clamp-1">{msg.reply_to.content}</span>
                              </div>
                            )}

                            <div className="flex items-end gap-1">
                              <div
                                className={`px-4 py-2 rounded-2xl ${
                                  isOwn
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-secondary text-secondary-foreground'
                                } ${msg.is_pinned ? 'ring-2 ring-amber-400/50' : ''}`}
                              >
                                {/* Images */}
                                {msg.images && msg.images.length > 0 && (
                                  <div className="flex gap-2 mb-2 flex-wrap">
                                    {msg.images.map((img, idx) => (
                                      <img
                                        key={idx}
                                        src={img}
                                        alt=""
                                        className="max-w-[200px] rounded-lg"
                                      />
                                    ))}
                                  </div>
                                )}
                                <p className="text-sm break-words">{msg.content}</p>
                                <div className="flex items-center gap-1 mt-1">
                                  <span className="text-[10px] opacity-60">
                                    {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                                  </span>
                                  {msg.edited_at && (
                                    <span className="text-[10px] opacity-60">(edited)</span>
                                  )}
                                  {msg.is_pinned && (
                                    <Pin className="h-3 w-3 opacity-60" />
                                  )}
                                </div>
                              </div>

                              {/* Message actions */}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <MoreVertical className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align={isOwn ? 'end' : 'start'}>
                                  <DropdownMenuItem onClick={() => setReplyTo(msg)}>
                                    Reply
                                  </DropdownMenuItem>
                                  {isLeader && (
                                    <DropdownMenuItem onClick={() => pinMessage(msg.id, !msg.is_pinned)}>
                                      {msg.is_pinned ? 'Unpin' : 'Pin'}
                                    </DropdownMenuItem>
                                  )}
                                  {(isOwn || isLeader) && (
                                    <DropdownMenuItem
                                      onClick={() => deleteMessage(msg.id)}
                                      className="text-destructive"
                                    >
                                      Delete
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Typing indicator */}
                  {typingUsers.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-foreground/60">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span>
                        {typingUsers.map(u => u.display_name).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                      </span>
                    </div>
                  )}

                  {messages.length === 0 && (
                    <p className="text-center text-foreground/50 text-sm py-8">
                      No messages yet. Be the first to say hello!
                    </p>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Reply preview */}
              {replyTo && (
                <div className="px-4 py-2 border-t border-border/30 bg-background/50 flex items-center gap-2">
                  <div className="flex-1 text-sm">
                    <span className="text-foreground/60">Replying to </span>
                    <span className="font-medium">{replyTo.sender?.display_name}</span>
                    <p className="text-xs text-foreground/50 truncate">{replyTo.content}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setReplyTo(null)}>
                    <ArrowLeft className="h-3 w-3" />
                  </Button>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-border/30">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={handleInputChange}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    className="bg-background/50 flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    size="icon"
                    className="shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center px-4">
                <MessageCircle className="h-12 w-12 text-foreground/30 mx-auto mb-4" />
                <p className="text-foreground/60">Select a chat room</p>
                <p className="text-sm text-foreground/40">to join the conversation</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
