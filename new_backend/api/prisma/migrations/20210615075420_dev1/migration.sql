-- CreateTable
CREATE TABLE "accounts" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "accesstoken" TEXT NOT NULL,
    "refreshtoken" VARCHAR(255) NOT NULL,
    "tokenlastrefreshed" TIMESTAMPTZ(6) NOT NULL,
    "state" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offers" (
    "id" SERIAL NOT NULL,
    "offerid" INTEGER NOT NULL,
    "propositionid" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "offerbucket" TEXT NOT NULL,
    "accountid" INTEGER NOT NULL,
    "validto" TIMESTAMPTZ(6) NOT NULL,
    "state" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts.username_unique" ON "accounts"("username");
