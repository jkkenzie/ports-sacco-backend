<?php

namespace ChatEngine;

class FAQ_Responder {
    
    public function get_response($intent = 'faq_general') {
        global $wpdb;
        $table = $wpdb->prefix . 'chat_faqs';
        
        $faq = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $table WHERE intent = %s LIMIT 1",
            $intent
        ));
        
        if ($faq) {
            return $faq->answer;
        }
        
        return 'I can help you with FAQs, loan information, office hours, and location. What would you like to know?';
    }
}
