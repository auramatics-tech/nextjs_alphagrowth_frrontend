# Inbox API Integration

This document describes the API integration implemented for the inbox functionality in the current frontend.

## Overview

The inbox page has been updated to integrate with the backend API endpoints for:
- Fetching inbox messages for leads
- Sending messages via LinkedIn and Email
- Managing identities
- Gmail inbox integration

## API Service

### File: `frontend/services/inboxService.ts`

The service provides the following functions:

#### Core Inbox Functions
- `getInboxMessages(leadId, identityId, page, limit)` - Fetch messages for a specific lead
- `sendMessage(leadId, messageData)` - Send message to lead via LinkedIn or Email
- `getAllLeads()` - Get all leads for the current user
- `getIdentities()` - Get available identities

#### Gmail Integration
- `getGmailInbox(identityId, maxResults)` - Fetch Gmail inbox emails
- `replyToGmailEmail(identityId, messageId, threadId, replyBody)` - Reply to Gmail email

## API Endpoints Used

Based on the frontend_old implementation, the following API endpoints are used:

### Identities
- **GET** `/pub/v1/identities/list` - Get all identities for the current user
- **Response**: `{ identities: Identity[] }` or `{ data: Identity[] }`

### Leads
- **GET** `/pub/v1/leads/inbox-lead` - Get all leads for inbox
- **Response**: `{ data: Lead[] }` or `{ leads: Lead[] }`

### Inbox Messages
- **GET** `/pub/v1/inbox/of_lead/{leadId}?identity_id={identityId}` - Get messages for a specific lead
- **Response**: `{ data: InboxMessage[] }` or `{ messages: InboxMessage[] }`

### Send Messages
- **POST** `/pub/v1/inbox/send_multichannel/{leadId}` - Send message to lead
- **Payload**: `{ message: string, channel: 'linkedin' | 'email', subject?: string, identity_id: string }`
- `getEmailThread(threadId, identityId)` - Get email thread details

## Updated Components

### 1. Main Inbox Page (`app/(dashboard)/inbox/page.tsx`)

**New Features:**
- Identity selector dropdown
- Real-time data loading from API
- Error handling with retry functionality
- Loading states
- Message sending integration

**State Management:**
- `conversations` - List of conversation objects
- `selectedIdentity` - Currently selected identity
- `loading` - Loading state for API calls
- `error` - Error state for failed operations

### 2. Chat Panel (`components/inbox/ChatPanel.tsx`)

**Updates:**
- Added `onSendMessage` prop for message sending
- Integrated with parent component's send message handler

### 3. Message Input (`components/inbox/MessageInput.tsx`)

**New Features:**
- Email subject input field (shown only for email channel)
- Updated `onSendMessage` signature to include subject parameter
- Channel-specific validation and UI

## API Endpoints Used

### Backend Endpoints
- `GET /pub/v1/inbox/of_lead/:leadId` - Get inbox messages for lead
- `POST /pub/v1/inbox/send_message/:leadId` - Send message to lead
- `GET /pub/v1/leads` - Get all leads
- `GET /pub/v1/identities` - Get identities
- `GET /api/v1/gmail/inbox/:identityId` - Get Gmail inbox
- `POST /api/v1/gmail/reply` - Reply to Gmail email

## Data Flow

1. **Page Load:**
   - Load identities from API
   - Select first identity by default
   - Load conversations for selected identity

2. **Conversation Loading:**
   - Fetch all leads
   - For each lead, fetch inbox messages
   - Transform data into conversation format
   - Display in conversation list

3. **Message Sending:**
   - User types message and selects channel
   - Message sent via API with identity and channel info
   - Conversations reloaded to show new message
   - Success/error toast displayed

## Error Handling

- API errors are caught and displayed as toast notifications
- Loading states prevent multiple simultaneous requests
- Retry functionality for failed operations
- Graceful fallbacks for missing data

## Authentication

- Uses JWT token from localStorage
- Token automatically included in API requests via axios interceptor
- Token format: `Bearer ${token}` in `login-jwt` header

## Future Enhancements

1. **Real-time Updates:**
   - WebSocket integration for live message updates
   - Auto-refresh when new messages arrive

2. **Message Threading:**
   - Better conversation grouping
   - Thread-based message organization

3. **File Attachments:**
   - Support for file uploads in messages
   - Image preview and download

4. **Advanced Search:**
   - Search across message content
   - Filter by date, channel, or contact

5. **Message Templates:**
   - Pre-defined message templates
   - Quick reply options

## Testing

To test the integration:

1. Ensure backend is running on `http://localhost:7001`
2. Ensure user is authenticated (has valid token in localStorage)
3. Navigate to `/inbox` page
4. Select an identity from the dropdown
5. Conversations should load automatically
6. Try sending a message via LinkedIn or Email

## Troubleshooting

**Common Issues:**

1. **No conversations loading:**
   - Check if identities are loaded
   - Verify API endpoint is accessible
   - Check browser console for errors

2. **Message sending fails:**
   - Verify identity has proper LinkedIn/Email connections
   - Check if lead has required contact information
   - Ensure backend scraper service is running

3. **Authentication errors:**
   - Verify token is present in localStorage
   - Check token format and validity
   - Ensure backend is accepting the token format
