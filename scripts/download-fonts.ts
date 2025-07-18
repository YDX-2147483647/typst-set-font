import assert from "node:assert";
import { execFile as _execFile } from "node:child_process";
import console from "node:console";
import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFile = promisify(_execFile);

interface Font {
  font_name: string;
  files: {
    /** Download name, default to the last part of URL */
    name?: string;
    /** SHA256 */
    hash: string;
    /** Primary download URL and fallback URLs */
    url: string[];
  }[];
}

const FONTS: Font[] = [
  {
    font_name: "Source Han Serif SC",
    files: [
      {
        name: "SourceHanSerifSC-Regular.otf",
        hash: "78aa7a328fd974df2d688c8a9fd74a33d8334dfa84ab24d9d11efb2ffc464117",
        url: [
          "https://mirrors.cernet.edu.cn/adobe-fonts/source-han-serif/OTF/SimplifiedChinese/SourceHanSerifSC-Regular.otf",
          "https://github.com/adobe-fonts/source-han-serif/raw/7889f11bf31170b5d092a083b357c8c8130f89e0/OTF/SimplifiedChinese/SourceHanSerifSC-Regular.otf",
          "https://github.com/adobe-fonts/source-han-serif/raw/release/OTF/SimplifiedChinese/SourceHanSerifSC-Regular.otf",
        ],
      },
      {
        name: "SourceHanSerifSC-Bold.otf",
        hash: "706b8c0de2deff6cbc0c87e2cdedfd33a78b7ffd76cebb4549012f197ba611fe",
        url: [
          "https://mirrors.cernet.edu.cn/adobe-fonts/source-han-serif/OTF/SimplifiedChinese/SourceHanSerifSC-Bold.otf",
          "https://github.com/adobe-fonts/source-han-serif/raw/7889f11bf31170b5d092a083b357c8c8130f89e0/OTF/SimplifiedChinese/SourceHanSerifSC-Bold.otf",
          "https://github.com/adobe-fonts/source-han-serif/raw/release/OTF/SimplifiedChinese/SourceHanSerifSC-Bold.otf",
        ],
      },
    ],
  },
  {
    font_name: "Source Han Sans SC",
    files: [
      {
        hash: "f1d8611151880c6c336aabeac4640ef434fa13cbfbf1ffe82d0a71b2a5637256",
        url: [
          "https://mirrors.cernet.edu.cn/adobe-fonts/source-han-sans/OTF/SimplifiedChinese/SourceHanSansSC-Regular.otf",
          "https://github.com/adobe-fonts/source-han-sans/raw/0486bb6f067427d9559018e9e3d36e3e8a636010/OTF/SimplifiedChinese/SourceHanSansSC-Regular.otf",
          "https://github.com/adobe-fonts/source-han-sans/raw/release/OTF/SimplifiedChinese/SourceHanSansSC-Regular.otf",
        ],
      },
    ],
  },
  {
    font_name: "Roboto",
    files: [
      {
        hash: "797e35f7f5d6020a5c6ea13b42ecd668bcfb3bbc4baa0e74773527e5b6cb3174",
        url: [
          "https://github.com/typst/typst-dev-assets/raw/64f8c7108db88323a9d3476e9750562de753f24e/files/fonts/Roboto-Regular.ttf",
          "https://github.com/typst/typst-dev-assets/raw/main/files/fonts/Roboto-Regular.ttf",
        ],
      },
    ],
  },
  {
    font_name: "FandolSong",
    files: [
      {
        hash: "a3820003227d4abe31fe28b493200d94a849ccfd078b50a019264f70353020b0",
        url: ["https://mirrors.ctan.org/fonts/fandol/FandolSong-Regular.otf"],
      },
    ],
  },
  {
    font_name: "FandolHei",
    files: [
      {
        hash: "4afa97aa8751e0118617df88272b58d43691b5cffb7ea024c4580496e9f34d28",
        url: ["https://mirrors.ctan.org/fonts/fandol/FandolHei-Regular.otf"],
      },
    ],
  },
  {
    font_name: "FandolKai",
    files: [
      {
        hash: "ea7e7fb4f9b3ac694a68d43946e04d21deed6e8c29a7c2d3081e1a4138f2f827",
        url: ["https://mirrors.ctan.org/fonts/fandol/FandolKai-Regular.otf"],
      },
    ],
  },
  {
    font_name: "FandolFang R",
    files: [
      {
        hash: "d838ad32ce2244d8144f408c37fe71065aba6fbbc80759a4d2aa2033948d5bc9",
        url: ["https://mirrors.ctan.org/fonts/fandol/FandolFang-Regular.otf"],
      },
    ],
  },
  {
    font_name: "LXGW WenKai GB",
    files: [
      {
        hash: "252cde5857f7ce57ce76f7e2e1d2e91c1f912f1f4c13c7e4fb295b5fdf5923ed",
        url: [
          "https://github.com/lxgw/LxgwWenkaiGB/releases/download/v1.520/LXGWWenKaiGB-Regular.ttf",
        ],
      },
    ],
  },
  {
    font_name: "TeX Gyre Termes",
    files: [
      {
        hash: "cc3fe7c707b81428d23d54df3eadd9228a2bf6a4d43125d94df56f5f63134659",
        url: [
          "https://mirrors.ctan.org/fonts/tex-gyre/opentype/texgyretermes-regular.otf",
        ],
      },
    ],
  },
  {
    font_name: "Noto Color Emoji",
    files: [
      {
        hash: "3ed77810c203e1a67735dc19d395f32c23f2d7c0c3696690f4f78e15e57ab816",
        url: [
          "https://github.com/googlefonts/noto-emoji/raw/b3e3051a088047d19fd4d49b1c3ac42fb8c3aaf8/fonts/NotoColorEmoji.ttf",
          "https://github.com/googlefonts/noto-emoji/raw/main/fonts/NotoColorEmoji.ttf",
        ],
      },
    ],
  },
  {
    font_name: "Twitter Color Emoji",
    files: [
      {
        hash: "11d45f5afc6a6a19f0c99831bc47f879e4157a8675cfaa436529f4ef227ddbcb",
        url: [
          "https://github.com/typst/typst-dev-assets/raw/64f8c7108db88323a9d3476e9750562de753f24e/files/fonts/TwitterColorEmoji.ttf",
          "https://github.com/typst/typst-dev-assets/raw/main/files/fonts/TwitterColorEmoji.ttf",
        ],
      },
    ],
  },
  {
    font_name: "I.Mahjong-CAN",
    files: [
      {
        hash: "0cb865227eb42a8b7a27a698ecf46c1e177b1a97b54240bc14a19a742b7728f4",
        url: [
          "https://github.com/SyaoranHinata/I.Mahjong/raw/73c507836e6ab30579305257ae3e2a7e1142d066/I.MahjongCAN.otf",
          "https://github.com/SyaoranHinata/I.Mahjong/raw/main/I.MahjongCAN.otf",
        ],
      },
    ],
  },
];

const ROOT_DIR = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const FONTS_DIR = path.join(ROOT_DIR, "fonts");
await mkdir(FONTS_DIR, { recursive: true });

const { stdout } = await execFile("typst", ["fonts", "--font-path", FONTS_DIR]);
const existing_fonts = stdout.trim().split("\n");

for (const { font_name, files } of FONTS) {
  if (existing_fonts.includes(font_name)) {
    console.log(`${font_name}: ✓`);
    continue;
  }

  console.log(`${font_name}:`);

  for (const spec of files) {
    let name = spec.name;
    // Infer `name` from `url`
    if (!name) {
      const ends = new Set(
        spec.url.map((u) => u.split("/").pop()).filter((x) => x !== undefined),
      );
      assert.equal(ends.size, 1);
      name = Array.from(ends)[0] as string;
    }

    console.log(`- ${name}: Downloading…`);

    let completed = false;
    for (const url of spec.url) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        }
        const buffer = await response.arrayBuffer();
        const hasher = createHash("sha256");
        hasher.update(Buffer.from(buffer));
        const hash = hasher.digest("hex");
        if (hash !== spec.hash) {
          throw new Error(
            `Hash mismatch for ${spec.name}: expected ${spec.hash}, got ${hash}`,
          );
        }
        const filePath = path.join(FONTS_DIR, name);

        await writeFile(filePath, Buffer.from(buffer));
        console.log(`  ✓ Downloaded and verified.`);
        completed = true;
        break;
      } catch (error) {
        console.error(`Error downloading ${spec.name} from ${url}:`, error);
      }
    }
    if (!completed) {
      throw new Error(`Failed to download ${spec.name} after trying all URLs.`);
    }
  }
}
