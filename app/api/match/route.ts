import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  try {
    const { candidate, job } = await request.json();

    if (!candidate || !job) {
      return NextResponse.json({ error: "candidate and job are required" }, { status: 400 });
    }

    const prompt = `
Olet SkillSync-palvelun rekrytointiassistentti. Arvioi työnhakijan ja työpaikan sopivuus.

Palauta vastauksesi vain JSON-muodossa tällä rakenteella:
{
  "score": number,
  "summary": string,
  "strengths": string[],
  "gaps": string[],
  "questionsForCandidate": string[],
  "questionsForRecruiter": string[],
  "applicationDraft": string
}

Työnhakija:
${JSON.stringify(candidate, null, 2)}

Työpaikka:
${JSON.stringify(job, null, 2)}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.4
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("No AI response");

    return NextResponse.json(JSON.parse(content));
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "AI matching failed" },
      { status: 500 }
    );
  }
}
