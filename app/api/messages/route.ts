import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/auth-service';

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mock data for now - in real app this would come from database
    const conversations = [
      {
        id: '1',
        participantId: user.role === 'student' ? 'inst_1' : 'student_1',
        participantName: user.role === 'student' ? 'Sarah Johnson' : 'John Smith',
        participantRole: user.role === 'student' ? 'instructor' : 'student',
        lastMessage: user.role === 'student' 
          ? 'Great progress in today\'s lesson! Let\'s work on parallel parking next time.'
          : 'Thank you for the lesson today! When is our next session?',
        lastMessageTime: new Date().toISOString(),
        unreadCount: user.role === 'student' ? 2 : 1,
        isOnline: true,
        ...(user.role === 'instructor' && {
          studentInfo: {
            lessonsCompleted: 12,
            nextLesson: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            progress: 75
          }
        })
      },
      {
        id: '2',
        participantId: 'admin_1',
        participantName: 'DriveUK Support',
        participantRole: 'admin',
        lastMessage: user.role === 'student'
          ? 'Your theory test has been scheduled for next Monday at 2 PM.'
          : 'Please confirm your availability for next week\'s schedule.',
        lastMessageTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        unreadCount: 0,
        isOnline: false
      }
    ];

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Messages fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { conversationId, message } = await request.json();

    if (!conversationId || !message?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // TODO: Save message to database
    console.log('Saving message:', {
      senderId: user.id,
      conversationId,
      message,
      timestamp: new Date().toISOString()
    });

    // Mock response
    const newMessage = {
      id: `msg_${Date.now()}`,
      senderId: user.id,
      senderName: `${user.firstName} ${user.lastName}`,
      senderRole: user.role,
      content: message,
      timestamp: new Date().toISOString(),
      isRead: false,
      isOwn: true
    };

    return NextResponse.json({
      message: 'Message sent successfully',
      data: newMessage
    });
  } catch (error) {
    console.error('Message send error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}