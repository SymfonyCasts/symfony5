<?php

namespace App\Service;

class MarkdownHelper
{
    public function parse(string $source): string
    {
        $parsedQuestionText = $cache->get('markdown_'.md5($questionText), function() use ($questionText, $markdownParser) {
            return $markdownParser->transformMarkdown($questionText);
        });
    }
}
