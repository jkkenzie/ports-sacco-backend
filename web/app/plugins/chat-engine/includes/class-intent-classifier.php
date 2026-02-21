<?php

namespace ChatEngine;

class Intent_Classifier {
    
    public function classify($message, $channel = 'web') {
        $message_lower = strtolower(trim($message));
        
        // Get all FAQs
        global $wpdb;
        $table = $wpdb->prefix . 'chat_faqs';
        
        $channel_filter = $channel === 'whatsapp' 
            ? "AND (channel_allowed = 'both' OR channel_allowed = 'whatsapp')"
            : "AND (channel_allowed = 'both' OR channel_allowed = 'web')";
        
        $faqs = $wpdb->get_results(
            "SELECT * FROM $table WHERE 1=1 $channel_filter"
        );
        
        $best_match = null;
        $best_score = 0;
        
        // Check for exact keyword matches
        foreach ($faqs as $faq) {
            $keywords = explode(',', strtolower($faq->keywords));
            $score = $this->calculate_match_score($message_lower, $keywords, $faq->question);
            
            if ($score > $best_score) {
                $best_score = $score;
                $best_match = $faq;
            }
        }
        
        // Check for specific intent patterns
        $intent_patterns = $this->get_intent_patterns();
        foreach ($intent_patterns as $intent => $patterns) {
            foreach ($patterns as $pattern) {
                if (preg_match('/\b' . preg_quote($pattern, '/') . '\b/i', $message_lower)) {
                    $score = 0.8;
                    if ($score > $best_score) {
                        $best_score = $score;
                        $best_match = (object) array(
                            'intent' => $intent,
                            'answer' => $this->get_default_answer($intent),
                            'question' => ''
                        );
                    }
                }
            }
        }
        
        // Human agent request
        if (preg_match('/\b(agent|human|person|representative|talk to someone|speak to|help me|support)\b/i', $message_lower)) {
            return array(
                'intent' => 'human_agent',
                'confidence' => 0.9,
                'answer' => null
            );
        }
        
        if ($best_match && $best_score > 0.3) {
            return array(
                'intent' => $best_match->intent ?? 'faq_general',
                'confidence' => min($best_score, 1.0),
                'answer' => $best_match->answer ?? null
            );
        }
        
        // No match found
        return array(
            'intent' => 'unknown',
            'confidence' => 0.0,
            'answer' => null
        );
    }
    
    private function calculate_match_score($message, $keywords, $question) {
        $score = 0;
        $message_words = explode(' ', $message);
        $question_words = explode(' ', strtolower($question));
        
        // Count keyword matches
        foreach ($keywords as $keyword) {
            $keyword = trim($keyword);
            if (empty($keyword)) continue;
            
            if (stripos($message, $keyword) !== false) {
                $score += 0.3;
            }
        }
        
        // Count word matches with question
        $common_words = array_intersect($message_words, $question_words);
        $score += count($common_words) * 0.1;
        
        // Exact phrase match bonus
        if (stripos($message, $question) !== false) {
            $score += 0.5;
        }
        
        return min($score, 1.0);
    }
    
    private function get_intent_patterns() {
        return array(
            'office_hours' => array('hours', 'open', 'closed', 'when', 'time', 'schedule'),
            'location' => array('where', 'location', 'address', 'office', 'find'),
            'loan_product_info' => array('loan', 'borrow', 'credit', 'financing', 'products'),
            'membership_inquiry' => array('member', 'join', 'register', 'sign up', 'membership'),
            'document_request' => array('document', 'form', 'paper', 'file', 'request'),
        );
    }
    
    private function get_default_answer($intent) {
        $answers = array(
            'office_hours' => 'Our office hours are Monday to Friday, 8:00 AM to 5:00 PM (Africa/Nairobi timezone).',
            'location' => 'Our main office is located at [Your Address].',
            'loan_product_info' => 'We offer various loan products. Please contact us for details.',
        );
        
        return $answers[$intent] ?? null;
    }
}
