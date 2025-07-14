<script setup lang="ts">
import { markdownBlock } from "../markdown.ts";
</script>

<template>
  <section :class="$style.section">
    <h2>附录：为什么这么复杂？</h2>
    <figure>
      <picture>
        <source
          media="(prefers-color-scheme: dark)"
          srcset="/docs/coverage-1.dark.svg"
        />
        <source
          media="(prefers-color-scheme: light)"
          srcset="/docs/coverage-1.svg"
        />
        <img src="/docs/coverage-1.svg" alt="" />
      </picture>
      <figcaption>典型字体的字符覆盖范围</figcaption>
    </figure>
    <div
      v-html="
        markdownBlock(`
如上图所示，中西混排的文章可能用到许多字符。可目前鲜有字体覆盖并联合设计多个文种，典型情况如下。

- **西文（Latin）字体**：缺少中文字符，中文变成豆腐块；
- **中文字体**：虽基本覆盖 Latin 字符，但 Latin 部分的设计未必美观，甚至组成单词时难以阅读。
    `)
      "
    />
    <figure>
      <div class="not-prose grid grid-cols-2">
        <picture>
          <source
            media="(prefers-color-scheme: dark)"
            srcset="/docs/coverage-2.dark.svg"
          />
          <source
            media="(prefers-color-scheme: light)"
            srcset="/docs/coverage-2.svg"
          />
          <img src="/docs/coverage-2.svg" alt="Roboto" />
        </picture>
        <picture>
          <source
            media="(prefers-color-scheme: dark)"
            srcset="/docs/coverage-3.dark.svg"
          />
          <source
            media="(prefers-color-scheme: light)"
            srcset="/docs/coverage-3.svg"
          />
          <img src="/docs/coverage-3.svg" alt="FandolSong" />
        </picture>
      </div>
      <figcaption>典型 Latin 字体（Roboto）与中文字体（FandolSong）</figcaption>
    </figure>
    <div
      v-html="
        markdownBlock(`
因此实际写作中，常常需要分别设置中西字体，确保中西内容都能正确渲染。 

然而如下表，引号“”等**中西共用标点**不仅中西字体均提供，而且中西实际都会使用，并且中西习惯的形状、位置、大小还不相同。这导致选择字体比较复杂。 
    `)
      "
    />
    <figure>
      <table>
        <thead>
          <tr>
            <th colspan="2" rowspan="2"></th>
            <th colspan="3">文种使用情况</th>
          </tr>
          <tr>
            <th>西文独占</th>
            <th>中西共用</th>
            <th>中文独占</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th rowspan="4">
              <span class="text-nowrap">典型</span
              ><span class="text-nowrap">字体</span
              ><span class="text-nowrap">覆盖</span
              ><span class="text-nowrap">情况</span>
            </th>
            <th>仅 Latin 字体</th>
            <td>‼<br />ﬁﬂﬀ</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <th>中西字体均有</th>
            <td>,.?!«»<br />Aafiïèßαа09</td>
            <td>—…“”‘’·<br />&nbsp;</td>
            <td></td>
          </tr>
          <tr>
            <th>仅中文字体</th>
            <td></td>
            <td></td>
            <td>，、。？！《》「」<br />永体體固春和景明㈠一壹</td>
          </tr>
          <tr>
            <th>Emoji 字体<br />与个别中文字体</th>
            <td colspan="3">㋀㍻㊙🉑🈚🈲🀄🀇</td>
          </tr>
        </tbody>
      </table>
      <figcaption>中西混排涉及字符的典型字体覆盖情况与文种使用情况</figcaption>
    </figure>
    <div
      v-html="
        markdownBlock(`
### 中西共用标点的三种处理方法

#### 法一：采用中文字体

对于中文为主的文章，中西共用标点应采用中文字体渲染。实现细节如下。

1. 先尝试用 Latin 字体渲染，但中西共用标点除外
   - 对于大部分字符
     - 若 Latin 字体能覆盖（西文独占字符），则按 Latin 字体渲染
     - 若不能覆盖（中文独占汉字、标点），则暂不渲染，等待后续补充
   - 对于中西共用标点，无论 Latin 字体是否覆盖，均跳过此步，等待后续补充
2. 再补充用中文字体渲染
   - 对于尚未渲染的字符（中文独占汉字、标点，中西共用标点），采用中文字体补充渲染
    `)
      "
    />
    <figure>
      <div class="not-prose grid grid-cols-2">
        <picture>
          <source
            media="(prefers-color-scheme: dark)"
            srcset="/docs/coverage-5.dark.svg"
          />
          <source
            media="(prefers-color-scheme: light)"
            srcset="/docs/coverage-5.svg"
          />
          <img src="/docs/coverage-5.svg" alt="" />
        </picture>
        <picture>
          <source
            media="(prefers-color-scheme: dark)"
            srcset="/docs/coverage-6.dark.svg"
          />
          <source
            media="(prefers-color-scheme: light)"
            srcset="/docs/coverage-6.svg"
          />
          <img src="/docs/coverage-6.svg" alt="" />
        </picture>
      </div>
      <figcaption>
        先尝试用 Latin 字体渲染，但中西共用标点除外；再补充用中文字体渲染
      </figcaption>
    </figure>
    <div
      v-html="
        markdownBlock(`
#### 法二：采用 Latin 字体

对于西文为主的文章，中西共用标点应采用 Latin 字体渲染。实现细节如下。

1. 先尝试用 Latin 字体渲染，无例外
   - 若 Latin 字体能覆盖（西文独占字符、中西共用标点），则按 Latin 字体渲染
   - 若不能覆盖（中文独占汉字、标点），则暂不渲染，等待后续补充
2. 再补充用中文字体渲染
   - 对于尚未渲染的字符（中文独占汉字、标点），采用中文字体补充渲染
    `)
      "
    />
    <figure>
      <div class="not-prose grid grid-cols-2">
        <picture>
          <source
            media="(prefers-color-scheme: dark)"
            srcset="/docs/coverage-2.dark.svg"
          />
          <source
            media="(prefers-color-scheme: light)"
            srcset="/docs/coverage-2.svg"
          />
          <img src="/docs/coverage-2.svg" alt="" />
        </picture>
        <picture>
          <source
            media="(prefers-color-scheme: dark)"
            srcset="/docs/coverage-4.dark.svg"
          />
          <source
            media="(prefers-color-scheme: light)"
            srcset="/docs/coverage-4.svg"
          />
          <img src="/docs/coverage-4.svg" alt="" />
        </picture>
      </div>
      <figcaption>
        先尝试用 Latin 字体渲染，无例外；再补充用中文字体渲染
      </figcaption>
    </figure>
    <div
      v-html="
        markdownBlock(`
#### 法三：不考虑中文标点

对于代码等不含中文标点的特殊文段，也可采用另一特殊方法。实现细节如下。

1. 先用中文字体渲染汉字
   - 对于中文独占的汉字，采用中文字体渲染
2. 再补充用 Latin 字体渲染
   - 若 Latin 字体能覆盖（西文独占字符、中西共用标点），则按 Latin 字体渲染
   - 若不能覆盖（中文独占标点），则放弃，变成豆腐块
    `)
      "
    />
    <figure>
      <div class="not-prose grid grid-cols-2">
        <picture>
          <source
            media="(prefers-color-scheme: dark)"
            srcset="/docs/coverage-7.dark.svg"
          />
          <source
            media="(prefers-color-scheme: light)"
            srcset="/docs/coverage-7.svg"
          />
          <img src="/docs/coverage-7.svg" alt="" />
        </picture>
        <picture>
          <source
            media="(prefers-color-scheme: dark)"
            srcset="/docs/coverage-9.dark.svg"
          />
          <source
            media="(prefers-color-scheme: light)"
            srcset="/docs/coverage-9.svg"
          />
          <img src="/docs/coverage-9.svg" alt="" />
        </picture>
      </div>
      <figcaption>
        先用中文字体渲染汉字；再补充用 Latin 字体渲染，不能渲染则放弃
      </figcaption>
    </figure>
    <p>
      关于字体覆盖的更多例子可参考
      <a href="/docs/coverage.pdf">coverage.pdf</a
      >，关于正则表达式的更多例子可参考
      <a href="/docs/regex.pdf">regex.pdf</a>。
    </p>
  </section>
</template>

<style module>
.section {
  figure {
    > img,
    > picture,
    > picture > img {
      display: block;
      margin-inline: auto;
    }
    > figcaption {
      text-align: center;
    }
  }

  table {
    td,
    th {
      text-align: center;
      vertical-align: middle;
    }
  }

  a {
    &::after {
      content: "🔗";
      vertical-align: super;
      font-size: 0.75em;
      margin-left: 0.2em;
    }

    &:not(:hover) {
      text-decoration: none;
    }
  }
}
</style>
