-- CreateTable
CREATE TABLE `_CategoriaToProdutos` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CategoriaToProdutos_AB_unique`(`A`, `B`),
    INDEX `_CategoriaToProdutos_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_CategoriaToProdutos` ADD CONSTRAINT `_CategoriaToProdutos_A_fkey` FOREIGN KEY (`A`) REFERENCES `Categoria`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CategoriaToProdutos` ADD CONSTRAINT `_CategoriaToProdutos_B_fkey` FOREIGN KEY (`B`) REFERENCES `Produtos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
