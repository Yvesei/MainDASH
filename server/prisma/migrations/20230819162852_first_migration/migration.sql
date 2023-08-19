-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `image` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'USER') NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `number` VARCHAR(191) NOT NULL,
    `distance` INTEGER NOT NULL,
    `image` VARCHAR(191) NULL,

    UNIQUE INDEX `Client_number_key`(`number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Task` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Date` DATETIME(3) NOT NULL,
    `dateStart` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateEnd` DATETIME(3) NULL,
    `type` VARCHAR(999) NULL,
    `supply` VARCHAR(999) NULL,
    `supplyFile` VARCHAR(191) NULL,
    `devis` VARCHAR(999) NULL,
    `endTask` BOOLEAN NULL,
    `result` VARCHAR(9999) NULL,
    `followupBool` BOOLEAN NULL,
    `followupAutre` VARCHAR(999) NULL,
    `clientId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
