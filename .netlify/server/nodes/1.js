

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.YP4kxJYJ.js","_app/immutable/chunks/scheduler.a0R-6sdq.js","_app/immutable/chunks/index.DSQAGmCZ.js","_app/immutable/chunks/entry.PFpKJ4lf.js"];
export const stylesheets = [];
export const fonts = [];
