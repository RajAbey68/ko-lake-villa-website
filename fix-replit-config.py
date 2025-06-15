#!/usr/bin/env python3
"""
Fix .replit configuration by resolving Git merge conflicts
"""
import re

def fix_replit_config():
    try:
        with open('.replit', 'r') as f:
            content = f.read()
        
        # Remove Git merge conflict markers and keep the merged version
        fixed_content = re.sub(
            r'<<<<<<< HEAD\npackages = \["zip", "nano", "psmisc", "yakut"\]\n=======\npackages = \["zip", "nano", "psmisc", "yakut", "openssh", "unzip"\]\n>>>>>>> dev',
            'packages = ["zip", "nano", "psmisc", "yakut", "openssh", "unzip"]',
            content
        )
        
        # Also clean up the final merge conflict
        fixed_content = re.sub(
            r'<<<<<<< HEAD\n=======.*?>>>>>>> dev',
            '',
            fixed_content,
            flags=re.DOTALL
        )
        
        # Write fixed content to a new file
        with open('.replit.fixed', 'w') as f:
            f.write(fixed_content)
        
        print("Fixed .replit configuration saved as .replit.fixed")
        print("Content preview:")
        print(fixed_content[:500] + "..." if len(fixed_content) > 500 else fixed_content)
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    fix_replit_config()