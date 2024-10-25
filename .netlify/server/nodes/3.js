import * as universal from '../entries/pages/about/_page.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/about/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/about/+page.ts";
export const imports = ["_app/immutable/nodes/3.DlizLBlw.js","_app/immutable/chunks/index.R8ovVqwX.js","_app/immutable/chunks/scheduler.a0R-6sdq.js","_app/immutable/chunks/index.DSQAGmCZ.js"];
export const stylesheets = ["_app/immutable/assets/3.CISwv5jU.css"];
export const fonts = [];
