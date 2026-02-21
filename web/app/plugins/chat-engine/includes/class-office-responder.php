<?php

namespace ChatEngine;

class Office_Responder {
    
    public function get_response() {
        $business_hours = new Business_Hours();
        return $business_hours->get_hours_message();
    }
    
    public function get_location() {
        // In production, fetch from options or custom fields
        $address = get_option('chat_engine_office_address', '[Your Office Address]');
        $phone = get_option('chat_engine_office_phone', '[Your Phone Number]');
        $email = get_option('chat_engine_office_email', '[Your Email]');
        
        $response = "Our office location:\n\n";
        $response .= "📍 Address: {$address}\n";
        $response .= "📞 Phone: {$phone}\n";
        $response .= "📧 Email: {$email}\n\n";
        $response .= "You can visit us during our business hours: Monday to Friday, 8:00 AM to 5:00 PM.";
        
        return $response;
    }
}
