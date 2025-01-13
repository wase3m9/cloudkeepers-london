import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.20.1";
import { getPricingSection } from "./pricing.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export const createOpenAIClient = () => {
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set');
  }
  return new OpenAI({ apiKey });
};

export const generateTitle = async (openai: OpenAI, city: string, service: string) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "Create a concise, SEO-optimized title for a professional accounting service page." },
      { role: "user", content: `Create a title for ${service} services in ${city}. Include location and service type. Keep it under 60 characters.` }
    ],
    temperature: 0.7,
    max_tokens: 60,
  });

  return response.choices[0]?.message?.content || `${service} Services in ${city} | Professional Accountants`;
};

export const generateDescription = async (openai: OpenAI, city: string, service: string) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "Create an engaging meta description for a professional accounting service page." },
      { role: "user", content: `Write a meta description for ${service} services in ${city}. Highlight key benefits and include a call to action. Keep it under 160 characters.` }
    ],
    temperature: 0.7,
    max_tokens: 160,
  });
  
  return response.choices[0]?.message?.content || `Expert ${service} services in ${city}. Contact us today for professional accounting support.`;
};

export const generateMainContent = async (openai: OpenAI, city: string, service: string, pricingSection: string) => {
  // Generate main content with specific sections
  const contentPrompt = `
Create comprehensive content about ${service} services in ${city} with the following structure:

1. Introduction Section:
- A welcoming headline
- Brief overview of our ${service} services in ${city}
- Why choose us for ${service} in ${city}

2. Benefits Section (with 4 key benefits):
### Key Benefits of Our ${service} Services
[List 4 benefits with brief descriptions]

3. Services Overview:
- Detailed explanation of our ${service} services
- How we help businesses in ${city}

4. Pricing Section:
[Will be added separately]

5. FAQ Section:
### Frequently Asked Questions
[Create 5 relevant FAQs about ${service} services]

Format everything in Markdown. Make it professional and engaging.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { 
        role: "system", 
        content: "You are an expert accountant creating professional content for an accounting firm's website. Use clear, professional language and focus on value proposition."
      },
      { role: "user", content: contentPrompt }
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });

  const mainContent = response.choices[0]?.message?.content || `# ${service} Services in ${city}\n\nWe provide expert ${service} services tailored to ${city} businesses.`;
  
  // Insert the pricing section after the services overview
  const contentParts = mainContent.split('4. Pricing Section:');
  const finalContent = contentParts[0] + '\n\n' + pricingSection + '\n\n' + (contentParts[1] || '');

  return finalContent;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { city, service, type } = await req.json();
    console.log(`Generating content for ${city}/${service} - Type: ${type}`);

    if (!city || !service || !type) {
      throw new Error('Missing required fields: city, service, and type are required');
    }

    const openai = createOpenAIClient();

    if (type !== 'all') {
      throw new Error('Invalid content type');
    }

    const pricingSection = getPricingSection();
    const [title, description, mainContent] = await Promise.all([
      generateTitle(openai, city, service),
      generateDescription(openai, city, service),
      generateMainContent(openai, city, service, pricingSection)
    ]);

    console.log('Successfully generated content');
    
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
    console.error('Error in generate-content function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        title: `Professional Services in Your Area | Expert Accountants`,
        description: `Expert accounting services tailored to your business needs. Contact us today for professional support.`,
        mainContent: `# Professional Accounting Services\n\nWe provide expert accounting services tailored to local businesses.\n\n${getPricingSection()}`
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 500
      }
    );
  }
});