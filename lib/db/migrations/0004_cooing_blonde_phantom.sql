ALTER TABLE "ab_test" RENAME COLUMN "id" TO "name";--> statement-breakpoint
ALTER TABLE "ab_test_result" RENAME COLUMN "test_id" TO "test_name";--> statement-breakpoint
ALTER TABLE "ab_test_result" DROP CONSTRAINT "ab_test_result_test_id_ab_test_id_fk";
ALTER TABLE "ab_test" ALTER COLUMN "name" TYPE VARCHAR(255);--> statement-breakpoint
ALTER TABLE "ab_test_result" ALTER COLUMN "test_name" TYPE VARCHAR(255);--> statement-breakpoint
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ab_test_result" ADD CONSTRAINT "ab_test_result_test_name_ab_test_name_fk" FOREIGN KEY ("test_name") REFERENCES "public"."ab_test"("name") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
