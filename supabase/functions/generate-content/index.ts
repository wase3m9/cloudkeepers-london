import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.20.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

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
    return new Response('ok', { 
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/plain',
      }
    });
  }

  try {
    const { city, service, type } = await req.json();
    console.log(`Generating content for ${city}/${service} - Type: ${type}`);

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });

    const pricingSection = `
## Pricing and Packages

### Sole Trader Accounting Packages

#### Starter Success - From £75/month
Perfect for new sole traders needing simple bookkeeping and compliance.
- ✅ Bookkeeping
- ✅ Self-assessment filing
- ✅ FREE Allowable Expense Guide PDF

#### Growth Tracker - From £99/month
Ideal for sole traders focused on growing their income and managing expenses.
- ✅ Bookkeeping
- ✅ Self-assessment filing
- ✅ Expense tracking tool
- ✅ WhatsApp support
- ✅ FREE Allowable Expense Guide PDF

#### Pro Planner - From £125/month
Designed for experienced sole traders with more complex financial needs.
- ✅ Bookkeeping
- ✅ Tax planning
- ✅ Cash flow forecasting
- ✅ WhatsApp support
- ✅ Quarterly review calls
- ✅ FREE Allowable Expense Guide PDF

### Limited Company Accounting Packages

#### Foundation Focus - From £125/month
Perfect for startups or micro-businesses needing statutory accounts and payroll.
- ✅ Statutory accounts
- ✅ Corporation tax filing
- ✅ Payroll processing
- ✅ FREE Allowable Expense Guide PDF

#### Growth Optimizer - From £250/month
Ideal for growing companies requiring VAT returns and financial strategy.
- ✅ Statutory accounts
- ✅ VAT returns
- ✅ Quarterly advisory session
- ✅ WhatsApp support
- ✅ FREE Allowable Expense Guide PDF

#### Corporate Leader - From £300/month
Designed for established businesses managing multiple departments or operations.
- ✅ Full compliance services
- ✅ Advanced tax planning
- ✅ Budgeting analysis
- ✅ WhatsApp support
- ✅ Quarterly review calls
- ✅ FREE Allowable Expense Guide PDF`;

    try {
      switch (type) {
        case 'all':
          const generateContent = async () => {
            console.log('Starting content generation...');
            
            const systemPrompt = `You are an expert accountant creating content for a professional accounting firm's website. 
            Create comprehensive, engaging content that demonstrates expertise and authority. 
            Focus on location-specific benefits and challenges.
            Use a professional yet approachable tone.`;

            const contentPrompt = `Create comprehensive content about ${service} services in ${city}. Include:

1. A compelling title that mentions ${city} and ${service}
2. A detailed overview of our ${service} services tailored to ${city} businesses
3. Specific benefits for ${city} businesses
4. Common challenges faced by ${city} businesses and how we solve them
5. Our process and approach
6. A strong call to action

Use this structure:

# [Title]

## Overview of Our ${service} Services in ${city}
[2-3 paragraphs about our services and their importance for local businesses]

## Why Choose Our ${service} Services in ${city}?
- [3-4 key benefits, each with a brief explanation]

## Common ${service} Challenges for ${city} Businesses
[2-3 specific challenges and our solutions]

## Our ${service} Process in ${city}
1. [Initial consultation]
2. [Assessment and planning]
3. [Implementation]
4. [Ongoing support]

${pricingSection}

## Get Started with Professional ${service} Services in ${city}
[Compelling call to action]`;

            const [titleResponse, descResponse, contentResponse] = await Promise.all([
              openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                  { role: "system", content: "Create a concise, SEO-optimized title for a professional accounting service page." },
                  { role: "user", content: `Create a title for ${service} services in ${city}. Include location and service type. Keep it under 60 characters.` }
                ],
                temperature: 0.7,
              }),
              openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                  { role: "system", content: "Create an engaging meta description for a professional accounting service page." },
                  { role: "user", content: `Write a meta description for ${service} services in ${city}. Highlight key benefits and include a call to action. Keep it under 160 characters.` }
                ],
                temperature: 0.7,
              }),
              openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                  { role: "system", content: systemPrompt },
                  { role: "user", content: contentPrompt }
                ],
                temperature: 0.7,
                max_tokens: 2500,
              })
            ]);

            console.log('Content generation completed successfully');

            return {
              title: titleResponse.choices[0]?.message?.content || `${service} Services in ${city} | Professional Accountants`,
              description: descResponse.choices[0]?.message?.content || `Expert ${service} services in ${city}. Contact us today for professional accounting support.`,
              mainContent: contentResponse.choices[0]?.message?.content || `# ${service} Services in ${city}\n\nWe provide expert ${service} services tailored to ${city} businesses.`
            };
          };

          const result = await retryWithBackoff(generateContent);
          console.log('Successfully generated and returning content');
          
          return new Response(
            JSON.stringify(result),
            { 
              headers: { 
                ...corsHeaders, 
                'Content-Type': 'application/json'
              } 
            }
          );

        default:
          throw new Error('Invalid content type');
      }
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
        mainContent: `# ${service} Services in ${city}\n\nWe provide expert ${service} services tailored to ${city} businesses.\n\n${pricingSection}`
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