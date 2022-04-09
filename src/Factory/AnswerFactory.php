<?php

namespace App\Factory;

use App\Entity\Answer;
use App\Repository\AnswerRepository;
use Zenstruck\Foundry\ModelFactory;
use Zenstruck\Foundry\Proxy;
use Zenstruck\Foundry\RepositoryProxy;

/**
 * @extends ModelFactory<Answer>
 *
 * @method static       Answer|Proxy createOne(array $attributes = [])
 * @method static       Answer[]|Proxy[] createMany(int $number, array|callable $attributes = [])
 * @method static       Answer|Proxy find(object|array|mixed $criteria)
 * @method static       Answer|Proxy findOrCreate(array $attributes)
 * @method static       Answer|Proxy first(string $sortedField = 'id')
 * @method static       Answer|Proxy last(string $sortedField = 'id')
 * @method static       Answer|Proxy random(array $attributes = [])
 * @method static       Answer|Proxy randomOrCreate(array $attributes = [])
 * @method static       Answer[]|Proxy[] all()
 * @method static       Answer[]|Proxy[] findBy(array $attributes)
 * @method static       Answer[]|Proxy[] randomSet(int $number, array $attributes = [])
 * @method static       Answer[]|Proxy[] randomRange(int $min, int $max, array $attributes = [])
 * @method static       AnswerRepository|RepositoryProxy repository()
 * @method Answer|Proxy create(array|callable $attributes = [])
 */
final class AnswerFactory extends ModelFactory
{
    public function __construct()
    {
        parent::__construct();

        // inject services if required (https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#factories-as-services)
    }

    public function needsApproval(): self
    {
        return $this->addState(['status' => Answer::STATUS_NEEDS_APPROVAL]);
    }

    protected function getDefaults(): array
    {
        return [
            'content' => self::faker()->text(),
            'username' => self::faker()->userName(),
            'createdAt' => self::faker()->dateTimeBetween('-1 year'),
            'votes' => rand(-20, 50),
            'question' => QuestionFactory::new()->unpublished(),
            'status' => Answer::STATUS_APPROVED,
        ];
    }

    protected function initialize(): self
    {
        // see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#initialization
        return $this
            // ->afterInstantiate(function(Answer $answer) {})
        ;
    }

    protected static function getClass(): string
    {
        return Answer::class;
    }
}
