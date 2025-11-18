import { AuditLog } from "../models/auditLog.js";


export const logAction = async ({ actorId, targetId = null, action, details = {}, req = null }) => {
try {
const ip = req ? (req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress) : null;
const userAgent = req ? req.headers['user-agent'] : null;


await AuditLog.create({ actorId, targetId, action, details, ip, userAgent });
} catch (err) {
// Non-blocking: log to console but don't throw to avoid breaking admin operations
console.error('Failed to write audit log', err);
}
};