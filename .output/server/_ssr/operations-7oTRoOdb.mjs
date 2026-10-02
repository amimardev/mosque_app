import { i as eq, n as desc, o as inArray, r as and, s as or } from "../_libs/drizzle-orm.mjs";
import { a as ensureDatabaseInitialized, c as groups, d as sessions, f as studentRatings, h as users, i as db, l as parents, m as teachers, n as attendances, o as groupTeachers, p as students, s as groupTypes, u as sessionStudentRecords } from "./init-DEOmme2k.mjs";
import { t as calculateAge } from "./ageUtils-DAte9AqJ.mjs";
import { n as getSurahByNumber, t as QURAN_SURAHS } from "./quranData-CM-Mrj3O.mjs";
import { n as OperationRegistry } from "./api-CjBBtC3c.mjs";
import { n as hashPassword } from "./authService-B3SnfIDP.mjs";
import { t as getSessionId } from "./session-CW2Txe2V.mjs";
import { storageRouter } from "./storage-B1BjdWQX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/operations-7oTRoOdb.js
var studentsRouter = new OperationRegistry();
studentsRouter.get("/", async (c) => {
	await ensureDatabaseInitialized();
	const q = c.req.query("q")?.trim() || "";
	const groupId = c.req.query("groupId")?.trim() || "";
	let allStudents = await db.select().from(students);
	const allGroups = await db.select().from(groups);
	const allGroupTypes = await db.select().from(groupTypes);
	const allRatings = await db.select().from(studentRatings).orderBy(desc(studentRatings.createdAt));
	const allParents = await db.select().from(parents);
	const groupMap = new Map(allGroups.map((g) => [g.id, g]));
	const typeMap = new Map(allGroupTypes.map((gt) => [gt.id, gt]));
	const parentMap = new Map(allParents.map((p) => [p.id, p]));
	let result = allStudents.map((student) => {
		const studentGroup = (student.groupId ? student.groupId.split(",").map((id) => id.trim()).filter(Boolean) : []).map((gid) => groupMap.get(gid)).filter(Boolean)[0] || null;
		const matchedType = studentGroup ? typeMap.get(studentGroup.typeId) : null;
		const latestRating = allRatings.find((r) => r.studentId === student.id) || null;
		const surahData = getSurahByNumber(student.currentSurahNumber);
		const parentObj = student.parentId ? parentMap.get(student.parentId) : null;
		const avatar = student.avatar || `/api/storage/student-${student.id}`;
		const birthDate = student.dateOfBirth || (typeof student.age === "string" && student.age.includes("-") ? student.age : null);
		const computedAge = calculateAge(birthDate || student.age);
		return {
			...student,
			age: computedAge,
			calculatedAge: computedAge,
			dateOfBirth: birthDate || student.dateOfBirth,
			avatar,
			parentName: parentObj?.name || null,
			parentPhone: parentObj?.phone || null,
			parent: parentObj || null,
			group: studentGroup ? {
				id: studentGroup.id,
				number: studentGroup.number,
				typeId: studentGroup.typeId,
				type: matchedType?.name || "حلقة قرآنية",
				typeSlug: matchedType?.slug || "general",
				studyTime: studentGroup.studyTime,
				room: studentGroup.room,
				level: studentGroup.level
			} : null,
			latestRating: latestRating ? {
				id: latestRating.id,
				month: latestRating.month,
				overallScore: latestRating.overallScore,
				grade: latestRating.grade,
				hifzScore: latestRating.hifzScore,
				tajweedScore: latestRating.tajweedScore,
				murajaahScore: latestRating.murajaahScore,
				attendanceScore: latestRating.attendanceScore,
				behaviorScore: latestRating.behaviorScore,
				surahEvaluated: latestRating.surahEvaluated,
				notes: latestRating.notes
			} : null,
			surahDetails: surahData || null
		};
	});
	if (q) {
		const lower = q.toLowerCase();
		result = result.filter((s) => s.name.toLowerCase().includes(lower) || s.parentName && s.parentName.toLowerCase().includes(lower) || s.parentPhone && s.parentPhone.toLowerCase().includes(lower) || s.currentSurahName && s.currentSurahName.toLowerCase().includes(lower));
	}
	if (groupId && groupId !== "all") result = result.filter((s) => s.groupId && s.groupId.split(",").map((id) => id.trim()).includes(groupId));
	result.sort((a, b) => a.name.localeCompare(b.name));
	return c.json({ students: result });
});
studentsRouter.get("/:id", async (c) => {
	await ensureDatabaseInitialized();
	const id = c.req.param("id");
	const student = await db.select().from(students).where(eq(students.id, id)).then((r) => r[0]);
	if (!student) return c.json({ error: "Student not found" }, 404);
	let group = null;
	let groupTeachersList = [];
	const assignedGroupIds = student.groupId ? student.groupId.split(",").map((item) => item.trim()).filter(Boolean) : [];
	if (assignedGroupIds.length > 0) {
		const firstGroupId = assignedGroupIds[0];
		group = await db.select().from(groups).where(eq(groups.id, firstGroupId)).then((r) => r[0]);
		if (group) {
			const gTeachers = await db.select().from(groupTeachers).where(eq(groupTeachers.groupId, group.id));
			const allTeachers = await db.select().from(teachers);
			const matchedType = (await db.select().from(groupTypes)).find((gt) => gt.id === group.typeId) || null;
			groupTeachersList = gTeachers.map((gt) => {
				const t = allTeachers.find((item) => item.id === gt.teacherId);
				return t ? {
					...t,
					avatar: `/api/storage/teacher-${t.id}`,
					role: gt.role
				} : null;
			}).filter(Boolean);
			group = {
				...group,
				type: matchedType?.name || "حلقة قرآنية",
				typeSlug: matchedType?.slug || "general",
				groupType: matchedType,
				teachers: groupTeachersList
			};
		}
	}
	const ratings = await db.select().from(studentRatings).where(eq(studentRatings.studentId, id)).orderBy(desc(studentRatings.createdAt));
	const studentSessions = await db.select({
		id: sessions.id,
		date: sessions.date,
		sessionType: sessions.sessionType,
		sessionTimeText: sessions.sessionTimeText,
		attendanceStatus: sessionStudentRecords.attendanceStatus,
		surahName: sessionStudentRecords.surahName,
		ayahStart: sessionStudentRecords.ayahStart,
		ayahEnd: sessionStudentRecords.ayahEnd,
		teacherRemarque: sessionStudentRecords.teacherRemarque,
		teacherName: teachers.name
	}).from(sessionStudentRecords).innerJoin(sessions, eq(sessionStudentRecords.sessionId, sessions.id)).leftJoin(teachers, eq(sessions.teacherId, teachers.id)).where(eq(sessionStudentRecords.studentId, id)).orderBy(desc(sessions.date));
	const surahData = getSurahByNumber(student.currentSurahNumber);
	let parentObj = student.parentId ? await db.select().from(parents).where(eq(parents.id, student.parentId)).then((r) => r[0]) : null;
	const avatar = student.avatar || `/api/storage/student-${student.id}`;
	const birthDate = student.dateOfBirth || (typeof student.age === "string" && student.age.includes("-") ? student.age : null);
	const computedAge = calculateAge(birthDate || student.age);
	return c.json({ student: {
		...student,
		age: computedAge,
		calculatedAge: computedAge,
		dateOfBirth: birthDate || student.dateOfBirth,
		avatar,
		parentName: parentObj?.name || null,
		parentPhone: parentObj?.phone || null,
		parent: parentObj || null,
		group: group || null,
		ratings,
		sessions: studentSessions,
		surahDetails: surahData || null
	} });
});
studentsRouter.post("/", async (c) => {
	await ensureDatabaseInitialized();
	try {
		const body = await c.req.json();
		const id = body.id || `std_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
		const avatar = body.avatar || `/api/storage/student-${id}`;
		let surahNumber = parseInt(body.currentSurahNumber, 10) || 1;
		let surahName = body.currentSurahName || "Al-Fatihah";
		const matchedSurah = getSurahByNumber(surahNumber);
		if (matchedSurah) surahName = matchedSurah.nameEnglish;
		const studentGender = body.gender || "male";
		const parentId = body.parentId || null;
		if (body.groupId) {
			const assignedGroupIds = body.groupId.split(",").map((id) => id.trim()).filter(Boolean);
			if (assignedGroupIds.length > 0) {
				const fetchedGroups = await db.select().from(groups);
				for (const gid of assignedGroupIds) {
					const grp = fetchedGroups.find((g) => g.id === gid);
					if (grp && grp.gender !== studentGender) return c.json({ error: `عذراً، لا يمكن تسجيل الطالب في حلقة غير متوافقة مع جنسه. الحلقة رقم ${grp.number} مخصصة لـ ${grp.gender === "male" ? "الذكور" : "الإناث"}.` }, 400);
				}
			}
		}
		const birthDate = body.dateOfBirth || (typeof body.age === "string" && body.age.includes("-") ? body.age : null);
		const newStudent = {
			id,
			name: body.name?.trim(),
			avatar,
			gender: body.gender || "male",
			dateOfBirth: birthDate,
			age: birthDate || (body.age ? String(body.age) : null),
			parentId,
			email: body.email?.trim() || null,
			groupId: body.groupId || null,
			currentSurahNumber: surahNumber,
			currentSurahName: surahName,
			currentAyah: parseInt(body.currentAyah, 10) || 1,
			targetJuz: parseInt(body.targetJuz, 10) || 30,
			memorizedJuzCount: parseInt(body.memorizedJuzCount, 10) || 1,
			status: body.status || "active",
			enrollmentDate: body.enrollmentDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
			notes: body.notes || null,
			createdAt: /* @__PURE__ */ new Date(),
			updatedAt: /* @__PURE__ */ new Date()
		};
		if (!newStudent.name) return c.json({ error: "Student full name is required" }, 400);
		await db.insert(students).values(newStudent);
		const parentObj = newStudent.parentId ? await db.select().from(parents).where(eq(parents.id, newStudent.parentId)).then((r) => r[0]) : null;
		const computedAge = calculateAge(newStudent.dateOfBirth || newStudent.age);
		return c.json({
			success: true,
			student: {
				...newStudent,
				parentName: parentObj?.name || null,
				parentPhone: parentObj?.phone || null,
				parent: parentObj || null,
				age: computedAge,
				calculatedAge: computedAge
			}
		}, 201);
	} catch (err) {
		console.error("Error adding student:", err);
		return c.json({ error: err.message || "Failed to create student" }, 500);
	}
});
studentsRouter.put("/:id", async (c) => {
	await ensureDatabaseInitialized();
	const id = c.req.param("id");
	try {
		const body = await c.req.json();
		const existing = await db.select().from(students).where(eq(students.id, id)).then((r) => r[0]);
		if (!existing) return c.json({ error: "Student not found" }, 404);
		let surahNumber = body.currentSurahNumber !== void 0 ? parseInt(body.currentSurahNumber, 10) : existing.currentSurahNumber;
		let surahName = body.currentSurahName || existing.currentSurahName;
		if (body.currentSurahNumber !== void 0) {
			const matched = getSurahByNumber(surahNumber);
			if (matched) surahName = matched.nameEnglish;
		}
		const avatar = body.avatar || existing.avatar || `/api/storage/student-${id}`;
		const targetGender = body.gender ?? existing.gender;
		const targetGroupId = body.groupId !== void 0 ? body.groupId === "" ? null : body.groupId : existing.groupId;
		if (targetGroupId) {
			const assignedGroupIds = targetGroupId.split(",").map((id) => id.trim()).filter(Boolean);
			if (assignedGroupIds.length > 0) {
				const fetchedGroups = await db.select().from(groups);
				for (const gid of assignedGroupIds) {
					const grp = fetchedGroups.find((g) => g.id === gid);
					if (grp && grp.gender !== targetGender) return c.json({ error: `عذراً، لا يمكن تسجيل الطالب في حلقة غير متوافقة مع جنسه. الحلقة رقم ${grp.number} مخصصة لـ ${grp.gender === "male" ? "الذكور" : "الإناث"}.` }, 400);
				}
			}
		}
		const targetParentId = body.parentId !== void 0 ? body.parentId || null : existing.parentId;
		const birthDate = body.dateOfBirth !== void 0 ? body.dateOfBirth : typeof body.age === "string" && body.age.includes("-") ? body.age : existing.dateOfBirth;
		const updatedData = {
			name: body.name?.trim() ?? existing.name,
			avatar,
			gender: targetGender,
			dateOfBirth: birthDate,
			age: birthDate ?? (body.age !== void 0 ? String(body.age) : existing.age),
			parentId: targetParentId,
			email: body.email !== void 0 ? body.email?.trim() : existing.email,
			groupId: targetGroupId,
			currentSurahNumber: surahNumber,
			currentSurahName: surahName,
			currentAyah: body.currentAyah !== void 0 ? parseInt(body.currentAyah, 10) : existing.currentAyah,
			targetJuz: body.targetJuz !== void 0 ? parseInt(body.targetJuz, 10) : existing.targetJuz,
			memorizedJuzCount: body.memorizedJuzCount !== void 0 ? parseInt(body.memorizedJuzCount, 10) : existing.memorizedJuzCount,
			status: body.status ?? existing.status,
			enrollmentDate: body.enrollmentDate ?? existing.enrollmentDate,
			notes: body.notes !== void 0 ? body.notes : existing.notes,
			updatedAt: /* @__PURE__ */ new Date()
		};
		await db.update(students).set(updatedData).where(eq(students.id, id));
		const parentObj = updatedData.parentId ? await db.select().from(parents).where(eq(parents.id, updatedData.parentId)).then((r) => r[0]) : null;
		const computedAge = calculateAge(updatedData.dateOfBirth || updatedData.age);
		return c.json({
			success: true,
			student: {
				...existing,
				...updatedData,
				parentName: parentObj?.name || null,
				parentPhone: parentObj?.phone || null,
				parent: parentObj || null,
				age: computedAge,
				calculatedAge: computedAge
			}
		});
	} catch (err) {
		console.error("Error updating student:", err);
		return c.json({ error: err.message || "Failed to update student" }, 500);
	}
});
studentsRouter.delete("/:id", async (c) => {
	await ensureDatabaseInitialized();
	const id = c.req.param("id");
	try {
		await db.delete(students).where(eq(students.id, id));
		return c.json({
			success: true,
			message: "Student deleted successfully"
		});
	} catch (err) {
		return c.json({ error: err.message || "Failed to delete student" }, 500);
	}
});
studentsRouter.get("/:id/history", async (c) => {
	await ensureDatabaseInitialized();
	const studentId = c.req.param("id");
	try {
		const student = await db.select().from(students).where(eq(students.id, studentId)).then((r) => r[0]);
		if (!student) return c.json({ error: "الطالب غير موجود" }, 404);
		const sessionRecords = await db.select({
			id: sessionStudentRecords.id,
			sessionId: sessionStudentRecords.sessionId,
			attendanceStatus: sessionStudentRecords.attendanceStatus,
			absenceReason: sessionStudentRecords.absenceReason,
			surahNumber: sessionStudentRecords.surahNumber,
			surahName: sessionStudentRecords.surahName,
			ayahStart: sessionStudentRecords.ayahStart,
			ayahEnd: sessionStudentRecords.ayahEnd,
			teacherRemarque: sessionStudentRecords.teacherRemarque,
			isAssessed: sessionStudentRecords.isAssessed,
			date: sessions.date,
			sessionTimeText: sessions.sessionTimeText,
			sessionType: sessions.sessionType
		}).from(sessionStudentRecords).innerJoin(sessions, eq(sessionStudentRecords.sessionId, sessions.id)).where(eq(sessionStudentRecords.studentId, studentId)).orderBy(desc(sessions.date));
		const attendanceRecords = await db.select().from(attendances).where(eq(attendances.studentId, studentId)).orderBy(desc(attendances.date));
		const lastPresentSession = sessionRecords.find((r) => (r.attendanceStatus === "present" || r.attendanceStatus === "late") && r.surahName);
		const lastProgress = lastPresentSession ? {
			surahName: lastPresentSession.surahName,
			surahNumber: lastPresentSession.surahNumber,
			latestVerse: lastPresentSession.ayahEnd || lastPresentSession.ayahStart || 1,
			ayahStart: lastPresentSession.ayahStart,
			ayahEnd: lastPresentSession.ayahEnd,
			date: lastPresentSession.date,
			teacherRemarque: lastPresentSession.teacherRemarque || null
		} : {
			surahName: student.currentSurahName || "الفاتحة",
			surahNumber: student.currentSurahNumber || 1,
			latestVerse: student.currentAyah || 1,
			ayahStart: 1,
			ayahEnd: student.currentAyah || 1,
			date: null,
			teacherRemarque: student.notes || null
		};
		const sessionsList = [];
		const seenDates = /* @__PURE__ */ new Set();
		for (const rec of sessionRecords) {
			if (!seenDates.has(rec.date)) {
				seenDates.add(rec.date);
				sessionsList.push({
					date: rec.date,
					status: rec.attendanceStatus,
					reason: rec.absenceReason,
					comment: rec.teacherRemarque,
					surahName: rec.surahName,
					ayahStart: rec.ayahStart,
					ayahEnd: rec.ayahEnd
				});
			}
			if (sessionsList.length >= 5) break;
		}
		if (sessionsList.length < 5) for (const att of attendanceRecords) {
			if (!seenDates.has(att.date)) {
				seenDates.add(att.date);
				sessionsList.push({
					date: att.date,
					status: att.status,
					reason: att.reason,
					comment: null,
					surahName: null,
					ayahStart: null,
					ayahEnd: null
				});
			}
			if (sessionsList.length >= 5) break;
		}
		sessionsList.sort((a, b) => b.date.localeCompare(a.date));
		return c.json({
			success: true,
			student: {
				id: student.id,
				name: student.name,
				avatar: student.avatar,
				currentSurahName: student.currentSurahName,
				currentAyah: student.currentAyah
			},
			lastProgress,
			latestSessions: sessionsList.slice(0, 5)
		});
	} catch (err) {
		console.error("Error fetching student history:", err);
		return c.json({ error: err.message || "فشل في جلب سجل الطالب" }, 500);
	}
});
var parentsRouter = new OperationRegistry();
async function isAdminUser$1(c) {
	const sessionId = getSessionId(c);
	if (!sessionId) return false;
	const user = await db.select().from(users).where(eq(users.id, sessionId)).then((r) => r[0]);
	if (!user) return false;
	if (user.role === "admin") return true;
	const teacher = await db.select().from(teachers).where(eq(teachers.userId, user.id)).then((r) => r[0]);
	return !!(teacher && teacher.isAdmin);
}
parentsRouter.get("/", async (c) => {
	await ensureDatabaseInitialized();
	const search = c.req.query("search")?.trim().toLowerCase();
	const allParents = await db.select().from(parents).orderBy(desc(parents.createdAt));
	const allStudents = await db.select().from(students);
	const studentsByParent = /* @__PURE__ */ new Map();
	for (const st of allStudents) if (st.parentId) {
		const list = studentsByParent.get(st.parentId) || [];
		list.push(st);
		studentsByParent.set(st.parentId, list);
	}
	let enriched = allParents.map((parent) => {
		const parentStudents = studentsByParent.get(parent.id) || [];
		return {
			...parent,
			studentsCount: parentStudents.length,
			students: parentStudents.map((st) => ({
				id: st.id,
				name: st.name,
				avatar: st.avatar,
				gender: st.gender,
				age: calculateAge(st.dateOfBirth || st.age),
				dateOfBirth: st.dateOfBirth || st.age,
				groupId: st.groupId,
				memorizedJuzCount: st.memorizedJuzCount,
				currentSurahName: st.currentSurahName
			}))
		};
	});
	if (search) enriched = enriched.filter((p) => p.name.toLowerCase().includes(search) || p.phone.includes(search) || p.email && p.email.toLowerCase().includes(search) || p.students.some((st) => st.name.toLowerCase().includes(search)));
	return c.json({ parents: enriched });
});
parentsRouter.get("/:id", async (c) => {
	await ensureDatabaseInitialized();
	const id = c.req.param("id");
	const parent = await db.select().from(parents).where(eq(parents.id, id)).then((r) => r[0]);
	if (!parent) return c.json({ error: "ولي الأمر غير موجود" }, 404);
	const linkedStudents = await db.select().from(students).where(eq(students.parentId, id));
	return c.json({ parent: {
		...parent,
		studentsCount: linkedStudents.length,
		students: linkedStudents
	} });
});
parentsRouter.post("/", async (c) => {
	await ensureDatabaseInitialized();
	try {
		const { name, phone, email, address, notes, password } = await c.req.json();
		if (!name || !name.trim()) return c.json({ error: "اسم ولي الأمر مطلوب" }, 400);
		if (!phone || !phone.trim()) return c.json({ error: "رقم هاتف ولي الأمر مطلوب" }, 400);
		const id = `prn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
		let userId = null;
		if (email && email.trim()) {
			const emailLower = email.trim().toLowerCase();
			const existingUser = await db.select().from(users).where(eq(users.email, emailLower)).then((r) => r[0]);
			if (existingUser) userId = existingUser.id;
			else {
				userId = `usr_prn_${id}`;
				await db.insert(users).values({
					id: userId,
					name: name.trim(),
					email: emailLower,
					password: await hashPassword(password || "password123"),
					role: "parent",
					avatar: `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(name.trim())}`
				});
			}
		}
		const newParent = {
			id,
			name: name.trim(),
			phone: phone.trim(),
			email: email?.trim() || null,
			address: address?.trim() || null,
			notes: notes?.trim() || null,
			userId,
			createdAt: /* @__PURE__ */ new Date(),
			updatedAt: /* @__PURE__ */ new Date()
		};
		await db.insert(parents).values(newParent);
		return c.json({
			success: true,
			parent: newParent
		}, 201);
	} catch (err) {
		console.error("Error creating parent:", err);
		return c.json({ error: err.message || "فشل في إضافة ولي الأمر" }, 500);
	}
});
parentsRouter.put("/:id", async (c) => {
	await ensureDatabaseInitialized();
	const id = c.req.param("id");
	try {
		const body = await c.req.json();
		const existing = await db.select().from(parents).where(eq(parents.id, id)).then((r) => r[0]);
		if (!existing) return c.json({ error: "ولي الأمر غير موجود" }, 404);
		if (body.password) {
			if (!await isAdminUser$1(c)) return c.json({ error: "غير مصرح لك بتعديل كلمة مرور ولي الأمر. المشرفون فقط مخولون بذلك." }, 403);
		}
		let userId = existing.userId;
		const parentEmail = body.email !== void 0 ? body.email?.trim() : existing.email;
		if (parentEmail) {
			const emailLower = parentEmail.toLowerCase();
			if (!userId) {
				userId = `usr_prn_${id}`;
				await db.insert(users).values({
					id: userId,
					name: body.name?.trim() || existing.name,
					email: emailLower,
					password: await hashPassword(body.password || "password123"),
					role: "parent",
					avatar: `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent((body.name || existing.name).trim())}`
				}).onConflictDoNothing();
			} else {
				const userUpdatePayload = {
					name: (body.name || existing.name).trim(),
					email: emailLower
				};
				if (body.password) userUpdatePayload.password = await hashPassword(body.password);
				await db.update(users).set(userUpdatePayload).where(eq(users.id, userId));
			}
		}
		const updated = {
			name: body.name !== void 0 ? body.name.trim() : existing.name,
			phone: body.phone !== void 0 ? body.phone.trim() : existing.phone,
			email: parentEmail || null,
			address: body.address !== void 0 ? body.address?.trim() || null : existing.address,
			notes: body.notes !== void 0 ? body.notes?.trim() || null : existing.notes,
			userId,
			updatedAt: /* @__PURE__ */ new Date()
		};
		await db.update(parents).set(updated).where(eq(parents.id, id));
		return c.json({
			success: true,
			parent: {
				...existing,
				...updated
			}
		});
	} catch (err) {
		console.error("Error updating parent:", err);
		return c.json({ error: err.message || "فشل في تعديل بيانات ولي الأمر" }, 500);
	}
});
parentsRouter.delete("/:id", async (c) => {
	await ensureDatabaseInitialized();
	const id = c.req.param("id");
	try {
		await db.update(students).set({ parentId: null }).where(eq(students.parentId, id));
		await db.delete(parents).where(eq(parents.id, id));
		return c.json({
			success: true,
			message: "تم حذف ولي الأمر بنجاح"
		});
	} catch (err) {
		console.error("Error deleting parent:", err);
		return c.json({ error: err.message || "فشل في حذف ولي الأمر" }, 500);
	}
});
var teachersRouter = new OperationRegistry();
async function isAdminUser(c) {
	const sessionId = getSessionId(c);
	if (!sessionId) return false;
	const user = await db.select().from(users).where(eq(users.id, sessionId)).then((r) => r[0]);
	if (!user) return false;
	if (user.role === "admin") return true;
	const teacher = await db.select().from(teachers).where(eq(teachers.userId, user.id)).then((r) => r[0]);
	return !!(teacher && teacher.isAdmin);
}
teachersRouter.get("/", async (c) => {
	await ensureDatabaseInitialized();
	const q = c.req.query("q")?.trim() || "";
	const allTeachers = await db.select().from(teachers).orderBy(teachers.name);
	const allGroupTeachers = await db.select().from(groupTeachers);
	const allGroups = await db.select().from(groups);
	const allStudents = await db.select().from(students);
	const allGroupTypes = await db.select().from(groupTypes);
	const groupMap = new Map(allGroups.map((g) => [g.id, g]));
	const typeMap = new Map(allGroupTypes.map((gt) => [gt.id, gt]));
	let result = allTeachers.map((teacher) => {
		const assignedGroups = allGroupTeachers.filter((gt) => gt.teacherId === teacher.id).map((gt) => {
			const grp = groupMap.get(gt.groupId);
			if (!grp) return null;
			const matchedType = typeMap.get(grp.typeId);
			return {
				id: grp.id,
				number: grp.number,
				type: matchedType?.name || "حلقة عامة",
				typeSlug: matchedType?.slug || "general",
				studyTime: grp.studyTime,
				role: gt.role
			};
		}).filter(Boolean);
		const groupIds = assignedGroups.map((g) => g.id);
		const studentsTaughtCount = allStudents.filter((s) => s.groupId && groupIds.includes(s.groupId)).length;
		const avatar = teacher.avatar || `/api/storage/teacher-${teacher.id}`;
		return {
			...teacher,
			avatar,
			assignedGroups,
			studentsCount: studentsTaughtCount
		};
	});
	if (q) {
		const lower = q.toLowerCase();
		result = result.filter((t) => t.name.toLowerCase().includes(lower) || t.email && t.email.toLowerCase().includes(lower) || t.phone && t.phone.toLowerCase().includes(lower) || t.specialization && t.specialization.toLowerCase().includes(lower));
	}
	return c.json({ teachers: result });
});
teachersRouter.get("/:id", async (c) => {
	await ensureDatabaseInitialized();
	const id = c.req.param("id");
	const teacher = await db.select().from(teachers).where(eq(teachers.id, id)).then((r) => r[0]);
	if (!teacher) return c.json({ error: "Teacher not found" }, 404);
	const assignedGt = await db.select().from(groupTeachers).where(eq(groupTeachers.teacherId, id));
	const allGroups = await db.select().from(groups);
	const allGroupTypes = await db.select().from(groupTypes);
	const groupMap = new Map(allGroups.map((g) => [g.id, g]));
	const typeMap = new Map(allGroupTypes.map((gt) => [gt.id, gt]));
	const assignedGroups = assignedGt.map((gt) => {
		const grp = groupMap.get(gt.groupId);
		if (!grp) return null;
		const matchedType = typeMap.get(grp.typeId);
		return {
			...grp,
			type: matchedType?.name || "حلقة عامة",
			typeSlug: matchedType?.slug || "general",
			role: gt.role
		};
	}).filter(Boolean);
	const allStudents = await db.select().from(students);
	const groupIds = assignedGroups.map((g) => g.id);
	const assignedStudents = allStudents.filter((s) => s.groupId && groupIds.includes(s.groupId)).map((s) => ({
		...s,
		avatar: `/api/storage/student-${s.id}`
	}));
	const avatar = `/api/storage/teacher-${teacher.id}`;
	return c.json({ teacher: {
		...teacher,
		avatar,
		assignedGroups,
		students: assignedStudents
	} });
});
teachersRouter.post("/", async (c) => {
	await ensureDatabaseInitialized();
	try {
		const body = await c.req.json();
		const id = body.id || `tch_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
		const avatar = body.avatar || `/api/storage/teacher-${id}`;
		let userId = null;
		if (body.email && body.email.trim()) {
			const emailLower = body.email.trim().toLowerCase();
			const existingUser = await db.select().from(users).where(eq(users.email, emailLower)).then((r) => r[0]);
			if (existingUser) userId = existingUser.id;
			else {
				userId = `usr_tch_${id}`;
				await db.insert(users).values({
					id: userId,
					name: body.name?.trim() || "معلم جديد",
					email: emailLower,
					password: await hashPassword(body.password || "password123"),
					role: body.isAdmin ? "admin" : "teacher",
					avatar
				});
			}
		}
		const newTeacher = {
			id,
			name: body.name?.trim(),
			email: body.email?.trim() || null,
			phone: body.phone?.trim() || null,
			avatar,
			specialization: body.specialization?.trim() || "Tajweed & Hifz",
			bio: body.bio?.trim() || null,
			status: body.status || "active",
			userId,
			isAdmin: !!body.isAdmin,
			createdAt: /* @__PURE__ */ new Date(),
			updatedAt: /* @__PURE__ */ new Date()
		};
		if (!newTeacher.name) return c.json({ error: "Teacher full name is required" }, 400);
		await db.insert(teachers).values(newTeacher);
		if (Array.isArray(body.groupIds) && body.groupIds.length > 0) for (const gid of body.groupIds) await db.insert(groupTeachers).values({
			id: `gt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
			groupId: gid,
			teacherId: id,
			role: "lead"
		}).onConflictDoNothing();
		return c.json({
			success: true,
			teacher: newTeacher
		}, 201);
	} catch (err) {
		console.error("Error creating teacher:", err);
		return c.json({ error: err.message || "Failed to create teacher" }, 500);
	}
});
teachersRouter.put("/:id", async (c) => {
	await ensureDatabaseInitialized();
	const id = c.req.param("id");
	try {
		const body = await c.req.json();
		const existing = await db.select().from(teachers).where(eq(teachers.id, id)).then((r) => r[0]);
		if (!existing) return c.json({ error: "Teacher not found" }, 404);
		if (body.password) {
			if (!await isAdminUser(c)) return c.json({ error: "غير مصرح لك بتعديل كلمة مرور المعلم. المشرفون فقط مخولون بذلك." }, 403);
		}
		const avatar = body.avatar || existing.avatar || `/api/storage/teacher-${id}`;
		let userId = existing.userId;
		if (body.email && body.email.trim()) {
			const emailLower = body.email.trim().toLowerCase();
			if (!userId) {
				userId = `usr_tch_${id}`;
				await db.insert(users).values({
					id: userId,
					name: body.name?.trim() || existing.name,
					email: emailLower,
					password: await hashPassword(body.password || "password123"),
					role: body.isAdmin ? "admin" : "teacher",
					avatar
				}).onConflictDoNothing();
			} else {
				const userUpdatePayload = {
					name: body.name?.trim() || existing.name,
					email: emailLower,
					avatar
				};
				if (body.password) userUpdatePayload.password = await hashPassword(body.password);
				if (body.isAdmin !== void 0) userUpdatePayload.role = body.isAdmin ? "admin" : "teacher";
				await db.update(users).set(userUpdatePayload).where(eq(users.id, userId));
			}
		}
		const updatedData = {
			name: body.name?.trim() ?? existing.name,
			email: body.email !== void 0 ? body.email?.trim() : existing.email,
			phone: body.phone !== void 0 ? body.phone?.trim() : existing.phone,
			avatar,
			specialization: body.specialization?.trim() ?? existing.specialization,
			bio: body.bio !== void 0 ? body.bio : existing.bio,
			status: body.status ?? existing.status,
			userId,
			updatedAt: /* @__PURE__ */ new Date()
		};
		if (body.isAdmin !== void 0) updatedData.isAdmin = !!body.isAdmin;
		await db.update(teachers).set(updatedData).where(eq(teachers.id, id));
		if (Array.isArray(body.groupIds)) {
			await db.delete(groupTeachers).where(eq(groupTeachers.teacherId, id));
			for (const gid of body.groupIds) await db.insert(groupTeachers).values({
				id: `gt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
				groupId: gid,
				teacherId: id,
				role: "lead"
			});
		}
		return c.json({
			success: true,
			teacher: {
				...existing,
				...updatedData
			}
		});
	} catch (err) {
		console.error("Error updating teacher:", err);
		return c.json({ error: err.message || "Failed to update teacher" }, 500);
	}
});
teachersRouter.delete("/:id", async (c) => {
	await ensureDatabaseInitialized();
	const id = c.req.param("id");
	try {
		await db.delete(groupTeachers).where(eq(groupTeachers.teacherId, id));
		await db.delete(teachers).where(eq(teachers.id, id));
		return c.json({
			success: true,
			message: "Teacher deleted successfully"
		});
	} catch (err) {
		return c.json({ error: err.message || "Failed to delete teacher" }, 500);
	}
});
var groupsRouter = new OperationRegistry();
groupsRouter.get("/", async (c) => {
	await ensureDatabaseInitialized();
	const q = c.req.query("q")?.trim() || "";
	const allGroups = await db.select().from(groups).orderBy(groups.number);
	const allGroupTeachers = await db.select().from(groupTeachers);
	const allTeachers = await db.select().from(teachers);
	const allStudents = await db.select().from(students);
	const allGroupTypes = await db.select().from(groupTypes);
	const teacherMap = new Map(allTeachers.map((t) => [t.id, t]));
	const typeMap = new Map(allGroupTypes.map((gt) => [gt.id, gt]));
	let result = allGroups.map((group) => {
		const teachersList = allGroupTeachers.filter((gt) => gt.groupId === group.id).map((gt) => {
			const t = teacherMap.get(gt.teacherId);
			return t ? {
				...t,
				role: gt.role
			} : null;
		}).filter(Boolean);
		const groupStudents = allStudents.filter((s) => s.groupId && s.groupId.split(",").map((item) => item.trim()).includes(group.id));
		const matchedType = (group.typeId ? typeMap.get(group.typeId) : null) || allGroupTypes[0] || null;
		return {
			...group,
			typeId: matchedType?.id || group.typeId,
			type: matchedType?.name || "حلقة قرآنية",
			typeSlug: matchedType?.slug || "general",
			groupType: matchedType,
			teachers: teachersList,
			studentsCount: groupStudents.length,
			studentsPreview: groupStudents.slice(0, 5).map((s) => ({
				id: s.id,
				name: s.name,
				avatar: s.avatar,
				currentSurahName: s.currentSurahName,
				currentAyah: s.currentAyah
			}))
		};
	});
	if (q) {
		const lower = q.toLowerCase();
		result = result.filter((g) => String(g.number).includes(lower) || g.type.toLowerCase().includes(lower) || g.studyTime && g.studyTime.toLowerCase().includes(lower) || g.room && g.room.toLowerCase().includes(lower) || g.level && g.level.toLowerCase().includes(lower));
	}
	return c.json({ groups: result });
});
groupsRouter.get("/by-type-and-number/:typeSlug/:groupNumber", async (c) => {
	await ensureDatabaseInitialized();
	const typeSlug = decodeURIComponent(c.req.param("typeSlug"));
	const groupNumber = parseInt(c.req.param("groupNumber"), 10);
	const matchedType = (await db.select().from(groupTypes)).find((gt) => gt.slug === typeSlug || gt.id === typeSlug || gt.name === typeSlug);
	const foundGroup = (await db.select().from(groups)).find((g) => {
		const matchesNumber = g.number === groupNumber;
		const matchesType = matchedType ? g.typeId === matchedType.id : true;
		return matchesNumber && matchesType;
	});
	if (!foundGroup) return c.json({ error: "Group not found" }, 404);
	const gTeachers = await db.select().from(groupTeachers).where(eq(groupTeachers.groupId, foundGroup.id));
	const allTeachers = await db.select().from(teachers);
	const teachersList = gTeachers.map((gt) => {
		const t = allTeachers.find((item) => item.id === gt.teacherId);
		return t ? {
			...t,
			role: gt.role
		} : null;
	}).filter(Boolean);
	const studentsList = (await db.select().from(students)).filter((s) => s.groupId && s.groupId.split(",").map((item) => item.trim()).includes(foundGroup.id));
	studentsList.sort((a, b) => a.name.localeCompare(b.name));
	const allRatings = await db.select().from(studentRatings).where(eq(studentRatings.groupId, foundGroup.id)).orderBy(desc(studentRatings.createdAt));
	const enrichedStudents = studentsList.map((s) => {
		const latestRating = allRatings.find((r) => r.studentId === s.id) || null;
		const surahData = getSurahByNumber(s.currentSurahNumber);
		return {
			...s,
			latestRating,
			surahDetails: surahData || null
		};
	});
	return c.json({ group: {
		...foundGroup,
		type: matchedType?.name || "حلقة قرآنية",
		typeSlug: matchedType?.slug || typeSlug,
		groupType: matchedType || null,
		teachers: teachersList,
		students: enrichedStudents,
		studentsCount: enrichedStudents.length
	} });
});
groupsRouter.get("/:id", async (c) => {
	await ensureDatabaseInitialized();
	const id = c.req.param("id");
	const group = await db.select().from(groups).where(eq(groups.id, id)).then((r) => r[0]);
	if (!group) return c.json({ error: "Group not found" }, 404);
	const matchedType = (await db.select().from(groupTypes)).find((gt) => gt.id === group.typeId) || null;
	const gTeachers = await db.select().from(groupTeachers).where(eq(groupTeachers.groupId, id));
	const allTeachers = await db.select().from(teachers);
	const teachersList = gTeachers.map((gt) => {
		const t = allTeachers.find((item) => item.id === gt.teacherId);
		return t ? {
			...t,
			role: gt.role
		} : null;
	}).filter(Boolean);
	const studentsList = (await db.select().from(students)).filter((s) => s.groupId && s.groupId.split(",").map((item) => item.trim()).includes(id));
	studentsList.sort((a, b) => a.name.localeCompare(b.name));
	const allRatings = await db.select().from(studentRatings).where(eq(studentRatings.groupId, id)).orderBy(desc(studentRatings.createdAt));
	const enrichedStudents = studentsList.map((s) => {
		const latestRating = allRatings.find((r) => r.studentId === s.id) || null;
		const surahData = getSurahByNumber(s.currentSurahNumber);
		return {
			...s,
			latestRating,
			surahDetails: surahData || null
		};
	});
	return c.json({ group: {
		...group,
		type: matchedType?.name || "حلقة قرآنية",
		typeSlug: matchedType?.slug || "general",
		groupType: matchedType,
		teachers: teachersList,
		students: enrichedStudents,
		studentsCount: enrichedStudents.length
	} });
});
groupsRouter.post("/", async (c) => {
	await ensureDatabaseInitialized();
	try {
		const body = await c.req.json();
		const id = `grp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
		let typeId = body.typeId?.trim();
		if (!typeId && body.type) {
			const gt = await db.select().from(groupTypes).where(eq(groupTypes.name, body.type)).then((r) => r[0]);
			if (gt) typeId = gt.id;
		}
		if (!typeId) return c.json({ error: "Group typeId is required" }, 400);
		const newGroup = {
			id,
			number: parseInt(body.number, 10),
			typeId,
			gender: body.gender || "male",
			sessionTime: body.sessionTime || null,
			studyTime: body.studyTime?.trim() || "من 16:30 إلى 18:00",
			days: Array.isArray(body.days) ? body.days : ["Monday", "Wednesday"],
			timeSlot: body.timeSlot?.trim() || "16:30 - 18:00",
			room: body.room?.trim() || "قاعة المحراب الرئيسية",
			capacity: parseInt(body.capacity, 10) || 20,
			level: body.level || "Intermediate",
			status: body.status || "active",
			createdAt: /* @__PURE__ */ new Date(),
			updatedAt: /* @__PURE__ */ new Date()
		};
		if (isNaN(newGroup.number)) return c.json({ error: "Group number is required" }, 400);
		await db.insert(groups).values(newGroup);
		if (Array.isArray(body.teacherIds) && body.teacherIds.length > 0) for (const [idx, tid] of body.teacherIds.entries()) await db.insert(groupTeachers).values({
			id: `gt_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
			groupId: id,
			teacherId: tid,
			role: idx === 0 ? "lead" : "assistant"
		});
		return c.json({
			success: true,
			group: newGroup
		}, 201);
	} catch (err) {
		console.error("Error creating group:", err);
		return c.json({ error: err.message || "Failed to create group" }, 500);
	}
});
groupsRouter.put("/:id", async (c) => {
	await ensureDatabaseInitialized();
	const id = c.req.param("id");
	try {
		const body = await c.req.json();
		const existing = await db.select().from(groups).where(eq(groups.id, id)).then((r) => r[0]);
		if (!existing) return c.json({ error: "Group not found" }, 404);
		const typeId = body.typeId !== void 0 ? body.typeId?.trim() || existing.typeId : existing.typeId;
		const updatedData = {
			number: body.number !== void 0 ? parseInt(body.number, 10) : existing.number,
			typeId,
			gender: body.gender ?? existing.gender,
			sessionTime: body.sessionTime !== void 0 ? body.sessionTime : existing.sessionTime,
			studyTime: body.studyTime?.trim() ?? existing.studyTime,
			days: Array.isArray(body.days) ? body.days : existing.days,
			timeSlot: body.timeSlot !== void 0 ? body.timeSlot?.trim() : existing.timeSlot,
			room: body.room !== void 0 ? body.room?.trim() : existing.room,
			capacity: body.capacity !== void 0 ? parseInt(body.capacity, 10) : existing.capacity,
			level: body.level ?? existing.level,
			status: body.status ?? existing.status,
			updatedAt: /* @__PURE__ */ new Date()
		};
		await db.update(groups).set(updatedData).where(eq(groups.id, id));
		if (Array.isArray(body.teacherIds)) {
			await db.delete(groupTeachers).where(eq(groupTeachers.groupId, id));
			for (const [idx, tid] of body.teacherIds.entries()) await db.insert(groupTeachers).values({
				id: `gt_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
				groupId: id,
				teacherId: tid,
				role: idx === 0 ? "lead" : "assistant"
			});
		}
		if (Array.isArray(body.studentIds)) {
			const allStudents = await db.select().from(students);
			for (const student of allStudents) {
				const assignedGroupIds = student.groupId ? student.groupId.split(",").map((item) => item.trim()).filter(Boolean) : [];
				const isAssignedToThisGroup = assignedGroupIds.includes(id);
				const shouldBeAssigned = body.studentIds.includes(student.id);
				if (shouldBeAssigned && !isAssignedToThisGroup) {
					const newGroupIds = [...assignedGroupIds, id].join(",");
					await db.update(students).set({ groupId: newGroupIds }).where(eq(students.id, student.id));
				} else if (!shouldBeAssigned && isAssignedToThisGroup) {
					const newGroupIds = assignedGroupIds.filter((gid) => gid !== id).join(",") || null;
					await db.update(students).set({ groupId: newGroupIds }).where(eq(students.id, student.id));
				}
			}
		}
		return c.json({
			success: true,
			group: {
				...existing,
				...updatedData
			}
		});
	} catch (err) {
		console.error("Error updating group:", err);
		return c.json({ error: err.message || "Failed to update group" }, 500);
	}
});
groupsRouter.post("/bulk-update-time", async (c) => {
	await ensureDatabaseInitialized();
	try {
		const { groupIds, sessionTime, studyTime } = await c.req.json();
		if (!Array.isArray(groupIds) || groupIds.length === 0) return c.json({ error: "لم يتم تحديد أي حلقات للتحديث" }, 400);
		if (!sessionTime) return c.json({ error: "تفاصيل الوقت المطلوبة غير متوفرة" }, 400);
		await db.update(groups).set({
			sessionTime,
			studyTime: studyTime || null,
			updatedAt: /* @__PURE__ */ new Date()
		}).where(inArray(groups.id, groupIds));
		return c.json({
			success: true,
			message: `تم تحديث توقيت ${groupIds.length} حلقات بنجاح`,
			updatedCount: groupIds.length
		});
	} catch (err) {
		console.error("Error bulk updating group timing:", err);
		return c.json({ error: err.message || "فشل في تحديث توقيت الحلقات بالجملة" }, 500);
	}
});
groupsRouter.delete("/:id", async (c) => {
	await ensureDatabaseInitialized();
	const id = c.req.param("id");
	try {
		await db.update(students).set({ groupId: null }).where(eq(students.groupId, id));
		await db.delete(groupTeachers).where(eq(groupTeachers.groupId, id));
		await db.delete(groups).where(eq(groups.id, id));
		return c.json({
			success: true,
			message: "Group deleted successfully"
		});
	} catch (err) {
		return c.json({ error: err.message || "Failed to delete group" }, 500);
	}
});
var groupTypesRouter = new OperationRegistry();
function generateSlug(text) {
	return text.trim().toLowerCase().replace(/[\s\t\n]+/g, "-").replace(/[^\w\u0621-\u064A\-]/g, "").replace(/-+/g, "-") || `type-${Date.now()}`;
}
groupTypesRouter.get("/", async (c) => {
	await ensureDatabaseInitialized();
	const allTypes = await db.select().from(groupTypes).orderBy(groupTypes.createdAt);
	const allGroups = await db.select().from(groups);
	const allStudents = await db.select().from(students);
	const result = allTypes.map((gt) => {
		const matchedGroups = allGroups.filter((g) => g.typeId === gt.id);
		let totalStudents = 0;
		matchedGroups.forEach((g) => {
			const gStudents = allStudents.filter((s) => s.groupId && s.groupId.split(",").map((item) => item.trim()).includes(g.id));
			totalStudents += gStudents.length;
		});
		return {
			...gt,
			groupsCount: matchedGroups.length,
			totalStudents
		};
	});
	return c.json({ groupTypes: result });
});
groupTypesRouter.get("/:identifier", async (c) => {
	await ensureDatabaseInitialized();
	const identifier = decodeURIComponent(c.req.param("identifier"));
	const groupType = (await db.select().from(groupTypes)).find((gt) => gt.id === identifier || gt.slug === identifier || gt.name === identifier);
	if (!groupType) return c.json({ error: "Group type not found" }, 404);
	const allGroups = await db.select().from(groups);
	const allStudents = await db.select().from(students);
	const allGroupTeachers = await db.select().from(groupTeachers);
	const allTeachers = await db.select().from(teachers);
	const teacherMap = new Map(allTeachers.map((t) => [t.id, t]));
	const matchedGroups = allGroups.filter((g) => g.typeId === groupType.id).sort((a, b) => a.number - b.number).map((group) => {
		const teachersList = allGroupTeachers.filter((gt) => gt.groupId === group.id).map((gt) => {
			const t = teacherMap.get(gt.teacherId);
			return t ? {
				...t,
				role: gt.role
			} : null;
		}).filter(Boolean);
		const groupStudents = allStudents.filter((s) => s.groupId && s.groupId.split(",").map((item) => item.trim()).includes(group.id));
		return {
			...group,
			type: groupType.name,
			typeSlug: groupType.slug,
			groupType,
			teachers: teachersList,
			studentsCount: groupStudents.length
		};
	});
	let totalStudents = 0;
	matchedGroups.forEach((g) => {
		totalStudents += g.studentsCount;
	});
	return c.json({ groupType: {
		...groupType,
		groupsCount: matchedGroups.length,
		totalStudents,
		groups: matchedGroups
	} });
});
groupTypesRouter.post("/", async (c) => {
	await ensureDatabaseInitialized();
	try {
		const body = await c.req.json();
		const name = body.name?.trim();
		if (!name) return c.json({ error: "Group type name is required" }, 400);
		const slug = body.slug?.trim() ? generateSlug(body.slug) : generateSlug(name);
		const id = `gt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
		if (await db.select().from(groupTypes).where(or(eq(groupTypes.name, name), eq(groupTypes.slug, slug))).then((r) => r[0])) return c.json({ error: "A group type with this name or slug already exists" }, 400);
		const newType = {
			id,
			name,
			slug,
			description: body.description?.trim() || null,
			createdAt: /* @__PURE__ */ new Date(),
			updatedAt: /* @__PURE__ */ new Date()
		};
		await db.insert(groupTypes).values(newType);
		return c.json({
			success: true,
			groupType: newType
		}, 201);
	} catch (err) {
		console.error("Error creating group type:", err);
		return c.json({ error: err.message || "Failed to create group type" }, 500);
	}
});
groupTypesRouter.put("/:id", async (c) => {
	await ensureDatabaseInitialized();
	const id = decodeURIComponent(c.req.param("id"));
	try {
		const body = await c.req.json();
		const existing = (await db.select().from(groupTypes)).find((gt) => gt.id === id || gt.slug === id);
		if (!existing) return c.json({ error: "Group type not found" }, 404);
		const updated = {
			name: body.name?.trim() || existing.name,
			slug: body.slug?.trim() ? generateSlug(body.slug) : body.name ? generateSlug(body.name) : existing.slug,
			description: body.description !== void 0 ? body.description?.trim() || null : existing.description,
			updatedAt: /* @__PURE__ */ new Date()
		};
		await db.update(groupTypes).set(updated).where(eq(groupTypes.id, existing.id));
		return c.json({
			success: true,
			groupType: {
				...existing,
				...updated
			}
		});
	} catch (err) {
		console.error("Error updating group type:", err);
		return c.json({ error: err.message || "Failed to update group type" }, 500);
	}
});
groupTypesRouter.delete("/:id", async (c) => {
	await ensureDatabaseInitialized();
	const id = decodeURIComponent(c.req.param("id"));
	try {
		const existing = (await db.select().from(groupTypes)).find((gt) => gt.id === id || gt.slug === id);
		if (!existing) return c.json({ error: "Group type not found" }, 404);
		await db.delete(groupTypes).where(eq(groupTypes.id, existing.id));
		return c.json({
			success: true,
			message: "Group type deleted"
		});
	} catch (err) {
		console.error("Error deleting group type:", err);
		return c.json({ error: err.message || "Failed to delete group type" }, 500);
	}
});
var ratingsRouter = new OperationRegistry();
function calculateGrade(score) {
	if (score >= 95) return "Mumtaz (Outstanding)";
	if (score >= 88) return "Mumtaz (Excellent)";
	if (score >= 80) return "Jayyid Jiddan (Very Good)";
	if (score >= 70) return "Jayyid (Good)";
	if (score >= 60) return "Maqbool (Acceptable)";
	return "Da'eef (Needs Improvement)";
}
ratingsRouter.get("/", async (c) => {
	await ensureDatabaseInitialized();
	const studentId = c.req.query("studentId")?.trim();
	const groupId = c.req.query("groupId")?.trim();
	const month = c.req.query("month")?.trim();
	let allRatings = await db.select().from(studentRatings).orderBy(desc(studentRatings.createdAt));
	const allStudents = await db.select().from(students);
	const allTeachers = await db.select().from(teachers);
	const allGroups = await db.select().from(groups);
	const allGroupTypes = await db.select().from(groupTypes);
	const studentMap = new Map(allStudents.map((s) => [s.id, s]));
	const teacherMap = new Map(allTeachers.map((t) => [t.id, t]));
	const groupMap = new Map(allGroups.map((g) => [g.id, g]));
	const typeMap = new Map(allGroupTypes.map((gt) => [gt.id, gt]));
	if (studentId) allRatings = allRatings.filter((r) => r.studentId === studentId);
	if (groupId && groupId !== "all") allRatings = allRatings.filter((r) => r.groupId === groupId);
	if (month && month !== "all") allRatings = allRatings.filter((r) => r.month === month);
	const result = allRatings.map((r) => {
		const student = studentMap.get(r.studentId);
		const teacher = r.teacherId ? teacherMap.get(r.teacherId) : null;
		const group = r.groupId ? groupMap.get(r.groupId) : null;
		const matchedType = group ? typeMap.get(group.typeId) : null;
		return {
			...r,
			student: student ? {
				id: student.id,
				name: student.name,
				avatar: student.avatar,
				currentSurahName: student.currentSurahName,
				currentAyah: student.currentAyah,
				age: calculateAge(student.dateOfBirth || student.age)
			} : null,
			teacher: teacher ? {
				id: teacher.id,
				name: teacher.name,
				avatar: teacher.avatar
			} : null,
			group: group ? {
				id: group.id,
				number: group.number,
				type: matchedType?.name || "حلقة عامة",
				studyTime: group.studyTime
			} : null
		};
	});
	return c.json({ ratings: result });
});
ratingsRouter.post("/", async (c) => {
	await ensureDatabaseInitialized();
	try {
		const body = await c.req.json();
		const id = `rat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
		const hifz = parseInt(body.hifzScore, 10) ?? 90;
		const tajweed = parseInt(body.tajweedScore, 10) ?? 85;
		const murajaah = parseInt(body.murajaahScore, 10) ?? 88;
		const attendance = parseInt(body.attendanceScore, 10) ?? 95;
		const behavior = parseInt(body.behaviorScore, 10) ?? 100;
		const computedOverall = Math.round(hifz * .35 + tajweed * .25 + murajaah * .2 + attendance * .1 + behavior * .1);
		const overallScore = body.overallScore !== void 0 ? parseInt(body.overallScore, 10) : computedOverall;
		const grade = body.grade || calculateGrade(overallScore);
		const newRating = {
			id,
			studentId: body.studentId,
			teacherId: body.teacherId || null,
			groupId: body.groupId || null,
			month: body.month || (/* @__PURE__ */ new Date()).toISOString().substring(0, 7),
			hifzScore: hifz,
			tajweedScore: tajweed,
			murajaahScore: murajaah,
			attendanceScore: attendance,
			behaviorScore: behavior,
			overallScore,
			grade,
			surahEvaluated: body.surahEvaluated || null,
			ayahStart: body.ayahStart ? parseInt(body.ayahStart, 10) : null,
			ayahEnd: body.ayahEnd ? parseInt(body.ayahEnd, 10) : null,
			notes: body.notes || null,
			createdAt: /* @__PURE__ */ new Date()
		};
		if (!newRating.studentId) return c.json({ error: "Student ID is required for rating" }, 400);
		await db.insert(studentRatings).values(newRating);
		if (body.updateStudentSurah && body.surahEvaluated) {
			const student = await db.select().from(students).where(eq(students.id, newRating.studentId)).then((r) => r[0]);
			if (student) await db.update(students).set({
				currentSurahName: body.surahEvaluated,
				currentAyah: body.ayahEnd || student.currentAyah,
				updatedAt: /* @__PURE__ */ new Date()
			}).where(eq(students.id, student.id));
		}
		return c.json({
			success: true,
			rating: newRating
		}, 201);
	} catch (err) {
		console.error("Error adding rating:", err);
		return c.json({ error: err.message || "Failed to submit rating" }, 500);
	}
});
ratingsRouter.put("/:id", async (c) => {
	await ensureDatabaseInitialized();
	const id = c.req.param("id");
	try {
		const body = await c.req.json();
		const existing = await db.select().from(studentRatings).where(eq(studentRatings.id, id)).then((r) => r[0]);
		if (!existing) return c.json({ error: "Rating record not found" }, 404);
		const hifz = body.hifzScore !== void 0 ? parseInt(body.hifzScore, 10) : existing.hifzScore;
		const tajweed = body.tajweedScore !== void 0 ? parseInt(body.tajweedScore, 10) : existing.tajweedScore;
		const murajaah = body.murajaahScore !== void 0 ? parseInt(body.murajaahScore, 10) : existing.murajaahScore;
		const attendance = body.attendanceScore !== void 0 ? parseInt(body.attendanceScore, 10) : existing.attendanceScore;
		const behavior = body.behaviorScore !== void 0 ? parseInt(body.behaviorScore, 10) : existing.behaviorScore;
		const computedOverall = Math.round(hifz * .35 + tajweed * .25 + murajaah * .2 + attendance * .1 + behavior * .1);
		const overallScore = body.overallScore !== void 0 ? parseInt(body.overallScore, 10) : computedOverall;
		const updatedData = {
			month: body.month ?? existing.month,
			teacherId: body.teacherId !== void 0 ? body.teacherId : existing.teacherId,
			groupId: body.groupId !== void 0 ? body.groupId : existing.groupId,
			hifzScore: hifz,
			tajweedScore: tajweed,
			murajaahScore: murajaah,
			attendanceScore: attendance,
			behaviorScore: behavior,
			overallScore,
			grade: body.grade || calculateGrade(overallScore),
			surahEvaluated: body.surahEvaluated !== void 0 ? body.surahEvaluated : existing.surahEvaluated,
			ayahStart: body.ayahStart !== void 0 ? parseInt(body.ayahStart, 10) : existing.ayahStart,
			ayahEnd: body.ayahEnd !== void 0 ? parseInt(body.ayahEnd, 10) : existing.ayahEnd,
			notes: body.notes !== void 0 ? body.notes : existing.notes
		};
		await db.update(studentRatings).set(updatedData).where(eq(studentRatings.id, id));
		return c.json({
			success: true,
			rating: {
				...existing,
				...updatedData
			}
		});
	} catch (err) {
		return c.json({ error: err.message || "Failed to update rating" }, 500);
	}
});
ratingsRouter.delete("/:id", async (c) => {
	await ensureDatabaseInitialized();
	const id = c.req.param("id");
	try {
		await db.delete(studentRatings).where(eq(studentRatings.id, id));
		return c.json({
			success: true,
			message: "Rating deleted"
		});
	} catch (err) {
		return c.json({ error: err.message || "Failed to delete rating" }, 500);
	}
});
var prayerTimesRouter = new OperationRegistry();
var prayerCache = /* @__PURE__ */ new Map();
var DEFAULT_ALGERIA_TIMINGS = {
	Fajr: "05:17",
	Sunrise: "06:43",
	Dhuhr: "12:37",
	Asr: "15:59",
	Sunset: "18:31",
	Maghrib: "18:31",
	Isha: "19:52",
	Imsak: "05:07",
	Midnight: "00:37"
};
prayerTimesRouter.get("/", async (c) => {
	try {
		const rawDate = c.req.query("date");
		const city = c.req.query("city") || "Algiers";
		const country = c.req.query("country") || "Algeria";
		const method = c.req.query("method") || "19";
		let formattedDate = "";
		let cacheKey = "";
		if (rawDate) {
			if (rawDate.includes("-")) {
				const parts = rawDate.split("-");
				if (parts[0].length === 4) {
					formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
					cacheKey = `${rawDate}_${city}_${country}_${method}`;
				} else {
					formattedDate = rawDate;
					cacheKey = `${rawDate}_${city}_${country}_${method}`;
				}
			}
		} else {
			const today = /* @__PURE__ */ new Date();
			formattedDate = `${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth() + 1).padStart(2, "0")}-${today.getFullYear()}`;
			cacheKey = `today_${formattedDate}_${city}_${country}_${method}`;
		}
		if (prayerCache.has(cacheKey)) return c.json({
			success: true,
			data: prayerCache.get(cacheKey),
			fromCache: true
		});
		const url = formattedDate ? `https://api.aladhan.com/v1/timingsByCity/${formattedDate}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}` : `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}`;
		const res = await fetch(url, { headers: { "Accept": "application/json" } });
		if (!res.ok) throw new Error(`AlAdhan API responded with status ${res.status}`);
		const json = await res.json();
		if (json && json.data) {
			const resultData = {
				timings: json.data.timings,
				date: json.data.date,
				meta: json.data.meta,
				location: {
					city,
					country,
					methodName: "Algeria (Ministry of Religious Affairs / Method 19)"
				}
			};
			prayerCache.set(cacheKey, resultData);
			return c.json({
				success: true,
				data: resultData
			});
		}
		throw new Error("Invalid response structure from AlAdhan API");
	} catch (err) {
		console.error("Error fetching AlAdhan prayer times:", err.message);
		const today = /* @__PURE__ */ new Date();
		const fallbackData = {
			timings: DEFAULT_ALGERIA_TIMINGS,
			date: {
				readable: today.toDateString(),
				hijri: {
					day: "20",
					month: {
						ar: "رَبيع الثاني",
						en: "Rabi al-Thani"
					},
					year: "1448",
					date: "20-04-1448"
				},
				gregorian: { date: today.toISOString().split("T")[0] }
			},
			meta: {
				method: {
					id: 19,
					name: "Algeria"
				},
				timezone: "Africa/Algiers"
			},
			isFallback: true
		};
		return c.json({
			success: true,
			data: fallbackData,
			note: "Using standard Algeria prayer timetable"
		});
	}
});
async function fetchAlgeriaTimingsForDate(rawDate) {
	let cacheKey = rawDate || "today";
	if (prayerCache.has(cacheKey)) return prayerCache.get(cacheKey).timings || DEFAULT_ALGERIA_TIMINGS;
	try {
		let formattedDate = "";
		if (rawDate && rawDate.includes("-")) {
			const parts = rawDate.split("-");
			if (parts[0].length === 4) formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
			else formattedDate = rawDate;
		} else {
			const today = /* @__PURE__ */ new Date();
			formattedDate = `${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth() + 1).padStart(2, "0")}-${today.getFullYear()}`;
		}
		const url = `https://api.aladhan.com/v1/timingsByCity/${formattedDate}?city=Algiers&country=Algeria&method=19`;
		const res = await fetch(url, { headers: { "Accept": "application/json" } });
		if (res.ok) {
			const json = await res.json();
			if (json?.data?.timings) {
				prayerCache.set(cacheKey, json.data);
				return json.data.timings;
			}
		}
	} catch (e) {
		console.error("Server error fetching AlAdhan timings:", e);
	}
	return DEFAULT_ALGERIA_TIMINGS;
}
async function computeAlgeriaSessionTimes(group, dateStr) {
	const timings = await fetchAlgeriaTimingsForDate(dateStr);
	const getP = (pName) => {
		switch (pName) {
			case "fajr": return timings.Fajr?.split(" ")[0] || "05:17";
			case "dhuhr": return timings.Dhuhr?.split(" ")[0] || "12:37";
			case "asr": return timings.Asr?.split(" ")[0] || "15:59";
			case "maghrib": return timings.Maghrib?.split(" ")[0] || "18:31";
			case "isha": return timings.Isha?.split(" ")[0] || "19:52";
			default: return "16:30";
		}
	};
	const addTime = (tStr, offsetH) => {
		const [h, m] = tStr.split(" ")[0].split(":").map(Number);
		let newH = (h || 0) + offsetH;
		newH = (newH % 24 + 24) % 24;
		return `${String(newH).padStart(2, "0")}:${String(m || 0).padStart(2, "0")}`;
	};
	const sessionTime = group?.sessionTime;
	let calcStart = "16:30";
	let calcEnd = "18:00";
	let desc = group?.studyTime || "من العصر إلى المغرب";
	if (sessionTime) {
		const { startType, startTime, startPrayer, startOffsetHours, endType, endTime, endPrayer, endOffsetHours } = sessionTime;
		if (startType === "prayer" && startPrayer) calcStart = addTime(getP(startPrayer), Number(startOffsetHours) || 0);
		else if (startTime) calcStart = startTime;
		if (endType === "prayer" && endPrayer) calcEnd = addTime(getP(endPrayer), Number(endOffsetHours) || 0);
		else if (endTime) calcEnd = endTime;
	} else if (desc) {
		const lower = desc.toLowerCase();
		if (lower.includes("الفجر")) calcStart = addTime(timings.Fajr?.split(" ")[0] || "05:17", lower.includes("فجر +") ? 1 : 0);
		else if (lower.includes("الظهر")) calcStart = timings.Dhuhr?.split(" ")[0] || "12:37";
		else if (lower.includes("العصر")) calcStart = timings.Asr?.split(" ")[0] || "15:59";
		else if (lower.includes("المغرب")) calcStart = timings.Maghrib?.split(" ")[0] || "18:31";
		else if (lower.includes("العشاء")) calcStart = timings.Isha?.split(" ")[0] || "19:52";
		if (lower.includes("إلى صلاة العشاء") || lower.includes("إلى العشاء")) calcEnd = timings.Isha?.split(" ")[0] || "19:52";
		else if (lower.includes("إلى صلاة المغرب") || lower.includes("إلى المغرب")) calcEnd = timings.Maghrib?.split(" ")[0] || "18:31";
		else if (lower.includes("إلى صلاة العصر") || lower.includes("إلى العصر")) calcEnd = timings.Asr?.split(" ")[0] || "15:59";
		else if (lower.includes("الفجر + ساعة") || lower.includes("فجر + 1")) calcEnd = addTime(timings.Fajr?.split(" ")[0] || "05:17", 1);
	}
	const slotStr = `${calcStart} - ${calcEnd}`;
	let text = desc;
	if (desc && !desc.includes(slotStr)) text = `${desc} (${slotStr})`;
	return {
		startTime: calcStart,
		endTime: calcEnd,
		sessionTimeText: text,
		timeSlot: slotStr
	};
}
var sessionsRouter = new OperationRegistry();
async function getAuthenticatedUser(c) {
	const sessionId = getSessionId(c);
	if (!sessionId) return null;
	const user = await db.select().from(users).where(eq(users.id, sessionId)).then((r) => r[0]);
	if (!user) return null;
	let teacherProfile = null;
	let parentProfile = null;
	let role = user.role;
	if (user.role === "admin" || user.role === "teacher") {
		teacherProfile = await db.select().from(teachers).where(eq(teachers.userId, user.id)).then((r) => r[0]);
		if (teacherProfile && teacherProfile.isAdmin) role = "admin";
	}
	if (user.role === "parent") parentProfile = await db.select().from(parents).where(eq(parents.userId, user.id)).then((r) => r[0]);
	return {
		...user,
		role,
		teacherProfile,
		parentProfile
	};
}
sessionsRouter.get("/", async (c) => {
	try {
		const user = await getAuthenticatedUser(c);
		if (!user) return c.json({ error: "غير مصرح بالدخول، يرجى تسجيل الدخول أولاً" }, 401);
		const startDate = c.req.query("startDate");
		const endDate = c.req.query("endDate");
		const groupIdFilter = c.req.query("groupId");
		const page = c.req.query("page");
		const limit = c.req.query("limit");
		const search = c.req.query("search")?.trim().toLowerCase();
		const statusFilter = c.req.query("status");
		const allGroups = await db.select().from(groups);
		const dayNames = [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday"
		];
		const today = /* @__PURE__ */ new Date();
		let genStart = /* @__PURE__ */ new Date();
		let genEnd = /* @__PURE__ */ new Date();
		if (startDate && endDate) {
			genStart = new Date(startDate);
			genEnd = new Date(endDate);
		} else if (startDate) {
			genStart = new Date(startDate);
			genEnd = new Date(startDate);
			genEnd.setDate(genEnd.getDate() + 14);
		} else {
			genStart.setDate(today.getDate() - 7);
			genEnd.setDate(today.getDate() + 7);
		}
		const diffDays = Math.min(60, Math.max(1, Math.round((genEnd.getTime() - genStart.getTime()) / 864e5)));
		for (const group of allGroups) {
			const days = group.days || [];
			if (days.length === 0) continue;
			const groupTeacher = await db.select().from(groupTeachers).where(eq(groupTeachers.groupId, group.id)).then((r) => r[0]);
			const defaultTeacherId = groupTeacher ? groupTeacher.teacherId : null;
			for (let i = 0; i <= diffDays; i++) {
				const checkDate = new Date(genStart);
				checkDate.setDate(genStart.getDate() + i);
				const dayName = dayNames[checkDate.getDay()];
				if (days.includes(dayName)) {
					const dateStr = checkDate.toISOString().split("T")[0];
					if (!await db.select().from(sessions).where(and(eq(sessions.groupId, group.id), eq(sessions.date, dateStr))).then((r) => r[0])) {
						const sessionId = `ses_${group.id}_${dateStr}`;
						const computedTimes = await computeAlgeriaSessionTimes(group, dateStr);
						await db.insert(sessions).values({
							id: sessionId,
							groupId: group.id,
							teacherId: defaultTeacherId,
							sessionType: "main",
							date: dateStr,
							startTime: computedTimes.startTime,
							endTime: computedTimes.endTime,
							sessionTimeText: computedTimes.sessionTimeText,
							status: checkDate < today ? "completed" : "scheduled",
							notes: "حصة أساسية مجدولة تلقائياً"
						}).onConflictDoNothing();
						const groupStudents = await db.select().from(students).where(eq(students.groupId, group.id));
						for (const student of groupStudents) await db.insert(sessionStudentRecords).values({
							id: `rec_${sessionId}_${student.id}`,
							sessionId,
							studentId: student.id,
							attendanceStatus: "present",
							surahNumber: student.currentSurahNumber,
							surahName: student.currentSurahName,
							ayahStart: student.currentAyah,
							ayahEnd: student.currentAyah ? student.currentAyah + 10 : 10,
							teacherRemarque: "",
							isAssessed: false
						}).onConflictDoNothing();
					}
				}
			}
		}
		let results = await db.select({
			id: sessions.id,
			groupId: sessions.groupId,
			teacherId: sessions.teacherId,
			sessionType: sessions.sessionType,
			date: sessions.date,
			startTime: sessions.startTime,
			endTime: sessions.endTime,
			sessionTimeText: sessions.sessionTimeText,
			status: sessions.status,
			notes: sessions.notes,
			groupStudyTime: groups.studyTime,
			groupSessionTime: groups.sessionTime,
			level: groups.level,
			room: groups.room,
			groupNumber: groups.number,
			teacherName: teachers.name,
			teacherAvatar: teachers.avatar
		}).from(sessions).innerJoin(groups, eq(sessions.groupId, groups.id)).leftJoin(teachers, eq(sessions.teacherId, teachers.id));
		if (groupIdFilter) results = results.filter((r) => r.groupId === groupIdFilter);
		if (startDate) results = results.filter((r) => r.date >= startDate);
		if (endDate) results = results.filter((r) => r.date <= endDate);
		if (statusFilter && statusFilter !== "all") results = results.filter((r) => r.status === statusFilter);
		if (user.role === "teacher" && user.teacherProfile) {
			const groupIds = (await db.select({ groupId: groupTeachers.groupId }).from(groupTeachers).where(eq(groupTeachers.teacherId, user.teacherProfile.id))).map((tg) => tg.groupId);
			results = results.filter((r) => groupIds.includes(r.groupId));
		} else if (user.role === "parent" && user.parentProfile) {
			const groupIds = (await db.select({ groupId: students.groupId }).from(students).where(eq(students.parentId, user.parentProfile.id))).map((c) => c.groupId).filter(Boolean);
			results = results.filter((r) => groupIds.includes(r.groupId));
		}
		if (search) results = results.filter((r) => r.teacherName && r.teacherName.toLowerCase().includes(search) || r.level && r.level.toLowerCase().includes(search) || r.groupNumber && String(r.groupNumber).includes(search) || r.sessionTimeText && r.sessionTimeText.toLowerCase().includes(search) || r.date && r.date.includes(search));
		results.sort((a, b) => b.date.localeCompare(a.date) || (b.startTime || "").localeCompare(a.startTime || ""));
		const total = results.length;
		if (page !== void 0) {
			const pageNum = Math.max(1, parseInt(page, 10) || 1);
			const limitNum = Math.max(1, parseInt(limit || "10", 10) || 10);
			const totalPages = Math.ceil(total / limitNum) || 1;
			const startIndex = (pageNum - 1) * limitNum;
			const paginatedResults = results.slice(startIndex, startIndex + limitNum);
			return c.json({
				success: true,
				sessions: paginatedResults,
				pagination: {
					page: pageNum,
					limit: limitNum,
					total,
					totalPages
				}
			});
		}
		return c.json({
			success: true,
			sessions: results,
			pagination: null
		});
	} catch (err) {
		console.error("Error fetching sessions:", err);
		return c.json({ error: err.message || "فشل في تحميل الحصص" }, 500);
	}
});
sessionsRouter.post("/exception", async (c) => {
	try {
		const user = await getAuthenticatedUser(c);
		if (!user) return c.json({ error: "غير مصرح بالدخول" }, 401);
		const { groupId, date, notes } = await c.req.json();
		if (!groupId || !date) return c.json({ error: "معرف الحلقة والتاريخ مطلوبان" }, 400);
		const group = await db.select().from(groups).where(eq(groups.id, groupId)).then((r) => r[0]);
		if (!group) return c.json({ error: "الحلقة غير موجودة" }, 404);
		const groupTeacher = await db.select().from(groupTeachers).where(eq(groupTeachers.groupId, groupId)).then((r) => r[0]);
		if (user.role !== "admin") {
			if (!await db.select().from(groupTeachers).where(and(eq(groupTeachers.groupId, groupId), eq(groupTeachers.teacherId, user.teacherProfile?.id || ""))).then((r) => r.length > 0)) return c.json({ error: "غير مصرح لك بإنشاء حصة في حلقة غير مسندة إليك" }, 403);
		}
		const sessionId = `ses_exc_${groupId}_${Date.now()}`;
		const computedTimes = await computeAlgeriaSessionTimes(group, date);
		const newSession = {
			id: sessionId,
			groupId,
			teacherId: user.teacherProfile?.id || groupTeacher?.teacherId || null,
			sessionType: "exception",
			date,
			startTime: computedTimes.startTime,
			endTime: computedTimes.endTime,
			sessionTimeText: `حصة استثنائية - ${computedTimes.sessionTimeText}`,
			status: "scheduled",
			notes: notes || "حصة استثنائية تمت إضافتها من صفحة الحلقة"
		};
		await db.insert(sessions).values(newSession);
		const groupStudents = await db.select().from(students).where(eq(students.groupId, groupId));
		for (const student of groupStudents) await db.insert(sessionStudentRecords).values({
			id: `rec_${sessionId}_${student.id}`,
			sessionId,
			studentId: student.id,
			attendanceStatus: "present",
			surahNumber: student.currentSurahNumber,
			surahName: student.currentSurahName,
			ayahStart: student.currentAyah,
			ayahEnd: student.currentAyah + 10,
			teacherRemarque: "",
			isAssessed: false
		});
		return c.json({
			success: true,
			session: newSession
		});
	} catch (err) {
		console.error("Error creating exception session:", err);
		return c.json({ error: err.message || "فشل في إنشاء الحصة الاستثنائية" }, 500);
	}
});
sessionsRouter.get("/:id", async (c) => {
	try {
		const sessionId = c.req.param("id");
		const user = await getAuthenticatedUser(c);
		if (!user) return c.json({ error: "غير مصرح بالدخول" }, 401);
		const session = await db.select({
			id: sessions.id,
			groupId: sessions.groupId,
			teacherId: sessions.teacherId,
			sessionType: sessions.sessionType,
			date: sessions.date,
			startTime: sessions.startTime,
			endTime: sessions.endTime,
			sessionTimeText: sessions.sessionTimeText,
			status: sessions.status,
			notes: sessions.notes,
			groupStudyTime: groups.studyTime,
			room: groups.room,
			groupNumber: groups.number,
			level: groups.level,
			teacherName: teachers.name,
			teacherAvatar: teachers.avatar
		}).from(sessions).innerJoin(groups, eq(sessions.groupId, groups.id)).leftJoin(teachers, eq(sessions.teacherId, teachers.id)).where(eq(sessions.id, sessionId)).then((r) => r[0]);
		if (!session) return c.json({ error: "الحصة غير موجودة" }, 404);
		let records = await db.select({
			id: sessionStudentRecords.id,
			sessionId: sessionStudentRecords.sessionId,
			studentId: sessionStudentRecords.studentId,
			attendanceStatus: sessionStudentRecords.attendanceStatus,
			absenceReason: sessionStudentRecords.absenceReason,
			surahNumber: sessionStudentRecords.surahNumber,
			surahName: sessionStudentRecords.surahName,
			ayahStart: sessionStudentRecords.ayahStart,
			ayahEnd: sessionStudentRecords.ayahEnd,
			teacherRemarque: sessionStudentRecords.teacherRemarque,
			isAssessed: sessionStudentRecords.isAssessed,
			studentName: students.name,
			studentAvatar: students.avatar,
			studentAge: students.age,
			studentDateOfBirth: students.dateOfBirth,
			studentParentId: students.parentId
		}).from(sessionStudentRecords).innerJoin(students, eq(sessionStudentRecords.studentId, students.id)).where(eq(sessionStudentRecords.sessionId, sessionId));
		if (user.role === "parent" && user.parentProfile) records = records.filter((r) => r.studentParentId === user.parentProfile?.id);
		const formattedRecords = records.map((r) => ({
			...r,
			studentAge: calculateAge(r.studentDateOfBirth || r.studentAge)
		}));
		return c.json({
			success: true,
			session,
			records: formattedRecords
		});
	} catch (err) {
		console.error("Error fetching session details:", err);
		return c.json({ error: err.message || "فشل في تحميل تفاصيل الحصة" }, 500);
	}
});
sessionsRouter.post("/:id/records", async (c) => {
	try {
		const sessionId = c.req.param("id");
		const user = await getAuthenticatedUser(c);
		if (!user) return c.json({ error: "غير مصرح بالدخول" }, 401);
		if (user.role === "parent") return c.json({ error: "غير مصرح لأولياء الأمور بتعديل سجلات الطلاب" }, 403);
		const { records, notes, status } = await c.req.json();
		if (!Array.isArray(records)) return c.json({ error: "تنسيق السجلات غير صالح" }, 400);
		for (const rec of records) {
			await db.insert(sessionStudentRecords).values({
				id: rec.id || `rec_${sessionId}_${rec.studentId}`,
				sessionId,
				studentId: rec.studentId,
				attendanceStatus: rec.attendanceStatus || "present",
				absenceReason: rec.absenceReason || "",
				surahNumber: rec.surahNumber || null,
				surahName: rec.surahName || "",
				ayahStart: rec.ayahStart || null,
				ayahEnd: rec.ayahEnd || null,
				teacherRemarque: rec.teacherRemarque || "",
				isAssessed: rec.isAssessed !== void 0 ? Boolean(rec.isAssessed) : false
			}).onConflictDoUpdate({
				target: sessionStudentRecords.id,
				set: {
					attendanceStatus: rec.attendanceStatus || "present",
					absenceReason: rec.absenceReason || "",
					surahNumber: rec.surahNumber || null,
					surahName: rec.surahName || "",
					ayahStart: rec.ayahStart || null,
					ayahEnd: rec.ayahEnd || null,
					teacherRemarque: rec.teacherRemarque || "",
					isAssessed: rec.isAssessed !== void 0 ? Boolean(rec.isAssessed) : false
				}
			});
			if (rec.attendanceStatus === "present" && rec.surahName) await db.update(students).set({
				currentSurahName: rec.surahName,
				currentSurahNumber: rec.surahNumber || 1,
				currentAyah: rec.ayahEnd || rec.ayahStart || 1,
				updatedAt: /* @__PURE__ */ new Date()
			}).where(eq(students.id, rec.studentId));
		}
		await db.update(sessions).set({
			status: status || "completed",
			notes: notes !== void 0 ? notes : null,
			updatedAt: /* @__PURE__ */ new Date()
		}).where(eq(sessions.id, sessionId));
		return c.json({
			success: true,
			message: "تم حفظ ورصد الحضور والأداء بنجاح"
		});
	} catch (err) {
		console.error("Error saving session records:", err);
		return c.json({ error: err.message || "فشل في حفظ وتحديث بيانات الحصة" }, 500);
	}
});
sessionsRouter.post("/:id/records/:recordId", async (c) => {
	try {
		const sessionId = c.req.param("id");
		const recordId = c.req.param("recordId");
		const user = await getAuthenticatedUser(c);
		if (!user) return c.json({ error: "غير مصرح بالدخول" }, 401);
		if (user.role === "parent") return c.json({ error: "غير مصرح لأولياء الأمور بتعديل سجلات الطلاب" }, 403);
		const rec = await c.req.json();
		const isAssessed = rec.isAssessed !== void 0 ? Boolean(rec.isAssessed) : true;
		await db.insert(sessionStudentRecords).values({
			id: recordId,
			sessionId,
			studentId: rec.studentId,
			attendanceStatus: rec.attendanceStatus || "present",
			absenceReason: rec.absenceReason || "",
			surahNumber: rec.surahNumber || null,
			surahName: rec.surahName || "",
			ayahStart: rec.ayahStart || null,
			ayahEnd: rec.ayahEnd || null,
			teacherRemarque: rec.teacherRemarque || "",
			isAssessed
		}).onConflictDoUpdate({
			target: sessionStudentRecords.id,
			set: {
				attendanceStatus: rec.attendanceStatus || "present",
				absenceReason: rec.absenceReason || "",
				surahNumber: rec.surahNumber || null,
				surahName: rec.surahName || "",
				ayahStart: rec.ayahStart || null,
				ayahEnd: rec.ayahEnd || null,
				teacherRemarque: rec.teacherRemarque || "",
				isAssessed
			}
		});
		if (rec.attendanceStatus === "present" && rec.surahName && rec.studentId) await db.update(students).set({
			currentSurahName: rec.surahName,
			currentSurahNumber: rec.surahNumber || 1,
			currentAyah: rec.ayahEnd || rec.ayahStart || 1,
			updatedAt: /* @__PURE__ */ new Date()
		}).where(eq(students.id, rec.studentId));
		return c.json({
			success: true,
			message: "تم حفظ تقييم الطالب بنجاح",
			isAssessed
		});
	} catch (err) {
		console.error("Error saving single student record:", err);
		return c.json({ error: err.message || "فشل في حفظ تقييم الطالب" }, 500);
	}
});
var attendancesRouter = new OperationRegistry();
attendancesRouter.get("/", async (c) => {
	await ensureDatabaseInitialized();
	const groupId = c.req.query("groupId")?.trim();
	const studentId = c.req.query("studentId")?.trim();
	const date = c.req.query("date")?.trim();
	const statusFilter = c.req.query("status")?.trim();
	const search = c.req.query("search")?.trim().toLowerCase();
	const allAttendances = await db.select().from(attendances).orderBy(desc(attendances.createdAt));
	const allStudents = await db.select().from(students);
	const allTeachers = await db.select().from(teachers);
	const allGroups = await db.select().from(groups);
	const allGroupTypes = await db.select().from(groupTypes);
	const studentMap = new Map(allStudents.map((s) => [s.id, s]));
	const teacherMap = new Map(allTeachers.map((t) => [t.id, t]));
	const groupMap = new Map(allGroups.map((g) => [g.id, g]));
	const groupTypeMap = new Map(allGroupTypes.map((gt) => [gt.id, gt]));
	let enriched = allAttendances.map((att) => {
		const student = studentMap.get(att.studentId);
		const teacher = att.recordedByTeacherId ? teacherMap.get(att.recordedByTeacherId) : null;
		const group = groupMap.get(att.groupId);
		const groupType = group ? groupTypeMap.get(group.typeId) : null;
		return {
			...att,
			groupTypeName: att.groupTypeName || groupType?.name || "حلقة قرآنية",
			groupNumber: att.groupNumber ?? group?.number,
			student: student ? {
				id: student.id,
				name: student.name,
				avatar: student.avatar,
				gender: student.gender
			} : null,
			teacher: teacher ? {
				id: teacher.id,
				name: teacher.name,
				avatar: teacher.avatar
			} : null,
			group: group ? {
				id: group.id,
				number: group.number,
				type: groupType?.name || "حلقة قرآنية",
				studyTime: group.studyTime
			} : null
		};
	});
	if (groupId) enriched = enriched.filter((a) => a.groupId === groupId);
	if (studentId) enriched = enriched.filter((a) => a.studentId === studentId);
	if (date) enriched = enriched.filter((a) => a.date === date);
	if (statusFilter) enriched = enriched.filter((a) => a.status === statusFilter);
	if (search) enriched = enriched.filter((a) => a.student?.name.toLowerCase().includes(search) || a.reason && a.reason.toLowerCase().includes(search) || a.sessionTimeText && a.sessionTimeText.toLowerCase().includes(search) || a.groupTypeName && a.groupTypeName.toLowerCase().includes(search));
	return c.json({ attendances: enriched });
});
attendancesRouter.post("/bulk", async (c) => {
	await ensureDatabaseInitialized();
	try {
		const { groupId, date, sessionTimeText, recordedByTeacherId, records } = await c.req.json();
		if (!groupId) return c.json({ error: "معرف الحلقة مطلوب" }, 400);
		if (!date) return c.json({ error: "تاريخ الحصة مطلوب" }, 400);
		if (!Array.isArray(records) || records.length === 0) return c.json({ error: "سجل الحضور والغياب للطلاب فارغ" }, 400);
		const group = await db.select().from(groups).where(eq(groups.id, groupId)).then((r) => r[0]);
		let groupTypeName = "حلقة قرآنية";
		if (group?.typeId) {
			const gt = await db.select().from(groupTypes).where(eq(groupTypes.id, group.typeId)).then((r) => r[0]);
			if (gt) groupTypeName = gt.name;
		}
		const effectiveSessionTime = sessionTimeText?.trim() || group?.studyTime || "غير محدد";
		const existingGroupAttendances = await db.select().from(attendances).where(and(eq(attendances.groupId, groupId), eq(attendances.date, date)));
		const existingMap = new Map(existingGroupAttendances.map((item) => [item.studentId, item]));
		for (const rec of records) {
			const { studentId, status, reason } = rec;
			if (!studentId || !status) continue;
			const existingRecord = existingMap.get(studentId);
			if (existingRecord) await db.update(attendances).set({
				status,
				reason: reason?.trim() || null,
				sessionTimeText: effectiveSessionTime,
				recordedByTeacherId: recordedByTeacherId || existingRecord.recordedByTeacherId,
				updatedAt: /* @__PURE__ */ new Date()
			}).where(eq(attendances.id, existingRecord.id));
			else {
				const id = `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
				await db.insert(attendances).values({
					id,
					studentId,
					groupId,
					groupTypeName,
					groupNumber: group?.number || 1,
					date,
					sessionTimeText: effectiveSessionTime,
					status,
					reason: reason?.trim() || null,
					recordedByTeacherId: recordedByTeacherId || null,
					createdAt: /* @__PURE__ */ new Date(),
					updatedAt: /* @__PURE__ */ new Date()
				});
			}
		}
		return c.json({
			success: true,
			message: `تم حفظ سجل الغياب والحضور لعدد ${records.length} طلاب بنجاح`,
			savedCount: records.length
		});
	} catch (err) {
		console.error("Error recording group attendance:", err);
		return c.json({ error: err.message || "فشل في حفظ سجل الحضور والغياب" }, 500);
	}
});
attendancesRouter.put("/:id", async (c) => {
	await ensureDatabaseInitialized();
	const id = c.req.param("id");
	try {
		const body = await c.req.json();
		const existing = await db.select().from(attendances).where(eq(attendances.id, id)).then((r) => r[0]);
		if (!existing) return c.json({ error: "سجل الغياب غير موجود" }, 404);
		const updated = {
			status: body.status || existing.status,
			reason: body.reason !== void 0 ? body.reason?.trim() || null : existing.reason,
			sessionTimeText: body.sessionTimeText?.trim() || existing.sessionTimeText,
			updatedAt: /* @__PURE__ */ new Date()
		};
		await db.update(attendances).set(updated).where(eq(attendances.id, id));
		return c.json({
			success: true,
			attendance: {
				...existing,
				...updated
			}
		});
	} catch (err) {
		return c.json({ error: err.message || "فشل في تعديل سجل الغياب" }, 500);
	}
});
attendancesRouter.delete("/:id", async (c) => {
	await ensureDatabaseInitialized();
	const id = c.req.param("id");
	try {
		await db.delete(attendances).where(eq(attendances.id, id));
		return c.json({
			success: true,
			message: "تم حذف سجل الغياب بنجاح"
		});
	} catch (err) {
		return c.json({ error: err.message || "فشل في حذف سجل الغياب" }, 500);
	}
});
var statsRouter = new OperationRegistry();
statsRouter.get("/counts", async (c) => {
	await ensureDatabaseInitialized();
	try {
		const allStudents = await db.select({ id: students.id }).from(students);
		const allParents = await db.select({ id: parents.id }).from(parents);
		const allTeachers = await db.select({ id: teachers.id }).from(teachers);
		const allGroups = await db.select({ id: groups.id }).from(groups);
		const allRatings = await db.select({ id: studentRatings.id }).from(studentRatings);
		return c.json({ counts: {
			students: allStudents.length,
			parents: allParents.length,
			teachers: allTeachers.length,
			groups: allGroups.length,
			ratings: allRatings.length
		} });
	} catch (err) {
		return c.json({ counts: {
			students: 0,
			parents: 0,
			teachers: 0,
			groups: 0,
			ratings: 0
		} });
	}
});
statsRouter.get("/", async (c) => {
	await ensureDatabaseInitialized();
	const allStudents = await db.select().from(students);
	const allTeachers = await db.select().from(teachers);
	const allGroups = await db.select().from(groups);
	const allRatings = await db.select().from(studentRatings);
	const totalStudents = allStudents.length;
	const totalTeachers = allTeachers.length;
	const totalGroups = allGroups.length;
	const averageRating = allRatings.length > 0 ? Math.round(allRatings.reduce((acc, r) => acc + r.overallScore, 0) / allRatings.length) : 92;
	const totalJuzMemorized = allStudents.reduce((acc, s) => acc + (s.memorizedJuzCount || 0), 0);
	const topStudents = [...allStudents].sort((a, b) => (b.memorizedJuzCount || 0) - (a.memorizedJuzCount || 0)).slice(0, 5);
	return c.json({ stats: {
		totalStudents,
		totalTeachers,
		totalGroups,
		averageRating,
		totalJuzMemorized,
		topStudents
	} });
});
var quranRouter = new OperationRegistry();
quranRouter.get("/surahs", (c) => {
	return c.json({ surahs: QURAN_SURAHS });
});
var apiRouter = new OperationRegistry();
apiRouter.route("/api/students", studentsRouter);
apiRouter.route("/api/parents", parentsRouter);
apiRouter.route("/api/teachers", teachersRouter);
apiRouter.route("/api/groups", groupsRouter);
apiRouter.route("/api/group-types", groupTypesRouter);
apiRouter.route("/api/ratings", ratingsRouter);
apiRouter.route("/api/sessions", sessionsRouter);
apiRouter.route("/api/attendances", attendancesRouter);
apiRouter.route("/api/stats", statsRouter);
apiRouter.route("/api/quran", quranRouter);
apiRouter.route("/api/storage", storageRouter);
apiRouter.route("/api/prayer-times", prayerTimesRouter);
//#endregion
export { apiRouter };
