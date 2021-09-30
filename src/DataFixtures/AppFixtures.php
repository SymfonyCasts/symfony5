<?php

namespace App\DataFixtures;

use App\Entity\Question;
use App\Factory\QuestionFactory;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager)
    {
        QuestionFactory::new()->createMany(20);

        QuestionFactory::new()
            ->unpublished()
            ->createMany(5)
        ;

        $manager->flush();
    }
}
