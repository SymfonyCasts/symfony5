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

    // /**
    //  * @return QuestionTag[] Returns an array of QuestionTag objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('q')
            ->andWhere('q.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('q.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?QuestionTag
    {
        return $this->createQueryBuilder('q')
            ->andWhere('q.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
