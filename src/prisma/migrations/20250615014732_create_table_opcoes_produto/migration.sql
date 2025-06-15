-- CreateTable
CREATE TABLE `OpcoesProduto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `produto_id` INTEGER NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `shape` ENUM('Círculo', 'Quadrado') NOT NULL DEFAULT 'Quadrado',
    `radius` INTEGER NOT NULL DEFAULT 0,
    `type` ENUM('Cor', 'Texto') NOT NULL DEFAULT 'Texto',
    `valores_produto` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `OpcoesProduto` ADD CONSTRAINT `OpcoesProduto_produto_id_fkey` FOREIGN KEY (`produto_id`) REFERENCES `Produtos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
