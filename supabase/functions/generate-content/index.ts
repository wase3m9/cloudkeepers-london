import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.20.1";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    let systemPrompt = `You are an expert content writer for Cloudkeepers Accountants. 
    Create professional, SEO-optimized content that demonstrates expertise and authority.
    Include specific details about ${city} and its business environment.
    Focus on how ${service} services can benefit local businesses.
    Use a professional yet approachable tone.
    Do not mention specific pricing or phone numbers.
    Focus on value proposition and expertise.
    Include information about:
    - The local business community in ${city}
    - Common industries and business types in the area
    - Specific challenges faced by businesses in ${city}
    - How Cloudkeepers Accountants' expertise benefits local businesses
    - Relevant local business regulations and compliance requirements
    - Local economic growth opportunities
    - Specific tax considerations for the area`

    switch (type) {
      case 'meta_title':
        prompt = `Create an SEO-optimized title for ${service} services in ${city}. 
        Include the location and service type. Keep it under 60 characters.
        Brand name is Cloudkeepers Accountants.
        Make it compelling and relevant to local businesses.`
        break
      case 'meta_description':
        prompt = `Write an engaging meta description for ${service} services in ${city}. 
        Highlight key benefits and include a call to action. Keep it under 160 characters.
        Brand name is Cloudkeepers Accountants.
        Focus on local business needs and expertise.`
        break
      case 'main_content':
        prompt = `Create comprehensive content about ${service} services in ${city} for Cloudkeepers Accountants. Include:
        1. Introduction to the local business environment in ${city}
        2. Key industries and business types in ${city}
        3. Specific ${service} challenges faced by businesses in ${city}
        4. How our services help local businesses overcome these challenges
        5. Our expertise in local regulations and compliance requirements
        6. Benefits of choosing Cloudkeepers Accountants
        7. Call to action
        
        Additional requirements:
        - Include specific examples of local business scenarios
        - Mention relevant local business regulations
        - Discuss area-specific tax considerations
        - Include local economic statistics and growth trends
        - Address common pain points for ${city} businesses
        - Highlight our understanding of the local market
        
        Make it engaging, informative, and optimized for SEO. Format in Markdown.
        Ensure content is detailed and specific to ${city}, not generic.`
        break
      case 'all':
        const titleResponse = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Create an SEO-optimized title for ${service} services in ${city}. Include location and service type. Keep it under 60 characters.` }
          ],
          temperature: 0.7,
        })

        const descResponse = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Write an engaging meta description for ${service} services in ${city}. Highlight key benefits and include a call to action. Keep it under 160 characters.` }
          ],
          temperature: 0.7,
        })

        const contentResponse = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Create comprehensive content about ${service} services in ${city}. Include local business environment, challenges, solutions, and benefits. Format in Markdown.` }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        })

        // Store in Supabase
        const supabaseClient = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const title = titleResponse.choices[0]?.message?.content || ''
        const description = descResponse.choices[0]?.message?.content || ''
        const mainContent = contentResponse.choices[0]?.message?.content || ''

        await Promise.all([
          supabaseClient.from('content_cache').upsert({
            city,
            service,
            type: 'meta_title',
            content: title,
          }),
          supabaseClient.from('content_cache').upsert({
            city,
            service,
            type: 'meta_description',
            content: description,
          }),
          supabaseClient.from('content_cache').upsert({
            city,
            service,
            type: 'main_content',
            content: mainContent,
          })
        ])

        return new Response(
          JSON.stringify({ 
            title,
            description,
            mainContent
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      default:
        throw new Error('Invalid content type')
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
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