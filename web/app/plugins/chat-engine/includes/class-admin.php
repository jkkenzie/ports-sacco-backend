<?php

namespace ChatEngine;

class Admin {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'handle_form_submissions'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_scripts'));
    }
    
    public function add_admin_menu() {
        add_menu_page(
            'Chat Engine',
            'Chat Engine',
            'manage_options',
            'chat-engine',
            array($this, 'render_main_page'),
            'dashicons-format-chat',
            30
        );
        
        add_submenu_page(
            'chat-engine',
            'FAQs',
            'FAQs',
            'manage_options',
            'chat-engine',
            array($this, 'render_main_page')
        );
        
        add_submenu_page(
            'chat-engine',
            'Loan Products',
            'Loan Products',
            'manage_options',
            'chat-engine-loans',
            array($this, 'render_loans_page')
        );
        
        add_submenu_page(
            'chat-engine',
            'Office Settings',
            'Office Settings',
            'manage_options',
            'chat-engine-office',
            array($this, 'render_office_page')
        );
        
        add_submenu_page(
            'chat-engine',
            'Agent Handoff',
            'Agent Handoff',
            'manage_options',
            'chat-engine-agent',
            array($this, 'render_agent_handoff_page')
        );
        
        add_submenu_page(
            'chat-engine',
            'Chat Sessions',
            'Chat Sessions',
            'manage_options',
            'chat-engine-sessions',
            array($this, 'render_sessions_page')
        );
    }
    
    public function enqueue_admin_scripts($hook) {
        if (strpos($hook, 'chat-engine') === false) {
            return;
        }
        
        wp_enqueue_style(
            'chat-engine-admin',
            CHAT_ENGINE_PLUGIN_URL . 'assets/admin.css',
            array(),
            CHAT_ENGINE_VERSION
        );
        
        wp_enqueue_script(
            'chat-engine-admin',
            CHAT_ENGINE_PLUGIN_URL . 'assets/admin.js',
            array('jquery'),
            CHAT_ENGINE_VERSION,
            true
        );
    }
    
    public function handle_form_submissions() {
        if (!isset($_POST['chat_engine_action']) || !check_admin_referer('chat_engine_action')) {
            return;
        }
        
        global $wpdb;
        $action = sanitize_text_field($_POST['chat_engine_action']);
        
        switch ($action) {
            case 'add_faq':
                $this->add_faq();
                break;
            case 'edit_faq':
                $this->edit_faq();
                break;
            case 'delete_faq':
                $this->delete_faq();
                break;
            case 'update_office':
                $this->update_office_settings();
                break;
            case 'update_agent_handoff':
                $this->update_agent_handoff_settings();
                break;
        }
    }
    
    private function update_agent_handoff_settings() {
        update_option('chat_engine_agent_handoff_message', sanitize_textarea_field($_POST['agent_handoff_message']));
        update_option('chat_engine_agent_show_whatsapp', !empty($_POST['agent_show_whatsapp']));
        update_option('chat_engine_agent_show_phone', !empty($_POST['agent_show_phone']));
        update_option('chat_engine_agent_show_email', !empty($_POST['agent_show_email']));
        wp_redirect(admin_url('admin.php?page=chat-engine-agent&updated=1'));
        exit;
    }
    
    private function add_faq() {
        global $wpdb;
        $table = $wpdb->prefix . 'chat_faqs';
        
        $wpdb->insert(
            $table,
            array(
                'question' => sanitize_textarea_field($_POST['question']),
                'keywords' => sanitize_text_field($_POST['keywords']),
                'answer' => sanitize_textarea_field($_POST['answer']),
                'intent' => sanitize_text_field($_POST['intent']),
                'channel_allowed' => sanitize_text_field($_POST['channel_allowed']),
            ),
            array('%s', '%s', '%s', '%s', '%s')
        );
        
        wp_redirect(admin_url('admin.php?page=chat-engine&added=1'));
        exit;
    }
    
    private function edit_faq() {
        global $wpdb;
        $table = $wpdb->prefix . 'chat_faqs';
        $id = intval($_POST['faq_id']);
        
        $wpdb->update(
            $table,
            array(
                'question' => sanitize_textarea_field($_POST['question']),
                'keywords' => sanitize_text_field($_POST['keywords']),
                'answer' => sanitize_textarea_field($_POST['answer']),
                'intent' => sanitize_text_field($_POST['intent']),
                'channel_allowed' => sanitize_text_field($_POST['channel_allowed']),
            ),
            array('id' => $id),
            array('%s', '%s', '%s', '%s', '%s'),
            array('%d')
        );
        
        wp_redirect(admin_url('admin.php?page=chat-engine&updated=1'));
        exit;
    }
    
    private function delete_faq() {
        if (!isset($_GET['delete'])) {
            return;
        }
        
        global $wpdb;
        $table = $wpdb->prefix . 'chat_faqs';
        $id = intval($_GET['delete']);
        
        // Verify nonce
        if (!isset($_GET['_wpnonce']) || !wp_verify_nonce($_GET['_wpnonce'], 'delete_faq_' . $id)) {
            wp_die('Security check failed');
        }
        
        $wpdb->delete($table, array('id' => $id), array('%d'));
        
        wp_redirect(admin_url('admin.php?page=chat-engine&deleted=1'));
        exit;
    }
    
    private function update_office_settings() {
        update_option('chat_engine_office_address', sanitize_text_field($_POST['office_address']));
        update_option('chat_engine_office_phone', sanitize_text_field($_POST['office_phone']));
        update_option('chat_engine_office_email', sanitize_email($_POST['office_email']));
        
        wp_redirect(admin_url('admin.php?page=chat-engine-office&updated=1'));
        exit;
    }
    
    public function render_main_page() {
        global $wpdb;
        $table = $wpdb->prefix . 'chat_faqs';
        $faqs = $wpdb->get_results("SELECT * FROM $table ORDER BY id DESC");
        $editing_id = isset($_GET['edit']) ? intval($_GET['edit']) : 0;
        $editing_faq = $editing_id ? $wpdb->get_row($wpdb->prepare("SELECT * FROM $table WHERE id = %d", $editing_id)) : null;
        
        ?>
        <div class="wrap chat-engine-admin">
            <h1>Chat Engine - FAQs Management</h1>
            
            <?php if (isset($_GET['added'])): ?>
                <div class="notice notice-success"><p>FAQ added successfully!</p></div>
            <?php endif; ?>
            <?php if (isset($_GET['updated'])): ?>
                <div class="notice notice-success"><p>FAQ updated successfully!</p></div>
            <?php endif; ?>
            <?php if (isset($_GET['deleted'])): ?>
                <div class="notice notice-success"><p>FAQ deleted successfully!</p></div>
            <?php endif; ?>
            
            <div class="chat-engine-admin-container">
                <!-- Add/Edit Form -->
                <div class="chat-engine-form-section">
                    <h2><?php echo $editing_faq ? 'Edit FAQ' : 'Add New FAQ'; ?></h2>
                    <form method="post" action="">
                        <?php wp_nonce_field('chat_engine_action'); ?>
                        <input type="hidden" name="chat_engine_action" value="<?php echo $editing_faq ? 'edit_faq' : 'add_faq'; ?>">
                        <?php if ($editing_faq): ?>
                            <input type="hidden" name="faq_id" value="<?php echo esc_attr($editing_faq->id); ?>">
                        <?php endif; ?>
                        
                        <table class="form-table">
                            <tr>
                                <th><label for="question">Question</label></th>
                                <td>
                                    <textarea name="question" id="question" rows="2" class="large-text" required><?php echo $editing_faq ? esc_textarea($editing_faq->question) : ''; ?></textarea>
                                    <p class="description">The question users might ask</p>
                                </td>
                            </tr>
                            <tr>
                                <th><label for="keywords">Keywords</label></th>
                                <td>
                                    <input type="text" name="keywords" id="keywords" value="<?php echo $editing_faq ? esc_attr($editing_faq->keywords) : ''; ?>" class="large-text" required>
                                    <p class="description">Comma-separated keywords for matching (e.g., hours,open,closed,when)</p>
                                </td>
                            </tr>
                            <tr>
                                <th><label for="answer">Answer</label></th>
                                <td>
                                    <textarea name="answer" id="answer" rows="4" class="large-text" required><?php echo $editing_faq ? esc_textarea($editing_faq->answer) : ''; ?></textarea>
                                    <p class="description">The response the bot will give</p>
                                </td>
                            </tr>
                            <tr>
                                <th><label for="intent">Intent</label></th>
                                <td>
                                    <select name="intent" id="intent" required>
                                        <option value="faq_general" <?php selected($editing_faq ? $editing_faq->intent : '', 'faq_general'); ?>>General FAQ</option>
                                        <option value="office_hours" <?php selected($editing_faq ? $editing_faq->intent : '', 'office_hours'); ?>>Office Hours</option>
                                        <option value="location" <?php selected($editing_faq ? $editing_faq->intent : '', 'location'); ?>>Location</option>
                                        <option value="loan_product_info" <?php selected($editing_faq ? $editing_faq->intent : '', 'loan_product_info'); ?>>Loan Product Info</option>
                                        <option value="membership_inquiry" <?php selected($editing_faq ? $editing_faq->intent : '', 'membership_inquiry'); ?>>Membership Inquiry</option>
                                        <option value="document_request" <?php selected($editing_faq ? $editing_faq->intent : '', 'document_request'); ?>>Document Request</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <th><label for="channel_allowed">Channel</label></th>
                                <td>
                                    <select name="channel_allowed" id="channel_allowed" required>
                                        <option value="both" <?php selected($editing_faq ? $editing_faq->channel_allowed : '', 'both'); ?>>Both (Web & WhatsApp)</option>
                                        <option value="web" <?php selected($editing_faq ? $editing_faq->channel_allowed : '', 'web'); ?>>Web Only</option>
                                        <option value="whatsapp" <?php selected($editing_faq ? $editing_faq->channel_allowed : '', 'whatsapp'); ?>>WhatsApp Only</option>
                                    </select>
                                </td>
                            </tr>
                        </table>
                        
                        <p class="submit">
                            <button type="submit" class="button button-primary"><?php echo $editing_faq ? 'Update FAQ' : 'Add FAQ'; ?></button>
                            <?php if ($editing_faq): ?>
                                <a href="<?php echo admin_url('admin.php?page=chat-engine'); ?>" class="button">Cancel</a>
                            <?php endif; ?>
                        </p>
                    </form>
                </div>
                
                <!-- FAQs List -->
                <div class="chat-engine-list-section">
                    <h2>Existing FAQs (<?php echo count($faqs); ?>)</h2>
                    <?php if (empty($faqs)): ?>
                        <p>No FAQs yet. Add your first FAQ above.</p>
                    <?php else: ?>
                        <table class="wp-list-table widefat fixed striped">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Question</th>
                                    <th>Keywords</th>
                                    <th>Intent</th>
                                    <th>Channel</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($faqs as $faq): ?>
                                    <tr>
                                        <td><?php echo esc_html($faq->id); ?></td>
                                        <td><strong><?php echo esc_html($faq->question); ?></strong></td>
                                        <td><?php echo esc_html($faq->keywords); ?></td>
                                        <td><code><?php echo esc_html($faq->intent); ?></code></td>
                                        <td><?php echo esc_html($faq->channel_allowed); ?></td>
                                        <td>
                                            <a href="<?php echo admin_url('admin.php?page=chat-engine&edit=' . $faq->id); ?>" class="button button-small">Edit</a>
                                            <a href="<?php echo wp_nonce_url(admin_url('admin.php?page=chat-engine&delete=' . $faq->id), 'delete_faq_' . $faq->id); ?>" class="button button-small" onclick="return confirm('Are you sure?');">Delete</a>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    <?php endif; ?>
                </div>
            </div>
        </div>
        <?php
    }
    
    public function render_loans_page() {
        ?>
        <div class="wrap chat-engine-admin">
            <h1>Loan Products</h1>
            <p>Loan product information is managed in the code. To customize loan responses, edit:</p>
            <code>web/app/plugins/chat-engine/includes/class-loan-responder.php</code>
            <p>Or contact a developer to add a database-driven loan products system.</p>
        </div>
        <?php
    }
    
    public function render_office_page() {
        $address = get_option('chat_engine_office_address', '');
        $phone = get_option('chat_engine_office_phone', '');
        $email = get_option('chat_engine_office_email', '');
        
        ?>
        <div class="wrap chat-engine-admin">
            <h1>Office Settings</h1>
            
            <?php if (isset($_GET['updated'])): ?>
                <div class="notice notice-success"><p>Settings updated successfully!</p></div>
            <?php endif; ?>
            
            <form method="post" action="">
                <?php wp_nonce_field('chat_engine_action'); ?>
                <input type="hidden" name="chat_engine_action" value="update_office">
                
                <table class="form-table">
                    <tr>
                        <th><label for="office_address">Office Address</label></th>
                        <td>
                            <textarea name="office_address" id="office_address" rows="3" class="large-text"><?php echo esc_textarea($address); ?></textarea>
                            <p class="description">Full office address shown in location responses</p>
                        </td>
                    </tr>
                    <tr>
                        <th><label for="office_phone">Phone Number</label></th>
                        <td>
                            <input type="text" name="office_phone" id="office_phone" value="<?php echo esc_attr($phone); ?>" class="regular-text">
                        </td>
                    </tr>
                    <tr>
                        <th><label for="office_email">Email Address</label></th>
                        <td>
                            <input type="email" name="office_email" id="office_email" value="<?php echo esc_attr($email); ?>" class="regular-text">
                        </td>
                    </tr>
                </table>
                
                <p class="submit">
                    <button type="submit" class="button button-primary">Save Settings</button>
                </p>
            </form>
        </div>
        <?php
    }
    
    public function render_agent_handoff_page() {
        $message = get_option('chat_engine_agent_handoff_message', "We've noted your request. For immediate assistance, please contact us:");
        $show_whatsapp = get_option('chat_engine_agent_show_whatsapp', true);
        $show_phone = get_option('chat_engine_agent_show_phone', true);
        $show_email = get_option('chat_engine_agent_show_email', true);
        ?>
        <div class="wrap chat-engine-admin">
            <h1>Agent Handoff Settings</h1>
            <p>When a user is transferred to a human agent, the chat shows this message. Because there is no live agent in the same chat window yet, we give the user clear next steps (e.g. WhatsApp, phone, email) so they are not stuck waiting.</p>
            
            <?php if (isset($_GET['updated'])): ?>
                <div class="notice notice-success"><p>Settings saved.</p></div>
            <?php endif; ?>
            
            <form method="post" action="">
                <?php wp_nonce_field('chat_engine_action'); ?>
                <input type="hidden" name="chat_engine_action" value="update_agent_handoff">
                
                <table class="form-table">
                    <tr>
                        <th><label for="agent_handoff_message">Message when transferring to agent</label></th>
                        <td>
                            <textarea name="agent_handoff_message" id="agent_handoff_message" rows="4" class="large-text"><?php echo esc_textarea($message); ?></textarea>
                            <p class="description">Shown in the chat when escalation is triggered. Add contact options below so users know how to reach you.</p>
                        </td>
                    </tr>
                    <tr>
                        <th>Append contact options</th>
                        <td>
                            <label><input type="checkbox" name="agent_show_whatsapp" value="1" <?php checked($show_whatsapp); ?> /> Append WhatsApp link (uses Twilio WhatsApp number from .env)</label><br>
                            <label><input type="checkbox" name="agent_show_phone" value="1" <?php checked($show_phone); ?> /> Append office phone (from Office Settings)</label><br>
                            <label><input type="checkbox" name="agent_show_email" value="1" <?php checked($show_email); ?> /> Append office email (from Office Settings)</label>
                        </td>
                    </tr>
                </table>
                
                <p class="submit">
                    <button type="submit" class="button button-primary">Save</button>
                </p>
            </form>
            
            <hr>
            <h2>How agent handoff works</h2>
            <ul style="list-style: disc; margin-left: 20px;">
                <li><strong>Web chat:</strong> Session is marked as "agent" and this message is shown. The user gets the contact options you configured so they can reach support (WhatsApp, phone, email). A future agent dashboard could pick up the session and reply in the same chat.</li>
                <li><strong>WhatsApp:</strong> If <code>TWILIO_CONVERSATIONS_SERVICE_SID</code> is set, a Twilio Conversation is created for the agent to join. Otherwise the user continues in WhatsApp and your team can reply via Twilio.</li>
                <li>Escalation is triggered when: user asks for an agent, confidence is low, or the intent is unknown (and within business hours).</li>
            </ul>
        </div>
        <?php
    }
    
    public function render_sessions_page() {
        global $wpdb;
        $sessions_table = $wpdb->prefix . 'chat_sessions';
        $messages_table = $wpdb->prefix . 'chat_messages';
        
        $sessions = $wpdb->get_results(
            "SELECT s.*, COUNT(m.id) as message_count 
             FROM $sessions_table s 
             LEFT JOIN $messages_table m ON s.session_id = m.session_id 
             GROUP BY s.id 
             ORDER BY s.created_at DESC 
             LIMIT 50"
        );
        
        ?>
        <div class="wrap chat-engine-admin">
            <h1>Chat Sessions</h1>
            <p>Recent chat sessions and conversations</p>
            
            <?php if (empty($sessions)): ?>
                <p>No chat sessions yet.</p>
            <?php else: ?>
                <table class="wp-list-table widefat fixed striped">
                    <thead>
                        <tr>
                            <th>Session ID</th>
                            <th>Channel</th>
                            <th>User</th>
                            <th>Status</th>
                            <th>Messages</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($sessions as $session): ?>
                            <tr>
                                <td><code><?php echo esc_html(substr($session->session_id, 0, 20)); ?>...</code></td>
                                <td><?php echo esc_html($session->channel); ?></td>
                                <td><?php echo esc_html($session->user_identifier ?: 'N/A'); ?></td>
                                <td><span class="status-<?php echo esc_attr($session->status); ?>"><?php echo esc_html($session->status); ?></span></td>
                                <td><?php echo esc_html($session->message_count); ?></td>
                                <td><?php echo esc_html($session->created_at); ?></td>
                                <td>
                                    <a href="<?php echo admin_url('admin.php?page=chat-engine-sessions&view=' . urlencode($session->session_id)); ?>" class="button button-small">View Messages</a>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php endif; ?>
            
            <?php
            if (isset($_GET['view'])) {
                $session_id = sanitize_text_field($_GET['view']);
                $messages = $wpdb->get_results($wpdb->prepare(
                    "SELECT * FROM $messages_table WHERE session_id = %s ORDER BY timestamp ASC",
                    $session_id
                ));
                ?>
                <h2>Messages for Session: <?php echo esc_html($session_id); ?></h2>
                <div class="chat-messages-view">
                    <?php foreach ($messages as $msg): ?>
                        <div class="message message-<?php echo esc_attr($msg->sender); ?>">
                            <strong><?php echo esc_html(ucfirst($msg->sender)); ?>:</strong>
                            <?php echo nl2br(esc_html($msg->message)); ?>
                            <small><?php echo esc_html($msg->timestamp); ?></small>
                        </div>
                    <?php endforeach; ?>
                </div>
                <?php
            }
            ?>
        </div>
        <?php
    }
}
