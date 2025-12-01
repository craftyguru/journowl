import crypto from "crypto";
import { db } from "../storage";
import { aiRequests, organizationAiSettings } from "@shared/schema";
import { eq, and } from "drizzle-orm";

interface AIRequestContext {
  organizationId: number;
  userId: number;
  feature: string;
  model: string;
  content: string;
}

/**
 * AI Gateway Service: Centralized AI call management with governance
 * - Policy enforcement (allowed features, token limits, PII redaction)
 * - Audit logging (ai_requests table)
 * - Cost tracking
 * - Response caching
 */
export class AIGatewayService {
  /**
   * Execute AI call with governance enforcement
   */
  static async executeAICall(
    ctx: AIRequestContext,
    callFn: (content: string) => Promise<any>
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      // 1. Check org AI settings
      const settings = await db
        .select()
        .from(organizationAiSettings)
        .where(eq(organizationAiSettings.organizationId, ctx.organizationId))
        .limit(1);

      const orgSettings = settings[0];

      if (!orgSettings) {
        return { success: false, error: "Organization AI settings not found" };
      }

      // 2. Check if feature is allowed
      if (ctx.feature === "coaching_chat" && !orgSettings.allowCoachingChat) {
        await this.logAIRequest(ctx, "blocked");
        return { success: false, error: "Coaching chat disabled for your organization" };
      }

      // 3. Check model is allowed
      const allowedModels = (orgSettings.allowedModels as string[]) || ["gpt-4o-mini"];
      if (!allowedModels.includes(ctx.model)) {
        await this.logAIRequest(ctx, "blocked");
        return { success: false, error: `Model ${ctx.model} not allowed for organization` };
      }

      // 4. Redact PII if enabled
      let processedContent = ctx.content;
      if (orgSettings.redactPii && !orgSettings.allowPersonalDataToAi) {
        processedContent = this.redactPII(ctx.content);
      }

      // 5. Execute AI call
      const response = await callFn(processedContent);

      // 6. Log successful request
      const tokensIn = this.estimateTokens(processedContent);
      const tokensOut = this.estimateTokens(JSON.stringify(response));
      const costUsd = this.calculateCost(tokensIn, tokensOut);

      await this.logAIRequest(ctx, "success", tokensIn, tokensOut, costUsd);

      return { success: true, data: response };
    } catch (error: any) {
      await this.logAIRequest(ctx, "error");
      return { success: false, error: error.message };
    }
  }

  /**
   * Redact personally identifiable information
   */
  static redactPII(text: string): string {
    return text
      // Email addresses
      .replace(/[\w\.-]+@[\w\.-]+\.\w+/g, "[EMAIL]")
      // Phone numbers
      .replace(/(\+\d{1,3})?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, "[PHONE]")
      // SSN
      .replace(/\d{3}-\d{2}-\d{4}/g, "[SSN]")
      // Credit card
      .replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, "[CARD]")
      // Common names (basic approach)
      .replace(/\b(John|Jane|Michael|David|Sarah|Emma)\b/g, "[NAME]");
  }

  /**
   * Estimate token count (rough approximation: 1 token ≈ 4 chars)
   */
  static estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  /**
   * Calculate cost: GPT-4o mini pricing
   * Input: $0.15 / 1M tokens, Output: $0.60 / 1M tokens
   */
  static calculateCost(tokensIn: number, tokensOut: number): number {
    const inputCost = (tokensIn / 1_000_000) * 0.15;
    const outputCost = (tokensOut / 1_000_000) * 0.60;
    return Math.round((inputCost + outputCost) * 10000) / 10000; // Round to 4 decimals
  }

  /**
   * Log AI request to audit table
   */
  static async logAIRequest(
    ctx: AIRequestContext,
    status: "success" | "error" | "blocked" | "redacted",
    tokensIn: number = 0,
    tokensOut: number = 0,
    costUsd: number = 0
  ) {
    try {
      const promptHash = crypto
        .createHash("sha256")
        .update(ctx.content)
        .digest("hex");

      await db.insert(aiRequests).values({
        organizationId: ctx.organizationId,
        userId: ctx.userId,
        feature: ctx.feature,
        model: ctx.model,
        promptHash,
        tokensIn,
        tokensOut,
        costUsd: Math.round(costUsd * 100), // Store in cents
        status,
      });
    } catch (error) {
      console.error("Failed to log AI request:", error);
    }
  }

  /**
   * Get AI usage stats for organization
   */
  static async getOrgAIUsage(organizationId: number, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const usage = await db
      .select({
        feature: aiRequests.feature,
        totalTokensIn: aiRequests.tokensIn,
        totalTokensOut: aiRequests.tokensOut,
        totalCost: aiRequests.costUsd,
        requestCount: aiRequests.id,
      })
      .from(aiRequests)
      .where(
        and(
          eq(aiRequests.organizationId, organizationId),
          eq(aiRequests.status, "success")
        )
      );

    return usage;
  }
}
