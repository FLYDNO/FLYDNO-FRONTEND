$files = @('index.html', 'oppdag.html', 'deals.html', 'varsler.html', 'historikk.html')
$utf8NoBom = New-Object System.Text.UTF8Encoding $False
$utf8 = [System.Text.Encoding]::UTF8
$win1252 = [System.Text.Encoding]::GetEncoding(1252)

foreach ($f in $files) {
    if (Test-Path $f) {
        $c = [System.IO.File]::ReadAllText($f, $utf8)
        if ($c -match 'Ã') {
            try {
                $bytes = $win1252.GetBytes($c)
                $fixedStr = $utf8.GetString($bytes)
                [System.IO.File]::WriteAllText("test_$f", $fixedStr, $utf8NoBom)
                Write-Host "Fixed $f"
            }
            catch {
                Write-Host "Error on $($f): $_"
            }
        }
    }
}
