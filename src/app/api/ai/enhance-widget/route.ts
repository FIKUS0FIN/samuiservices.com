import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json() as { widgetType: string, text: string };
    const { widgetType, text } = body;

    if (!widgetType || !text) {
      return NextResponse.json({ error: 'Missing widgetType or text' }, { status: 400 });
    }

    const { env } = getCloudflareContext();
    if (!env || !env.AI) {
      if (process.env.NODE_ENV === 'development') {
        console.warn("AI binding not found in development. Returning mock response.");
        return NextResponse.json({ result: "Mock enhanced output." });
      }
      return NextResponse.json({ error: 'AI binding not configured' }, { status: 500 });
    }

    let schemaInstruction = '';
    switch (widgetType) {
      case 'faqs':
        schemaInstruction = `An array of objects. Each object should have: {"question": "...", "answer": "..."}`;
        break;
      case 'menu':
        schemaInstruction = `An array of objects. Each object: {"category": "...", "items": [{"name": "...", "price": "...", "description": "..."}]}`;
        break;
      case 'specialOffers':
        schemaInstruction = `An array of objects. Each object should have: {"title": "...", "description": "...", "validUntil": "...", "ctaLink": "..."}`;
        break;
      case 'socialLinks':
        schemaInstruction = `An object containing social media URLs, e.g. {"facebook": "...", "instagram": "..."}`;
        break;
      default:
        schemaInstruction = `A standard JSON structure matching the intent.`;
    }

    const prompt = `
You are an expert content enhancer. The user has provided rough draft text for a business widget: ${widgetType}.
Your task is to fix spelling, improve grammar, make it sound professional, and format it into STRICT JSON.

Rough Draft Text:
---
${text}
---

Required JSON Format:
${schemaInstruction}

Respond ONLY with a valid JSON object or array as requested. Do not wrap it in markdown code blocks like \`\`\`json.
`;

    const response = await env.AI.run('@cf/meta/llama-3.1-70b-instruct', {
      messages: [
        { role: 'system', content: 'You are a strict data formatting AI. You only output valid, parsable JSON.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1500
    });

    let resultText = (response as any).response || response;
    
    if (typeof resultText !== 'string') {
       resultText = JSON.stringify(resultText);
    }
    
    resultText = resultText.trim();
    const jsonMatch = resultText.match(/(\{|\[)[\s\S]*(\}|\])/);
    if (jsonMatch) {
      resultText = jsonMatch[0];
    }

    let parsedJson;
    try {
      parsedJson = JSON.parse(resultText);
    } catch (e) {
      console.error("Failed to parse LLM output as JSON:", resultText);
      return NextResponse.json({ error: 'Failed to format the text.' }, { status: 500 });
    }

    return NextResponse.json({ result: parsedJson });

  } catch (error) {
    console.error('Enhance API Error:', error);
    return NextResponse.json({ error: 'Failed to enhance text' }, { status: 500 });
  }
}
