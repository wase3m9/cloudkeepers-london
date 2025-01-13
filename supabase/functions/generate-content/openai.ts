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
  const contentPrompt = `
Create detailed content for ${service} services in ${city}. Follow this exact structure:

# Professional ${service} Services in ${city}

[Write a compelling introduction about our expertise in ${service} and presence in ${city}]

## Why Choose Our ${service} Services in ${city}?

[Write 3 compelling reasons why businesses should choose our services]

## Our Key Benefits

### 1. Expert Knowledge and Experience
[Write a paragraph about our expertise]

### 2. Personalized Service
[Write a paragraph about our tailored approach]

### 3. Advanced Technology
[Write a paragraph about our modern tools and systems]

### 4. Reliable Support
[Write a paragraph about our customer service]

## Our ${service} Services Include:

[Create a detailed list of specific services we offer]

${pricingSection}

## Frequently Asked Questions

### What makes your ${service} services unique in ${city}?
[Write a detailed answer]

### How quickly can you start working with my business?
[Write a detailed answer]

### What types of businesses do you typically work with?
[Write a detailed answer]

### What software and tools do you use?
[Write a detailed answer]

### How do you ensure data security and confidentiality?
[Write a detailed answer]

### What are your working hours and response times?
[Write a detailed answer]

Use professional language and focus on value proposition. Format in Markdown.`;

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
    max_tokens: 2000,
  });

  return response.choices[0]?.message?.content || `# ${service} Services in ${city}\n\nWe provide expert ${service} services tailored to ${city} businesses.`;
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

    // Clear the cache by deleting the existing content
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (supabaseUrl && supabaseKey) {
      const response = await fetch(`${supabaseUrl}/rest/v1/content_cache?city=eq.${encodeURIComponent(city)}&service=eq.${encodeURIComponent(service)}`, {
        method: 'DELETE',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
      });
      console.log('Cache cleared for', city, service);
    }

    const [title, description, mainContent] = await Promise.all([
      generateTitle(openai, city, service),
      generateDescription(openai, city, service),
      generateMainContent(openai, city, service, getPricingSection())
    ]);

    console.log('Successfully generated new content');
    
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