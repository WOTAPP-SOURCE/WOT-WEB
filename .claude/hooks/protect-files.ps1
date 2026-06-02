# protect-files.ps1 — Prevent Claude Code from modifying sensitive files
# Called by Claude Code PreToolUse hook on Edit|Write|MultiEdit|Bash matcher

$filePath = $env:CLAUDE_TOOL_INPUT_FILE_PATH
if (-not $filePath) { exit 0 }

# Normalize path separators
$filePath = $filePath.Replace('/', '\')

# Protected file patterns
$protected = @(
    '\.env$',
    '\.env\.local$',
    '\.env\.production$',
    '\.env\.development$',
    'package-lock\.json$',
    'pnpm-lock\.yaml$',
    'yarn\.lock$',
    '\\\.git\\',
    '\\\.git$',
    '\\node_modules\\',
    '\\\.vercel\\',
    '\\\.claude\\settings\.json$',
    '\\\.claude\\hooks\\'
)

foreach ($pattern in $protected) {
    if ($filePath -match $pattern) {
        Write-Error "BLOCKED: Cannot modify protected file '$filePath'"
        Write-Error "This file is in the protected list. Modify it manually if needed."
        exit 2
    }
}

exit 0
