# Complex Many To Many

Coming soon...

Okay. So a many to many relationship is unique in doctrine because doctrine and
creates and handles the `question_tag`, join table for us.

But what we wanted to add more columns to this table, like a `tagged_at` DateTime
column. Excellent question. And the answer is that's not possible. I'm serious, but
it's by design. As soon as you need even one extra column on this table on this joint
table, you need to stop using a many to many relationship. Instead, you need to
create an actual `QuestionTag` entity manually and relate it to the `Question` and `Tag`
entities. Well, let's try this. I'll admit it's actually easier to do this from the
beginning than to try to refactor a many to many relationship into that. So before
you create a many-to-many relationship, try to think if you might need extra comms in
the future. And if you do start with the solution that we're going to use anyways,
I'm actually going to back up and in the `Question` entity, I'm going to remove
everything related to ags. So the property, the line, the constructor and the
getter, et cetera, fits inside of the `Tag` and see I'm going to do the same thing for
questions. So I'm going to remove E get her and set her methods and a top or move the
property and we can delete the entire constructor. So we've we saw the question
entity. We saw a tag, unstable. They are no longer related at all.

Okay. Now we're going to sort of put that relationship back, but would they enjoy
where they new entity in between them?

So spend over your terminal Aaron's 

```terminal
symfony console make:entity
```

let's call this an
entity `QuestionTag`, and it's going to have at least two properties. We need a
`question` property. This is going to be a many to one relationship over to Question,
but I'll ask you to have `relations` so we can go to the wizard. This would relate to
the `Question` entity, and we want a `ManyToOne` relationship. Each question tag
relates to one question. Each question, have many question tag objects. So I'll say
`ManyToOne` is the property allowed to be nullable? No. And then do we want to add
a new property question? So we can say questionnaire or get `questionTags` that
might actually be handy. So I'll say yes. And we'll call that property question tags
and I'll say no to orphan removal. Cool. The other property we're definitely going to
need is a `tag` property.

And this will definitely be a `ManyToOne`. That's just how this works and able to
relate it to the `Tag` and state. Um, I'll say no for nullable in this case, I'm
actually going to say no to the, uh, mapping the other side, I'm doing this in part
just so you can see what differences makes. But I think also having a tag object and
saying, get question tags is maybe not going to be convenient. So I'm going to say
no. And perfect. That's the minimum amount that we need on that new `QuestionTag`
entity. We need a many to one relationship to question and a many to one relationship
to tech. Now we can start adding whatever other fields we want. So I'll add a `taggedAt`,
and I'll make this be a `datetime_immutable` property that can't be known in the
database and perfect. I'll hit enter a one more time to stop there. All right, let's
go check out this new class. So `src/Entity/QuestionTag`. It looks for us
beautifully boring. There's a `question` property that's many to one, a `Question`, a
`tag` company that's many to one to `Tag` and a tag at any tag that property.

And of course inside the `Question` entity by scroll all the way up, because we mapped
the other side. It has a one to many to `QuestionTag` back in `QuestionTag` before
where you do the migration, let's give our `$taggedAt` a default value. So I'll, I'll
create a `__construct()` method. And we can just say `$this->taggedAt = new \DateTimeImmutable()`
which will default to right now. Perfect. Okay. So we just made some
change our database. So let's run the Mo let's execute migration, 

```terminal
symfony console make:migration
```

and then go check that new migration out. Cause this is really cool.
If you look down here, it looks like there's a lot of queries, but look closely.

All it's doing is altering the question, tag tables. So we already had a question tag
table, so we don't need to drop it and create a new one. All we need to do is tweak
it and you can see it drops to foreign key constraints. It's actually a dropping the
`question_id` and a `tag_id` foreign key constraint off the old table, but then it
actually just adds them back down here. So these first two lines basically drop
foreign key. And these last two lines basically re it. So they're kind of doing
nothing. The only real thing that's happening inside of here is altered table.
Question tag is it adds a true `id` auto increment column, and it adds are `taggedAt` so
yeah, they had the exact effect that we wanted by creating this new question, tag
entity and giving it a many to one relationship to the two other entities. We
basically recreated the exact same database structure, a many-to-many relationship.
It's really just a shortcut to doing this setup.

All right. So let's try running that migration 

```terminal
symfony console doctrine:migrations:migrate
```

We riots, oh, it fails
