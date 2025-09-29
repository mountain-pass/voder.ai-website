#!/bin/bash

# Configuration
PROMPTS_DIR="prompts"
TRACEABILITY_DIR=".voder/traceability"

echo "🔍 Generating traceability files..."

# Check if prompts directory exists
if [ ! -d "$PROMPTS_DIR" ]; then
    echo "❌ Prompts directory '$PROMPTS_DIR' not found"
    exit 1
fi

# Create traceability directory if it doesn't exist
if [ ! -d "$TRACEABILITY_DIR" ]; then
    mkdir -p "$TRACEABILITY_DIR"
    echo "📁 Created directory: $TRACEABILITY_DIR"
fi

# Find all .md files in prompts directory and create traceability files
echo "🔎 Scanning $PROMPTS_DIR for .md files..."

file_count=0
find "$PROMPTS_DIR" -name "*.md" -type f | while read -r spec_file; do
    # Convert file path to safe filename by replacing / with - and removing .md extension
    # Example: prompts/release-0.5/001.0-FEATURE.md -> prompts-release-0.5-001.0-FEATURE.json
    safe_filename=$(echo "$spec_file" | sed 's/\//-/g' | sed 's/\.md$//')
    traceability_file="$TRACEABILITY_DIR/${safe_filename}.json"
    
    # Create JSON content
    cat > "$traceability_file" << INNER_EOF
{
  "specification": "$spec_file",
  "status": "TODO"
}
INNER_EOF
    
    echo "Created: $traceability_file"
    ((file_count++))
done

echo "✅ Traceability files generated successfully"