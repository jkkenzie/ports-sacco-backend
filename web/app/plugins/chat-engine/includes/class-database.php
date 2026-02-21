<?php

namespace ChatEngine;

class Database {
    
    public static function create_tables() {
        global $wpdb;
        
        $charset_collate = $wpdb->get_charset_collate();
        
        // FAQ table
        $table_faqs = $wpdb->prefix . 'chat_faqs';
        $sql_faqs = "CREATE TABLE IF NOT EXISTS $table_faqs (
            id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            question text NOT NULL,
            keywords text,
            answer text NOT NULL,
            intent varchar(100),
            channel_allowed varchar(20) DEFAULT 'both',
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY intent (intent),
            KEY channel_allowed (channel_allowed)
        ) $charset_collate;";
        
        // Sessions table
        $table_sessions = $wpdb->prefix . 'chat_sessions';
        $sql_sessions = "CREATE TABLE IF NOT EXISTS $table_sessions (
            id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            session_id varchar(100) NOT NULL,
            channel varchar(20) NOT NULL DEFAULT 'web',
            user_identifier varchar(255),
            status varchar(20) DEFAULT 'bot',
            twilio_conversation_sid varchar(100),
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY session_id (session_id),
            KEY channel (channel),
            KEY status (status),
            KEY user_identifier (user_identifier)
        ) $charset_collate;";
        
        // Messages table
        $table_messages = $wpdb->prefix . 'chat_messages';
        $sql_messages = "CREATE TABLE IF NOT EXISTS $table_messages (
            id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            session_id varchar(100) NOT NULL,
            sender varchar(20) NOT NULL,
            message text NOT NULL,
            media_url varchar(500),
            intent varchar(100),
            timestamp datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY session_id (session_id),
            KEY sender (sender),
            KEY timestamp (timestamp)
        ) $charset_collate;";
        
        // Flow data table for WhatsApp flows
        $table_flow_data = $wpdb->prefix . 'chat_flow_data';
        $sql_flow_data = "CREATE TABLE IF NOT EXISTS $table_flow_data (
            id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            session_id varchar(100) NOT NULL,
            flow_state varchar(50),
            flow_data text,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY session_id (session_id),
            KEY flow_state (flow_state)
        ) $charset_collate;";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql_faqs);
        dbDelta($sql_sessions);
        dbDelta($sql_messages);
        dbDelta($sql_flow_data);
    }
}
