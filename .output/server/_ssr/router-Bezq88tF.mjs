import { o as __toESM } from "../_runtime.mjs";
import { t as __exportAll } from "./init-DEOmme2k.mjs";
import { _ as ToastViewport$1, at as require_react, c as createToastManager, d as ToastAction$1, f as ToastClose$1, g as ToastRoot, h as ToastContent$1, it as require_jsx_runtime, l as useToastManager, m as ToastDescription$1, p as ToastTitle$1, s as Button, u as ToastPortal$1, v as ToastProvider$1 } from "../_libs/@base-ui/react+[...].mjs";
import { C as useNavigate, X as redirect, _ as Outlet, b as createRootRoute, d as Scripts, f as HeadContent, g as createRouter, m as useRouterState, v as lazyRouteComponent, x as Link, y as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as getServerFnById, n as createServerFn, r as TSS_SERVER_FUNCTION } from "./ssr.mjs";
import { t as calculateAge } from "./ageUtils-DAte9AqJ.mjs";
import { a as string, i as record, n as any, r as object, t as _enum } from "../_libs/zod.mjs";
import { t as cn } from "../_libs/cn.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { G as CircleCheck, J as ChevronRight, L as Info, S as Phone, T as OctagonAlert, W as Clock, c as TriangleAlert, d as Star, et as BookOpen, h as Sparkles, j as LoaderCircle, t as X } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/createSsrRpc-D75-wYbG.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-Bezq88tF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var getCurrentUserFn = createServerFn({ method: "GET" }).handler(createSsrRpc("e3fe404ee0b8e721efa01daf601517ee9e623b866309fd4b561c2a1b8684aa3a"));
var loginFn = createServerFn({ method: "POST" }).validator(object({
	email: string().trim().email(),
	password: string().min(1)
})).handler(createSsrRpc("400d0ebda25e268fae04a488ac1560b98c4d67527f9bd9e0f94da9940683d0e0"));
var logoutFn = createServerFn({ method: "POST" }).handler(createSsrRpc("afe1d2a803886564f98daff63e8424e1b53fe830e93496792cdbbf97ce1b93e3"));
var AuthContext = (0, import_react.createContext)(void 0);
var AuthProvider = ({ children }) => {
	const [user, setUser] = (0, import_react.useState)(null);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const refreshUser = async () => {
		try {
			const result = await getCurrentUserFn();
			setUser(result.user);
		} catch (error) {
			console.warn("Unable to load the current user", error);
			setUser(null);
		} finally {
			setIsLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		refreshUser();
	}, []);
	const login = async (email, password) => {
		try {
			setIsLoading(true);
			const result = await loginFn({ data: {
				email,
				password
			} });
			setUser(result.user);
			return result.success && !!result.user;
		} catch (error) {
			console.error("Login request failed", error);
			return false;
		} finally {
			setIsLoading(false);
		}
	};
	const logout = async () => {
		try {
			setIsLoading(true);
			await logoutFn();
			setUser(null);
		} catch (error) {
			console.error("Logout failed", error);
		} finally {
			setIsLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value: {
			user,
			role: user ? user.role : null,
			isLoading,
			login,
			logout,
			refreshUser
		},
		children
	});
};
var useAuth = () => {
	const context = (0, import_react.useContext)(AuthContext);
	if (context === void 0) throw new Error("useAuth must be used within an AuthProvider");
	return context;
};
var buttonVariants = cva("group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/80",
			outline: "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
			secondary: "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
			ghost: "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
			destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
			xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
			sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
			lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
			icon: "size-8",
			"icon-xs": "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
			"icon-sm": "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
			"icon-lg": "size-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button$1({ className, variant = "default", size = "default", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		"data-slot": "button",
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
var toast = createToastManager();
function ToastProvider({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastProvider$1, { ...props });
}
function ToastPortal({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastPortal$1, {
		"data-slot": "toast-portal",
		...props
	});
}
function ToastViewport({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastViewport$1, {
		"data-slot": "toast-viewport",
		className: cn("pointer-events-none fixed inset-x-4 bottom-4 z-[9999] mx-auto w-auto max-w-sm outline-none sm:right-4 sm:left-auto sm:mx-0 sm:w-full", className),
		...props
	});
}
function Toast$1({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastRoot, {
		"data-slot": "toast",
		className: cn("group/toast pointer-events-auto absolute right-0 bottom-0 z-[calc(1000-var(--toast-index))] w-full origin-bottom rounded-2xl border border-gray-200/80 bg-white text-gray-900 shadow-xl will-change-transform outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50", "[--gap:0.75rem] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))] [--peek:0.75rem] [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))]", "h-(--height) [transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))] [transition:transform_500ms_cubic-bezier(0.22,1,0.36,1),opacity_500ms,height_150ms]", "after:absolute after:top-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']", "data-expanded:h-(--toast-height) data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]", "data-limited:opacity-0 data-starting-style:[transform:translateY(150%)]", "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(150%)]", "data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]", "data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]", "data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]", "data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]", "data-expanded:data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]", "data-expanded:data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]", "data-expanded:data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]", "data-expanded:data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]", className),
		...props
	});
}
function ToastContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastContent$1, {
		"data-slot": "toast-content",
		className: cn("flex h-full items-center gap-3 overflow-hidden p-4 transition-opacity duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] data-behind:opacity-0 data-expanded:opacity-100", className),
		...props
	});
}
function ToastTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastTitle$1, {
		"data-slot": "toast-title",
		className: cn("text-sm font-semibold text-gray-900", className),
		...props
	});
}
function ToastDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastDescription$1, {
		"data-slot": "toast-description",
		className: cn("text-xs text-gray-500 leading-relaxed", className),
		...props
	});
}
function ToastAction({ className, render = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
	variant: "outline",
	size: "sm"
}), ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastAction$1, {
		"data-slot": "toast-action",
		render,
		className: cn("shrink-0", className),
		...props
	});
}
function ToastClose({ className, children, render = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
	variant: "ghost",
	size: "icon-sm"
}), ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastClose$1, {
		"data-slot": "toast-close",
		"aria-label": "Close toast",
		render,
		className: cn("relative shrink-0 text-gray-400 after:absolute after:-inset-2 after:content-[''] hover:text-gray-700 cursor-pointer", className),
		...props,
		children: children ?? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
			className: "w-4 h-4",
			"aria-hidden": "true"
		})
	});
}
function ToastIcon({ type }) {
	if (type === "success") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		"data-slot": "toast-icon",
		className: "shrink-0 text-emerald-600",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
			className: "w-5 h-5",
			"aria-hidden": "true"
		})
	});
	if (type === "info") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		"data-slot": "toast-icon",
		className: "shrink-0 text-blue-600",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
			className: "w-5 h-5",
			"aria-hidden": "true"
		})
	});
	if (type === "warning") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		"data-slot": "toast-icon",
		className: "shrink-0 text-amber-600",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
			className: "w-5 h-5",
			"aria-hidden": "true"
		})
	});
	if (type === "error") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		"data-slot": "toast-icon",
		className: "shrink-0 text-red-600",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OctagonAlert, {
			className: "w-5 h-5",
			"aria-hidden": "true"
		})
	});
	if (type === "loading") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		"data-slot": "toast-icon",
		className: "shrink-0 text-gray-700",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
			className: "w-5 h-5 animate-spin",
			"aria-hidden": "true"
		})
	});
	return null;
}
function ToastList() {
	const { toasts } = useToastManager();
	return toasts.map((toastItem) => {
		const progress = toastItem.data?.progress;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toast$1, {
			toast: toastItem,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ToastContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastIcon, { type: toastItem.type }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 flex-1 flex-col gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastTitle, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastDescription, {}),
						typeof progress === "number" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-full bg-gray-100 rounded-full h-1.5 mt-1.5 overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bg-black h-1.5 rounded-full transition-all duration-300",
								style: { width: `${Math.min(100, Math.max(0, progress))}%` }
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastAction, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastClose, {})
			] })
		}, toastItem.id);
	});
}
function Toaster({ children, toastManager = toast, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ToastProvider, {
		toastManager,
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastViewport, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastList, {}) }) })]
	});
}
function ScrollToTop() {
	const pathname = useRouterState({ select: (state) => state.location.pathname });
	const hash = useRouterState({ select: (state) => state.location.hash });
	(0, import_react.useEffect)(() => {
		if (!hash) {
			window.scrollTo({
				top: 0,
				behavior: "instant"
			});
			return;
		}
		const timeout = window.setTimeout(() => {
			document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
		}, 50);
		return () => window.clearTimeout(timeout);
	}, [pathname, hash]);
	return null;
}
function RootComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RootDocument, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollToTop, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-h-screen text-slate-900 bg-slate-50 font-sans relative w-full overflow-x-hidden antialiased",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
		})
	] }) });
}
function RootDocument({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "ar",
		dir: "rtl",
		className: "scroll-smooth",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "bg-slate-50 text-slate-900 antialiased",
			style: { fontFamily: "'Cairo', 'Amiri', sans-serif" },
			children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})]
		})]
	});
}
var Route$25 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1.0"
			},
			{ title: "بوابة المدرسة القرآنية - إدارة الطلاب والمعلمين والحلقات" },
			{
				name: "description",
				content: "نظام شامل لإدارة مدرسة تحفيظ القرآن الكريم وحلقات المسجد للطلاب والمعلمين ومتابعة حفظ السور والآيات والتقييمات الشهرية."
			},
			{
				property: "og:title",
				content: "بوابة المدرسة القرآنية - إدارة الطلاب والمعلمين والحلقات"
			},
			{
				property: "og:description",
				content: "نظام شامل لإدارة مدرسة تحفيظ القرآن الكريم وحلقات المسجد للطلاب والمعلمين ومتابعة حفظ السور والآيات والتقييمات الشهرية."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:title",
				content: "بوابة المدرسة القرآنية - إدارة الطلاب والمعلمين والحلقات"
			},
			{
				name: "twitter:description",
				content: "نظام شامل لإدارة مدرسة تحفيظ القرآن الكريم وحلقات المسجد للطلاب والمعلمين ومتابعة حفظ السور والآيات والتقييمات الشهرية."
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/x-icon",
				href: "/favicon.ico"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&family=Amiri:ital,wght@0,400;0,700;1,400&display=swap"
			}
		]
	}),
	component: RootComponent
});
var Route$24 = createFileRoute("/")({ beforeLoad: () => {
	throw redirect({ to: "/dashboard" });
} });
var $$splitComponentImporter$22 = () => import("./dashboard-BoKLBhZ7.mjs");
var Route$23 = createFileRoute("/dashboard")({ component: lazyRouteComponent($$splitComponentImporter$22, "component") });
var $$splitComponentImporter$21 = () => import("./login-CjSRxhea.mjs");
var Route$22 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$21, "component") });
var requestSchema = object({
	method: _enum([
		"GET",
		"POST",
		"PUT",
		"DELETE"
	]),
	path: string().startsWith("/api/"),
	query: record(string(), string()).optional(),
	body: any().optional()
});
var apiRequestFn = createServerFn({ method: "POST" }).validator(requestSchema).handler(createSsrRpc("34a078b9ab06754cb1314ccee2a0b7029ae93c7a80283a8624ba47ae43695a9c"));
function encodeBase64(bytes) {
	let binary = "";
	const chunkSize = 32768;
	for (let index = 0; index < bytes.length; index += chunkSize) binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
	return btoa(binary);
}
async function serializeBody(body) {
	if (!(body instanceof FormData)) return body;
	const values = {};
	for (const [key, value] of body.entries()) if (value instanceof Blob) values[key] = {
		name: value instanceof File ? value.name : "upload",
		type: value.type,
		base64: encodeBase64(new Uint8Array(await value.arrayBuffer()))
	};
	else values[key] = value;
	return values;
}
async function request(method, rawUrl, body, config = {}) {
	const url = new URL(rawUrl, typeof window === "undefined" ? "http://localhost" : window.location.origin);
	for (const [key, value] of Object.entries(config.params ?? {})) if (value !== void 0 && value !== null) url.searchParams.set(key, String(value));
	if (url.origin !== (typeof window === "undefined" ? "http://localhost" : window.location.origin)) {
		const response = await fetch(url, {
			method,
			headers: config.headers,
			body: body === void 0 ? void 0 : JSON.stringify(body)
		});
		const data = await response.json().catch(() => null);
		if (!response.ok) throw Object.assign(new Error(data?.error || response.statusText), { response: {
			data,
			status: response.status
		} });
		return {
			data,
			status: response.status
		};
	}
	const query = Object.fromEntries(url.searchParams.entries());
	const result = await apiRequestFn({ data: {
		method,
		path: url.pathname,
		query,
		body: await serializeBody(body)
	} });
	const response = {
		data: result.body,
		status: result.status,
		headers: result.headers
	};
	if (result.status >= 400) {
		const message = result.body?.error || `Request failed (${result.status})`;
		throw Object.assign(new Error(message), { response });
	}
	return response;
}
var api = {
	get: (url, config) => request("GET", url, void 0, config),
	post: (url, body, config) => request("POST", url, body, config),
	put: (url, body, config) => request("PUT", url, body, config),
	delete: (url, config) => request("DELETE", url, void 0, config)
};
var StudentCard = ({ student, onClick }) => {
	const targetJuz = student.targetJuz || 30;
	const memorized = student.memorizedJuzCount || 0;
	const progressPercent = Math.min(100, Math.round(memorized / targetJuz * 100));
	const getStatusLabel = (status) => {
		switch (status) {
			case "active": return "نشط";
			case "graduated": return "متخرج";
			case "paused": return "موقوف مؤقتاً";
			default: return status;
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		onClick,
		className: "bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group space-y-4 text-right",
		dir: "rtl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-0 space-y-1 text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-extrabold text-slate-900 text-base truncate group-hover:text-emerald-700 transition-colors",
								children: student.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${student.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"}`,
								children: getStatusLabel(student.status)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-slate-600 space-y-0.5 text-right",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-semibold text-slate-800",
									children: ["الجنس: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-normal",
										children: student.gender === "male" ? "طالب (ذكر)" : "طالبة (أنثى)"
									})]
								}),
								calculateAge(student.dateOfBirth || student.age) !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-semibold text-slate-800",
									children: ["العمر: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-normal",
										children: [calculateAge(student.dateOfBirth || student.age), " سنة"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[11px] text-slate-500 truncate",
									children: ["ولي الأمر: ", student.parentName || "غير متوفر"]
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: student.avatar,
						alt: student.name,
						referrerPolicy: "no-referrer",
						className: "w-20 sm:w-24 aspect-[3/4] rounded-2xl object-cover object-top shrink-0 bg-slate-100 ring-2 ring-emerald-600/20 shadow-xs",
						onError: (e) => {
							const target = e.target;
							if (!target.src.includes("dicebear")) target.src = `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(student.name)}`;
						}
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-semibold text-slate-700 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "w-3.5 h-3.5 text-emerald-600 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "مستوى تقدم الحفظ" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-bold text-slate-900 font-mono",
								children: [
									memorized,
									" / ",
									targetJuz,
									" جزء ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-emerald-700",
										children: [
											"(",
											progressPercent,
											"%)"
										]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-full h-2 bg-slate-200/80 rounded-full overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full bg-emerald-600 rounded-full transition-all duration-300",
								style: { width: `${Math.max(progressPercent, 4)}%` }
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between pt-1 text-[11px] text-slate-600",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["الحفظ الحالي: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: ["سورة ", student.currentSurahName || "الفاتحة"] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-800",
								children: ["آية ", student.currentAyah || 1]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-slate-700",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-slate-400 text-[11px] flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3.5 h-3.5 text-emerald-600" }), "الحلقة:"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-slate-900 truncate max-w-[180px]",
							children: student.group ? `حلقة رقم ${student.group.number} (${student.group.type})` : "لم يتم التعيين لحلقة"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-slate-700",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-slate-400 text-[11px] flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-3.5 h-3.5 text-emerald-600" }), "الهاتف:"]
						}), student.parentPhone ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: `tel:${student.parentPhone}`,
							onClick: (e) => e.stopPropagation(),
							className: "font-mono text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200/60 transition-colors flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-3 h-3 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: student.parentPhone })]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-slate-400 text-[11px] italic",
							children: "غير متوفر"
						})]
					})]
				})
			]
		})
	});
};
/** Public image paths used as visual placeholders. Record data belongs in the database. */
var PLACEHOLDER_IMAGES = {
	dashboardStudents: "/images/students_faceless_1790530817292.jpg",
	dashboardTeachers: "/images/teachers_faceless_1790530831937.jpg",
	dashboardGroups: "/images/halaqat_faceless_1790530844707.jpg",
	mosqueHero: "/images/hero_mosque_illustration_1790525295748.jpg",
	scholarAvatar: "/images/scholar_imam_avatar_1_1790525305502.jpg",
	wallpaper: "/images/islamic_wallpaper_mosque_1790525336507.jpg"
};
var Route$21 = createFileRoute("/dashboard/")({ component: DashboardIndexPage });
function DashboardIndexPage() {
	const navigate = useNavigate();
	const { user } = useAuth();
	const [students, setStudents] = (0, import_react.useState)([]);
	const [teachers, setTeachers] = (0, import_react.useState)([]);
	const [groups, setGroups] = (0, import_react.useState)([]);
	const [ratings, setRatings] = (0, import_react.useState)([]);
	const [counts, setCounts] = (0, import_react.useState)({
		students: 0,
		teachers: 0,
		groups: 0
	});
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		async function loadData() {
			try {
				setIsLoading(true);
				const countsRes = await api.get("/api/stats/counts").catch(() => null);
				if (countsRes?.data?.counts) setCounts({
					students: countsRes.data.counts.students || 0,
					teachers: countsRes.data.counts.teachers || 0,
					groups: countsRes.data.counts.groups || 0
				});
				const results = await Promise.allSettled([
					api.get("/api/students"),
					api.get("/api/teachers"),
					api.get("/api/groups"),
					api.get("/api/ratings")
				]);
				let studentList = [];
				let teacherList = [];
				let groupList = [];
				let ratingList = [];
				if (results[0].status === "fulfilled" && results[0].value.data?.students) studentList = results[0].value.data.students;
				if (results[1].status === "fulfilled" && results[1].value.data?.teachers) teacherList = results[1].value.data.teachers;
				if (results[2].status === "fulfilled" && results[2].value.data?.groups) groupList = results[2].value.data.groups;
				if (results[3].status === "fulfilled" && results[3].value.data?.ratings) ratingList = results[3].value.data.ratings;
				setStudents(studentList);
				setTeachers(teacherList);
				setGroups(groupList);
				setRatings(ratingList);
				if (studentList.length || teacherList.length || groupList.length) setCounts({
					students: studentList.length,
					teachers: teacherList.length,
					groups: groupList.length
				});
			} catch (err) {
				console.warn("Dashboard data fetch warning:", err?.message || err);
			} finally {
				setIsLoading(false);
			}
		}
		loadData();
	}, [user]);
	const menuOptions = [
		{
			to: "/dashboard/students",
			label: "الطلاب",
			image: PLACEHOLDER_IMAGES.dashboardStudents,
			alt: "دليل الطلاب",
			countLabel: `${counts.students || students.length} طالباً مسجلاً`
		},
		{
			to: "/dashboard/teachers",
			label: "المعلمون والمشايخ",
			image: PLACEHOLDER_IMAGES.dashboardTeachers,
			alt: "المعلمون والتحفيظ",
			countLabel: `${counts.teachers || teachers.length} معلماً ومحفظاً`
		},
		{
			to: "/dashboard/groups",
			label: "الحلقات الدراسية",
			image: PLACEHOLDER_IMAGES.dashboardGroups,
			alt: "حلقات تحفيظ القرآن",
			countLabel: `${counts.groups || groups.length} حلقة حفظ`
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8 pb-16 text-right",
		dir: "rtl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-7 border border-emerald-700/80 shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 text-[11px] font-semibold border border-emerald-700",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-3 h-3 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "نظام إدارة حلقات تحفيظ القرآن الكريم والمسجد" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-xl sm:text-2xl font-extrabold tracking-tight",
							children: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-emerald-100 font-medium",
							children: "مرحباً بكم في البوابة القرآنية للمدرسة. اختر أحد الأقسام أدناه لإدارة مركز تحفيظ القرآن الكريم."
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6",
					children: menuOptions.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.to,
						className: "flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl hover:bg-slate-50 transition-all group text-center cursor-pointer",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden p-1 flex items-center justify-center transition-transform duration-200 group-hover:scale-105 shrink-0 bg-slate-50 border border-slate-100",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: item.image,
									alt: item.alt,
									referrerPolicy: "no-referrer",
									className: "w-full h-full object-cover rounded-xl shadow-2xs"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-3 text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors block",
								children: item.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-slate-400 font-semibold mt-0.5 block",
								children: item.countLabel
							})
						]
					}, item.to))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between pb-2 border-b border-slate-100",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-sm font-bold text-slate-900 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-4 h-4 text-emerald-600" }), "الحلقات النشطة وأوقات الحفظ"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/dashboard/groups",
							className: "text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "عرض الكل" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3.5 h-3.5 rtl:rotate-180" })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "divide-y divide-slate-100",
						children: groups.slice(0, 4).map((group, idx) => {
							const groupType = `حلقة رقم ${group.number} (${group.type})`;
							const typeSlug = encodeURIComponent(group.typeSlug || "general");
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: `/dashboard/groups/$groupType/$groupNumber`,
								params: {
									groupType: typeSlug,
									groupNumber: String(group.number)
								},
								className: "py-3 flex items-center justify-between hover:text-emerald-700 transition-colors group block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 pr-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-700 block truncate",
										children: groupType
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-slate-500 block truncate",
										children: group.studyTime
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md shrink-0",
									children: [group.studentsCount || 0, " طالباً"]
								})]
							}, group.id || `grp-${idx}`);
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4 lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between pb-2 border-b border-slate-100",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-base font-extrabold text-slate-900 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "w-4 h-4 text-amber-500 fill-amber-400" }), "مستويات ومعدل تقدم حفظ الطلاب"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/dashboard/students",
							className: "text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"عرض جميع الطلاب (",
								students.length,
								")"
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3.5 h-3.5 rtl:rotate-180" })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5",
						children: students.slice().sort((a, b) => (b.memorizedJuzCount || 0) - (a.memorizedJuzCount || 0)).slice(0, 3).map((student, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentCard, {
							student,
							onClick: () => navigate({
								to: "/dashboard/students/$id",
								params: { id: student.id }
							})
						}, student.id || `std-${idx}`))
					})]
				})]
			})
		]
	});
}
var $$splitComponentImporter$20 = () => import("./attendance-Bx1YxP-a.mjs");
var Route$20 = createFileRoute("/dashboard/attendance")({ component: lazyRouteComponent($$splitComponentImporter$20, "component") });
var $$splitComponentImporter$19 = () => import("./parents-B5x1toAG.mjs");
var Route$19 = createFileRoute("/dashboard/parents")({ component: lazyRouteComponent($$splitComponentImporter$19, "component") });
var $$splitComponentImporter$18 = () => import("./groups-DMxfgux3.mjs");
var Route$18 = createFileRoute("/dashboard/groups/")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
var $$splitComponentImporter$17 = () => import("./new-C82F5xjG.mjs");
var Route$17 = createFileRoute("/dashboard/groups/new")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
var $$splitComponentImporter$16 = () => import("./ratings-BiHgE3Py.mjs");
var Route$16 = createFileRoute("/dashboard/ratings/")({ component: lazyRouteComponent($$splitComponentImporter$16, "component") });
var $$splitComponentImporter$15 = () => import("./new-D1HsV0WM.mjs");
object({ studentId: string().optional() });
var Route$15 = createFileRoute("/dashboard/ratings/new")({
	validateSearch: (search) => {
		return { studentId: typeof search.studentId === "string" ? search.studentId : void 0 };
	},
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./sessions-b4TUBklX.mjs");
var Route$14 = createFileRoute("/dashboard/sessions/")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("./students-r7lG0G8k.mjs");
var Route$13 = createFileRoute("/dashboard/students/")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./new-BTfjS3hf.mjs");
var Route$12 = createFileRoute("/dashboard/students/new")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./teachers-CROpP3kb.mjs");
var Route$11 = createFileRoute("/dashboard/teachers/")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./new-ClXEOvVW.mjs");
var Route$10 = createFileRoute("/dashboard/teachers/new")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("../_groupType-WffwUuK7.mjs");
var Route$9 = createFileRoute("/dashboard/groups/$groupType/")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./edit-C_cCtULO.mjs");
var Route$8 = createFileRoute("/dashboard/groups/$groupType/edit")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./new-DWHpQfVy.mjs");
var Route$7 = createFileRoute("/dashboard/groups/$groupType/new")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("../_sessionId-BWpqQwH3.mjs");
var Route$6 = createFileRoute("/dashboard/sessions/$sessionId/")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("../_id-BA6r2ut8.mjs");
var Route$5 = createFileRoute("/dashboard/students/$id/")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./edit-BnzQMsmU.mjs");
var Route$4 = createFileRoute("/dashboard/students/$id/edit")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("../_id-CrJ5fzLl.mjs");
var Route$3 = createFileRoute("/dashboard/teachers/$id/")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./edit-CICxD7DL.mjs");
var Route$2 = createFileRoute("/dashboard/teachers/$id/edit")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("../_groupNumber-BicEDAyZ.mjs");
var Route$1 = createFileRoute("/dashboard/groups/$groupType/$groupNumber/")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./edit-SlrX96Ln.mjs");
var Route = createFileRoute("/dashboard/groups/$groupType/$groupNumber/edit")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var IndexRoute = Route$24.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$25
});
var DashboardRoute = Route$23.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => Route$25
});
var LoginRoute = Route$22.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$25
});
var DashboardIndexRoute = Route$21.update({
	id: "/",
	path: "/",
	getParentRoute: () => DashboardRoute
});
var DashboardAttendanceRoute = Route$20.update({
	id: "/attendance",
	path: "/attendance",
	getParentRoute: () => DashboardRoute
});
var DashboardParentsRoute = Route$19.update({
	id: "/parents",
	path: "/parents",
	getParentRoute: () => DashboardRoute
});
var DashboardGroupsIndexRoute = Route$18.update({
	id: "/groups/",
	path: "/groups/",
	getParentRoute: () => DashboardRoute
});
var DashboardGroupsNewRoute = Route$17.update({
	id: "/groups/new",
	path: "/groups/new",
	getParentRoute: () => DashboardRoute
});
var DashboardRatingsIndexRoute = Route$16.update({
	id: "/ratings/",
	path: "/ratings/",
	getParentRoute: () => DashboardRoute
});
var DashboardRatingsNewRoute = Route$15.update({
	id: "/ratings/new",
	path: "/ratings/new",
	getParentRoute: () => DashboardRoute
});
var DashboardSessionsIndexRoute = Route$14.update({
	id: "/sessions/",
	path: "/sessions/",
	getParentRoute: () => DashboardRoute
});
var DashboardStudentsIndexRoute = Route$13.update({
	id: "/students/",
	path: "/students/",
	getParentRoute: () => DashboardRoute
});
var DashboardStudentsNewRoute = Route$12.update({
	id: "/students/new",
	path: "/students/new",
	getParentRoute: () => DashboardRoute
});
var DashboardTeachersIndexRoute = Route$11.update({
	id: "/teachers/",
	path: "/teachers/",
	getParentRoute: () => DashboardRoute
});
var DashboardTeachersNewRoute = Route$10.update({
	id: "/teachers/new",
	path: "/teachers/new",
	getParentRoute: () => DashboardRoute
});
var DashboardGroupsGroupTypeIndexRoute = Route$9.update({
	id: "/groups/$groupType/",
	path: "/groups/$groupType/",
	getParentRoute: () => DashboardRoute
});
var DashboardGroupsGroupTypeEditRoute = Route$8.update({
	id: "/groups/$groupType/edit",
	path: "/groups/$groupType/edit",
	getParentRoute: () => DashboardRoute
});
var DashboardGroupsGroupTypeNewRoute = Route$7.update({
	id: "/groups/$groupType/new",
	path: "/groups/$groupType/new",
	getParentRoute: () => DashboardRoute
});
var DashboardSessionsSessionIdIndexRoute = Route$6.update({
	id: "/sessions/$sessionId/",
	path: "/sessions/$sessionId/",
	getParentRoute: () => DashboardRoute
});
var DashboardStudentsIdIndexRoute = Route$5.update({
	id: "/students/$id/",
	path: "/students/$id/",
	getParentRoute: () => DashboardRoute
});
var DashboardStudentsIdEditRoute = Route$4.update({
	id: "/students/$id/edit",
	path: "/students/$id/edit",
	getParentRoute: () => DashboardRoute
});
var DashboardTeachersIdIndexRoute = Route$3.update({
	id: "/teachers/$id/",
	path: "/teachers/$id/",
	getParentRoute: () => DashboardRoute
});
var DashboardTeachersIdEditRoute = Route$2.update({
	id: "/teachers/$id/edit",
	path: "/teachers/$id/edit",
	getParentRoute: () => DashboardRoute
});
var DashboardGroupsGroupTypeGroupNumberIndexRoute = Route$1.update({
	id: "/groups/$groupType/$groupNumber/",
	path: "/groups/$groupType/$groupNumber/",
	getParentRoute: () => DashboardRoute
});
var DashboardRouteChildren = {
	DashboardAttendanceRoute,
	DashboardParentsRoute,
	DashboardIndexRoute,
	DashboardGroupsNewRoute,
	DashboardRatingsNewRoute,
	DashboardStudentsNewRoute,
	DashboardTeachersNewRoute,
	DashboardGroupsIndexRoute,
	DashboardRatingsIndexRoute,
	DashboardSessionsIndexRoute,
	DashboardStudentsIndexRoute,
	DashboardTeachersIndexRoute,
	DashboardGroupsGroupTypeEditRoute,
	DashboardGroupsGroupTypeNewRoute,
	DashboardStudentsIdEditRoute,
	DashboardTeachersIdEditRoute,
	DashboardGroupsGroupTypeIndexRoute,
	DashboardSessionsSessionIdIndexRoute,
	DashboardStudentsIdIndexRoute,
	DashboardTeachersIdIndexRoute,
	DashboardGroupsGroupTypeGroupNumberEditRoute: Route.update({
		id: "/groups/$groupType/$groupNumber/edit",
		path: "/groups/$groupType/$groupNumber/edit",
		getParentRoute: () => DashboardRoute
	}),
	DashboardGroupsGroupTypeGroupNumberIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	DashboardRoute: DashboardRoute._addFileChildren(DashboardRouteChildren),
	LoginRoute
};
var routeTree = Route$25._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		scrollRestoration: true
	});
}
//#endregion
export { useAuth as a, Button$1 as i, StudentCard as n, api as r, router_exports as t };
