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
  }[]
> = {
  宋体: [
    {
      label: "思源 Noto CJK",
      value: "Noto Serif CJK SC",
      available_in_typst_app: true,
    },
    { label: "思源 Source Han", value: "Source Han Serif" },
    { label: "中易", value: "SimSun" },
    { label: "Fandol", value: "FandolSong" },
  ],
  黑体: [
    {
      label: "思源 Noto CJK",
      value: "Noto Sans CJK SC",
      available_in_typst_app: true,
    },
    { label: "思源 Source Han", value: "Source Han Sans" },
    { label: "中易", value: "SimHei" },
    { label: "Fandol", value: "FandolHei" },
  ],
  楷体: [
    { label: "中易", value: "KaiTi" },
    { label: "Fandol", value: "FandolKai" },
    { label: "霞鹜", value: "LXGW WenKai GB" },
  ],
  仿宋: [
    { label: "中易", value: "FangSong" },
    { label: "Fandol", value: "FandolFang R" },
    { label: "朱雀", value: "Zhuque Fangsong (technical preview)" },
  ],
};
