import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return Response.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
      data: bytes,
    }).promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);

      const content = await page.getTextContent();

      const strings = content.items.map((item: any) => item.str);

      text += strings.join(" ") + "\n";
    }

    return Response.json({
      text,
    });
  } catch (error) {
    console.error("CV parsing failed:", error);

    return Response.json(
      { error: "CV parsing failed" },
      { status: 500 }
    );
  }
}