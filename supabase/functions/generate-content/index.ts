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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Validate request body exists
    if (!req.body) {
      throw new Error('Request body is required');
    }

    // Parse and validate request body
    const body = await req.json();
    const { city, service, type } = body;

    // Log incoming request
    console.log(`Processing request for city: ${city}, service: ${service}, type: ${type}`);

    // Validate required fields
    if (!city || !service || !type) {
      throw new Error('Missing required fields: city, service, and type are required');
    }

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
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in generate-content function:', error);
    
    // If we have city and service from the error context, use them in the fallback
    // Otherwise use generic placeholders
    const errorCity = error.city || 'your city';
    const errorService = error.service || 'accounting';
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        title: `${errorService} Services in ${errorCity} | Professional Accountants`,
        description: `Expert ${errorService} services in ${errorCity}. Contact us today for professional accounting support.`,
        mainContent: `# ${errorService} Services in ${errorCity}\n\nWe provide expert ${errorService} services tailored to ${errorCity} businesses.\n\n${getPricingSection()}`
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: error.status || 500
      }
    );
  }
});