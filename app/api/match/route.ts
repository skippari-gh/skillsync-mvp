import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function normalizeScore(parsed: any) {
  const summary = String(parsed.summary ?? "").toLowerCase();
  const score = Number(parsed.score);

  const soundsVeryPositive =
    summary.includes("vastaa hyvin") ||
    summary.includes("vahva") ||
    summary.includes("erittäin kokenut") ||
    summary.includes("sopii hyvin") ||
    summary.includes("hyvä match") ||
    summary.includes("laaja osaaminen");

  if (soundsVeryPositive && score < 70) {
    parsed.score = 85;
  }

  if (!Number.isFinite(score)) {
    parsed.score = 0;
  }

  return parsed;
}

export async function POST(req: Request) {
  try {
    const { profile, jobDescription } = await req.json();

    if (!profile || !jobDescription) {
      return Response.json(
        { error: "Profile and job description are required" },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `
Olet kokenut suomalainen rekrytoinnin, työnhaun ja osaamisen arvioinnin asiantuntija.

Palauta aina vain validia JSONia suomeksi.

JSON-rakenne:
{
  "score": number,
  "summary": "string",
  "scoreReasoning": ["string", "string", "string"],
  "nextSteps": ["string", "string", "string"],
  "strengths": ["string", "string", "string"],
  "gaps": ["string", "string", "string"],
  "interviewQuestions": ["string", "string", "string"],
  "recruiterNotes": ["string", "string", "string"],
  "applicationDraft": "string"
}

Score rules:
- 90-100 = erittäin vahva match
- 75-89 = hyvä match
- 60-74 = kohtalainen match
- 40-59 = heikko match
- 0-39 = erittäin heikko match

ERITTÄIN TÄRKEÄÄ:
- Score ei saa olla ristiriidassa yhteenvedon kanssa.
- Jos yhteenveto sanoo, että hakija vastaa hyvin vaatimuksia, score ei voi olla alle 75.
- Jos hakijalla on pitkä relevantti kokemus ja suuri osa vaatimuksista täyttyy, score on yleensä 80-90.
- Älä anna satunnaisen matalaa scorea.
- Älä rankaise hakijaa siitä, että hän on kokenut, ellei rooli selvästi ole junioritasoinen.
- Jos hakija voi olla liian seniori, mainitse se riskinä mutta älä pudota scorea rajusti.
- Score pitää perustella konkreettisesti scoreReasoning-kentässä.

Älä jätä mitään listaa tyhjäksi.
`,
        },
        {
          role: "user",
          content: `
Arvioi hakijan sopivuus tehtävään.

HAKIJAN PROFIILI:
${profile}

TYÖPAIKKAILMOITUS:
${jobDescription}
`,
        },
      ],
    });

    const content = completion.choices[0].message.content;

    if (!content) {
      return Response.json(
        { error: "No response from AI" },
        { status: 500 }
      );
    }

    const parsed = normalizeScore(JSON.parse(content));

    return Response.json(parsed);
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Analysis failed" },
      { status: 500 }
    );
  }
}