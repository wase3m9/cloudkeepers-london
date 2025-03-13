
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface LeadNotification {
  firstName: string
  lastName: string
  email: string
  website?: string
  companySize?: string
  serviceInterest?: string
  currentSoftware?: string
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const leadData: LeadNotification = await req.json()
    
    // Log the incoming request data for debugging
    console.log('Received lead notification request:', JSON.stringify(leadData))
    
    // Create HTML email content
    const htmlContent = `
      <h2>New Lead Notification</h2>
      <p>A new lead has submitted the consultation form:</p>
      <ul>
        <li><strong>Name:</strong> ${leadData.firstName} ${leadData.lastName}</li>
        <li><strong>Email:</strong> ${leadData.email}</li>
        ${leadData.website ? `<li><strong>Website:</strong> ${leadData.website}</li>` : ''}
        ${leadData.companySize ? `<li><strong>Company Size:</strong> ${leadData.companySize}</li>` : ''}
        ${leadData.serviceInterest ? `<li><strong>Service Interest:</strong> ${leadData.serviceInterest}</li>` : ''}
        ${leadData.currentSoftware ? `<li><strong>Current Software:</strong> ${leadData.currentSoftware}</li>` : ''}
      </ul>
    `

    // Add additional recipient if provided
    const recipients = ["info@cloud-keepers.co.uk"];
    
    console.log(`Sending email to: ${recipients.join(', ')}`)
    
    if (!RESEND_API_KEY) {
      console.error('Missing RESEND_API_KEY environment variable')
      throw new Error('Server configuration error: Missing API key')
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Cloud Keepers <info@cloud-keepers.co.uk>",
        to: recipients,
        subject: "New Lead: Free Consultation Request",
        html: htmlContent,
      }),
    })

    // Log the response status for debugging
    console.log('Resend API response status:', res.status)
    
    if (!res.ok) {
      const error = await res.text()
      console.error('Resend API error:', error)
      throw new Error('Failed to send email')
    }

    const data = await res.json()
    console.log('Email sent successfully:', data)

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error in send-lead-notification:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
}

serve(handler)
