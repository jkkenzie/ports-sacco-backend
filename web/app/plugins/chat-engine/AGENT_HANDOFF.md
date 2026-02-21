# Agent Handoff - Clickable Links

## Overview

When a user is transferred to a human agent, the chat widget shows a configurable message with **clickable contact links**:
- WhatsApp links (e.g. `https://wa.me/14155238886`) are clickable
- Phone numbers are clickable (opens phone dialer on mobile)
- Email addresses are clickable (opens email client)

## Configuration

1. Go to **Chat Engine → Agent Handoff** in WordPress admin
2. Set your **Message when transferring to agent**
3. Check which contact options to append:
   - ✅ WhatsApp link
   - ✅ Office phone
   - ✅ Office email

## How It Works

The backend formats contact info like this:
- `WhatsApp: https://wa.me/14155238886`
- `Phone: +1234567890 (tel:+1234567890)`
- `Email: test@example.com (mailto:test@example.com)`

The frontend React component automatically:
- Detects `https://` URLs and makes them clickable
- Detects `(tel:...)` patterns and makes the phone number clickable
- Detects `(mailto:...)` patterns and makes the email clickable

So users see clean, clickable links instead of plain text.

## Example Output

When a user asks for an agent, they'll see:

```
We've noted your request. For immediate assistance, please contact us:

WhatsApp: https://wa.me/14155238886
Phone: +1234567890
Email: support@example.com
```

All three lines are clickable links that open the respective app/client.
