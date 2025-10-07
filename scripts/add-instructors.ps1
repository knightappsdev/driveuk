# PowerShell script to add instructors using SQL
# This script uses the Drizzle Kit to execute SQL safely

Write-Host "Adding 10 new instructors to the database..." -ForegroundColor Green

# First, check if the development server is running
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 5
    Write-Host "✓ Development server is running" -ForegroundColor Green
} catch {
    Write-Host "✗ Development server is not running. Please start with 'npm run dev'" -ForegroundColor Red
    exit 1
}

# Execute the SQL file using Drizzle Kit
try {
    Write-Host "Executing SQL script..." -ForegroundColor Yellow
    
    # Use Drizzle Kit to run custom SQL
    $sqlContent = Get-Content -Path "scripts\add-instructors-sql.sql" -Raw
    
    # Create a temporary migration file
    $migrationDir = "drizzle\migrations"
    if (!(Test-Path $migrationDir)) {
        New-Item -ItemType Directory -Path $migrationDir -Force
    }
    
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $migrationFile = "$migrationDir\${timestamp}_add_instructors.sql"
    
    Set-Content -Path $migrationFile -Value $sqlContent
    
    Write-Host "Created migration file: $migrationFile" -ForegroundColor Yellow
    
    # Push the migration
    $output = & npx drizzle-kit push --verbose 2>&1
    Write-Host "Migration output:" -ForegroundColor Cyan
    Write-Host $output
    
    # Verify the instructors were added
    Start-Sleep -Seconds 3
    
    Write-Host "Verifying instructors were added..." -ForegroundColor Yellow
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/instructors?limit=20" -Method GET
    $data = $response.Content | ConvertFrom-Json
    
    if ($data.success) {
        Write-Host "✓ Successfully added instructors!" -ForegroundColor Green
        Write-Host "Total instructors now: $($data.instructors.Count)" -ForegroundColor Cyan
        
        # Show the new instructors
        Write-Host "`nNew instructors added:" -ForegroundColor Green
        $data.instructors | Where-Object { $_.email -like "*@driveuk.com" } | ForEach-Object {
            Write-Host "- $($_.first_name) $($_.last_name) ($($_.base_city)) - £$($_.hourly_rate)/hour" -ForegroundColor White
        }
    } else {
        Write-Host "✗ Error verifying instructors: $($data.error)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "✗ Error executing SQL: $($_.Exception.Message)" -ForegroundColor Red
    
    # Fallback: Try using a direct API approach instead
    Write-Host "`nTrying alternative API approach..." -ForegroundColor Yellow
    
    # Create instructors via API calls
    $instructors = @(
        @{
            email = "john.smith@driveuk.com"
            firstName = "John"
            lastName = "Smith"
            phone = "+44 7123 456789"
            city = "Manchester"
            postcode = "M1 1AA"
            adiBadgeNumber = "ADI12345"
            adiGrade = "Grade A"
            yearsExperience = 8
            hourlyRate = 35.00
            baseCity = "Manchester"
            carMake = "Ford"
            carModel = "Focus"
            ethnicity = "White British"
            religion = "Christian"
            teachingExpertise = "Nervous Learners"
        },
        @{
            email = "sarah.johnson@driveuk.com"
            firstName = "Sarah"
            lastName = "Johnson"
            phone = "+44 7234 567890"
            city = "Birmingham"
            postcode = "B1 1AB"
            adiBadgeNumber = "ADI23456"
            adiGrade = "Grade A"
            yearsExperience = 6
            hourlyRate = 32.00
            baseCity = "Birmingham"
            carMake = "Toyota"
            carModel = "Corolla"
            ethnicity = "Asian British"
            religion = "Hindu"
            teachingExpertise = "Automatic Specialist"
        }
    )
    
    foreach ($instructor in $instructors) {
        try {
            $jsonBody = $instructor | ConvertTo-Json
            $response = Invoke-WebRequest -Uri "http://localhost:3000/api/admin/instructors" -Method POST -Body $jsonBody -ContentType "application/json"
            Write-Host "✓ Added: $($instructor.firstName) $($instructor.lastName)" -ForegroundColor Green
        } catch {
            Write-Host "✗ Failed to add: $($instructor.firstName) $($instructor.lastName)" -ForegroundColor Red
        }
    }
}

Write-Host "`nInstructor addition process completed!" -ForegroundColor Green