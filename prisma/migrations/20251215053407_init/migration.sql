-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "password_hash" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "expires_at" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "user_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "gold_prices" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "buy_price" INTEGER NOT NULL,
    "sell_price" INTEGER NOT NULL,
    "effective_date" DATETIME NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'Pegadaian',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "estimations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT,
    "estimation_id" TEXT NOT NULL,
    "image_url" TEXT,
    "image_base64" TEXT,
    "object_type" TEXT NOT NULL,
    "estimated_weight" REAL NOT NULL,
    "karat" INTEGER NOT NULL,
    "condition" TEXT NOT NULL,
    "confidence_object_detection" REAL NOT NULL,
    "confidence_weight_estimation" REAL NOT NULL,
    "confidence_karat_analysis" REAL NOT NULL,
    "confidence_condition_analysis" REAL NOT NULL,
    "gold_price_per_gram" INTEGER NOT NULL,
    "estimated_gold_value" INTEGER NOT NULL,
    "max_ltv_percentage" INTEGER NOT NULL,
    "max_loan_amount" INTEGER NOT NULL,
    "admin_fee" INTEGER NOT NULL,
    "net_loan_amount" INTEGER NOT NULL,
    "rag_validation_id" TEXT,
    "rag_is_valid" BOOLEAN,
    "rag_confidence_score" REAL,
    "rag_validation_steps" TEXT,
    "rag_recommendations" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "expires_at" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "gold_price_id" TEXT,
    CONSTRAINT "estimations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "estimations_gold_price_id_fkey" FOREIGN KEY ("gold_price_id") REFERENCES "gold_prices" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "estimation_id" TEXT NOT NULL,
    "user_id" TEXT,
    "application_number" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "id_card_number" TEXT,
    "id_card_image" TEXT,
    "requested_amount" INTEGER NOT NULL,
    "approved_amount" INTEGER,
    "interest_rate" REAL,
    "loan_duration" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "current_step" TEXT NOT NULL,
    "progress_percentage" INTEGER NOT NULL DEFAULT 0,
    "approved_by" TEXT,
    "approved_at" DATETIME,
    "rejection_reason" TEXT,
    "rejected_at" DATETIME,
    "branch_id" TEXT,
    "branch_name" TEXT,
    "branch_address" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "expires_at" DATETIME,
    CONSTRAINT "applications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "applications_estimation_id_fkey" FOREIGN KEY ("estimation_id") REFERENCES "estimations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "application_status_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "application_id" TEXT NOT NULL,
    "step" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    CONSTRAINT "application_status_logs_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "validation_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "estimation_id" TEXT NOT NULL,
    "validation_type" TEXT NOT NULL,
    "step_name" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL,
    "confidence_score" REAL NOT NULL,
    "input_data" TEXT,
    "output_data" TEXT,
    "error_message" TEXT,
    "processing_time_ms" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "validation_logs_estimation_id_fkey" FOREIGN KEY ("estimation_id") REFERENCES "estimations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "knowledge_base" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "keywords" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "system_config" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resource_id" TEXT,
    "old_values" TEXT,
    "new_values" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "email_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recipient_email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "template_type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "error_message" TEXT,
    "sent_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "admin_activities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "admin_id" TEXT NOT NULL,
    "activity_type" TEXT NOT NULL,
    "target_type" TEXT,
    "target_id" TEXT,
    "description" TEXT,
    "ip_address" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_session_token_key" ON "user_sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "gold_prices_effective_date_key" ON "gold_prices"("effective_date");

-- CreateIndex
CREATE UNIQUE INDEX "estimations_estimation_id_key" ON "estimations"("estimation_id");

-- CreateIndex
CREATE UNIQUE INDEX "applications_estimation_id_key" ON "applications"("estimation_id");

-- CreateIndex
CREATE UNIQUE INDEX "applications_application_number_key" ON "applications"("application_number");

-- CreateIndex
CREATE UNIQUE INDEX "knowledge_base_category_title_key" ON "knowledge_base"("category", "title");

-- CreateIndex
CREATE UNIQUE INDEX "system_config_key_key" ON "system_config"("key");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_resource_idx" ON "audit_logs"("resource");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- CreateIndex
CREATE INDEX "email_logs_recipient_email_idx" ON "email_logs"("recipient_email");

-- CreateIndex
CREATE INDEX "email_logs_created_at_idx" ON "email_logs"("created_at");

-- CreateIndex
CREATE INDEX "admin_activities_admin_id_idx" ON "admin_activities"("admin_id");

-- CreateIndex
CREATE INDEX "admin_activities_created_at_idx" ON "admin_activities"("created_at");
