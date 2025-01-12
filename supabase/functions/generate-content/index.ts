import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import OpenAI from "https://esm.sh/openai@4.20.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { city, service, type } = await req.json()

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    })

    let prompt = ''
    let systemPrompt = `You are an expert content writer for an accounting firm. 
    Create professional, SEO-optimized content that demonstrates expertise and authority.
    Include specific details about ${city} and its business environment.
    Focus on how ${service} services can benefit local businesses.
    Use a professional yet approachable tone.`

    switch (type) {
      case 'meta_title':
        prompt = `Create an SEO-optimized title for ${service} services in ${city}. 
        Include the location and service type. Keep it under 60 characters.`
        break
      case 'meta_description':
        prompt = `Write an engaging meta description for ${service} services in ${city}. 
        Highlight key benefits and include a call to action. Keep it under 160 characters.`
        break
      case 'main_content':
        prompt = `Create comprehensive content about ${service} services in ${city}. Include:
        1. Introduction to the local business environment
        2. Specific ${service} challenges faced by businesses in ${city}
        3. How our services help local businesses
        4. Industry expertise and qualifications
        5. Local compliance requirements
        6. Case studies or success stories
        7. Call to action
        Make it engaging, informative, and optimized for SEO.`
        break
      default:
        throw new Error('Invalid content type')
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: type === 'main_content' ? 2000 : 200,
    })

    const generatedContent = completion.choices[0]?.message?.content || ''

    // Store in Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    await supabaseClient
      .from('content_cache')
      .upsert({
        city,
        service,
        type,
        content: generatedContent,
        created_at: new Date().toISOString(),
      })

    return new Response(
      JSON.stringify({ content: generatedContent }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in generate-content function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})