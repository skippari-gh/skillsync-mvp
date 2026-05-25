import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
      temperature: 0.35,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Olet kokenut rekrytoija. Arvioit hakijan realistisesti suhteessa tehtävään. Palauta aina vain validia JSONia suomeksi.",
        },
        {
          role: "user",
          content: `
Arvioi hakijan sopivuus tehtävään.

HAKIJAN PROFIILI:
${profile}

TYÖPAIKKAILMOITUS:
${jobDescription}

Score rules:
- 90-100 = erittäin vahva match
- 70-89 = hyvä match
- 50-69 = kohtalainen match
- alle 50 = heikko match
- Älä anna matalaa scorea kokeneelle hakijalle, jos suurin osa vaatimuksista täyttyy.
- Score ei saa olla ristiriidassa yhteenvedon kanssa.

Palauta VAIN validi JSON tällä rakenteella:

{
  "matchScore": number,
  "summary": "lyhyt kokonaisarvio",
  "strengths": [
    "vahvuus 1",
    "vahvuus 2",
    "vahvuus 3"
  ],
  "improvements": [
    "kehityskohde 1",
    "kehityskohde 2",
    "kehityskohde 3"
  ],
  "candidateQuestions": [
    "kysymys hakijalle 1",
    "kysymys hakijalle 2",
    "kysymys hakijalle 3"
  ],
  "recruiterQuestions": [
    "kysymys rekrytoijalle 1",
    "kysymys rekrytoijalle 2",
    "kysymys rekrytoijalle 3"
  ],
  "applicationDraft": "lyhyt mutta vakuuttava hakemusluonnos"
}
`,
        },
      ],
    });

    const content = completion.choices[0].message.content || "{}";
    const parsed = JSON.parse(content);

    return Response.json(parsed);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Analysis failed" }, { status: 500 });
  }
}