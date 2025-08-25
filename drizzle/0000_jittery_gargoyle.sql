-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "user_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"total_entries" integer DEFAULT 0,
	"total_words" integer DEFAULT 0,
	"current_streak" integer DEFAULT 0,
	"longest_streak" integer DEFAULT 0,
	"last_entry_date" timestamp,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "achievements" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"icon" text NOT NULL,
	"unlocked_at" timestamp DEFAULT now(),
	"achievement_id" text,
	"rarity" text DEFAULT 'common',
	"target_value" integer DEFAULT 1,
	"current_value" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"level" integer DEFAULT 1,
	"xp" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"role" text DEFAULT 'user',
	"avatar" text,
	"bio" text,
	"quote" text,
	"theme" text DEFAULT 'dark',
	"preferences" json DEFAULT '{}'::json,
	"ai_personality" text DEFAULT 'friendly',
	"favorite_quote" text,
	"provider" text DEFAULT 'local',
	"provider_id" text,
	"profile_image_url" text,
	"first_name" text,
	"last_name" text,
	"is_active" boolean DEFAULT true,
	"last_login_at" timestamp,
	"email_verified" boolean DEFAULT false,
	"updated_at" timestamp DEFAULT now(),
	"current_plan" text DEFAULT 'free',
	"prompts_used_this_month" integer DEFAULT 0,
	"prompts_remaining" integer DEFAULT 100,
	"storage_used_mb" integer DEFAULT 0,
	"last_usage_reset" timestamp DEFAULT now(),
	"subscription_tier" text DEFAULT 'free',
	"subscription_status" text DEFAULT 'active',
	"subscription_expires_at" timestamp,
	"storage_limit_mb" integer DEFAULT 100,
	"stripe_subscription_id" text,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "journal_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"mood" text NOT NULL,
	"word_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"font_family" text DEFAULT 'Inter',
	"font_size" integer DEFAULT 16,
	"text_color" text DEFAULT '#ffffff',
	"background_color" text DEFAULT '#1e293b',
	"drawings" json,
	"photos" json,
	"tags" json,
	"ai_insights" json,
	"is_private" boolean DEFAULT false,
	"location" text,
	"weather" text
);
--> statement-breakpoint
CREATE TABLE "session" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mood_trends" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"date" date NOT NULL,
	"mood" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "journal_prompts" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" text NOT NULL,
	"text" text NOT NULL,
	"difficulty" text DEFAULT 'medium',
	"is_kid_friendly" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "admin_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"metric_name" text NOT NULL,
	"metric_value" numeric NOT NULL,
	"recorded_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"value" text NOT NULL,
	"updated_by" integer,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "site_settings_key_key" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "user_activity_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"action" text NOT NULL,
	"details" json,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "announcements" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"target_audience" text DEFAULT 'all',
	"is_active" boolean DEFAULT true,
	"created_by" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "prompt_purchases" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"stripe_payment_id" text NOT NULL,
	"amount" integer NOT NULL,
	"prompts_added" integer NOT NULL,
	"status" text DEFAULT 'completed',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "prompt_purchases_stripe_payment_id_key" UNIQUE("stripe_payment_id")
);
--> statement-breakpoint
CREATE TABLE "goals" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"target_value" integer,
	"current_value" integer DEFAULT 0,
	"status" text DEFAULT 'active',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"goal_id" text,
	"difficulty" text DEFAULT 'beginner',
	"type" text DEFAULT 'writing',
	"is_completed" boolean DEFAULT false,
	"deadline" timestamp,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "email_campaigns" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"subject" text NOT NULL,
	"content" text NOT NULL,
	"target_audience" text DEFAULT 'all',
	"status" text DEFAULT 'draft',
	"recipient_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"html_content" text,
	"scheduled_at" timestamp,
	"sent_at" timestamp,
	"open_rate" numeric(5, 2) DEFAULT '0.0',
	"click_rate" numeric(5, 2) DEFAULT '0.0'
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"tier" text NOT NULL,
	"status" text DEFAULT 'active',
	"stripe_subscription_id" text,
	"amount" integer,
	"billing_cycle" text DEFAULT 'monthly',
	"created_at" timestamp DEFAULT now(),
	"expires_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "user_stats" ADD CONSTRAINT "user_stats_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mood_trends" ADD CONSTRAINT "mood_trends_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_activity_logs" ADD CONSTRAINT "user_activity_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prompt_purchases" ADD CONSTRAINT "prompt_purchases_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goals" ADD CONSTRAINT "goals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_session_expire" ON "session" USING btree ("expire" timestamp_ops);
*/