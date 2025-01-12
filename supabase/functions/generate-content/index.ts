import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.1.0"

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
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Check cache first
    const { data: cachedContent } = await supabaseClient
      .from('content_cache')
      .select('*')
      .eq('city', city)
      .eq('service', service)
      .eq('type', type)
      .single()

    if (cachedContent) {
      return new Response(JSON.stringify(cachedContent), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const configuration = new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    })
    const openai = new OpenAIApi(configuration)

    let prompt = ''
    switch(type) {
      case 'meta_title':
        prompt = `Generate an SEO-optimized meta title for an accountancy firm's ${service} service in ${city}. Include the city name and make it compelling.`
        break
      case 'meta_description':
        prompt = `Write an SEO-optimized meta description for an accountancy firm's ${service} service in ${city}. Include key benefits and a call to action.`
        break
      case 'main_content':
        prompt = `Write comprehensive, SEO-optimized content about ${service} services for an accountancy firm in ${city}. Include local context, benefits, and why choose us sections. Make it engaging and informative.`
        break
      default:
        throw new Error('Invalid content type')
    }

    const completion = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert SEO copywriter specializing in accounting services content."
        },
        {
          role: "user",
          content: prompt
        }
      ],
    })

    const generatedContent = completion.data.choices[0].message?.content || ''

    // Cache the content
    await supabaseClient
      .from('content_cache')
      .insert([
        {
          city,
          service,
          type,
          content: generatedContent,
          created_at: new Date().toISOString(),
        }
      ])

    return new Response(
      JSON.stringify({ content: generatedContent }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
    )
  }
})