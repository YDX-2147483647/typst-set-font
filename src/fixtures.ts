/**
 * Sample text characters for testing font rendering across different scripts.
 */
export const text_samples = {
  /** Characters dedicated for Latin */
  latin: "Aa09,.?!",
  /** Characters shared between Latin and Han */
  both: "—…“”‘’·",
  /** Characters dedicated for Han */
  han: {
    /** Punctuations */
    punct: "，、。？！",
    /** Ideographs */
    ideo: "永体體固",
  },
};

/**
 * A map from general font styles to lists of specific options.
 */
export const common_han_fonts: Record<
  string,
  {
    /** Display name */
    label: string;
    /** The value to `set text(font: …)` */
    value: string;
    /** Whether this font is available in typst.app. Default to false */
    available_in_typst_app?: boolean;
    /** URL to the homepage, usually listed in the OTF info, and different from a direct download link */
    homepage?: string;
  }[]
> = {
  宋体: [
    {
      label: "思源 Noto CJK",
      value: "Noto Serif CJK SC",
      available_in_typst_app: true,
      homepage: "https://github.com/notofonts/noto-cjk",
    },
    {
      label: "思源 Source Han",
      value: "Source Han Serif SC",
      homepage: "https://github.com/adobe-fonts/source-han-serif",
    },
    { label: "中易", value: "SimSun" },
    {
      label: "Fandol",
      value: "FandolSong",
      homepage: "https://www.ctan.org/tex-archive/fonts/fandol",
    },
  ],
  黑体: [
    {
      label: "思源 Noto CJK",
      value: "Noto Sans CJK SC",
      available_in_typst_app: true,
      homepage: "https://github.com/notofonts/noto-cjk",
    },
    {
      label: "思源 Source Han",
      value: "Source Han Sans SC",
      homepage: "https://github.com/adobe-fonts/source-han-sans",
    },
    { label: "中易", value: "SimHei" },
    {
      label: "Fandol",
      value: "FandolHei",
      homepage: "https://www.ctan.org/tex-archive/fonts/fandol",
    },
  ],
  楷体: [
    { label: "中易", value: "KaiTi" },
    {
      label: "Fandol",
      value: "FandolKai",
      homepage: "https://www.ctan.org/tex-archive/fonts/fandol",
    },
    {
      label: "霞鹜",
      value: "LXGW WenKai GB",
      homepage: "https://github.com/lxgw/LxgwWenKaiGB",
    },
  ],
  仿宋: [
    { label: "中易", value: "FangSong" },
    {
      label: "Fandol",
      value: "FandolFang R",
      homepage: "https://www.ctan.org/tex-archive/fonts/fandol",
    },
    {
      label: "朱雀",
      value: "Zhuque Fangsong (technical preview)",
      homepage: "https://github.com/TrionesType/zhuque",
    },
  ],
};
