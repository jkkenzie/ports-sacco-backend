<?php

namespace ChatEngine;

use function Env\env;

class Business_Hours {
    
    private $start_time;
    private $end_time;
    private $timezone;
    
    public function __construct() {
        $this->start_time = env('CHAT_BUSINESS_HOURS_START') ?: '08:00';
        $this->end_time = env('CHAT_BUSINESS_HOURS_END') ?: '17:00';
        $this->timezone = env('CHAT_TIMEZONE') ?: 'Africa/Nairobi';
    }
    
    public function is_within_hours() {
        try {
            $tz = new \DateTimeZone($this->timezone);
            $now = new \DateTime('now', $tz);
            
            $start = \DateTime::createFromFormat('H:i', $this->start_time, $tz);
            $end = \DateTime::createFromFormat('H:i', $this->end_time, $tz);
            
            $current_time = clone $now;
            $current_time->setTime($now->format('H'), $now->format('i'));
            
            // Check if it's a weekday (Monday = 1, Friday = 5)
            $day_of_week = (int) $now->format('N');
            if ($day_of_week > 5) {
                return false; // Weekend
            }
            
            // Check if current time is between start and end
            if ($current_time >= $start && $current_time <= $end) {
                return true;
            }
            
            return false;
        } catch (\Exception $e) {
            error_log('Business hours error: ' . $e->getMessage());
            return false;
        }
    }
    
    public function get_hours_message() {
        $is_open = $this->is_within_hours();
        
        $message = "Our office hours are:\n";
        $message .= "📅 Monday to Friday\n";
        $message .= "🕐 {$this->start_time} to {$this->end_time} ({$this->timezone})\n\n";
        
        if ($is_open) {
            $message .= "✅ We are currently open and available to assist you.";
        } else {
            $message .= "❌ We are currently closed. Please contact us during business hours.";
        }
        
        return $message;
    }
}
