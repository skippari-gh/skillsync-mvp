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

type MatchResult = {
  score: number;
  summary: string;
  strengths: string[];
  gaps: string[];
  questionsForCandidate: string[];
  questionsForRecruiter: string[];
  applicationDraft: string;
};

const initialCandidate: Candidate = {
  name: "Jani Kinnunen",
  title: "Marketing & Communications Specialist",
  location: "Tampere / remote",
  skills: "markkinointistrategia, viestintä, sosiaalinen media, konseptointi, copywriting, PR, SEO, SEM, AI, graafinen suunnittelu, videoeditointi",
  experience: "25+ vuotta markkinoinnin ja viestinnän parissa. Mainostoimistotausta, brändinhallinta, digistrategia, sisällöntuotanto ja kansainvälisen teknologiayrityksen markkinoinnin rakentaminen.",
  preferences: "Markkinointi- tai viestintäpäällikkö, senior specialist, strateginen mutta käytännönläheinen rooli."
};

const initialJob: Job = {
  company: "Kasvava B2B SaaS -yritys",
  role: "Marketing Manager",
  location: "Helsinki / hybrid",
  description: "Etsimme markkinoinnin ammattilaista rakentamaan sisältömarkkinointia, brändiä ja liidinhankintaa.",
  requirements: "B2B-markkinointi, sisältöstrategia, sosiaalinen media, hakukonenäkyvyys, analytiikka, copywriting, sidosryhmäviestintä"
};

export default function Home() {
  const [candidate, setCandidate] = useState<Candidate>(initialCandidate);
  const [job, setJob] = useState<Job>(initialJob);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function runMatch() {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidate, job })
      });

      if (!response.ok) throw new Error("Matchaus epäonnistui");
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("AI-matchaus epäonnistui. Tarkista OPENAI_API_KEY ja käynnistä sovellus uudelleen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <section className="overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.45)] sm:p-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-800/80 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-300 shadow-sm">
                <Sparkles className="h-4 w-4 text-cyan-300" /> SkillSync Premium
              </span>
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">AI-pohjainen rekrytointi ja työnhakijan matchaus</h1>
                <p className="text-base leading-8 text-slate-300 sm:text-lg">
                  Syötä profiili ja työpaikkailmoitus. SkillSync arvioi sopivuuden, korostaa vahvuuksia ja tuottaa ammattimaisen hakemusluonnoksen nopeasti.
                </p>
              </div>
            </div>
            <div className="grid max-w-md gap-4 rounded-3xl border border-white/10 bg-slate-900/85 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.35)]">
              <div className="rounded-3xl bg-slate-800/80 p-5 text-slate-100">
                <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Ylivertainen prosessi</p>
                <p className="mt-3 text-2xl font-semibold">Nopea, selkeä ja luotettava</p>
              </div>
              <div className="grid gap-3 text-sm text-slate-400">
                <div className="rounded-2xl bg-slate-950/90 p-4">Riippumaton arvio työnhakijan ja ilmoituksen yhteensopivuudesta.</div>
                <div className="rounded-2xl bg-slate-950/90 p-4">Selkeät suositukset hakijalle ja rekrytoijalle.</div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-10 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <section className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.35)]">
              <div className="mb-6 flex items-center gap-3 text-slate-100">
                <UserRound className="h-5 w-5 text-cyan-300" />
                <h2 className="text-2xl font-semibold">Työnhakijan profiili</h2>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Nimi" value={candidate.name} onChange={(v) => setCandidate({ ...candidate, name: v })} />
                <Field label="Titteli" value={candidate.title} onChange={(v) => setCandidate({ ...candidate, title: v })} />
                <Field label="Sijainti" value={candidate.location} onChange={(v) => setCandidate({ ...candidate, location: v })} />
                <Field label="Toiveet" value={candidate.preferences} onChange={(v) => setCandidate({ ...candidate, preferences: v })} />
              </div>
              <div className="mt-5 space-y-5">
                <Area label="Osaaminen" value={candidate.skills} onChange={(v) => setCandidate({ ...candidate, skills: v })} />
                <Area label="Kokemus" value={candidate.experience} onChange={(v) => setCandidate({ ...candidate, experience: v })} />
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.35)]">
              <div className="mb-6 flex items-center gap-3 text-slate-100">
                <Briefcase className="h-5 w-5 text-cyan-300" />
                <h2 className="text-2xl font-semibold">Työpaikkailmoitus</h2>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Yritys" value={job.company} onChange={(v) => setJob({ ...job, company: v })} />
                <Field label="Rooli" value={job.role} onChange={(v) => setJob({ ...job, role: v })} />
                <Field label="Sijainti" value={job.location} onChange={(v) => setJob({ ...job, location: v })} />
              </div>
              <div className="mt-5 space-y-5">
                <Area label="Kuvaus" value={job.description} onChange={(v) => setJob({ ...job, description: v })} />
                <Area label="Vaatimukset" value={job.requirements} onChange={(v) => setJob({ ...job, requirements: v })} />
              </div>
            </section>

            <section className="rounded-[2rem] border border-cyan-500/10 bg-slate-950/80 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.25)]">
              <button
                onClick={runMatch}
                disabled={loading}
                className="w-full rounded-3xl bg-gradient-to-r from-cyan-400 via-slate-100 to-cyan-300 px-6 py-4 text-base font-semibold text-slate-950 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Analysoidaan..." : "Tee AI-matchaus"}
              </button>
              {error && <p className="mt-4 text-sm text-rose-300">{error}</p>}
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.35)]">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Insight dashboard</p>
                  <h2 className="mt-3 text-3xl font-semibold text-white">Rekrytointityökalun tulokset</h2>
                </div>
                <div className="rounded-3xl bg-slate-950/80 px-4 py-3 text-sm text-slate-200">Reagoiva analyysi</div>
              </div>
              <p className="text-sm leading-6 text-slate-400">Tallenna reaaliaikainen match-score, vahvuudet ja aukot yhdellä napsautuksella.</p>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.35)]">
              <div className="grid gap-4">
                <div className="rounded-[1.75rem] bg-slate-950/90 p-5 text-slate-100 shadow-[0_18px_40px_rgba(15,23,42,0.25)]">
                  <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Luottavainen</p>
                  <p className="mt-4 text-2xl font-semibold">Ammattimainen rekrytointi</p>
                  <p className="mt-3 text-sm leading-6 text-slate-400">Tyylikäs käyttöliittymä tekee datasta helposti luettavaa ja nopeasti käytettävää.</p>
                </div>
                <div className="rounded-[1.75rem] bg-slate-950/90 p-5 text-slate-100 shadow-[0_18px_40px_rgba(15,23,42,0.25)]">
                  <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Vahva brändi</p>
                  <p className="mt-4 text-2xl font-semibold">SaaS-tyylinen selkeys</p>
                  <p className="mt-3 text-sm leading-6 text-slate-400">Puhtaasti suunniteltu layout pitää fokusoidun työnkulun yllä.</p>
                </div>
              </div>
            </section>
          </aside>
        </div>

        {result && (
          <section className="mt-10 grid gap-6 xl:grid-cols-[1.2fr_0.9fr]">
            <div className="space-y-6">
              <div className="rounded-[2rem] bg-gradient-to-br from-cyan-500/15 via-slate-900/80 to-slate-950/90 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.35)] border border-cyan-500/20">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Match score</p>
                    <h2 className="mt-3 text-5xl font-semibold text-white">{result.score}%</h2>
                  </div>
                  <div className="rounded-3xl bg-slate-950/80 px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(15,23,42,0.25)]">Premium tulos</div>
                </div>
                <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300">{result.summary}</p>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <ResultCard title="Vahvuudet" items={result.strengths} accent="from-cyan-500/15 to-slate-950/80" />
                <ResultCard title="Täydennettävää" items={result.gaps} accent="from-rose-500/15 to-slate-950/80" />
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 shadow-[0_24px_90px_rgba(15,23,42,0.35)]">
                <div className="mb-6 flex items-center gap-3 text-slate-100">
                  <FileText className="h-6 w-6 text-cyan-300" />
                  <h2 className="text-2xl font-semibold">Hakemusluonnos</h2>
                </div>
                <textarea
                  value={result.applicationDraft}
                  readOnly
                  className="min-h-[360px] w-full rounded-[1.75rem] border border-slate-800/80 bg-slate-950/90 p-5 text-sm leading-6 text-slate-100 outline-none transition focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="space-y-6">
              <ResultCard title="Kysymykset työnhakijalle" items={result.questionsForCandidate} accent="from-violet-500/15 to-slate-950/80" />
              <ResultCard title="Kysymykset rekrytoijalle" items={result.questionsForRecruiter} accent="from-emerald-500/15 to-slate-950/80" />
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-400">{label}</span>
      <input className="w-full rounded-3xl border border-slate-800/80 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/15" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function Area({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-400">{label}</span>
      <textarea className="min-h-28 w-full rounded-3xl border border-slate-800/80 bg-slate-950/90 px-4 py-4 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/15" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function ResultCard({ title, items, accent }: { title: string; items: string[]; accent?: string }) {
  return (
    <div className={`rounded-[2rem] border border-white/10 bg-gradient-to-br ${accent ?? "from-slate-900/95 to-slate-950/95"} p-6 shadow-[0_24px_80px_rgba(15,23,42,0.35)]`}>
      <h2 className="mb-4 text-xl font-semibold text-white">{title}</h2>
      <div className="space-y-3">
        {items?.map((item) => (
          <div key={item} className="rounded-3xl bg-slate-950/95 px-4 py-3 text-sm text-slate-200 shadow-sm">{item}</div>
        ))}
      </div>
    </div>
  );
}
