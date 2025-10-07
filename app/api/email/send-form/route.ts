import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { leads } from '@/lib/db/schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Email API - Received data:', JSON.stringify(body, null, 2));

    const { type, data, customerEmail } = body;

    // Validate required fields
    if (!data.name || !data.email || !data.phone) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save to CRM database (leads table)
    if (type === 'exit-intent') {
      try {
        const leadData = {
          firstName: data.name.split(' ')[0] || data.name,
          lastName: data.name.split(' ').slice(1).join(' ') || '',
          email: data.email,
          phone: data.phone,
          drivingLevel: data.drivingLevel || 'Theory',
          leadSource: 'exit_intent_popup',
          status: 'new',
          notes: `Exit intent lead - Interested in ${data.drivingLevel || 'Theory'} lessons`,
          contactPreference: 'phone', // Default preference
        };

        console.log('Saving lead to CRM:', leadData);

        const newLead = await db.insert(leads).values(leadData).returning();
        
        console.log('Lead saved successfully:', newLead[0]);

        // TODO: Send confirmation email to customer
        // TODO: Send notification email to admin/sales team

        return NextResponse.json({
          success: true,
          message: 'Free lesson request submitted successfully!',
          leadId: newLead[0].id
        });

      } catch (dbError) {
        console.error('Database error:', dbError);
        return NextResponse.json(
          { success: false, error: 'Failed to save lead to CRM' },
          { status: 500 }
        );
      }
    }

    // Handle other form types if needed
    return NextResponse.json(
      { success: false, error: 'Unsupported form type' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}