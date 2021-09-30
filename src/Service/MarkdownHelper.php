<?php

namespace App\Service;

use Knp\Bundle\MarkdownBundle\MarkdownParserInterface;
use Symfony\Contracts\Cache\CacheInterface;

class MarkdownHelper
{
    public function parse(string $source, MarkdownParserInterface $markdownParser, CacheInterface $cache): string
    {
        return $cache->get('markdown_'.md5($source), function() use ($source, $markdownParser) {
            return $markdownParser->transformMarkdown($source);
        });
    }
}
