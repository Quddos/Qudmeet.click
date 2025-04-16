interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  chartData?: any;
}

/**
 * Exports chat messages to a text file
 */
export function exportChatAsText(messages: Message[], filename: string = 'chat-export.txt'): void {
  try {
    // Format the messages
    const formattedText = messages.map(message => {
      const timestamp = message.timestamp 
        ? new Date(message.timestamp).toLocaleString() 
        : new Date().toLocaleString();
      
      return `[${message.role.toUpperCase()}] ${timestamp}\n${message.content}\n\n`;
    }).join('---\n\n');
    
    // Create a blob with the formatted text
    const blob = new Blob([formattedText], { type: 'text/plain' });
    
    // Create a download link and trigger the download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('Error exporting chat as text:', error);
    throw error;
  }
}

/**
 * Exports chat messages to a markdown file
 */
export function exportChatAsMarkdown(messages: Message[], filename: string = 'chat-export.md'): void {
  try {
    // Create the markdown content
    let markdown = `# Chat Export\n\n`;
    markdown += `*Exported on ${new Date().toLocaleString()}*\n\n`;
    
    // Add each message
    messages.forEach((message, index) => {
      const timestamp = message.timestamp 
        ? new Date(message.timestamp).toLocaleString() 
        : new Date().toLocaleString();
      
      markdown += `## ${message.role === 'user' ? '👤 User' : '🤖 Assistant'} (${timestamp})\n\n`;
      markdown += `${message.content}\n\n`;
      
      // Add separator except for the last message
      if (index < messages.length - 1) {
        markdown += `---\n\n`;
      }
    });
    
    // Create a blob with the markdown content
    const blob = new Blob([markdown], { type: 'text/markdown' });
    
    // Create a download link and trigger the download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('Error exporting chat as markdown:', error);
    throw error;
  }
}

/**
 * Exports chat messages to a JSON file
 */
export function exportChatAsJSON(messages: Message[], filename: string = 'chat-export.json'): void {
  try {
    // Create a clean version of the messages for export
    const exportMessages = messages.map(message => ({
      role: message.role,
      content: message.content,
      timestamp: message.timestamp ? new Date(message.timestamp).toISOString() : new Date().toISOString()
    }));
    
    // Create the export object
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        messageCount: messages.length
      },
      messages: exportMessages
    };
    
    // Create a blob with the JSON content
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    
    // Create a download link and trigger the download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('Error exporting chat as JSON:', error);
    throw error;
  }
}

/**
 * Exports chat messages to an HTML file
 */
export function exportChatAsHTML(messages: Message[], filename: string = 'chat-export.html'): void {
  try {
    // Create the HTML content
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chat Export</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid #eee;
    }
    .message {
      margin-bottom: 20px;
      padding: 15px;
      border-radius: 10px;
    }
    .user {
      background-color: #e6f7ff;
      border-left: 4px solid #1890ff;
    }
    .assistant {
      background-color: #f6f6f6;
      border-left: 4px solid #52c41a;
    }
    .meta {
      font-size: 12px;
      color: #888;
      margin-bottom: 5px;
    }
    .content {
      white-space: pre-wrap;
    }
    .separator {
      height: 1px;
      background-color: #eee;
      margin: 20px 0;
    }
    code {
      background-color: #f1f1f1;
      padding: 2px 4px;
      border-radius: 4px;
      font-family: monospace;
    }
    pre {
      background-color: #f1f1f1;
      padding: 10px;
      border-radius: 4px;
      overflow-x: auto;
      font-family: monospace;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Chat Export</h1>
    <p>Exported on ${new Date().toLocaleString()}</p>
  </div>
  <div class="chat">
`;
    
    // Add each message
    messages.forEach((message, index) => {
      const timestamp = message.timestamp 
        ? new Date(message.timestamp).toLocaleString() 
        : new Date().toLocaleString();
      
      const role = message.role === 'user' ? 'User' : 'Assistant';
      const className = message.role === 'user' ? 'user' : 'assistant';
      
      html += `    <div class="message ${className}">
      <div class="meta">${role} • ${timestamp}</div>
      <div class="content">${formatHTMLContent(message.content)}</div>
    </div>
`;
      
      // Add separator except for the last message
      if (index < messages.length - 1) {
        html += `    <div class="separator"></div>
`;
      }
    });
    
    // Close the HTML
    html += `  </div>
</body>
</html>`;
    
    // Create a blob with the HTML content
    const blob = new Blob([html], { type: 'text/html' });
    
    // Create a download link and trigger the download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('Error exporting chat as HTML:', error);
    throw error;
  }
}

/**
 * Format content for HTML export
 */
function formatHTMLContent(content: string): string {
  // Escape HTML special characters
  let formatted = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
  
  // Format code blocks
  formatted = formatted.replace(/```([\s\S]*?)```/g, (match, code) => {
    return `<pre>${code.trim()}</pre>`;
  });
  
  // Format inline code
  formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Format bold text
  formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  
  // Format italic text
  formatted = formatted.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  
  // Format links
  formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
  
  // Format line breaks
  formatted = formatted.replace(/\n/g, '<br>');
  
  return formatted;
}
