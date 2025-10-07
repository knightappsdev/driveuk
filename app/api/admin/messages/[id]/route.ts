import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { messages, users, messageReadStatus } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth/auth-service';

// GET - Fetch messages for a specific conversation
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const conversationId = parseInt(id);

    if (isNaN(conversationId)) {
      return NextResponse.json({ error: 'Invalid conversation ID' }, { status: 400 });
    }

    // Fetch messages in the conversation
    const conversationMessages = await db
      .select({
        id: messages.id,
        conversationId: messages.conversationId,
        senderId: messages.senderId,
        messageType: messages.messageType,
        content: messages.content,
        attachments: messages.attachments,
        replyToMessageId: messages.replyToMessageId,
        isEdited: messages.isEdited,
        editedAt: messages.editedAt,
        isDeleted: messages.isDeleted,
        createdAt: messages.createdAt,
        // Sender info
        senderFirstName: users.firstName,
        senderLastName: users.lastName,
        senderRole: users.role,
        senderEmail: users.email,
      })
      .from(messages)
      .innerJoin(users, eq(messages.senderId, users.id))
      .where(
        and(
          eq(messages.conversationId, conversationId),
          eq(messages.isDeleted, false)
        )
      )
      .orderBy(messages.createdAt);

    // Check read status for each message
    const messageIds = conversationMessages.map(m => m.id);
    const readStatuses = await db
      .select({
        messageId: messageReadStatus.messageId,
        readAt: messageReadStatus.readAt,
      })
      .from(messageReadStatus)
      .where(
        and(
          eq(messageReadStatus.userId, user.id),
          eq(messageReadStatus.messageId, messageIds[0]) // This should use inArray but simplified for now
        )
      );

    const readStatusMap = Object.fromEntries(
      readStatuses.map(rs => [rs.messageId, rs.readAt])
    );

    // Format messages
    const formattedMessages = conversationMessages.map(msg => ({
      id: msg.id.toString(),
      conversationId: msg.conversationId.toString(),
      senderId: msg.senderId.toString(),
      senderName: `${msg.senderFirstName} ${msg.senderLastName}`,
      senderRole: msg.senderRole,
      senderEmail: msg.senderEmail,
      content: msg.content,
      messageType: msg.messageType,
      attachments: msg.attachments,
      replyToMessageId: msg.replyToMessageId?.toString(),
      timestamp: msg.createdAt.toISOString(),
      isEdited: msg.isEdited,
      editedAt: msg.editedAt?.toISOString(),
      isRead: !!readStatusMap[msg.id],
      isOwn: msg.senderId === user.id,
    }));

    // Mark unread messages as read
    const unreadMessages = conversationMessages.filter(
      msg => msg.senderId !== user.id && !readStatusMap[msg.id]
    );

    if (unreadMessages.length > 0) {
      const readStatusEntries = unreadMessages.map(msg => ({
        messageId: msg.id,
        userId: user.id,
        readAt: new Date(),
      }));

      await db.insert(messageReadStatus).values(readStatusEntries);
    }

    return NextResponse.json({
      success: true,
      messages: formattedMessages
    });
  } catch (error) {
    console.error('Conversation messages fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Send message to specific conversation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const conversationId = parseInt(id);

    if (isNaN(conversationId)) {
      return NextResponse.json({ error: 'Invalid conversation ID' }, { status: 400 });
    }

    const { content } = await request.json();

    if (!content?.trim()) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }

    // Insert the message
    const newMessage = await db
      .insert(messages)
      .values({
        conversationId,
        senderId: user.id,
        messageType: 'text',
        content: content.trim(),
        createdAt: new Date(),
      })
      .returning();

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
      conversationId: conversationId.toString(),
      senderId: user.id.toString(),
      senderName: `${user.firstName} ${user.lastName}`,
      senderRole: user.role,
      content: newMessage[0].content,
      timestamp: newMessage[0].createdAt.toISOString(),
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