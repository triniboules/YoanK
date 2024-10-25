import * as server from '../entries/pages/sverdle/_page.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/sverdle/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/sverdle/+page.server.ts";
export const imports = ["_app/immutable/nodes/6._63uvjX1.js","_app/immutable/chunks/scheduler.a0R-6sdq.js","_app/immutable/chunks/each.BDgaXpZn.js","_app/immutable/chunks/index.DSQAGmCZ.js","_app/immutable/chunks/entry.PFpKJ4lf.js"];
export const stylesheets = ["_app/immutable/assets/6.DOkkq0IA.css"];
export const fonts = [];
