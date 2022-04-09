<?php

namespace App\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\Routing\Annotation\Route;

class UserController extends BaseController
{
    /**
     * @Route("/api/me", name="app_user_api_me")
     * @IsGranted("IS_AUTHENTICATED_REMEMBERED")
     */
    public function apiMe()
    {
        return $this->json($this->getUser(), 200, [], [
            'groups' => ['user:read'],
        ]);
    }
}
