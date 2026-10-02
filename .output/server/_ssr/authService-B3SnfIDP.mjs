import { i as eq } from "../_libs/drizzle-orm.mjs";
import { a as ensureDatabaseInitialized, h as users, i as db, l as parents, m as teachers, p as students, t as __exportAll } from "./init-DEOmme2k.mjs";
import { t as bcryptjs_default } from "../_libs/bcryptjs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/authService-B3SnfIDP.js
var authService_exports = /* @__PURE__ */ __exportAll({
	authenticateUser: () => authenticateUser,
	getFullUserProfile: () => getFullUserProfile,
	hashPassword: () => hashPassword
});
function isUserRole(role) {
	return role === "admin" || role === "teacher" || role === "parent";
}
async function getFullUserProfile(userId) {
	await ensureDatabaseInitialized();
	const user = await db.select().from(users).where(eq(users.id, userId)).then((rows) => rows[0]);
	if (!user) return null;
	if (!isUserRole(user.role)) return null;
	let teacherProfile = null;
	let parentProfile = null;
	let children = [];
	let role = user.role;
	if (user.role === "admin" || user.role === "teacher") {
		teacherProfile = await db.select().from(teachers).where(eq(teachers.userId, user.id)).then((rows) => rows[0]);
		if (teacherProfile?.isAdmin) role = "admin";
	}
	if (user.role === "parent") {
		parentProfile = await db.select().from(parents).where(eq(parents.userId, user.id)).then((rows) => rows[0]);
		if (parentProfile) children = await db.select().from(students).where(eq(students.parentId, parentProfile.id));
	}
	return {
		id: user.id,
		name: user.name,
		email: user.email,
		role,
		avatar: user.avatar || `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(user.name)}`,
		teacherProfile,
		parentProfile,
		children
	};
}
async function authenticateUser(email, password) {
	await ensureDatabaseInitialized();
	const user = await db.select().from(users).where(eq(users.email, email.trim().toLowerCase())).then((rows) => rows[0]);
	if (!user) return null;
	const isHash = !!user.password?.startsWith("$2");
	const valid = isHash ? await bcryptjs_default.compare(password, user.password) : password === user.password;
	if (valid && !isHash) await db.update(users).set({ password: await hashPassword(password) }).where(eq(users.id, user.id));
	return valid ? user : null;
}
function hashPassword(password) {
	return bcryptjs_default.hash(password, 12);
}
//#endregion
export { hashPassword as n, authService_exports as t };
