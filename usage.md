# ShareMDC Usage Guide

## Starting the Service
```bash
cd /root/sharemdc
npm start
```

Default port: 3000

## Usage Steps

1. Open your browser and visit `http://localhost:3000/`
2. Type Markdown content in the editor on the left, and see the real-time preview on the right
3. Click the "Share" button to generate a short link
4. Copy the link and send it to others
5. When other users open the link, they can view the rendered content

## API Endpoints

### POST `/api/share`
Generate a share link

**Request:**
```json
{
  "content": "# Hello World\n\nThis is markdown content."
}
```

**Response:**
```json
{
  "id": "abc123xyz",
  "url": "/s/abc123xyz"
}
```

### GET `/api/share/:id`
Retrieve shared content

**Response:**
```json
{
  "content": "# Hello World\n\nThis is markdown content.",
  "createdAt": 1700000000000
}
```

### POST `/api/preview`
Preview Markdown content

**Request:**
```json
{
  "content": "# Hello World"
}
```

**Response:**
```json
{
  "html": "<h1>Hello World</h1>"
}
```

### GET `/health`
Health check

**Response:**
```json
{
  "ok": true
}
```

## Data Persistence

### Database
- Database file: `data/share.db`
- Database type: SQLite

### Schema
Table: `shares`

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | Short link ID (primary key) |
| content | TEXT | Markdown content |
| created_at | INTEGER | Creation timestamp |
| updated_at | INTEGER | Last update timestamp |

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3000 | Server port |
| DB_PATH | ./data/share.db | Database file path |
| CLARITY_ID | (empty) | Microsoft Clarity analytics ID (optional) |

### Example Configuration

```bash
# Set custom port
export PORT=8080

# Set custom database path
export DB_PATH=/var/lib/sharemdc/database.db

# Set Microsoft Clarity ID for analytics (optional)
export CLARITY_ID=your_clarity_project_id

# Start the server
npm start
```

### Clarity Analytics

ShareMDC includes optional Microsoft Clarity analytics. To enable it:

1. Create a project at [clarity.microsoft.com](https://clarity.microsoft.com)
2. Get your Clarity Project ID
3. Set the `CLARITY_ID` environment variable

If `CLARITY_ID` is not set, the Clarity script will be completely removed from the page.

## Usage Examples

### Sharing AI-Generated Content

After a ChatGPT or Claude session:

1. Copy the AI response
2. Paste it into ShareMDC
3. Click "Share"
4. Share the link with your team

### Code Snippets

For code reviews or documentation:

```markdown
# API Endpoint: GET /users

Retrieves a list of users.

## Response
```json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe"
    }
  ]
}
```
```

### Meeting Notes

Quick meeting summaries:

```markdown
# Daily Standup - 2024-03-10

## Attendees
- Alice
- Bob
- Charlie

## Updates
- Alice: Completed user authentication feature
- Bob: Fixed database migration bug
- Charlie: Started working on dashboard

## Blockers
- Waiting for API access token

## Next Steps
- Alice will review PR #123
- Bob will write unit tests
```

## Best Practices

### Content Formatting
- Use proper Markdown syntax for better rendering
- Include code blocks with language specification for syntax highlighting
- Use headings (##, ###) to structure long documents

### Link Management
- Save important share links for future reference
- ShareMDC stores content indefinitely, but keep your own backup if needed
- Use descriptive titles in your Markdown for easier identification

### Privacy
- Share links are public - anyone with the link can access the content
- For sensitive information, consider using password protection (coming soon)
- Regularly clean up outdated shared content

## Tips and Tricks

### Keyboard Shortcuts
- `Ctrl/Cmd + B` - Bold text
- `Ctrl/Cmd + I` - Italic text
- `Ctrl/Cmd + K` - Insert link

### Dark Mode
- Click the theme toggle button in the top-right corner
- Preference is saved in localStorage

### Mobile Usage
- Double-tap the preview area to zoom in/out
- Use the share buttons at the bottom for social sharing

## Troubleshooting

### Content Not Saving
- Check if the database file has write permissions
- Verify the server is running without errors

### Share Links Not Working
- Ensure the server is running and accessible
- Check if the share ID exists in the database

### Preview Not Updating
- Refresh the page
- Check browser console for JavaScript errors

## Support

For more help, visit:
- GitHub Issues: https://github.com/perry2008084/sharemdc/issues
- Live Demo: https://www.sharemdc.com
