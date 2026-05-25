import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { profile, jobDescription } = body;

    if (!profile || !jobDescription) {
      return Response.json(
        { error: "Profile and job description are required" },
        { status: 400 }
      );
    }

    const prompt = `
Analyze this candidate against this job description.

CANDIDATE PROFILE:
${profile}

JOB DESCRIPTION:
${jobDescription}

Return the answer in Finnish.

Return:
1. Match score from 0 to 100
2. Top strengths
3. Missing skills or gaps
4. Recruiter concerns
5. Why this candidate may stand out
6. Suggested interview questions

Be realistic, specific and useful. Avoid generic praise.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an experienced recruiter. You evaluate candidates realistically and explain your reasoning clearly.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.4,
    });

    return Response.json({
      result: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Analysis failed" },
      { status: 500 }
    );
  }
}