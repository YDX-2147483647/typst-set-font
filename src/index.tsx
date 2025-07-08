import { hydrate, prerender as ssr } from "preact-iso";

import "./style.css";

export function App() {
  return <section></section>;
}

if (typeof window !== "undefined") {
  hydrate(<App />, document.getElementById("app"));
}

export async function prerender(data) {
  return await ssr(<App {...data} />);
}
