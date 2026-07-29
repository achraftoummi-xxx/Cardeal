import { promises as fs } from "fs";
import path from "path";

export async function GET(_req: Request, context: any) {
  const params = context?.params ?? {};
  const { lang } = params as { lang?: string };
  const iconsDir = path.join(process.cwd(), "assets", "icons");
  try {
    const files = await fs.readdir(iconsDir);
    const match = files.find((f) => f.toLowerCase().startsWith(lang.toLowerCase()));
    if (!match) return new Response("Not found", { status: 404 });
    const filePath = path.join(iconsDir, match);
    const buffer = await fs.readFile(filePath);
    return new Response(buffer, { headers: { "Content-Type": "image/png" } });
  } catch (err) {
    return new Response("Not found", { status: 404 });
  }
}
