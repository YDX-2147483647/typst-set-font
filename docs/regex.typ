#pdf.embed(
  "regex.typ",
  relationship: "source",
)

#let latin-in-cjk = regex("[^\u{00B7}\u{2013}\u{2014}\u{2018}\u{2019}\u{201C}\u{201D}\u{2025}-\u{2027}\u{2E3A}]")

#let hline = table.hline(stroke: (thickness: 0.5pt, paint: gray, dash: "dashed"))

#let target = [表意汉漢字，大好きです，サッカーを，주의인주로，㋀㈠㍻㌀、abc,.123：！？“‘·’”——㊙️🉑🈚🈲🀄🀇,.?:«»]

#let candidates = (
  link("https://www.unicode.org/reports/tr44/tr44-24.html#GC_Values_Table")[General Category],
  (regex("\pL"), regex("\p{General_Category=Letter}"), regex("\p{Letter}"), regex("\p{lETteR}")),
  regex("\p{Cased_Letter}"),
  regex("\p{Symbol}"),
  regex("\p{Number}"),
  regex("\p{Punctuation}"),
  link("https://www.unicode.org/reports/tr24/#Script_Values_Table")[Script],
  (
    regex("\p{Han}"),
    regex("\p{Hani}"),
    regex("\p{sc=Han}"),
    regex("\p{Script=Han}"),
    regex("\p{sc:Han}"),
    regex("\p{Script:Han}"),
  ),
  hline,
  regex("\p{Hiragana}"),
  regex("\p{Katakana}"),
  regex("[\p{Hiragana}\p{Katakana}]"),
  hline,
  regex("\p{Hangul}"),
  hline,
  regex("\p{Latin}"),
  regex("\p{Common}"),
  link("https://www.unicode.org/reports/tr24/#Script_Extensions")[Script Extensions],
  (
    regex("\p{scx=Han}"),
    regex("\p{Script_Extensions=Han}"),
    regex("\p{scx:Han}"),
    regex("\p{Script_Extensions:Han}"),
    regex("\p{scx=Hani}"),
  ),
  hline,
  regex("\p{scx=Hiragana}"),
  regex("\p{scx=Katakana}"),
  regex("[\p{scx=Hiragana}\p{scx=Katakana}]"),
  hline,
  regex("\p{scx=Hangul}"),
  hline,
  regex("\p{scx=Latin}"),
  regex("\p{scx=Common}"),
  link("https://docs.rs/typst/latest/typst/text/enum.Covers.html#variant.LatinInCjk")[Predefined coverage set],
  latin-in-cjk,
)

#set page(height: auto, width: auto, margin: 2em)
#set text(
  lang: "zh",
  region: "HK", // 避免标点挤压干扰
  font: "Source Han Serif SC",
  top-edge: "ascender",
  bottom-edge: "descender",
)

#show heading: set align(center)
#show link: it => it + super(emoji.chain)

= 正则表达式覆盖范围

#table(
  columns: 2,
  align: (end, start).map(a => a + horizon),
  stroke: none,
  row-gutter: 0.5em,
  ..candidates
    .map(it => if (regex, array).contains(type(it)) {
      (
        {
          set raw(lang: "typc")
          let patterns = (
            if type(it) == regex { (it,) } else { it }
          )
            .map(p => (
              ..if p == latin-in-cjk { (`"latin-in-cjk"`,) },
              raw(eval(repr(p).trim("regex(", at: start).trim(")", at: end)), lang: "re"),
            ))
            .flatten()

          if patterns.len() > 1 {
            grid(
              columns: 2,
              align: start + horizon,
              row-gutter: 0.25em,
              column-gutter: 1em,
              ..patterns
            )
          } else {
            patterns.join()
          }
        },
        {
          let pattern = if type(it) == regex { it } else { it.first() }
          show pattern: set text(blue)
          show pattern: underline.with(offset: 1em / 4)
          target
        },
      )
    } else if type(it) == content and it.func() == table.hline {
      it
    } else {
      table.cell(colspan: 2, align: center + horizon, stroke: (top: gray), inset: (bottom: 0em), it)
    })
    .flatten()
)
