import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createOpenAIClient, generateTitle, generateDescription, generateMainContent } from "./openai.ts";
import { retryWithBackoff } from "./retry.ts";
import { getPricingSection } from "./pricing.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { city, service, type } = await req.json();
    console.log(`Generating content for ${city}/${service} - Type: ${type}`);

    if (type !== 'all') {
      throw new Error('Invalid content type');
    }

    const openai = createOpenAIClient();
    const pricingSection = getPricingSection();

    try {
      const [title, description, mainContent] = await Promise.all([
        retryWithBackoff(() => generateTitle(openai, city, service)),
        retryWithBackoff(() => generateDescription(openai, city, service)),
        retryWithBackoff(() => generateMainContent(openai, city, service, pricingSection))
      ]);

      console.log('Successfully generated and returning content');
      
      return new Response(
        JSON.stringify({ title, description, mainContent }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in generate-content function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        title: `${service} Services in ${city} | Professional Accountants`,
        description: `Expert ${service} services in ${city}. Contact us today for professional accounting support.`,
        mainContent: `# ${service} Services in ${city}\n\nWe provide expert ${service} services tailored to ${city} businesses.\n\n${getPricingSection()}`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.status || 500
      }
    );
  }
});