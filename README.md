# typst-set-font

Setting Chinese font in Typst. 设置 Typst 中文字体。

[![Check](https://github.com/YDX-2147483647/typst-set-font/actions/workflows/check.yml/badge.svg)](https://github.com/YDX-2147483647/typst-set-font/actions/workflows/check.yml)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fydx-2147483647.github.io%2Ftypst-set-font%2F&label=Website)](https://ydx-2147483647.github.io/typst-set-font/)

## Development

Install typst and run the following.

```shell
pnpm install
pnpm just build-assets
pnpm dev
```

## References

<!-- The following are used by SeeAlso.vue -->

Packages:

- [ctyp](https://github.com/HPDell/ctyp/tree/6ad2953f8f942cd16ceae29668ece30622e03ed0)
  by HPDell
- [ori](https://typst.app/universe/package/ori/0.2.2/)
  by OrangeX4
- [jastylest-zh](https://typst.app/universe/package/jastylest-zh/0.1.1/)
  by mike-unkgi
- [jastylest](https://typst.app/universe/package/jastylest/0.1.1/)
  by raygo

Websites:

- [FAQ](https://typst-doc-cn.github.io/guide/FAQ.html)
  by [Typst中文社区导航](https://typst-doc-cn.github.io/guide)
  - [中英文如何使用不同的字体？](https://typst-doc-cn.github.io/guide/FAQ/lang-fonts.html)
  - [为什么代码块里面的中文字体显示不正常？](https://typst-doc-cn.github.io/guide/FAQ/chinese-in-raw.html)
  - [如何修改公式里的中文字体？](https://typst-doc-cn.github.io/guide/FAQ/equation-chinese-font.html)
  - [引号的字体不对 / 引号的宽度不对](https://typst-doc-cn.github.io/guide/FAQ/smartquote-font.html)

- [Typstで日本語文字と英数字のフォントを別々に指定する](https://zenn.dev/mkpoli/articles/6234c1d2a595bd)
  by mkpoli

另可参考本项目的核心代码与测试用例：

- [`src/fonts/` · YDX-2147483647/typst-set-font](https://github.com/YDX-2147483647/typst-set-font/tree/main/src/fonts)
