-- CreateTable
CREATE TABLE "Attendance" (
    "id" SERIAL NOT NULL,
    "internId" INTEGER,
    "timeIn" TIMESTAMP(3) NOT NULL,
    "timeOut" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Completion_Status" (
    "id" SERIAL NOT NULL,
    "attendanceId" INTEGER,
    "hoursToComplete" INTEGER NOT NULL DEFAULT 0,
    "hoursRendered" INTEGER NOT NULL DEFAULT 0,
    "hoursNeededLeft" INTEGER NOT NULL DEFAULT 0,
    "daysToComplete" INTEGER NOT NULL DEFAULT 0,
    "daysRendered" INTEGER NOT NULL DEFAULT 0,
    "daysLeft" INTEGER NOT NULL DEFAULT 0,
    "overtime" INTEGER DEFAULT 0,
    "endOfInternship" TIMESTAMP(3),

    CONSTRAINT "Completion_Status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tasks" (
    "id" SERIAL NOT NULL,
    "internId" INTEGER,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Tasks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_internId_fkey" FOREIGN KEY ("internId") REFERENCES "Intern"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Completion_Status" ADD CONSTRAINT "Completion_Status_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "Attendance"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_internId_fkey" FOREIGN KEY ("internId") REFERENCES "Intern"("id") ON DELETE SET NULL ON UPDATE CASCADE;
