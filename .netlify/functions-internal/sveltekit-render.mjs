import { init } from '../serverless.js';

export const handler = init((() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicn.png","favicon.png","image/1.webp","image/2.webp","image/3.webp","image/4.webp","image/5.webp","image/6.webp","image/7.webp","image/8.webp","image/9.webp","image/compute.png","image/contact.webp","image/contact1.webp","image/Da.webp","image/entrance.svg","image/entrance.webp","image/logo.webp","image/NOM.webp","image/pro.webp","image/proback.webp","image/pro_back.webp","image/titre.webp","image/X.webp","image/X2.webp","robots.txt"]),
	mimeTypes: {".png":"image/png",".webp":"image/webp",".svg":"image/svg+xml",".txt":"text/plain"},
	_: {
		client: {"start":"_app/immutable/entry/start.WPh0UIFa.js","app":"_app/immutable/entry/app.T4lBq1d7.js","imports":["_app/immutable/entry/start.WPh0UIFa.js","_app/immutable/chunks/entry.PFpKJ4lf.js","_app/immutable/chunks/scheduler.a0R-6sdq.js","_app/immutable/entry/app.T4lBq1d7.js","_app/immutable/chunks/preload-helper.C1FmrZbK.js","_app/immutable/chunks/scheduler.a0R-6sdq.js","_app/immutable/chunks/index.DSQAGmCZ.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('../server/nodes/0.js')),
			__memo(() => import('../server/nodes/1.js')),
			__memo(() => import('../server/nodes/4.js')),
			__memo(() => import('../server/nodes/5.js')),
			__memo(() => import('../server/nodes/6.js')),
			__memo(() => import('../server/nodes/8.js'))
		],
		routes: [
			{
				id: "/cambertvideo",
				pattern: /^\/cambertvideo\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/data",
				pattern: /^\/data\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/sverdle",
				pattern: /^\/sverdle\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/time",
				pattern: /^\/time\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})());
