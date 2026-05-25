# SkillSync MVP

AI-pohjaisen rekrytointi- ja työnhakupalvelun ensimmäinen MVP.

## Mitä tämä tekee?

- Työnhakijaprofiilin syöttö
- Työpaikkailmoituksen syöttö
- AI-matchaus OpenAI API:n kautta
- Match-prosentti
- Sopivuuden perustelut
- Profiilin puutteet
- Hakemusluonnos
- Supabase-tietokantamalli jatkokehitystä varten

## Käynnistys

```bash
npm install
cp .env.example .env.local
npm run dev
```

Lisää `.env.local`-tiedostoon Supabase- ja OpenAI-avaimet.

## Supabase

Aja `supabase/schema.sql` Supabasen SQL editorissa.
