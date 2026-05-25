"use client";

import { useState } from "react";
import { Briefcase, FileText, Sparkles, UserRound } from "lucide-react";

type Candidate = {
  name: string;
  title: string;
  location: string;
  skills: string;
  experience: string;
  preferences: string;
};

type Job = {
  company: string;
  role: string;
  location: string;
  description: string;
  requirements: string;
};

type MatchResult = any;

const initialCandidate: Candidate = {
  name: "Jani Kinnunen",
  title: "Marketing & Communications Specialist",
  location: "Tampere / remote",
  skills:
    "markkinointistrategia, viestintä, sosiaalinen media, konseptointi, copywriting, PR, SEO, SEM, AI, graafinen suunnittelu, videoeditointi",
  experience: "Liitä tähän CV:n teksti tai tiivistelmä kokemuksestasi.",
  preferences:
    "Markkinointi- tai viestintäpäällikkö, senior specialist, strateginen mutta käytännönläheinen rooli.",
};

const initialJob: Job = {
  company: "Kasvava B2B SaaS -yritys",
  role: "Marketing Manager",
  location: "Helsinki / hybrid",
  description:
    "Etsimme markkinoinnin ammattilaista rakentamaan sisältömarkkinointia, brändiä ja liidinhankintaa.",
  requirements:
    "B2B-markkinointi, sisältöstrategia, sosiaalinen media, hakukonenäkyvyys, analytiikka, copywriting, sidosryhmäviestintä",
};

function getMatchScore(result: any) {
  return (
    result?.score ??
    result?.matchScore ??
    result?.match_score ??
    result?.matchscore ??
    result?.match ??
    result?.matchPercentage ??
    result?.match_percentage ??
    0
  );
}

function getItems(result: any, keys: string[]) {
  for (const key of keys) {
    if (Array.isArray(result?.[key])) return result[key];
  }
  return [];
}

export default function Home() {
  const [candidate, setCandidate] = useState<Candidate>(initialCandidate);
  const [job, setJob] = useState<Job>(initialJob);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function runMatch() {
    try {
      setLoading(true);
      setError("");
      setResult(null);

      const profile = `
Nimi: ${candidate.name}
Titteli: ${candidate.title}
Sijainti: ${candidate.location}

Osaaminen:
${candidate.skills}

Kokemus / CV:
${candidate.experience}

Toiveet:
${candidate.preferences}
`;

      const jobDescription = `
Yritys: ${job.company}
Rooli: ${job.role}
Sijainti: ${job.location}

Kuvaus:
${job.description}

Vaatimukset:
${job.requirements}
`;

      const response = await fetch("/api/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile,
          jobDescription,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Match failed");
      }

      console.log("AI RESULT:", data);
      setResult(data);
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error ? error.message : "AI-matchaus epäonnistui."
      );
    } finally {
      setLoading(false);
    }
  }

  const strengths = result
    ? getItems(result, ["strengths", "vahvuudet"])
    : [];

  const gaps = result
    ? getItems(result, ["gaps", "improvements", "weaknesses", "puutteet"])
    : [];

  const interviewQuestions = result
    ? getItems(result, [
        "interviewQuestions",
        "candidateQuestions",
        "questionsForCandidate",
        "haastattelukysymykset",
      ])
    : [];

  const recruiterNotes = result
    ? getItems(result, [
        "recruiterNotes",
        "recruiterQuestions",
        "questionsForRecruiter",
        "rekrytoijanHuomiot",
      ])
    : [];

  const applicationDraft =
    result?.applicationDraft ??
    result?.coverLetter ??
    result?.hakemusluonnos ??
    "";

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <section className="rounded-[2rem] bg-slate-900 p-10">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-cyan-300" />
            <span className="text-sm uppercase tracking-[0.2em] text-cyan-300">
              SkillSync Premium
            </span>
          </div>

          <h1 className="mt-6 text-5xl font-semibold">
            AI-pohjainen rekrytointi ja työnhakijan matchaus
          </h1>

          <p className="mt-6 max-w-3xl text-slate-300">
            Liitä CV:n teksti, täytä työpaikkailmoitus ja saat match-arvion,
            vahvuudet, täydennettävät kohdat sekä hakemusluonnoksen.
          </p>
        </section>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <section className="rounded-[2rem] bg-slate-900 p-8">
            <div className="mb-6 flex items-center gap-3">
              <UserRound className="h-5 w-5 text-cyan-300" />
              <h2 className="text-2xl font-semibold">Työnhakijan profiili</h2>
            </div>

            <div className="space-y-4">
              <Field label="Nimi" value={candidate.name} onChange={(v) => setCandidate({ ...candidate, name: v })} />
              <Field label="Titteli" value={candidate.title} onChange={(v) => setCandidate({ ...candidate, title: v })} />
              <Field label="Sijainti" value={candidate.location} onChange={(v) => setCandidate({ ...candidate, location: v })} />

              <Area label="Osaaminen" value={candidate.skills} onChange={(v) => setCandidate({ ...candidate, skills: v })} />
              <Area label="Kokemus / liitä CV:n teksti tähän" value={candidate.experience} onChange={(v) => setCandidate({ ...candidate, experience: v })} />
              <Area label="Toiveet" value={candidate.preferences} onChange={(v) => setCandidate({ ...candidate, preferences: v })} />
            </div>
          </section>

          <section className="rounded-[2rem] bg-slate-900 p-8">
            <div className="mb-6 flex items-center gap-3">
              <Briefcase className="h-5 w-5 text-cyan-300" />
              <h2 className="text-2xl font-semibold">Työpaikkailmoitus</h2>
            </div>

            <div className="space-y-4">
              <Field label="Yritys" value={job.company} onChange={(v) => setJob({ ...job, company: v })} />
              <Field label="Rooli" value={job.role} onChange={(v) => setJob({ ...job, role: v })} />
              <Field label="Sijainti" value={job.location} onChange={(v) => setJob({ ...job, location: v })} />

              <Area label="Kuvaus" value={job.description} onChange={(v) => setJob({ ...job, description: v })} />
              <Area label="Vaatimukset" value={job.requirements} onChange={(v) => setJob({ ...job, requirements: v })} />
            </div>
          </section>
        </div>

        <div className="mt-8">
          <button
            onClick={runMatch}
            disabled={loading}
            className="w-full rounded-3xl bg-cyan-300 px-6 py-4 text-lg font-semibold text-slate-950 transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? "Analysoidaan..." : "Tee AI-matchaus"}
          </button>

          {error && (
            <div className="mt-4 rounded-2xl bg-rose-500/10 p-4 text-rose-300">
              {error}
            </div>
          )}
        </div>

        {result && (
          <section className="mt-10 grid gap-6 lg:grid-cols-2">
            <ResultCard
              title={`Match score: ${getMatchScore(result)}%`}
              items={[result.summary ?? "Ei yhteenvetoa."]}
            />

            <ResultCard title="Vahvuudet" items={strengths} />
            <ResultCard title="Täydennettävää" items={gaps} />
            <ResultCard title="Haastattelukysymykset" items={interviewQuestions} />
            <ResultCard title="Rekrytoijan huomiot" items={recruiterNotes} />

            <div className="rounded-[2rem] bg-slate-900 p-8">
              <div className="mb-6 flex items-center gap-3">
                <FileText className="h-5 w-5 text-cyan-300" />
                <h2 className="text-2xl font-semibold">Hakemusluonnos</h2>
              </div>

              <textarea
                readOnly
                value={applicationDraft}
                className="min-h-[350px] w-full rounded-2xl border border-slate-700 bg-slate-950 p-4 text-slate-200"
              />

              <button
                onClick={() => navigator.clipboard.writeText(applicationDraft)}
                className="mt-4 rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950"
              >
                Kopioi hakemusluonnos
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-slate-400">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-slate-700 bg-slate-950 p-3 text-white"
      />
    </label>
  );
}

function Area({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-slate-400">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[160px] w-full rounded-2xl border border-slate-700 bg-slate-950 p-3 text-white"
      />
    </label>
  );
}

function ResultCard({
  title,
  items,
}: {
  title: string;
  items?: string[];
}) {
  return (
    <div className="rounded-[2rem] bg-slate-900 p-8">
      <h2 className="mb-5 text-2xl font-semibold">{title}</h2>

      <div className="space-y-3">
        {items && items.length > 0 ? (
          items.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl bg-slate-950 p-4 text-slate-200"
            >
              {item}
            </div>
          ))
        ) : (
          <div className="rounded-2xl bg-slate-950 p-4 text-slate-500">
            Ei tietoja.
          </div>
        )}
      </div>
    </div>
  );
}