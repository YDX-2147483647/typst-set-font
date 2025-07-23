# Recipes in this file require typst, and could be executed by `pnpm just …`.

export TYPST_FONT_PATHS := justfile_directory() / "fonts"
export NODE_OPTIONS := "--experimental-strip-types"

# List available recipes
@list:
	just --list

# Check and download missing fonts into `./fonts/`
download-fonts:
  node scripts/download-fonts.ts

# Build docs as PDFs (for debugging)
build-pdf *ARGS:
  typst compile docs/coverage.typ {{ ARGS }}
  typst compile docs/regex.typ {{ ARGS }}

# Build docs and put into `./public/` and `./src/assets`
build-assets: download-fonts && build-font-samples
  mkdir --parents public/docs

  # PDF is the only stable format that supports links
  typst compile docs/regex.typ public/docs/regex.pdf
  typst compile docs/coverage.typ public/docs/coverage.pdf
  
  # SVGs will be included in the web page
  typst compile docs/coverage.typ "public/docs/coverage-{p}.svg" --pages 1-7,9
  typst compile docs/coverage.typ "public/docs/coverage-{p}.dark.svg" --pages 1-7,9 --input theme=dark

[private]
build-font-samples:
  mkdir --parents src/assets
  node scripts/build_font_samples.ts src/assets/font_samples.json
