import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return Response.json(
        { error: "Only PDF files are supported" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const data = await pdf(buffer);

    return Response.json({
      text: data.text,
    });
  } catch (error) {
    console.error("CV parsing failed:", error);

    return Response.json({ error: "CV parsing failed" }, { status: 500 });
  }
}