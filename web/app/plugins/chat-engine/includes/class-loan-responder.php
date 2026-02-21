<?php

namespace ChatEngine;

class Loan_Responder {
    
    public function get_response() {
        // In production, this could fetch from a loan products table
        $loan_products = array(
            'Personal Loans' => 'Available for members with flexible repayment terms.',
            'Business Loans' => 'Designed for business growth and expansion.',
            'Emergency Loans' => 'Quick access to funds for urgent needs.',
        );
        
        $response = "We offer the following loan products:\n\n";
        foreach ($loan_products as $product => $description) {
            $response .= "• {$product}: {$description}\n";
        }
        
        $response .= "\nFor detailed information about interest rates, requirements, and application process, please contact us during business hours or visit our website.";
        
        return $response;
    }
}
