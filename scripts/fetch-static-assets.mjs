import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const source = "https://loja.tfrprojetos.com.br";
const publicDir = fileURLToPath(new URL("../public/", import.meta.url));
const assets = ["/tfr-logo.png", "/kim-flow-logo.png", "/favicon.png", "/111.png"];

for (const asset of assets) {
  const response = await fetch(source + asset, {
    headers: { "user-agent": "tfr-site-release-build/1.0" }
  });

  if (!response.ok) {
    throw new Error(`Falha ao preservar ${asset}: HTTP ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.toLowerCase().startsWith("image/")) {
    throw new Error(`Resposta inválida para ${asset}: ${contentType || "sem content-type"}`);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  const target = join(publicDir, asset.replace(/^\//, ""));
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, bytes);
  console.log(`Preservado ${asset} (${bytes.length} bytes)`);
}
