<?php

namespace App\Controller;

use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class AnswerController extends AbstractController
{
    /**
     * @Route("/answers/{id}/vote", methods="POST", name="answer_vote")
     */
    public function answerVote($id, LoggerInterface $logger, Request $request)
    {
        $data = json_decode($request->getContent(), true);
        $direction = $data['direction'] ?? 'up';

        // todo - use id to query the database

        // use real logic here to save this to the database
        if ($direction === 'up') {
            $logger->info('Voting up!');
            $currentVoteCount = rand(7, 100);
        } else {
            $logger->info('Voting down!');
            $currentVoteCount = rand(0, 5);
        }

        return $this->json(['votes' => $currentVoteCount]);
    }
}
