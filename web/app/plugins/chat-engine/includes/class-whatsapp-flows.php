<?php

namespace ChatEngine;

class WhatsApp_Flows {
    
    private $flow_states = array();
    
    public function process_message($session_id, $phone, $message, $media_url = null) {
        // Get current flow state
        $state = $this->get_flow_state($session_id);
        
        // Check if starting a new flow
        if ($state === null) {
            $intent_classifier = new Intent_Classifier();
            $intent_result = $intent_classifier->classify($message, 'whatsapp');
            
            if ($intent_result['intent'] === 'membership_inquiry') {
                return $this->start_membership_flow($session_id, $phone);
            }
            
            if ($intent_result['intent'] === 'document_request') {
                return $this->start_document_flow($session_id, $phone);
            }
        }
        
        // Process based on current state
        if (strpos($state, 'membership_') === 0) {
            return $this->process_membership_flow($session_id, $phone, $message, $state);
        }
        
        if (strpos($state, 'document_') === 0) {
            return $this->process_document_flow($session_id, $phone, $message, $media_url, $state);
        }
        
        return null; // Not a flow message
    }
    
    private function start_membership_flow($session_id, $phone) {
        $this->set_flow_state($session_id, 'membership_ask_full_name');
        return "Great! I'll help you with membership. Let's start:\n\nWhat is your full name?";
    }
    
    private function process_membership_flow($session_id, $phone, $message, $state) {
        global $wpdb;
        $table = $wpdb->prefix . 'chat_flow_data';
        
        switch ($state) {
            case 'membership_ask_full_name':
                $this->save_flow_data($session_id, 'full_name', $message);
                $this->set_flow_state($session_id, 'membership_ask_id_number');
                return "Thank you! What is your ID number?";
                
            case 'membership_ask_id_number':
                $this->save_flow_data($session_id, 'id_number', $message);
                $this->set_flow_state($session_id, 'membership_ask_type');
                return "What type of membership are you interested in?\n\n1. Regular Membership\n2. Corporate Membership\n3. Student Membership\n\nReply with the number (1, 2, or 3).";
                
            case 'membership_ask_type':
                $type_map = array(
                    '1' => 'Regular Membership',
                    '2' => 'Corporate Membership',
                    '3' => 'Student Membership'
                );
                $type = $type_map[$message] ?? 'Regular Membership';
                $this->save_flow_data($session_id, 'membership_type', $type);
                
                // Get all data
                $data = $this->get_flow_data($session_id);
                
                // Confirm and store
                $this->confirm_membership_submission($session_id, $phone, $data);
                $this->clear_flow_state($session_id);
                
                return "✅ Thank you! Your membership inquiry has been submitted:\n\n" .
                       "Name: {$data['full_name']}\n" .
                       "ID: {$data['id_number']}\n" .
                       "Type: {$type}\n\n" .
                       "We'll contact you soon to complete the process.";
                
            default:
                $this->clear_flow_state($session_id);
                return "I'm sorry, there was an error. Please start over by typing 'membership'.";
        }
    }
    
    private function start_document_flow($session_id, $phone) {
        $this->set_flow_state($session_id, 'document_ask_type');
        return "I can help you request documents. What type of document do you need?\n\n" .
               "1. Membership Certificate\n" .
               "2. Statement of Account\n" .
               "3. Loan Application Form\n" .
               "4. Other\n\n" .
               "Reply with the number (1-4).";
    }
    
    private function process_document_flow($session_id, $phone, $message, $media_url, $state) {
        global $wpdb;
        
        switch ($state) {
            case 'document_ask_type':
                $type_map = array(
                    '1' => 'Membership Certificate',
                    '2' => 'Statement of Account',
                    '3' => 'Loan Application Form',
                    '4' => 'Other'
                );
                $doc_type = $type_map[$message] ?? 'Other';
                $this->save_flow_data($session_id, 'document_type', $doc_type);
                $this->set_flow_state($session_id, 'document_upload');
                return "Please upload the required document or send any supporting files. If you don't have a file, reply 'skip'.";
                
            case 'document_upload':
                if ($media_url) {
                    $this->save_flow_data($session_id, 'document_url', $media_url);
                    $this->save_flow_data($session_id, 'document_received', 'yes');
                }
                
                $data = $this->get_flow_data($session_id);
                $this->confirm_document_request($session_id, $phone, $data);
                $this->clear_flow_state($session_id);
                
                $response = "✅ Your document request has been received:\n\n" .
                           "Type: {$data['document_type']}\n";
                if (!empty($data['document_url'])) {
                    $response .= "File: Received\n";
                }
                $response .= "\nWe'll process your request and get back to you.";
                
                return $response;
                
            default:
                $this->clear_flow_state($session_id);
                return "I'm sorry, there was an error. Please start over by typing 'document'.";
        }
    }
    
    private function get_flow_state($session_id) {
        global $wpdb;
        $table = $wpdb->prefix . 'chat_flow_data';
        
        $state = $wpdb->get_var($wpdb->prepare(
            "SELECT flow_state FROM $table WHERE session_id = %s ORDER BY id DESC LIMIT 1",
            $session_id
        ));
        
        return $state;
    }
    
    private function set_flow_state($session_id, $state) {
        global $wpdb;
        $table = $wpdb->prefix . 'chat_flow_data';
        
        // Check if exists
        $exists = $wpdb->get_var($wpdb->prepare(
            "SELECT id FROM $table WHERE session_id = %s LIMIT 1",
            $session_id
        ));
        
        if ($exists) {
            $wpdb->update(
                $table,
                array('flow_state' => $state),
                array('session_id' => $session_id),
                array('%s'),
                array('%s')
            );
        } else {
            $wpdb->insert(
                $table,
                array(
                    'session_id' => $session_id,
                    'flow_state' => $state,
                    'flow_data' => '{}'
                ),
                array('%s', '%s', '%s')
            );
        }
    }
    
    private function clear_flow_state($session_id) {
        global $wpdb;
        $table = $wpdb->prefix . 'chat_flow_data';
        
        $wpdb->update(
            $table,
            array('flow_state' => null),
            array('session_id' => $session_id),
            array('%s'),
            array('%s')
        );
    }
    
    private function save_flow_data($session_id, $key, $value) {
        global $wpdb;
        $table = $wpdb->prefix . 'chat_flow_data';
        
        $data = $this->get_flow_data($session_id);
        $data[$key] = $value;
        
        // Check if record exists
        $exists = $wpdb->get_var($wpdb->prepare(
            "SELECT id FROM $table WHERE session_id = %s LIMIT 1",
            $session_id
        ));
        
        if ($exists) {
            $wpdb->update(
                $table,
                array('flow_data' => json_encode($data)),
                array('session_id' => $session_id),
                array('%s'),
                array('%s')
            );
        } else {
            $wpdb->insert(
                $table,
                array(
                    'session_id' => $session_id,
                    'flow_state' => null,
                    'flow_data' => json_encode($data)
                ),
                array('%s', '%s', '%s')
            );
        }
    }
    
    private function get_flow_data($session_id) {
        global $wpdb;
        $table = $wpdb->prefix . 'chat_flow_data';
        
        $data_json = $wpdb->get_var($wpdb->prepare(
            "SELECT flow_data FROM $table WHERE session_id = %s ORDER BY id DESC LIMIT 1",
            $session_id
        ));
        
        return $data_json ? json_decode($data_json, true) : array();
    }
    
    private function confirm_membership_submission($session_id, $phone, $data) {
        // Store in database or send to CRM
        // This is a placeholder - implement based on your needs
        error_log("Membership submission: {$session_id} - " . json_encode($data));
    }
    
    private function confirm_document_request($session_id, $phone, $data) {
        // Store document request
        // This is a placeholder - implement secure storage
        error_log("Document request: {$session_id} - " . json_encode($data));
    }
}
