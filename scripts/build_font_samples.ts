import assert from "node:assert";
import { writeFile } from "node:fs/promises";
import { common_han_fonts, text_samples } from "../src/fixtures.ts";
import { TYPST_EMBEDDED_FONTS } from "../src/fonts/const.ts";
import { typst } from "./typst.ts";

const template = `
#let text-sample = sys.inputs.at("text-sample")
#let font = sys.inputs.at("font")

#set page(height: auto, width: auto, margin: 0.5em, fill: none)
#set text(font: font, fallback: false)

#text-sample
`.trim();

async function compile(args: {
  text_sample: string;
  font: string;
}): Promise<string> {
  const { stdout, stderr } = await typst(
    [
      "compile",
      "-",
      "-",
      "--format=svg",
      "--input",
      `text-sample=${args.text_sample}`,
      "--input",
      `font=${args.font}`,
    ],
    {
      stdin: template,
    },
  );
  if (stderr.length > 0) {
    throw new Error(stderr);
  }
  return stdout
    .toString("utf-8")
    .replaceAll(' fill="#000000"', ' fill="currentColor"');
}

const fonts = [
  ...TYPST_EMBEDDED_FONTS,
  ...Object.values(common_han_fonts)
    .flat()
    .map(({ value }) => value),
];

const save_path = process.argv[2];
assert(save_path.endsWith(".json"));

const samples = Object.fromEntries(
  await Promise.all(
    fonts.map((font) =>
      (async () => {
        console.log(`🏁 Compiling ${font}…`);
        const cc = async (text_sample: string) =>
          await compile({ text_sample, font });
        const t = text_samples;

        // Concurrency would be slower here. So no need.
        const images = {
          latin: await cc(t.latin),
          both: await cc(t.both),
          both_for_math: await cc(t.both_for_math),
          han: { punct: await cc(t.han.punct), ideo: await cc(t.han.ideo) },
        };
        console.log(`✅ Compiled ${font}.`);

        return [font, images];
      })(),
    ),
  ),
);

await writeFile(save_path, JSON.stringify(samples), { encoding: "utf-8" });
console.log(`Saved font samples to ${save_path}.`);
