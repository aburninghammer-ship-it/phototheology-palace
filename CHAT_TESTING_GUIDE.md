# Chat System Testing Guide

## ✅ System Status
All chat components are properly configured:
- ✅ Database tables: `conversations`, `messages`, `typing_indicators`, `message_read_status`
- ✅ Realtime subscriptions enabled
- ✅ RLS policies configured
- ✅ Helper functions: `get_or_create_conversation`, `cleanup_old_typing_indicators`

## 🧪 How to Test the Chat

### 1. **Send a Message**
   - Open the messaging sidebar (click the message icon)
   - Click on an active user or existing conversation
   - Type a message and press Enter or click Send
   - **Expected:** Message appears instantly in your chat

### 2. **Receive a Message**
   - Have another user send you a message
   - **Expected:** 
     - You see a toast notification "You have a new message"
     - Click "View" button in the notification
     - Sidebar opens automatically to the conversation
     - You see the message in the chat window

### 3. **Real-time Updates**
   - Keep a conversation open
   - Have the other user send a message
   - **Expected:** Message appears in real-time without refresh

### 4. **Typing Indicators**
   - Start typing in a conversation
   - **Expected:** Other user sees typing indicator (three bouncing dots)

## 🔍 Debugging with Console Logs

All operations now have detailed console logs:
- `=== SENDING MESSAGE ===` - When you send a message
- `New message received:` - When receiving via realtime
- `Notification clicked - opening conversation:` - When clicking toast
- `Auto-expanding sidebar due to active conversation:` - When sidebar auto-opens
- `✅` - Success indicators
- `❌` - Error indicators

## 🚨 Common Issues & Solutions

### Issue: "No active conversation" error
- **Cause:** Trying to send without selecting a conversation
- **Solution:** Click on a user from Active Users or Conversations tab first

### Issue: Notification doesn't open chat
- **Cause:** Sidebar state management issue
- **Solution:** Check console for "Notification clicked" and "Open chat sidebar event" logs

### Issue: Messages not appearing
- **Cause:** Realtime subscription not working or RLS policy blocking
- **Solution:** 
  - Check console for "New message received" log
  - Verify user is authenticated
  - Check browser console for any Supabase errors

### Issue: Can't see other user's messages
- **Cause:** Not in the same conversation
- **Solution:** Both users must have started a conversation together first

## 📊 Database Structure

```
conversations
├── id (uuid)
├── participant1_id (uuid)
├── participant2_id (uuid)
├── created_at
└── updated_at

messages
├── id (uuid)
├── conversation_id (foreign key)
├── sender_id (uuid)
├── content (text)
├── created_at
├── is_deleted
└── edited_at
```

## 🔐 Security
- All tables have RLS enabled
- Users can only see/send messages in their own conversations
- Proper authentication required
- No public access to chat data
