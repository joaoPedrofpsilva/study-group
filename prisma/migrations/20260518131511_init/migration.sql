-- CreateTable
CREATE TABLE "Feedback" (
    "id" SERIAL NOT NULL,
    "autor" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "nota" INTEGER NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);
