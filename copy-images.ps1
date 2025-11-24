# Script to copy images to public folder
# Run this from the project root directory

$sourcePath = "drive-download-20251123T234132Z-1-001"
$destPath = "public\drive-download-20251123T234132Z-1-001"

# Create destination folder if it doesn't exist
if (-not (Test-Path $destPath)) {
    New-Item -ItemType Directory -Path $destPath -Force | Out-Null
    Write-Host "Created destination folder: $destPath"
}

# Check if source folder exists and has images
if (Test-Path $sourcePath) {
    $images = Get-ChildItem -Path $sourcePath -Filter "*.jpg" -ErrorAction SilentlyContinue
    
    if ($images.Count -gt 0) {
        Write-Host "Found $($images.Count) images in source folder"
        Copy-Item -Path "$sourcePath\*.jpg" -Destination $destPath -Force
        Write-Host "✅ Successfully copied $($images.Count) images to public folder"
    } else {
        Write-Host "⚠️  No images found in source folder: $sourcePath"
        Write-Host ""
        Write-Host "Please make sure your images are in the folder: $sourcePath"
        Write-Host "Or update the \$sourcePath variable in this script to point to your images."
    }
} else {
    Write-Host "❌ Source folder not found: $sourcePath"
    Write-Host ""
    Write-Host "To copy images to the public folder:"
    Write-Host "1. Place all your .jpg images in a folder"
    Write-Host "2. Update the \$sourcePath variable above to point to that folder"
    Write-Host "3. Run this script again"
    Write-Host ""
    Write-Host "Or manually copy images:"
    Write-Host "  Copy-Item -Path 'YOUR_IMAGE_FOLDER\*.jpg' -Destination '$destPath' -Force"
}

# Verify what's in the public folder
$publicImages = Get-ChildItem -Path $destPath -Filter "*.jpg" -ErrorAction SilentlyContinue
Write-Host ""
Write-Host "Images currently in public folder: $($publicImages.Count)"

