import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import OpenAI from "https://esm.sh/openai@4.20.1";
import { getPricingSection } from "./pricing.ts";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export const createOpenAIClient = () => {
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set');
  }
  return new OpenAI({ apiKey });
};

async function checkCache(city: string, service: string, type: string) {
  try {
    const { data, error } = await supabase
      .from('content_cache')
      .select('content, expires_at')
      .eq('city', city)
      .eq('service', service)
      .eq('type', type)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();
      
    if (error) {
      console.error('Cache check error:', error);
      return null;
    }
    return data?.content;
  } catch (error) {
    console.error('Cache check error:', error);
    return null;
  }
}

async function updateCache(city: string, service: string, type: string, content: string) {
  try {
    const { error } = await supabase
      .from('content_cache')
      .upsert({
        city,
        service,
        type,
        content,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }, {
        onConflict: 'city,service,type'
      });

    if (error) {
      console.error('Cache update error:', error);
    }
  } catch (error) {
    console.error('Cache update error:', error);
  }
}

export const generateTitle = async (openai: OpenAI, city: string, service: string) => {
  try {
    const cachedTitle = await checkCache(city, service, 'meta_title');
    if (cachedTitle) return cachedTitle;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Create a concise, SEO-optimized title for a professional accounting service page." },
        { role: "user", content: `Create a title for ${service} services in ${city}. Include location and service type. Keep it under 60 characters.` }
      ],
      temperature: 0.7,
      max_tokens: 60,
    });

    const title = response.choices[0]?.message?.content || `${service} Services in ${city} | Professional Accountants`;
    await updateCache(city, service, 'meta_title', title);
    return title;
  } catch (error) {
    console.error('Error generating title:', error);
    return `${service} Services in ${city} | Professional Accountants`;
  }
};

export const generateDescription = async (openai: OpenAI, city: string, service: string) => {
  try {
    const cachedDesc = await checkCache(city, service, 'meta_description');
    if (cachedDesc) return cachedDesc;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Create an engaging meta description for a professional accounting service page." },
        { role: "user", content: `Write a meta description for ${service} services in ${city}. Highlight key benefits and include a call to action. Keep it under 160 characters.` }
      ],
      temperature: 0.7,
      max_tokens: 160,
    });
    
    const description = response.choices[0]?.message?.content || `Expert ${service} services in ${city}. Contact us today for professional accounting support.`;
    await updateCache(city, service, 'meta_description', description);
    return description;
  } catch (error) {
    console.error('Error generating description:', error);
    return `Expert ${service} services in ${city}. Contact us today for professional accounting support.`;
  }
};

export const generateMainContent = async (openai: OpenAI, city: string, service: string, pricingSection: string) => {
  try {
    const cachedContent = await checkCache(city, service, 'main_content');
    if (cachedContent) return cachedContent;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "You are an expert accountant creating content for a professional accounting firm's website. Include a comprehensive overview, benefits, and services offered." 
        },
        { 
          role: "user", 
          content: `Create comprehensive content about ${service} services in ${city}. Include benefits, challenges, and solutions. The content should be detailed and professional.` 
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const mainContent = response.choices[0]?.message?.content || `# ${service} Services in ${city}\n\nWe provide expert ${service} services tailored to ${city} businesses.`;
    
    // Generate FAQ section
    const faqResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Create a FAQ section for an accounting service page with 5 relevant questions and answers."
        },
        {
          role: "user",
          content: `Generate 5 FAQs about ${service} services in ${city}. Include questions about pricing, process, and benefits.`
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const faqContent = faqResponse.choices[0]?.message?.content || "";
    
    // Combine all sections
    const fullContent = `${mainContent}\n\n${pricingSection}\n\n${faqContent}`;
    await updateCache(city, service, 'main_content', fullContent);
    return fullContent;
  } catch (error) {
    console.error('Error generating main content:', error);
    return `# ${service} Services in ${city}\n\nWe provide expert ${service} services tailored to ${city} businesses.\n\n${pricingSection}`;
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