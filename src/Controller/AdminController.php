<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\UX\Chartjs\Builder\ChartBuilderInterface;
use Symfony\UX\Chartjs\Model\Chart;

class AdminController extends AbstractController
{
    /**
     * @Route("/admin", name="admin_dashboard")
     */
    public function dashboard(ChartBuilderInterface $chartBuilder)
    {
        $chart = $chartBuilder->createChart(Chart::TYPE_LINE);
        $chart->setData([
            'labels' => ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            'datasets' => [
                [
                    'label' => 'Potions Brewed',
                    'backgroundColor' => 'rgb(255, 99, 132)',
                    'data' => [0, 10, 5, 2, 20, 30, 45],
                ],
                [
                    'label' => 'Frogs Created',
                    'backgroundColor' => 'rgb(86, 217, 0)',
                    'data' => [40, 25, 55, 32, 22, 10, 6],
                ],
            ],
        ]);

        $chart2 = $chartBuilder->createChart(Chart::TYPE_PIE);
        $chart2->setData([
            'labels' => ['Self-Vanishing', 'Miniaturization', 'Clown Feet', 'Poor Musical Taste'],
            'datasets' => [
                [
                    'label' => 'Accidents',
                    'data' => [40, 66, 110, 20],
                    'backgroundColor' => [
                      'rgb(255, 99, 132)',
                      'rgb(54, 162, 235)',
                      'rgb(255, 205, 86)',
                    ],
                    'hoverOffset' => 4,
                ],
            ],
        ]);

        return $this->render('admin/dashboard.html.twig', [
            'chart' => $chart,
            'chart2' => $chart2,
        ]);
    }

    /**
     * @Route("/admin/login")
     */
    public function adminLogin()
    {
        return new Response('Pretend admin login page, that should be public');
    }

    /**
     * @Route("/admin/comments")
     */
    public function adminComments()
    {
        $this->denyAccessUnlessGranted('ROLE_COMMENT_ADMIN');

        return new Response('Pretend comments admin page');
    }
}
