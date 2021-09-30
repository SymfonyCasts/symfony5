<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20210902182514 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE answer ADD status VARCHAR(15) NOT NULL');
        $this->addSql('ALTER TABLE answer RENAME INDEX idx_9474526c1e27f6bf TO IDX_DADD4A251E27F6BF');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE answer DROP status');
        $this->addSql('ALTER TABLE answer RENAME INDEX idx_dadd4a251e27f6bf TO IDX_9474526C1E27F6BF');
    }
}
