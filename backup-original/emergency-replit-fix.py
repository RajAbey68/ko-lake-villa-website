#!/usr/bin/env python
"""
Emergency fix for .replit configuration Git merge conflict
This resolves the conflict preventing Ko Lake Villa from starting
"""
import shutil
import os

def fix_replit_config():
    try:
        # Read the broken .replit file
        with open('.replit', 'r') as f:
            content = f.read()
        
        # Create backup
        shutil.copy('.replit', '.replit.backup')
        
        # Fix the Git merge conflict by removing conflict markers
        # and keeping the merged packages list
        lines = content.split('\n')
        fixed_lines = []
        skip_until_end = False
        
        for line in lines:
            if '<<<<<<< HEAD' in line:
                skip_until_end = True
                continue
            elif '=======' in line and skip_until_end:
                continue
            elif '>>>>>>> dev' in line and skip_until_end:
                skip_until_end = False
                # Add the correct packages line
                if 'packages' not in '\n'.join(fixed_lines[-5:]):
                    fixed_lines.append('packages = ["zip", "nano", "psmisc", "yakut", "openssh", "unzip"]')
                continue
            elif not skip_until_end:
                fixed_lines.append(line)
        
        # Join and clean up
        fixed_content = '\n'.join(fixed_lines)
        
        # Remove any remaining conflict markers
        fixed_content = fixed_content.replace('<<<<<<< HEAD', '')
        fixed_content = fixed_content.replace('=======', '')
        fixed_content = fixed_content.replace('>>>>>>> dev', '')
        
        # Write the fixed configuration
        with open('.replit', 'w') as f:
            f.write(fixed_content)
        
        print("Fixed .replit configuration - Git merge conflict resolved")
        return True
        
    except Exception as e:
        print(f"Error fixing configuration: {e}")
        return False

if __name__ == "__main__":
    if fix_replit_config():
        print("Configuration fixed. Ko Lake Villa should start now.")
    else:
        print("Failed to fix configuration.")