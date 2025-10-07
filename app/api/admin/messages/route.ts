import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { messages, conversations, users, messageReadStatus } from '@/lib/db/schema';
import { eq, desc, and, or, inArray, sql } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth/auth-service';

// GET - Fetch all conversations for current user
export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch conversations where user is a participant
    const userConversations = await db
      .select({
        id: conversations.id,
        type: conversations.type,
        title: conversations.title,
        participantIds: conversations.participantIds,
        lastMessageId: conversations.lastMessageId,
        lastActivityAt: conversations.lastActivityAt,
        isActive: conversations.isActive,
        conversationMeta: conversations.conversationMeta,
        createdAt: conversations.createdAt,
        // Join with last message
        lastMessageContent: messages.content,
        lastMessageSenderId: messages.senderId,
        lastMessageCreatedAt: messages.createdAt,
        // Join with sender info
        senderFirstName: users.firstName,
        senderLastName: users.lastName,
        senderRole: users.role,
      })
      .from(conversations)
      .leftJoin(messages, eq(conversations.lastMessageId, messages.id))
      .leftJoin(users, eq(messages.senderId, users.id))
      .where(
        sql`JSON_EXTRACT(${conversations.participantIds}, '$') LIKE ${'%' + user.id + '%'}`
      )
      .orderBy(desc(conversations.lastActivityAt));

    // Get unread counts for each conversation
    const conversationIds = userConversations.map(c => c.id);
    const unreadCounts = await db
      .select({
        conversationId: messages.conversationId,
        unreadCount: sql<number>`COUNT(*)`.as('unreadCount'),
      })
      .from(messages)
      .leftJoin(
        messageReadStatus,
        and(
          eq(messageReadStatus.messageId, messages.id),
          eq(messageReadStatus.userId, user.id)
        )
      )
      .where(
        and(
          inArray(messages.conversationId, conversationIds),
          sql`${messageReadStatus.id} IS NULL`, // Message not read
          sql`${messages.senderId} != ${user.id}` // Not sent by current user
        )
      )
      .groupBy(messages.conversationId);

    const unreadMap = Object.fromEntries(
      unreadCounts.map(uc => [uc.conversationId, uc.unreadCount])
    );

    // Format response
    const formattedConversations = userConversations.map(conv => ({
      id: conv.id.toString(),
      type: conv.type,
      title: conv.title,
      participantIds: conv.participantIds,
      lastMessage: conv.lastMessageContent || '',
      lastMessageTime: conv.lastMessageCreatedAt?.toISOString() || conv.createdAt?.toISOString() || new Date().toISOString(),
      lastMessageSender: conv.senderFirstName && conv.senderLastName 
        ? `${conv.senderFirstName} ${conv.senderLastName}`
        : 'Unknown',
      lastMessageSenderRole: conv.senderRole,
      unreadCount: unreadMap[conv.id] || 0,
      isActive: conv.isActive,
      meta: conv.conversationMeta,
    }));

    return NextResponse.json({ 
      success: true,
      conversations: formattedConversations 
    });
  } catch (error) {
    console.error('Messages fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Send a new message
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { conversationId, content, recipientId, subject } = body;

    if (!content?.trim()) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }

    let targetConversationId = conversationId;

    // If no conversation ID provided, create a new conversation
    if (!conversationId && recipientId) {
      const recipient = await db
        .select()
        .from(users)
        .where(eq(users.id, parseInt(recipientId)))
        .limit(1);

      if (recipient.length === 0) {
        return NextResponse.json({ error: 'Recipient not found' }, { status: 404 });
      }

      // Check if conversation already exists between these users
      const existingConversation = await db
        .select()
        .from(conversations)
        .where(
          and(
            eq(conversations.type, 'direct'),
            sql`JSON_EXTRACT(${conversations.participantIds}, '$') LIKE ${'%' + user.id + '%'}`,
            sql`JSON_EXTRACT(${conversations.participantIds}, '$') LIKE ${'%' + recipientId + '%'}`
          )
        )
        .limit(1);

      if (existingConversation.length > 0) {
        targetConversationId = existingConversation[0].id;
      } else {
        // Create new conversation
        const newConversation = await db
          .insert(conversations)
          .values({
            type: 'direct',
            title: subject || `Chat with ${recipient[0].firstName} ${recipient[0].lastName}`,
            participantIds: [user.id, parseInt(recipientId)],
            createdBy: user.id,
            lastActivityAt: new Date(),
          })
          .returning();

        targetConversationId = newConversation[0].id;
      }
    }

    if (!targetConversationId) {
      return NextResponse.json({ error: 'Conversation ID is required' }, { status: 400 });
    }

    // Insert the message
    const newMessage = await db
      .insert(messages)
      .values({
        conversationId: targetConversationId,
        senderId: user.id,
        messageType: 'text',
        content: content.trim(),
        createdAt: new Date(),
      })
      .returning();

    // Update conversation's last message and activity time
    await db
      .update(conversations)
      .set({
        lastMessageId: newMessage[0].id,
        lastActivityAt: new Date(),
      })
      .where(eq(conversations.id, targetConversationId));

    // Mark as read for sender
    await db
      .insert(messageReadStatus)
      .values({
        messageId: newMessage[0].id,
        userId: user.id,
        readAt: new Date(),
      });

    const responseMessage = {
      id: newMessage[0].id.toString(),
      conversationId: targetConversationId.toString(),
      senderId: user.id.toString(),
      senderName: `${user.firstName} ${user.lastName}`,
      senderRole: user.role,
      content: newMessage[0].content,
      timestamp: newMessage[0].createdAt?.toISOString() || new Date().toISOString(),
      isRead: true,
      isOwn: true
    };

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      data: responseMessage
    });
  } catch (error) {
    console.error('Message send error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}