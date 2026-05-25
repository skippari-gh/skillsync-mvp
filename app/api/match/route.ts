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
          content: `
Olet kokenut suomalainen rekrytoinnin, työnhaun ja osaamisen arvioinnin asiantuntija.

Arvioit hakijan realistisesti suhteessa työpaikkailmoitukseen.

Jos käyttäjän rooli palvelussa on "Työnhakija", painota:
- miten hakija voi parantaa profiiliaan
- miten kokemus kannattaa sanoittaa paremmin
- miten hakemusluonnoksesta tulee osuvampi
- mihin haastattelussa kannattaa valmistautua
- mitä puutteita voi paikata viestinnällä

Jos käyttäjän rooli palvelussa on "Rekrytoija", painota:
- hakijan sopivuutta tehtävään
- mahdollisia riskejä
- puuttuvaa näyttöä
- hyödyllisiä haastattelukysymyksiä
- rekrytointisuositusta

Älä mielistele. Ole realistinen, tarkka ja hyödyllinen.
Palauta aina vain validia JSONia suomeksi.
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

Score rules:
- 90-100 = erittäin vahva match
- 70-89 = hyvä match
- 50-69 = kohtalainen match
- alle 50 = heikko match
- Älä anna matalaa scorea kokeneelle hakijalle, jos suurin osa vaatimuksista täyttyy.
- Score ei saa olla ristiriidassa yhteenvedon kanssa.
- Jos osaaminen on vahvaa mutta ilmoitus ei vaadi kaikkea hakijan osaamista, älä rankaise siitä liikaa.
- Jos hakija on mahdollisesti liian seniori, mainitse se riskinä mutta älä automaattisesti laske scorea voimakkaasti.

Palauta VAIN validi JSON tällä rakenteella:

{
  "score": number,
  "summary": "lyhyt kokonaisarvio",
  "strengths": [
    "vahvuus 1",
    "vahvuus 2",
    "vahvuus 3"
  ],
  "gaps": [
    "täydennettävä asia 1",
    "täydennettävä asia 2",
    "täydennettävä asia 3"
  ],
  "interviewQuestions": [
    "haastattelukysymys 1",
    "haastattelukysymys 2",
    "haastattelukysymys 3"
  ],
  "recruiterNotes": [
    "rekrytoijan huomio 1",
    "rekrytoijan huomio 2",
    "rekrytoijan huomio 3"
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

    return Response.json(
      { error: "Analysis failed" },
      { status: 500 }
    );
  }
}