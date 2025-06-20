#!/bin/bash

# Create a backup of the original file
cp .replit .replit.original

# Create a clean .replit file without Git conflicts
cat > .replit << 'EOF'
modules = ["nodejs-20", "web", "postgresql-16"]
run = "npm run dev"
hidden = [".config", ".git", "generated-icon.png", "node_modules", "dist"]

[nix]
channel = "stable-24_05"
packages = ["zip", "nano", "psmisc", "yakut", "openssh", "unzip"]

[deployment]
deploymentTarget = "autoscale"
build = ["sh", "-c", "npm run build"]
run = ["sh", "-c", "npm run start"]

[[ports]]
localPort = 3001
externalPort = 3001

[[ports]]
localPort = 5000
externalPort = 80

[workflows]
runButton = "Restart Ko Lake Villa App"

[[workflows.workflow]]
name = "Project"
mode = "parallel"
author = "agent"

[[workflows.workflow.tasks]]
task = "workflow.run"
args = "Start application"

[[workflows.workflow]]
name = "Start application"
author = "agent"

[[workflows.workflow.tasks]]
task = "shell.exec"
args = "npm run dev"
waitForPort = 5000

[[workflows.workflow]]
name = "Restart Ko Lake Villa App"
author = 42618786
mode = "sequential"

[[workflows.workflow.tasks]]
task = "shell.exec"
args = "pkill -f \"node.*5000\" || true"

[[workflows.workflow.tasks]]
task = "shell.exec"
args = "pkill -f \"vite\" || true"

[[workflows.workflow.tasks]]
task = "shell.exec"
args = "sleep 3"

[[workflows.workflow.tasks]]
task = "shell.exec"
args = "npm run dev"
EOF

echo "Configuration file fixed - removed Git merge conflicts"