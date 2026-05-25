import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { candidate, job } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content: `
Olet rekrytoinnin AI-assistentti.
Arvioi työnhakijan ja työpaikan sopivuutta realistisesti.
Palauta vastaus JSON-muodossa.
`
        },
        {
          role: "user",
          content: `
TYÖNHAKIJA:
${JSON.stringify(candidate, null, 2)}

TYÖPAIKKA:
${JSON.stringify(job, null, 2)}

Palauta JSON tässä muodossa:
{
  "score": 0-100,
  "summary": "yhteenveto",
  "strengths": ["vahvuus 1", "vahvuus 2"],
  "gaps": ["puute 1", "puute 2"],
  "application": "hakemus"
}
`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = completion.choices[0].message.content;

    return NextResponse.json(JSON.parse(result || "{}"));
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "AI-matchaus epäonnistui" },
      { status: 500 }
    );
  }
}