# Version-Aware Image-to-Content Mapping System
# Automatically scans all .mdx content files, detects image references,
# and maps them to the correct version-specific image paths.

$ErrorActionPreference = "Stop"

$ContentDir = "src\content"
$AssetsDir = "src\assets\images"
$Versions = @("NG", "6_1", "6_1_1", "5_13")

$Report = @{
    Files = @()
    Summary = @{
        TotalFiles = 0
        TotalImageReferences = 0
        TotalValidImages = 0
        TotalMissingImages = 0
        Versions = @{}
    }
}

# Detect version from MDX file path
function Get-VersionFromPath {
    param([string]$FilePath)
    
    $normalizedPath = $FilePath -replace '\\', '/'
    
    foreach ($version in $Versions) {
        # Match version in path: /version/ or version/ at start
        if ($normalizedPath -match "[/\\]$version[/\\]|^$version[/\\]") {
            return $version
        }
    }
    
    return $null
}

# Extract image references from MDX content
function Get-ImageReferences {
    param([string]$Content)
    
    $references = @()
    $lines = $Content -split "`n"
    
    for ($i = 0; $i -lt $lines.Count; $i++) {
        $line = $lines[$i]
        $lineNumber = $i + 1
        
        # Markdown image pattern: ![alt](path)
        $markdownPattern = '!\[([^\]]*)\]\(([^)]+)\)'
        $markdownMatches = [regex]::Matches($line, $markdownPattern)
        
        foreach ($match in $markdownMatches) {
            $imagePath = $match.Groups[2].Value.Trim()
            if ($imagePath -and -not $imagePath.StartsWith("http") -and -not $imagePath.StartsWith("data:")) {
                $references += @{
                    Path = $imagePath
                    LineNumber = $lineNumber
                    Context = $line.Trim().Substring(0, [Math]::Min(100, $line.Trim().Length))
                }
            }
        }
        
        # HTML img pattern: <img src="path" ...>
        $htmlPattern = '<img[^>]+src=["'']([^"'']+)["''][^>]*>'
        $htmlMatches = [regex]::Matches($line, $htmlPattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
        
        foreach ($match in $htmlMatches) {
            $imagePath = $match.Groups[1].Value.Trim()
            if ($imagePath -and -not $imagePath.StartsWith("http") -and -not $imagePath.StartsWith("data:")) {
                $references += @{
                    Path = $imagePath
                    LineNumber = $lineNumber
                    Context = $line.Trim().Substring(0, [Math]::Min(100, $line.Trim().Length))
                }
            }
        }
        
        # Relative path pattern: ../Resources/Images/...
        $relativePattern = '\.\./Resources/Images/([^\s\)"'']+)'
        $relativeMatches = [regex]::Matches($line, $relativePattern)
        
        foreach ($match in $relativeMatches) {
            $imagePath = $match.Groups[1].Value.Trim()
            $references += @{
                Path = $imagePath
                LineNumber = $lineNumber
                Context = $line.Trim().Substring(0, [Math]::Min(100, $line.Trim().Length))
            }
        }
    }
    
    return $references
}

# Resolve image path to version-specific asset path
function Resolve-ImagePath {
    param(
        [string]$ImagePath,
        [string]$Version,
        [string]$MdxFilePath
    )
    
    # Remove query strings and fragments
    $cleanPath = $ImagePath -split '\?' | Select-Object -First 1
    $cleanPath = $cleanPath -split '#' | Select-Object -First 1
    
    # If already absolute or version-specific, return as-is
    if ($cleanPath -match '^/assets/|^/images/') {
        return $cleanPath
    }
    
    # Handle relative paths like ../Resources/Images/...
    if ($cleanPath -match '\.\./Resources/Images/(.+)') {
        $relativePath = $matches[1]
        # Preserve subdirectory structure
        return "/images/$Version/$relativePath"
    }
    
    # Handle paths with subdirectories (e.g., admin_org_details/cost_center.png)
    if ($cleanPath -match '^([^/\\]+[/\\])') {
        # Has subdirectory, preserve it
        return "/images/$Version/$cleanPath"
    }
    
    # Extract filename from path (no subdirectory)
    $imageName = Split-Path -Leaf $cleanPath
    
    # Map to version-specific path
    return "/images/$Version/$imageName"
}

# Check if image file exists
function Test-ImageExists {
    param([string]$ResolvedPath)
    
    # Convert web path to filesystem path
    $fsPath = $ResolvedPath -replace '^/images/', '' -replace '^/assets/images/', ''
    $fullPath = Join-Path $AssetsDir $fsPath
    
    # Normalize path separators
    $fullPath = $fullPath -replace '/', '\'
    
    # Check exact path
    if (Test-Path $fullPath) {
        return $true
    }
    
    # Check with different case for filename only
    $dir = Split-Path -Parent $fullPath
    $filename = Split-Path -Leaf $fullPath
    
    if (Test-Path $dir) {
        $files = Get-ChildItem -Path $dir -File -Recurse:$false
        $found = $files | Where-Object { $_.Name -eq $filename -or $_.Name.ToLower() -eq $filename.ToLower() }
        if ($found) {
            return $true
        }
    }
    
    # Try searching in subdirectories (case-insensitive)
    $versionDir = Split-Path -Parent $dir
    if (Test-Path $versionDir) {
        $searchPattern = "*$filename"
        $found = Get-ChildItem -Path $versionDir -Filter $searchPattern -File -Recurse -ErrorAction SilentlyContinue | 
            Where-Object { $_.Name -eq $filename -or $_.Name.ToLower() -eq $filename.ToLower() }
        if ($found) {
            return $true
        }
    }
    
    return $false
}

# Scan a single MDX file
function Scan-MDXFile {
    param([string]$FilePath)
    
    $version = Get-VersionFromPath -FilePath $FilePath
    
    if (-not $version) {
        return $null
    }
    
    try {
        $content = Get-Content -Path $FilePath -Raw -Encoding UTF8
        $imageRefs = Get-ImageReferences -Content $content
        
        $imageReferences = @()
        foreach ($ref in $imageRefs) {
            $resolvedPath = Resolve-ImagePath -ImagePath $ref.Path -Version $version -MdxFilePath $FilePath
            $exists = Test-ImageExists -ResolvedPath $resolvedPath
            
            $imageReferences += @{
                OriginalPath = $ref.Path
                ResolvedPath = $resolvedPath
                Exists = $exists
                LineNumber = $ref.LineNumber
                Context = $ref.Context
            }
        }
        
        $validImages = ($imageReferences | Where-Object { $_.Exists }).Count
        $missingImages = ($imageReferences | Where-Object { -not $_.Exists }).Count
        
        $relativePath = $FilePath.Replace((Get-Location).Path + '\', '').Replace('\', '/')
        if ($relativePath -eq $FilePath) {
            $relativePath = $FilePath.Replace((Resolve-Path $ContentDir).Path + '\', '').Replace('\', '/')
        }
        
        return [PSCustomObject]@{
            FilePath = $relativePath
            Version = $version
            ImageReferences = $imageReferences
            TotalImages = $imageReferences.Count
            ValidImages = $validImages
            MissingImages = $missingImages
        }
    }
    catch {
        Write-Warning "Error scanning $FilePath : $_"
        return $null
    }
}

# Scan all MDX files recursively
function Scan-AllMDXFiles {
    $reports = @()
    $mdxFiles = Get-ChildItem -Path $ContentDir -Filter "*.mdx" -Recurse -File
    
    Write-Host "Found $($mdxFiles.Count) MDX files to scan..." -ForegroundColor Cyan
    
    $count = 0
    foreach ($file in $mdxFiles) {
        $count++
        if ($count % 100 -eq 0) {
            Write-Host "  Scanned $count / $($mdxFiles.Count) files..." -ForegroundColor Gray
        }
        
        $report = Scan-MDXFile -FilePath $file.FullName
        if ($report) {
            $reports += $report
        }
    }
    
    return $reports
}

# Generate report
function Format-Report {
    param([array]$Reports)
    
    $output = "`n=== IMAGE MAPPING REPORT ===`n"
    $output += "=" * 80 + "`n`n"
    
    # Summary
    $totalFiles = if ($Reports) { $Reports.Count } else { 0 }
    
    if ($totalFiles -eq 0 -or -not $Reports) {
        $totalImageRefs = 0
        $totalValid = 0
        $totalMissing = 0
    } else {
        $reportsWithImages = $Reports | Where-Object { $null -ne $_ -and $null -ne $_.TotalImages }
        if ($reportsWithImages -and $reportsWithImages.Count -gt 0) {
            $totalImageRefs = ($reportsWithImages | Measure-Object -Property TotalImages -Sum).Sum
            $totalValid = ($reportsWithImages | Measure-Object -Property ValidImages -Sum).Sum
            $totalMissing = ($reportsWithImages | Measure-Object -Property MissingImages -Sum).Sum
        } else {
            $totalImageRefs = 0
            $totalValid = 0
            $totalMissing = 0
        }
    }
    
    $output += "SUMMARY`n"
    $output += "   Total MDX Files Scanned: $totalFiles`n"
    $output += "   Total Image References: $totalImageRefs`n"
    $output += "   [OK] Valid Images: $totalValid`n"
    $output += "   [MISSING] Missing Images: $totalMissing`n`n"
    
    # Version breakdown
    $output += "VERSION BREAKDOWN`n"
    if ($Reports -and $Reports.Count -gt 0) {
        $versionGroups = $Reports | Where-Object { $null -ne $_ -and $null -ne $_.Version } | Group-Object -Property Version
        foreach ($group in $versionGroups) {
            $version = $group.Name
            $files = $group.Count
            $validGroup = $group.Group | Where-Object { $null -ne $_.TotalImages }
            if ($validGroup) {
                $images = ($validGroup | Measure-Object -Property TotalImages -Sum).Sum
                $missing = ($validGroup | Measure-Object -Property MissingImages -Sum).Sum
            } else {
                $images = 0
                $missing = 0
            }
            
            $output += "   $version :`n"
            $output += "      Files: $files`n"
            $output += "      Images: $images`n"
            $output += "      Missing: $missing`n"
        }
    }
    $output += "`n"
    
    # Files with missing images
    $filesWithMissing = $Reports | Where-Object { $null -ne $_ -and $null -ne $_.MissingImages -and $_.MissingImages -gt 0 }
    if ($filesWithMissing.Count -gt 0) {
        $output += "[WARNING] FILES WITH MISSING IMAGES`n"
        $output += "-" * 80 + "`n"
        
        foreach ($file in $filesWithMissing) {
            $output += "`nFILE: $($file.FilePath)`n"
            $output += "   Version: $($file.Version)`n"
            $output += "   Total Images: $($file.TotalImages) ([OK] $($file.ValidImages) valid, [MISSING] $($file.MissingImages) missing)`n"
            
            $missingRefs = $file.ImageReferences | Where-Object { -not $_.Exists }
            foreach ($ref in $missingRefs) {
                $output += "   [MISSING] Line $($ref.LineNumber): $($ref.OriginalPath)`n"
                $output += "      Expected: $($ref.ResolvedPath)`n"
            }
        }
        $output += "`n"
    }
    
    # Sample of valid mappings
    $filesWithImages = $Reports | Where-Object { $null -ne $_ -and $null -ne $_.TotalImages -and $_.TotalImages -gt 0 } | Select-Object -First 5
    if ($filesWithImages.Count -gt 0) {
        $output += "[OK] SAMPLE VALID MAPPINGS`n"
        $output += "-" * 80 + "`n"
        
        foreach ($file in $filesWithImages) {
            $output += "`nFILE: $($file.FilePath)`n"
            $output += "   Version: $($file.Version)`n"
            
            $validRefs = $file.ImageReferences | Where-Object { $_.Exists } | Select-Object -First 3
            foreach ($ref in $validRefs) {
                $output += "   [OK] $($ref.OriginalPath) -> $($ref.ResolvedPath)`n"
            }
        }
        $output += "`n"
    }
    
    $output += "=" * 80 + "`n"
    
    return $output
}

# Main execution
Write-Host "`n[SCAN] Starting image mapping scan..." -ForegroundColor Green
Write-Host "Content Directory: $ContentDir" -ForegroundColor Cyan
Write-Host "Assets Directory: $AssetsDir`n" -ForegroundColor Cyan

$reports = Scan-AllMDXFiles
$reportText = Format-Report -Reports $reports

Write-Host $reportText

# Save report to file
$reportPath = Join-Path (Get-Location) "IMAGE_MAPPING_REPORT.txt"
$reportText | Out-File -FilePath $reportPath -Encoding UTF8
Write-Host "`n[SAVED] Full report saved to: $reportPath" -ForegroundColor Green

# Save JSON report
$versionGroups = $reports | Group-Object -Property Version
$versionStats = @{}
foreach ($group in $versionGroups) {
    $versionStats[$group.Name] = @{
        Files = $group.Count
        Images = if ($group.Group) { ($group.Group | Measure-Object -Property TotalImages -Sum).Sum } else { 0 }
        Missing = if ($group.Group) { ($group.Group | Measure-Object -Property MissingImages -Sum).Sum } else { 0 }
    }
}

$totalFiles = if ($reports) { $reports.Count } else { 0 }
$totalImageRefs = if ($reports) { ($reports | Measure-Object -Property TotalImages -Sum).Sum } else { 0 }
$totalValid = if ($reports) { ($reports | Measure-Object -Property ValidImages -Sum).Sum } else { 0 }
$totalMissing = if ($reports) { ($reports | Measure-Object -Property MissingImages -Sum).Sum } else { 0 }

$jsonReport = @{
    Files = $reports
    Summary = @{
        TotalFiles = $totalFiles
        TotalImageReferences = $totalImageRefs
        TotalValidImages = $totalValid
        TotalMissingImages = $totalMissing
        Versions = $versionStats
    }
}

$jsonPath = Join-Path (Get-Location) "IMAGE_MAPPING_REPORT.json"
$jsonReport | ConvertTo-Json -Depth 10 | Out-File -FilePath $jsonPath -Encoding UTF8
Write-Host "[SAVED] JSON report saved to: $jsonPath" -ForegroundColor Green

Write-Host "`n[COMPLETE] Image mapping scan complete!" -ForegroundColor Green

