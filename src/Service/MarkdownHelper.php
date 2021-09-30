<?php

namespace App\Service;

class MarkdownHelper
{
    public function parse(string $source): string
    {
        return $cache->get('markdown_'.md5($source), function() use ($source, $markdownParser) {
            return $markdownParser->transformMarkdown($source);
        });
    }
}
