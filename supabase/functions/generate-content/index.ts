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
        const delay = Math.pow(2, i) * 1000;
        console.log(`Rate limited. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { city, service, type } = await req.json();
    console.log(`Generating content for ${city}/${service} - Type: ${type}`);

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });

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

    try {
      switch (type) {
        case 'all':
          const generateContent = async () => {
            const [titleResponse, descResponse, contentResponse] = await Promise.all([
              openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                  { role: "system", content: `You are an expert content writer for Cloudkeepers Accountants. Create professional, SEO-optimized content that demonstrates expertise and authority. Include specific details about ${city} and its business environment. Focus on how ${service} services can benefit local businesses. Use a professional yet approachable tone. Do not mention specific pricing or phone numbers. Focus on value proposition and expertise.` },
                  { role: "user", content: `Create an SEO-optimized title for ${service} services in ${city}. Include location and service type. Keep it under 60 characters.` }
                ],
                temperature: 0.7,
              }),
              openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                  { role: "system", content: `You are an expert content writer for Cloudkeepers Accountants. Create professional, SEO-optimized content that demonstrates expertise and authority. Include specific details about ${city} and its business environment. Focus on how ${service} services can benefit local businesses. Use a professional yet approachable tone. Do not mention specific pricing or phone numbers. Focus on value proposition and expertise.` },
                  { role: "user", content: `Write an engaging meta description for ${service} services in ${city}. Highlight key benefits and include a call to action. Keep it under 160 characters.` }
                ],
                temperature: 0.7,
              }),
              openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                  { role: "system", content: `You are an expert content writer for Cloudkeepers Accountants. Create professional, SEO-optimized content that demonstrates expertise and authority. Include specific details about ${city} and its business environment. Focus on how ${service} services can benefit local businesses. Use a professional yet approachable tone. Do not mention specific pricing or phone numbers. Focus on value proposition and expertise.` },
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
          );

          try {
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
          } catch (error) {
            console.error('Error storing content in cache:', error);
            // Continue with the response even if caching fails
          }

          return new Response(
            JSON.stringify(result),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );

        default:
          throw new Error('Invalid content type');
      }
    } catch (error) {
      console.error('OpenAI API Error:', error);
      // Return fallback content if OpenAI fails
      return new Response(
        JSON.stringify(fallbackContent),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error in generate-content function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.status || 500
      }
    );
  }
});