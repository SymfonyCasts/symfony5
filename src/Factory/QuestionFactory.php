<?php

namespace App\Factory;

use App\Entity\Question;
use App\Repository\QuestionRepository;
use Zenstruck\Foundry\ModelFactory;
use Zenstruck\Foundry\Proxy;
use Zenstruck\Foundry\RepositoryProxy;

/**
 * @extends ModelFactory<Question>
 *
 * @method static         Question|Proxy createOne(array $attributes = [])
 * @method static         Question[]|Proxy[] createMany(int $number, array|callable $attributes = [])
 * @method static         Question|Proxy find(object|array|mixed $criteria)
 * @method static         Question|Proxy findOrCreate(array $attributes)
 * @method static         Question|Proxy first(string $sortedField = 'id')
 * @method static         Question|Proxy last(string $sortedField = 'id')
 * @method static         Question|Proxy random(array $attributes = [])
 * @method static         Question|Proxy randomOrCreate(array $attributes = [])
 * @method static         Question[]|Proxy[] all()
 * @method static         Question[]|Proxy[] findBy(array $attributes)
 * @method static         Question[]|Proxy[] randomSet(int $number, array $attributes = [])
 * @method static         Question[]|Proxy[] randomRange(int $min, int $max, array $attributes = [])
 * @method static         QuestionRepository|RepositoryProxy repository()
 * @method Question|Proxy create(array|callable $attributes = [])
 */
final class QuestionFactory extends ModelFactory
{
    public function __construct()
    {
        parent::__construct();

        // inject services if required (https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#factories-as-services)
    }

    public function unpublished(): self
    {
        return $this->addState(['askedAt' => null]);
    }

    protected function getDefaults(): array
    {
        return [
            'name' => self::faker()->realText(50),
            'question' => self::faker()->paragraphs(
                self::faker()->numberBetween(1, 4),
                true
            ),
            'askedAt' => self::faker()->dateTimeBetween('-100 days', '-1 minute'),
            'votes' => rand(-20, 50),
            'owner' => UserFactory::new(),
        ];
    }

    protected function initialize(): self
    {
        // see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#initialization
        return $this
            // ->afterInstantiate(function(Question $question) {})
        ;
    }

    protected static function getClass(): string
    {
        return Question::class;
    }
}
