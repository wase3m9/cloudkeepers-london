import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.20.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
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
- ✅ FREE Allowable Expense Guide PDF

### SME Accounting Packages

#### Essential Compliance - From £275/month
Tailored for small businesses managing compliance and cash flow.
- ✅ Annual compliance
- ✅ Payroll management
- ✅ Financial statements
- ✅ FREE Allowable Expense Guide PDF

#### Performance Plus - From £375/month
Designed for SMEs looking to improve profitability and streamline operations.
- ✅ Monthly management accounts
- ✅ VAT returns
- ✅ Financial analysis
- ✅ WhatsApp support
- ✅ FREE Allowable Expense Guide PDF

#### Strategic Growth - From £675/month
Ideal for SMEs with strategic growth ambitions and complex reporting needs.
- ✅ Monthly management accounts
- ✅ Tax optimization
- ✅ Strategic reporting
- ✅ WhatsApp support
- ✅ Quarterly review calls
- ✅ FREE Allowable Expense Guide PDF
`;

    const fallbackContent = {
      title: `${service} Services in ${city} | Cloudkeepers Accountants`,
      description: `Professional ${service} services in ${city}. Expert accountants helping local businesses succeed.`,
      mainContent: `# ${service} Services in ${city}\n\nCloudkeepers Accountants provides expert ${service} services in ${city}.`
    };

    try {
      switch (type) {
        case 'all':
          const generateContent = async () => {
            const contentPrompt = `Create comprehensive content about ${service} services in ${city}. Structure the content in the following format using Markdown:

# [Main Title]

## Overview
[Brief introduction about the service and its importance for ${city} businesses]

## Our ${service} Services in ${city}
[Detailed list of specific services offered]

## Why Choose Cloudkeepers for ${service} in ${city}?
- [Key benefit 1]
- [Key benefit 2]
- [Key benefit 3]

## Common ${service} Challenges for ${city} Businesses
[Discuss 2-3 common challenges and how we solve them]

## Our Process
1. [First step]
2. [Second step]
3. [Third step]

${pricingSection}

## Get Started with Professional ${service} Services
[Call to action and next steps]`;

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
                  { role: "system", content: "You are an expert content writer for an accounting firm. Create professional content that demonstrates expertise and authority." },
                  { role: "user", content: contentPrompt }
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
          return new Response(
            JSON.stringify(result),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );

        default:
          throw new Error('Invalid content type');
      }
    } catch (error) {
      console.error('OpenAI API Error:', error);
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