<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class QuestionController extends AbstractController
{
    /**
     * @Route("/")
     */
    public function homepage()
    {
        return new Response('OMG! My first page already! WOOO!');
    }

    /**
     * @Route("/questions/{slug}")
     */
    public function show($slug)
    {
        return $this->render('question/show.html.twig', [
            'question' => ucwords(str_replace('-', ' ', $slug))
        ]);
    }
}
