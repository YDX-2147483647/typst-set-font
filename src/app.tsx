import { useState } from "preact/hooks";

import {
  type FontFamilies,
  FontFamilies_from,
  type FontName,
} from "./fonts/types.ts";

export function App() {
  const [font, setFont] = useState("Source Han Serif");

  return (
    <section class="prose">
      <h1>Typst set font</h1>
      <label class="not-prose flex flex-col space-y-2">
        <span>选择字体</span>
        <input
          type="text"
          placeholder="输入字体名称"
          value={font}
          onInput={(e) => setFont((e.target as HTMLInputElement).value)}
          class="rounded border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
        />
      </label>
      <FontFamiliesSample font={FontFamilies_from(font)} />
    </section>
  );
}

function FontSample(props: { font: FontName; text: string }) {
  return (
    <div
      class="rounded bg-slate-50 px-4 py-1 text-center shadow"
      // Note: It is hard to `set text(fallback: false)` in Web. The result is not really predictable.
      style={{ fontFamily: props.font }}
    >
      {props.text}
    </div>
  );
}

function FontFamiliesSample({ font }: { font: FontFamilies }) {
  return (
    <section>
      <h2>字体测试</h2>
      <div class="not-prose my-4 grid grid-cols-[auto_auto_1fr] items-center gap-3 text-end">
        <p class="col-span-2">西文独占字符：</p>
        <FontSample font={font.latin} text="Aa09,.?!" />
        <p class="col-span-2">
          <a href="http://github.com/w3c/clreq/issues/534">中西共用字符：</a>
        </p>
        <FontSample font="todo" text="—…“”‘’·" />
        <p class="row-span-2">中文独占</p>
        <p>标点：</p>
        <FontSample font={font.han} text="，、。？！" />
        <p>汉字：</p>
        <FontSample font={font.han} text="永体體固" />
      </div>
      <p>浏览器渲染效果可能与 typst 不同；请以文字描述为准。</p>
    </section>
  );
}
