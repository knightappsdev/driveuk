import { EmailTemplate, FormSubmissionData } from './config';

// Helper to format form data for display
const formatFormData = (data: Record<string, any>): string => {
  return Object.entries(data)
    .filter(([key, value]) => value !== null && value !== undefined && value !== '')
    .map(([key, value]) => {
      // Format key to be more readable
      const formattedKey = key.replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .replace(/([a-z])([A-Z])/g, '$1 $2');
      
      // Format value based on type
      let formattedValue = value;
      if (Array.isArray(value)) {
        formattedValue = value.join(', ');
      } else if (typeof value === 'boolean') {
        formattedValue = value ? 'Yes' : 'No';
      }
      
      return `<tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: 600; color: #333;">${formattedKey}:</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">${formattedValue}</td>
      </tr>`;
    }).join('');
};

// Template for form submissions to dsforms@ofemo.uk
export const createFormSubmissionTemplate = (submission: FormSubmissionData): EmailTemplate => {
  const { type, data, timestamp } = submission;
  
  let subject = '';
  let title = '';
  
  switch (type) {
    case 'instructor-registration':
      subject = `New Instructor Application - ${data.firstName} ${data.lastName}`;
      title = 'New Driving Instructor Application';
      break;
    case 'exit-intent':
      subject = `New Free Lesson Request - ${data.name}`;
      title = 'New Free Lesson Request';
      break;
    case 'whatsapp-contact':
      subject = `New WhatsApp Contact - ${data.name || 'Unknown'}`;
      title = 'New WhatsApp Contact';
      break;
    case 'general-inquiry':
      subject = `New General Inquiry - ${data.name || 'Unknown'}`;
      title = 'New General Inquiry';
      break;
    default:
      subject = 'New Form Submission';
      title = 'New Form Submission';
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1e40af 0%, #10b981 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; font-weight: bold;">${title}</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Submitted on ${timestamp.toLocaleString('en-UK')}</p>
        </div>
        
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
            <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <thead>
                    <tr style="background: #f3f4f6;">
                        <th colspan="2" style="padding: 15px; text-align: left; font-size: 18px; color: #1f2937;">Submission Details</th>
                    </tr>
                </thead>
                <tbody>
                    ${formatFormData(data)}
                </tbody>
            </table>
            
            ${submission.userAgent ? `
            <div style="margin-top: 20px; padding: 15px; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <h3 style="margin: 0 0 10px 0; color: #92400e;">Technical Information</h3>
                <p style="margin: 0; font-size: 14px; color: #92400e;"><strong>User Agent:</strong> ${submission.userAgent}</p>
                ${submission.ipAddress ? `<p style="margin: 5px 0 0 0; font-size: 14px; color: #92400e;"><strong>IP Address:</strong> ${submission.ipAddress}</p>` : ''}
            </div>
            ` : ''}
            
            <div style="margin-top: 20px; padding: 15px; background: #dbeafe; border-radius: 8px; border-left: 4px solid #3b82f6;">
                <h3 style="margin: 0 0 10px 0; color: #1e40af;">Next Steps</h3>
                <ul style="margin: 0; padding-left: 20px; color: #1e40af;">
                    ${type === 'instructor-registration' ? `
                    <li>Review the instructor's qualifications and experience</li>
                    <li>Verify license number and background check status</li>
                    <li>Schedule an interview if application meets requirements</li>
                    <li>Send response within 48 hours as promised</li>
                    ` : type === 'exit-intent' ? `
                    <li>Contact the customer within 24 hours to schedule their free lesson</li>
                    <li>Assign an appropriate instructor based on location</li>
                    <li>Confirm availability and preferences</li>
                    ` : `
                    <li>Review the inquiry and determine appropriate response</li>
                    <li>Respond within 24 hours</li>
                    <li>Follow up as needed</li>
                    `}
                </ul>
            </div>
        </div>
        
        <div style="margin-top: 20px; text-align: center; color: #6b7280; font-size: 14px;">
            <p>This email was automatically generated from your driving school website.</p>
            <p>Please respond to the customer using your regular email system.</p>
        </div>
    </body>
    </html>
  `;

  const text = `${title}
Submitted on ${timestamp.toLocaleString('en-UK')}

${Object.entries(data)
  .filter(([key, value]) => value !== null && value !== undefined && value !== '')
  .map(([key, value]) => {
    const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    let formattedValue = value;
    if (Array.isArray(value)) {
      formattedValue = value.join(', ');
    } else if (typeof value === 'boolean') {
      formattedValue = value ? 'Yes' : 'No';
    }
    return `${formattedKey}: ${formattedValue}`;
  }).join('\n')}

${submission.userAgent ? `\nTechnical Information:\nUser Agent: ${submission.userAgent}${submission.ipAddress ? `\nIP Address: ${submission.ipAddress}` : ''}` : ''}

This email was automatically generated from your driving school website.
Please respond to the customer using your regular email system.`;

  return { subject, html, text };
};

// Template for automated responses to customers from support@ofemo.uk
export const createAutoResponseTemplate = (submission: FormSubmissionData): EmailTemplate => {
  const { type, data } = submission;
  const customerName = data.name || data.firstName || 'Valued Customer';
  
  let subject = '';
  let responseContent = '';
  
  switch (type) {
    case 'instructor-registration':
      subject = 'Application Received - We\'ll Review and Contact You Soon!';
      responseContent = `
        <h2 style="color: #1e40af;">Thank You for Your Interest in Joining Our Team!</h2>
        <p>Dear ${customerName},</p>
        <p>We have successfully received your driving instructor application. Our team will carefully review your qualifications and experience.</p>
        
        <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #1e40af;">What Happens Next?</h3>
            <ul style="margin: 0; padding-left: 20px; color: #1e40af;">
                <li><strong>Review Process:</strong> We'll verify your qualifications and experience</li>
                <li><strong>Background Check:</strong> We'll confirm your license and insurance details</li>
                <li><strong>Interview:</strong> If your application meets our requirements, we'll schedule an interview</li>
                <li><strong>Response Time:</strong> You'll hear from us within 48 hours</li>
            </ul>
        </div>
        
        <p>We're always looking for passionate, qualified instructors to join our team. If you have any questions in the meantime, please don't hesitate to contact us.</p>
      `;
      break;
      
    case 'exit-intent':
      subject = 'Your FREE Driving Lesson is Confirmed - We\'ll Contact You Soon!';
      responseContent = `
        <h2 style="color: #10b981;">Congratulations! Your FREE Lesson is Secured!</h2>
        <p>Dear ${customerName},</p>
        <p>Thank you for claiming your complimentary 1-hour driving lesson! We're excited to help you start or continue your driving journey.</p>
        
        <div style="background: #d1fae5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #10b981;">What You Can Expect:</h3>
            <ul style="margin: 0; padding-left: 20px; color: #065f46;">
                <li><strong>Free 1-Hour Lesson:</strong> Absolutely no cost or hidden fees</li>
                <li><strong>Qualified Instructor:</strong> Professional, patient, and experienced</li>
                <li><strong>Local Service:</strong> Available in your area</li>
                <li><strong>No Obligation:</strong> No pressure to book further lessons</li>
                <li><strong>Flexible Scheduling:</strong> We'll work around your availability</li>
            </ul>
        </div>
        
        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e;"><strong>Next Steps:</strong> We'll contact you within 24 hours to schedule your free lesson at a time that suits you.</p>
        </div>
      `;
      break;
      
    case 'whatsapp-contact':
      subject = 'Thanks for Contacting Us - We\'ll Respond Soon!';
      responseContent = `
        <h2 style="color: #10b981;">Thank You for Your Message!</h2>
        <p>Dear ${customerName},</p>
        <p>We've received your WhatsApp inquiry and appreciate you taking the time to contact us.</p>
        
        <div style="background: #d1fae5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #10b981;">We'll Respond Quickly</h3>
            <p style="margin: 0; color: #065f46;">Our team will review your message and get back to you within 24 hours with the information you need.</p>
        </div>
      `;
      break;
      
    default:
      subject = 'Thank You for Your Inquiry - We\'ll Be in Touch Soon!';
      responseContent = `
        <h2 style="color: #1e40af;">Thank You for Contacting Us!</h2>
        <p>Dear ${customerName},</p>
        <p>We've received your inquiry and appreciate your interest in our driving school services.</p>
        
        <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #1e40af;">We'll Be in Touch Soon</h3>
            <p style="margin: 0; color: #1e40af;">Our team will review your message and respond within 24 hours.</p>
        </div>
      `;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1e40af 0%, #10b981 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; font-weight: bold;">🚗 Professional Driving School</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your Journey to Safe Driving Starts Here</p>
        </div>
        
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
            ${responseContent}
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <h3 style="margin: 0 0 15px 0; color: #374151;">Why Choose Our Driving School?</h3>
                <div style="display: grid; gap: 10px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="color: #10b981; font-size: 18px;">✓</span>
                        <span style="color: #374151;">Qualified ADI registered instructors</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="color: #10b981; font-size: 18px;">✓</span>
                        <span style="color: #374151;">High first-time pass rates</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="color: #10b981; font-size: 18px;">✓</span>
                        <span style="color: #374151;">Flexible scheduling and competitive prices</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="color: #10b981; font-size: 18px;">✓</span>
                        <span style="color: #374151;">Modern, well-maintained vehicles</span>
                    </div>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
                <p style="margin: 0; color: #6b7280; font-size: 14px;">
                    Have questions? Contact us:<br>
                    📞 Phone: <a href="tel:+447123456789" style="color: #1e40af;">+44 7123 456 789</a><br>
                    📧 Email: <a href="mailto:support@ofemo.uk" style="color: #1e40af;">support@ofemo.uk</a><br>
                    💬 WhatsApp: Available on our website
                </p>
            </div>
        </div>
        
        <div style="margin-top: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
            <p>© 2024 Professional Driving School. All rights reserved.</p>
            <p>This is an automated response. Please don't reply to this email.</p>
        </div>
    </body>
    </html>
  `;

  const text = `Professional Driving School - ${subject}

Dear ${customerName},

${type === 'instructor-registration' ? `
Thank you for your interest in joining our team as a driving instructor!

We have successfully received your application and our team will carefully review your qualifications and experience.

What happens next:
- Review Process: We'll verify your qualifications and experience
- Background Check: We'll confirm your license and insurance details
- Interview: If your application meets our requirements, we'll schedule an interview
- Response Time: You'll hear from us within 48 hours

We're always looking for passionate, qualified instructors to join our team.
` : type === 'exit-intent' ? `
Congratulations! Your FREE 1-hour driving lesson is secured!

Thank you for claiming your complimentary driving lesson. We're excited to help you start or continue your driving journey.

What you can expect:
- Free 1-Hour Lesson: Absolutely no cost or hidden fees
- Qualified Instructor: Professional, patient, and experienced
- Local Service: Available in your area
- No Obligation: No pressure to book further lessons
- Flexible Scheduling: We'll work around your availability

Next Steps: We'll contact you within 24 hours to schedule your free lesson at a time that suits you.
` : `
Thank you for contacting us!

We've received your inquiry and appreciate your interest in our driving school services.

We'll review your message and respond within 24 hours.
`}

Why Choose Our Driving School?
✓ Qualified ADI registered instructors
✓ High first-time pass rates
✓ Flexible scheduling and competitive prices
✓ Modern, well-maintained vehicles

Contact us:
Phone: +44 7123 456 789
Email: support@ofemo.uk
WhatsApp: Available on our website

© 2024 Professional Driving School. All rights reserved.
This is an automated response. Please don't reply to this email.`;

  return { subject, html, text };
};