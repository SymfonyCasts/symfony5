# Many To Many Factory

Coming soon...

Now that we've seen how we can relate a tag objects and question objects. Let's use
Foundry to properly create some fresh tag fixture data. Start by generating the tag
factory in console, make factory. And we want to generate the one for 10. Beautiful
go about that class source factory tag factory. And remember our only job is to make
sure that we have good default values for all of the required properties. So for
name, uh, instead of using texts, we can actually use Word and like I've done before
I'm going to remove updated at, but I'll set created that to itself. Colon, colon,
faker, arrow, daytime between minus one Year and now

Cool things to that. At the top of the fixtures, we can very simply say we can create
a hundred random tags with tag factory rate many 100. And then what I want to do down
here for these 20 questions is I want to relate each of these 20 questions to eight
random number of these texts. Here's how we can do this. So first I'm going to pass a
second argument here. The second argument is attribute overrides. Second argument
here and think about it. The property that we want to pop it on question is texts. So
we'll set tags, equal arrow, and we'll set this to me. Array or collection of tags
that we want to use. What I'm going to do is I'm going to use actually tag factory,
colon, colon, or random or range and pass this zero and five. This is a cool
function. It's going to return zero to five random tags. So each question will have a
different amount of random texts, pretty handy. There is a process, small problem
with this, which you might spot, but let's try it. It's been over reload, the
fixtures Symfony console doctrine, fixtures load.

Awesome. And then let's check the database. I'll first say doctrine, query SQL select
star from tag, just so we can see that. Yep. We do have All a hundred tags. Actually.
We have 102 tags. Let me go down there and delete my extra code down here. We don't
really need that anymore. Anyways, it created a hundred tags. Let's also the joint
table question on her tag and Did it work

[inaudible]

And okay, we get 20 tags, which seems a little bit low. And if you look closely,
everyone is tagged to the same tag. So you might not have 20. You actually might have
zero, or you might have 40 or 60 or 80, but those are all different examples of the
same problem And problem we made earlier. Remember because I'm passing an array here.
This tag factor in random range is only called once. So my situation, it happened to
find one random tag and then assign that one tag to all 20 questions, which is why we
ended up with 28 Rutgers inside of here. We know the fix, change this into a call
back. That returns that array. All right, let's try that again. Reload the fixtures.
And I want that some query the question tag table and util I have 41 years will vary
somewhere between zero and a hundred based on the randomness, but you can have a look
here and you can see that every question is related to a random tag and some
questions have multiple tags. All the ones only have one tag. This one has four tags.
So it's perfect. Next each published question is now related to zero to five tags. So
let's render the tags on the front end.

