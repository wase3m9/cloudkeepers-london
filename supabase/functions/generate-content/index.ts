import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.20.1";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Utility function for exponential backoff
async function retryWithBackoff(fn: () => Promise<any>, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429 && i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000; // Exponential backoff: 1s, 2s, 4s
        console.log(`Rate limited. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { city, service, type } = await req.json()
    console.log(`Generating content for ${city}/${service} - Type: ${type}`);

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

    // Fallback content in case of API issues
    const fallbackContent = {
      title: `${service} Services in ${city} | Cloudkeepers Accountants`,
      description: `Professional ${service} services in ${city}. Expert accountants helping local businesses succeed.`,
      mainContent: `# ${service} Services in ${city}

## Local Expertise & Professional Service

Cloudkeepers Accountants provides expert ${service} services tailored to businesses in ${city}. Our team combines deep local knowledge with professional expertise to deliver exceptional service.

### Why Choose Us?

- Deep understanding of ${city}'s business landscape
- Tailored solutions for local businesses
- Expert compliance and regulatory knowledge
- Proactive financial guidance
- Dedicated support team

Contact us today to learn how we can help your business thrive.`
    };

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
        prompt = `Create comprehensive content about ${service} services in ${city}. Include:
        1. Introduction to the local business environment in ${city}
        2. Key industries and business types in ${city}
        3. Specific ${service} challenges faced by businesses in ${city}
        4. How our services help local businesses overcome these challenges
        5. Our expertise in local regulations and compliance requirements
        6. Benefits of choosing Cloudkeepers Accountants
        7. Call to action
        
        Format in Markdown.
        Ensure content is detailed and specific to ${city}, not generic.`
        break
      case 'all':
        try {
          const generateContent = async () => {
            const [titleResponse, descResponse, contentResponse] = await Promise.all([
              openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                  { role: "system", content: systemPrompt },
                  { role: "user", content: `Create an SEO-optimized title for ${service} services in ${city}. Include location and service type. Keep it under 60 characters.` }
                ],
                temperature: 0.7,
              }),
              openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                  { role: "system", content: systemPrompt },
                  { role: "user", content: `Write an engaging meta description for ${service} services in ${city}. Highlight key benefits and include a call to action. Keep it under 160 characters.` }
                ],
                temperature: 0.7,
              }),
              openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                  { role: "system", content: systemPrompt },
                  { role: "user", content: `Create comprehensive content about ${service} services in ${city}. Include local business environment, challenges, solutions, and benefits. Format in Markdown.` }
                ],
                temperature: 0.7,
                max_tokens: 2000,
              })
            ]);

            return {
              title: titleResponse.choices[0]?.message?.content || fallbackContent.title,
              description: descResponse.choices[0]?.message?.content || fallbackContent.description,
              mainContent: contentResponse.choices[0]?.message?.content || fallbackContent.mainContent
            };
          };

          const result = await retryWithBackoff(generateContent);

          // Store in Supabase
          const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
          )

          await Promise.all([
            supabaseClient.from('content_cache').upsert({
              city,
              service,
              type: 'meta_title',
              content: result.title,
            }),
            supabaseClient.from('content_cache').upsert({
              city,
              service,
              type: 'meta_description',
              content: result.description,
            }),
            supabaseClient.from('content_cache').upsert({
              city,
              service,
              type: 'main_content',
              content: result.mainContent,
            })
          ]);

          return new Response(
            JSON.stringify(result),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        } catch (error) {
          console.error('Error generating content:', error);
          // Return fallback content if OpenAI fails
          return new Response(
            JSON.stringify(fallbackContent),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      default:
        throw new Error('Invalid content type')
    }

    try {
      const generateSingleContent = async () => {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
          max_tokens: type === 'main_content' ? 2000 : 200,
        });
        return completion.choices[0]?.message?.content;
      };

      const generatedContent = await retryWithBackoff(generateSingleContent);

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
          content: generatedContent || fallbackContent[type],
        })

      return new Response(
        JSON.stringify({ content: generatedContent || fallbackContent[type] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (error) {
      console.error('Error generating single content:', error);
      // Return appropriate fallback content based on type
      const fallbackResponse = type === 'meta_title' ? fallbackContent.title :
        type === 'meta_description' ? fallbackContent.description :
        fallbackContent.mainContent;

      return new Response(
        JSON.stringify({ content: fallbackResponse }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  } catch (error) {
    console.error('Error in generate-content function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        fallback: true,
        content: `${service} Services in ${city} | Professional Accounting Services`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.status || 500
      }
    )
  }
})