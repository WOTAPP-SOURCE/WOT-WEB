# guard-bash.ps1 — Block destructive commands before Claude Code executes them
# Called by Claude Code PreToolUse hook on Bash matcher

$input = $env:CLAUDE_TOOL_INPUT
if (-not $input) { exit 0 }

# Dangerous patterns to block
$blocked = @(
    'rm\s+-rf\s+/',
    'rm\s+-rf\s+\*',
    'rm\s+-rf\s+\.',
    'rmdir\s+/s',
    'del\s+/s\s+/q',
    'git\s+push.*--force',
    'git\s+push.*-f\b',
    'git\s+reset\s+--hard',
    'git\s+clean\s+-fd',
    'DROP\s+TABLE',
    'DROP\s+DATABASE',
    'TRUNCATE\s+TABLE',
    'DELETE\s+FROM\s+\w+\s*;?\s*$',
    'mkfs\.',
    'dd\s+if=',
    ':(){',
    'chmod\s+-R\s+777\s+/',
    'npm\s+publish',
    'npx\s+rimraf\s+/'
)

foreach ($pattern in $blocked) {
    if ($input -match $pattern) {
        Write-Error "BLOCKED: Destructive command detected matching pattern '$pattern'"
        Write-Error "Command: $input"
        exit 2
    }
}

exit 0
