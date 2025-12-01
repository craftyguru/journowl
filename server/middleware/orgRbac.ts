import type { Request, Response, NextFunction } from "express";
import { db } from "../storage";
import { organizationMembers, users } from "@shared/schema";
import { eq, and } from "drizzle-orm";

declare global {
  namespace Express {
    interface Request {
      user?: any;
      orgId?: number;
      orgRoles?: string[];
    }
  }
}

/**
 * Middleware to populate organization context from session user
 * Attaches orgId and orgRoles to request for downstream middleware/routes
 */
export async function enrichOrgContext(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.session?.userId) {
      return next();
    }

    const userId = req.session.userId;
    
    // Query user's organization memberships
    const memberships = await db
      .select({
        organizationId: organizationMembers.organizationId,
        role: organizationMembers.role,
      })
      .from(organizationMembers)
      .where(eq(organizationMembers.userId, userId));

    if (memberships.length === 0) {
      req.orgId = undefined;
      req.orgRoles = [];
      return next();
    }

    // Primary org is first membership (can be expanded for multi-org support)
    req.orgId = memberships[0].organizationId;
    req.orgRoles = memberships.map(m => m.role);

  } catch (error) {
    console.error("Error enriching org context:", error);
  }
  next();
}

/**
 * Require authenticated user with organization context
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

/**
 * Require specific organization role(s)
 */
export function requireOrgRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!req.orgRoles || !req.orgRoles.some(r => allowedRoles.includes(r))) {
      return res.status(403).json({ 
        error: "Forbidden", 
        message: `Requires one of: ${allowedRoles.join(", ")}` 
      });
    }

    next();
  };
}

/**
 * Require organization admin or higher
 */
export function requireOrgAdmin(req: Request, res: Response, next: NextFunction) {
  requireOrgRole("owner", "admin")(req, res, next);
}

/**
 * Require organization owner
 */
export function requireOrgOwner(req: Request, res: Response, next: NextFunction) {
  requireOrgRole("owner")(req, res, next);
}

/**
 * Scope query to organization
 * Returns: { organizationId: req.orgId }
 */
export function withOrgScope(req: Request) {
  return { organizationId: req.orgId };
}

/**
 * Validate user has access to resource in their organization
 */
export async function validateOrgResourceAccess(
  userId: number,
  organizationId: number,
  resourceTable: any,
  resourceId: number
) {
  const resource = await db
    .select()
    .from(resourceTable)
    .where(and(
      eq(resourceTable.organizationId, organizationId),
      eq(resourceTable.id, resourceId)
    ))
    .limit(1);

  return resource.length > 0;
}

/**
 * Get user's organization context
 */
export async function getUserOrgContext(userId: number) {
  const memberships = await db
    .select({
      organizationId: organizationMembers.organizationId,
      role: organizationMembers.role,
      organizationName: users.username, // placeholder
    })
    .from(organizationMembers)
    .where(eq(organizationMembers.userId, userId));

  return {
    primaryOrgId: memberships?.[0]?.organizationId,
    roles: memberships.map(m => ({ orgId: m.organizationId, role: m.role })),
  };
}
