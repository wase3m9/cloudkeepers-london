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
    throw new Error('OPENAI_API_KEY is not set in environment variables');
  }
  return new OpenAI({ apiKey });
};

export const generateTitle = async (openai: OpenAI, city: string, service: string) => {
  try {
    console.log(`Generating title for ${service} in ${city}`);
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
  } catch (error) {
    console.error('Error generating title:', error);
    return `${service} Services in ${city} | Professional Accountants`;
  }
};

export const generateDescription = async (openai: OpenAI, city: string, service: string) => {
  try {
    console.log(`Generating description for ${service} in ${city}`);
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
  } catch (error) {
    console.error('Error generating description:', error);
    return `Expert ${service} services in ${city}. Contact us today for professional accounting support.`;
  }
};

export const generateMainContent = async (openai: OpenAI, city: string, service: string, pricingSection: string) => {
  try {
    console.log(`Generating main content for ${service} in ${city}`);
    const contentPrompt = `
Create detailed content for ${service} services in ${city}. Follow this exact structure and formatting:

# ${service} Services in ${city}

[Write a compelling introduction about our expertise in ${service} and presence in ${city}, focusing on local business needs]

## Our Expertise in ${service}

[Write about our specialized knowledge in ${service}, mentioning specific qualifications and experience]

## Local ${service} Services in ${city}

[Write about our local presence and understanding of ${city}'s business environment]

## How We Help ${city} Businesses

### Comprehensive Financial Solutions
[Write about our complete range of financial services]

### Industry-Specific Expertise
[Write about our experience with different business sectors]

### Technology-Driven Approach
[Write about our use of modern accounting software and tools]

### Dedicated Support Team
[Write about our customer service and support]

## Our Core ${service} Services

1. Monthly Bookkeeping and Accounting
   - [List 3-4 specific features]

2. Tax Planning and Compliance
   - [List 3-4 specific features]

3. Business Advisory
   - [List 3-4 specific features]

4. Financial Reporting
   - [List 3-4 specific features]

${pricingSection}

## Frequently Asked Questions

### How quickly can you start working with my business?
[Write a detailed answer about onboarding process and timeline]

### What makes your ${service} services unique in ${city}?
[Write about unique selling points and local expertise]

### Do you work with specific industries?
[Write about industry specializations and experience]

### What accounting software do you use?
[Write about technology stack and integration capabilities]

### How do you ensure data security?
[Write about security measures and compliance]

### What support can I expect?
[Write about communication channels and response times]`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "You are an expert accountant creating professional content for an accounting firm's website. Use clear, professional language and focus on value proposition. Format in proper markdown with clear section breaks and bullet points where appropriate."
        },
        { role: "user", content: contentPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    return response.choices[0]?.message?.content || `# ${service} Services in ${city}\n\nWe provide expert ${service} services tailored to ${city} businesses.`;
  } catch (error) {
    console.error('Error generating main content:', error);
    return `# ${service} Services in ${city}\n\nWe provide expert ${service} services tailored to ${city} businesses.`;
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
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