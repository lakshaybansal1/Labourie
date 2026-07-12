-- CreateTable
CREATE TABLE "public"."WorkerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "skills" TEXT[],
    "hourlyRate" INTEGER NOT NULL,
    "serviceRadius" INTEGER NOT NULL,
    "city" TEXT,
    "state" TEXT,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkerProfile_userId_key" ON "public"."WorkerProfile"("userId");

-- CreateIndex
CREATE INDEX "WorkerProfile_hourlyRate_idx" ON "public"."WorkerProfile"("hourlyRate");

-- CreateIndex
CREATE INDEX "WorkerProfile_isAvailable_idx" ON "public"."WorkerProfile"("isAvailable");

-- CreateIndex
CREATE INDEX "WorkerProfile_isVerified_idx" ON "public"."WorkerProfile"("isVerified");

-- AddForeignKey
ALTER TABLE "public"."WorkerProfile" ADD CONSTRAINT "WorkerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
