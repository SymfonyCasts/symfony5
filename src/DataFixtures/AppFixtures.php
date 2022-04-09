<?php

namespace App\DataFixtures;

use App\Factory\AnswerFactory;
use App\Factory\QuestionFactory;
use App\Factory\QuestionTagFactory;
use App\Factory\TagFactory;
use App\Factory\UserFactory;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager)
    {
        UserFactory::createOne([
            'email' => 'abraca_admin@example.com',
            'roles' => ['ROLE_ADMIN'],
        ]);
        UserFactory::createOne([
            'email' => 'abraca_user@example.com',
        ]);
        UserFactory::createMany(10);

        TagFactory::createMany(100);

        $questions = QuestionFactory::createMany(20, function () {
            return [
                'owner' => UserFactory::random(),
            ];
        });

        QuestionTagFactory::createMany(100, function () {
            return [
                'tag' => TagFactory::random(),
                'question' => QuestionFactory::random(),
            ];
        });

        QuestionFactory::new()
            ->unpublished()
            ->many(5)
            ->create()
        ;

        AnswerFactory::createMany(100, function () use ($questions) {
            return [
                'question' => $questions[array_rand($questions)],
            ];
        });
        AnswerFactory::new(function () use ($questions) {
            return [
                'question' => $questions[array_rand($questions)],
            ];
        })->needsApproval()->many(20)->create();

        $manager->flush();
    }
}
