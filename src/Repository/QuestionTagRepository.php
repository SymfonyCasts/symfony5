<?php

namespace App\Repository;

use App\Entity\QuestionTag;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method QuestionTag|null find($id, $lockMode = null, $lockVersion = null)
 * @method QuestionTag|null findOneBy(array $criteria, array $orderBy = null)
 * @method QuestionTag[]    findAll()
 * @method QuestionTag[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class QuestionTagRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, QuestionTag::class);
    }
}
