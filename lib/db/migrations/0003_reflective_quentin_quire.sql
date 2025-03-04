CREATE TABLE IF NOT EXISTS "ab_test" (
	"id" serial PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"location" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ab_test_result" (
	"id" serial PRIMARY KEY NOT NULL,
	"test_id" integer NOT NULL,
	"user_ip" varchar(45) NOT NULL,
	"variant" varchar(50) NOT NULL,
	"starting_time" timestamp NOT NULL,
	"ending_time" timestamp NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ab_test_result" ADD CONSTRAINT "ab_test_result_test_id_ab_test_id_fk" FOREIGN KEY ("test_id") REFERENCES "public"."ab_test"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
