import { db } from "../storage";
import { auditLogs } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface AuditLogEntry {
  organizationId: number;
  actorId?: number;
  actorType: "user" | "system" | "admin";
  action: string;
  resourceType?: string;
  resourceId?: number;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Audit Service: Comprehensive audit logging for compliance
 */
export class AuditService {
  /**
   * Log audit event
   */
  static async log(entry: AuditLogEntry) {
    try {
      await db.insert(auditLogs).values({
        organizationId: entry.organizationId,
        actorId: entry.actorId,
        actorType: entry.actorType,
        action: entry.action,
        resourceType: entry.resourceType,
        resourceId: entry.resourceId,
        details: entry.details,
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent,
      });
    } catch (error) {
      console.error("Failed to log audit entry:", error);
    }
  }

  /**
   * Get audit logs for organization with filtering
   */
  static async getOrgAuditLogs(
    organizationId: number,
    options?: {
      action?: string;
      actorId?: number;
      limit?: number;
      offset?: number;
    }
  ) {
    let query = db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.organizationId, organizationId));

    if (options?.action) {
      query = query.where(eq(auditLogs.action, options.action));
    }

    if (options?.actorId) {
      query = query.where(eq(auditLogs.actorId, options.actorId));
    }

    const limit = options?.limit || 100;
    const offset = options?.offset || 0;

    return query.limit(limit).offset(offset);
  }

  /**
   * Helper methods for common audit actions
   */

  static async logDataExport(
    organizationId: number,
    actorId: number,
    dataType: string,
    details?: any,
    ipAddress?: string,
    userAgent?: string
  ) {
    await this.log({
      organizationId,
      actorId,
      actorType: "user",
      action: "export_data",
      resourceType: dataType,
      details: { dataType, ...details },
      ipAddress,
      userAgent,
    });
  }

  static async logDataDeletion(
    organizationId: number,
    actorId: number,
    userId: number,
    ipAddress?: string,
    userAgent?: string
  ) {
    await this.log({
      organizationId,
      actorId,
      actorType: "user",
      action: "delete_user_data",
      resourceType: "user",
      resourceId: userId,
      ipAddress,
      userAgent,
    });
  }

  static async logSettingsChange(
    organizationId: number,
    actorId: number,
    settingType: string,
    oldValue: any,
    newValue: any,
    ipAddress?: string,
    userAgent?: string
  ) {
    await this.log({
      organizationId,
      actorId,
      actorType: "user",
      action: "update_settings",
      resourceType: settingType,
      details: { oldValue, newValue },
      ipAddress,
      userAgent,
    });
  }
}
