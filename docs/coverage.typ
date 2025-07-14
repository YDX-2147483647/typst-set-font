#pdf.embed("coverage.typ", relationship: "source")

#let font-configs = (
  (
    link("https://www.unicode.org/glossary/#character_repertoire", smallcaps[*Character Repertoire*]),
    ("Source Han Serif SC", "I.Mahjong-CAN"),
  ),
  "Roboto",
  "FandolSong",
  ("Roboto", "FandolSong"),
  (name: "Roboto", covers: "latin-in-cjk"),
  ((name: "Roboto", covers: "latin-in-cjk"), "FandolSong"),
  (name: "FandolSong", covers: regex("\p{Han}")),
  (name: "FandolSong", covers: regex("\p{scx=Han}")),
  ((name: "FandolSong", covers: regex("\p{Han}")), "Roboto"),
  "Libertinus Serif",
  "DejaVu Sans Mono",
  "New Computer Modern",
  "TeX Gyre Termes",
  "Source Han Serif SC",
  "Source Han Sans SC",
  "FandolHei",
  "FandolKai",
  "FandolFang R",
  "LXGW WenKai GB",
  "Twitter Color Emoji",
  "Noto Color Emoji",
  "I.Mahjong-CAN",
)

#let repertoire = (
  punctuation: (
    latin: "‼",
    both: ",.!«»—…“”",
    han: "，、。！《》「」",
  ),
  letter-number: (
    latin: "ﬁﬂﬀ",
    both: "Aafiïèßαа09",
    han: "永体體固春和景明㈠一壹",
  ),
)
#let edge-case = "㋀㍻㊙🉑🈚🈲🀄🀇"
#{
  for c in repertoire.punctuation.values().join().clusters() {
    assert(c.match(regex("\p{Punctuation}")) != none)
  }
  for c in repertoire.letter-number.values().join().clusters() {
    assert(c.match(regex("\p{Letter}|\p{Number}")) != none)
  }
  for c in edge-case.clusters() {
    assert(c.match(regex("[\p{Punctuation}\p{Letter}\p{Number}]")) == none)
    assert(c.match(regex("\p{Symbol}")) != none)
  }
}


#let palette = (
  latin: blue,
  han: orange,
  punctuation: purple,
  letter-number: green.darken(10%),
)

#let r = 5em
#let margin = (left: 1em, right: 5em, bottom: 1em, top: 3em)
#set page(
  width: margin.left + 3.2 * r + margin.right,
  height: margin.top + 2.5 * r + margin.bottom,
  margin: margin,
  fill: none,
  background: {
    // Write annotations
    place(center + top, dx: (margin.left - margin.right) / 2, dy: 2.2em, block(width: 16em, {
      set par(leading: 0.4em, spacing: 0.4em)
      align(right, text(palette.han)[*typical Han font*])
      v(-0.4em)
      align(left, text(palette.latin)[*typical\ Latin font*])
    }))
    place(end + horizon, dy: (margin.top - margin.bottom) / 2 + 0.5em, dx: 4.2em - margin.right, {
      set align(start)
      set text(0.8em)
      text(palette.punctuation)[Punctuations]
      v(0em)
      text(palette.letter-number)[Letters &  \ Numbers]
    })
  },
)

#for font-and-display in font-configs {
  let (font, display) = if (
    type(font-and-display) == array and font-and-display.len() == 2 and type(font-and-display.first()) == content
  ) {
    let (display, font) = font-and-display
    (font, display)
  } else {
    let font = font-and-display
    (font, raw(repr(font), lang: "typc"))
  }

  // Write heading
  set page(foreground: place(center + top, dx: 0.5em, dy: 0.5em, block({
    set align(start)
    context {
      let size = measure(display)
      if size.height > 1.5em.to-absolute() {
        set text(0.6em)
        display
      } else if size.width > 15em.to-absolute() {
        set text(0.8em)
        display
      } else {
        display
      }
    }
    // Add to bookmark
    place(hide(heading(display)))
  })))

  // Draw circles and lines
  place(center + horizon, {
    set box(baseline: 50%)
    box(circle(radius: 0.9 * r, stroke: palette.latin))
    h(-1.1 * r)
    box(circle(radius: 1.2 * r, stroke: palette.han))
  })
  place(start + horizon, line(start: (-2%, 0%), length: 130%, stroke: gray))

  // Write texts
  set text(
    font: font,
    fallback: false,
    top-edge: "bounds",
    bottom-edge: "bounds",
  )
  set par(leading: 0.25em)
  grid(
    align: (x, y) => (center, center, start).at(x) + (bottom, top).at(y),
    rows: (1fr,) * 2,
    columns: (1fr, 0.95fr, 1.6fr),
    column-gutter: (0.3em, 1.1em),
    row-gutter: 0.3 * r,
    ..repertoire
      .values()
      .map(row => row.values().map(cell => cell.clusters().intersperse(h(0.1em)).join()))
      .flatten()
      .zip((
        (
          pad.with(left: 0.4em, bottom: 0.6em),
          it => it,
          it => pad(left: 0.5em, bottom: 0.9em, box(width: 80%, it)),
        ).map(fn => cell => fn(text(palette.punctuation, cell))),
        (
          it => it,
          it => it,
          it => pad(top: 0.8em, box(width: 5em, it)),
        ).map(fn => cell => fn(text(palette.letter-number, cell))),
      ).flatten())
      .map(((x, f)) => f(x)),
  )
  place(end + bottom, text(0.5em, edge-case))

  pagebreak(weak: true)
}
