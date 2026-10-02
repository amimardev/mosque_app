import { o as __toESM } from "../_runtime.mjs";
import { at as require_react, it as require_jsx_runtime } from "../_libs/@base-ui/react+[...].mjs";
import { G as CircleCheck, j as LoaderCircle, r as User, s as Upload } from "../_libs/lucide-react.mjs";
import { r as api } from "./router-DHZqPWB-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AvatarPicker-B0TjrBex.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AvatarPicker = ({ id = "new", type = "student", value, onChange }) => {
	const [isUploading, setIsUploading] = (0, import_react.useState)(false);
	const [uploadMessage, setUploadMessage] = (0, import_react.useState)("");
	const [localPreview, setLocalPreview] = (0, import_react.useState)(null);
	const storageKey = `${type}-${id}`;
	(0, import_react.useEffect)(() => {
		return () => {
			if (localPreview && localPreview.startsWith("blob:")) URL.revokeObjectURL(localPreview);
		};
	}, [localPreview]);
	const handleFileChange = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const objectUrl = URL.createObjectURL(file);
		setLocalPreview(objectUrl);
		setUploadMessage("جاري رفع الصورة وتثبيتها...");
		try {
			setIsUploading(true);
			const formData = new FormData();
			formData.append("key", storageKey);
			formData.append("file", file);
			const timestampedUrl = (await api.post("/api/storage/upload", formData, { headers: { "Content-Type": "multipart/form-data" } })).data.url;
			if (onChange) onChange(timestampedUrl);
			setUploadMessage("تم رفع وتثبيت الصورة بنجاح");
		} catch (err) {
			console.error("Failed to upload profile image:", err);
			setUploadMessage("فشل رفع الصورة، يرجى المحاولة مرة أخرى");
		} finally {
			setIsUploading(false);
		}
	};
	const fallbackAvatar = `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(storageKey)}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-right",
		dir: "rtl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "text-xs font-bold text-slate-800 flex items-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "w-4 h-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"الصورة الشخصية (",
					type === "student" ? "الطالب" : "المعلم",
					")"
				] })]
			}), isUploading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-[11px] text-emerald-700 flex items-center gap-1 font-semibold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }), "جاري الرفع..."]
			}) : uploadMessage ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-[11px] font-bold text-emerald-700 flex items-center gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3.5 h-3.5 text-emerald-600" }), uploadMessage]
			}) : null]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-200 ring-2 ring-emerald-500/40 shrink-0 shadow-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: localPreview || value || fallbackAvatar,
					alt: "معاينة الصورة",
					className: "w-full h-full object-cover",
					onError: (e) => {
						e.target.src = fallbackAvatar;
					}
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "w-3.5 h-3.5" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isUploading ? "جاري الرفع..." : "اختيار صورة من الجهاز" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "file",
								accept: "image/*",
								onChange: handleFileChange,
								disabled: isUploading,
								className: "hidden"
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[11px] text-slate-500",
					children: ["تظهر المعاينة فوراً وتُحفظ الصورة مباشرة في ملف ", type === "student" ? "الطالب" : "المعلم"]
				})]
			})]
		})]
	});
};
//#endregion
export { AvatarPicker as t };
