import { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

export default function CopyButton({ textToCopy }: { textToCopy: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // Writes text to system clipboard using the standard Web API
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);

      // Revert the button status back to original state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Tooltip title={copied ? 'Copied!' : 'Copy to clipboard'} placement="top">
      <IconButton
        aria-label={copied ? 'Copied' : 'Copy to clipboard'}
        onClick={handleCopy}
        color={copied ? 'success' : 'default'}
      >
        {copied ? <CheckIcon /> : <ContentCopyIcon />}
      </IconButton>
    </Tooltip>
  );
}
