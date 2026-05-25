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
      temperature: 0.4,
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

scoreReasoning:
- mikä nostaa scorea
- mikä laskee scorea
- mikä selittää kokonaisarvion

nextSteps:
- anna 3 konkreettista seuraavaa toimenpidettä
- jos käyttäjä on työnhakija, neuvo miten profiilia, hakemusta tai haastatteluvalmistautumista kannattaa parantaa
- jos käyttäjä on rekrytoija, neuvo mitä kannattaa varmistaa ennen päätöstä

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

    return Response.json(JSON.parse(content));
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Analysis failed" },
      { status: 500 }
    );
  }
}