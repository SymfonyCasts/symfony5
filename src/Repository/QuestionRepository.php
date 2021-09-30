<?php

namespace App\Repository;

use App\Entity\Question;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Question|null find($id, $lockMode = null, $lockVersion = null)
 * @method Question|null findOneBy(array $criteria, array $orderBy = null)
 * @method Question[]    findAll()
 * @method Question[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class QuestionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Question::class);
    }

     /**
      * @return Question[] Returns an array of Question objects
      */
    public function findAllAskedOrderedByNewest()
    {
        $qb = $this->createQueryBuilder('q');

        return $this->addIsAskedQueryBuilder($qb)
            ->orderBy('q.askedAt', 'DESC')
            ->getQuery()
            ->getResult()
        ;
    }

    private function addIsAskedQueryBuilder(QueryBuilder $qb): QueryBuilder
    {
        return $qb->andWhere('q.askedAt IS NOT NULL');
    }

    /*
    public function findOneBySomeField($value): ?Question
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
