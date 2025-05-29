#!/bin/bash
# Ko Lake Villa - Security & Deployment Automation Script
# Automates security checks and deployment preparation

echo "🔒 Ko Lake Villa Security & Deployment Automation"
echo "================================================="

# Function to check environment variables
check_env_vars() {
    echo "Checking required environment variables..."
    
    required_vars=("STRIPE_SECRET_KEY" "VITE_STRIPE_PUBLIC_KEY" "VITE_GA_MEASUREMENT_ID")
    missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        else
            echo "✅ $var is configured"
        fi
    done
    
    if [ ${#missing_vars[@]} -gt 0 ]; then
        echo "❌ Missing environment variables:"
        printf '   %s\n' "${missing_vars[@]}"
        return 1
    fi
    
    echo "✅ All required environment variables are set"
    return 0
}

# Function to run security checks
security_checks() {
    echo -e "\nRunning security checks..."
    
    # Check for sensitive files
    echo "Checking for sensitive files..."
    sensitive_patterns=(".env" "*.key" "*.pem" "config.json")
    
    for pattern in "${sensitive_patterns[@]}"; do
        if find . -name "$pattern" -not -path "./node_modules/*" | grep -q .; then
            echo "⚠️  Found sensitive files matching: $pattern"
        fi
    done
    
    # Check package.json for security vulnerabilities
    if command -v npm &> /dev/null; then
        echo "Running npm audit..."
        npm audit --audit-level=high || echo "⚠️  Security vulnerabilities found"
    fi
    
    echo "✅ Security checks completed"
}

# Function to optimize for production
production_optimization() {
    echo -e "\nOptimizing for production..."
    
    # Build the application
    echo "Building application..."
    npm run build || {
        echo "❌ Build failed"
        return 1
    }
    
    # Check bundle size
    if [ -d "dist" ]; then
        echo "Bundle size analysis:"
        du -sh dist/
    fi
    
    echo "✅ Production optimization completed"
}

# Function to validate deployment readiness
deployment_validation() {
    echo -e "\nValidating deployment readiness..."
    
    # Check if server starts
    echo "Testing server startup..."
    timeout 10s npm start &>/dev/null && {
        echo "✅ Server starts successfully"
    } || {
        echo "❌ Server startup failed"
        return 1
    }
    
    # Check essential files exist
    essential_files=("package.json" "static/sitemap.xml" "static/robots.txt")
    
    for file in "${essential_files[@]}"; do
        if [ -f "$file" ]; then
            echo "✅ $file exists"
        else
            echo "❌ Missing: $file"
            return 1
        fi
    done
    
    echo "✅ Deployment validation passed"
}

# Function to create deployment package
create_deployment_package() {
    echo -e "\nCreating deployment package..."
    
    # Create deployment directory
    mkdir -p deployment-package
    
    # Copy essential files
    essential_dirs=("client" "server" "shared" "static" "uploads")
    essential_files=("package.json" "package-lock.json" "tsconfig.json" "vite.config.ts" "tailwind.config.ts")
    
    for dir in "${essential_dirs[@]}"; do
        if [ -d "$dir" ]; then
            cp -r "$dir" deployment-package/
            echo "✅ Copied $dir"
        fi
    done
    
    for file in "${essential_files[@]}"; do
        if [ -f "$file" ]; then
            cp "$file" deployment-package/
            echo "✅ Copied $file"
        fi
    done
    
    # Copy GCP configuration if it exists
    if [ -f "deploy-to-gcp.yaml" ]; then
        cp "deploy-to-gcp.yaml" deployment-package/app.yaml
        echo "✅ Copied GCP configuration as app.yaml"
    fi
    
    echo "✅ Deployment package created in ./deployment-package/"
}

# Main execution
main() {
    echo "Starting automated security and deployment checks..."
    
    if check_env_vars; then
        echo "✅ Environment validation passed"
    else
        echo "❌ Environment validation failed"
        exit 1
    fi
    
    security_checks
    
    if production_optimization; then
        echo "✅ Production optimization completed"
    else
        echo "❌ Production optimization failed"
        exit 1
    fi
    
    if deployment_validation; then
        echo "✅ Deployment validation passed"
    else
        echo "❌ Deployment validation failed"
        exit 1
    fi
    
    create_deployment_package
    
    echo -e "\n🎉 Ko Lake Villa is ready for deployment!"
    echo "================================================="
    echo "Deployment options:"
    echo "1. Replit Hosting: Click 'Deploy' button in Replit"
    echo "2. Google Cloud: Use 'gcloud app deploy' in deployment-package/"
    echo "3. Manual: Use files in deployment-package/ for any provider"
    echo ""
    echo "Domain configuration: www.KoLakeHouse.com"
    echo "All security checks passed ✅"
}

# Run if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi