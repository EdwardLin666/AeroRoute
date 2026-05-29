$body = @{
  locations = @(
    @{
      lat = 43.6535
      lon = -79.3839
    },
    @{
      lat = 43.8828
      lon = -79.4403
    }
  )
  costing = "bicycle"
  directions_options = @{
    units = "kilometers"
  }
} | ConvertTo-Json -Depth 10

Invoke-RestMethod `
  -Uri "http://localhost:8002/route" `
  -Method Post `
  -Body $body `
  -ContentType "application/json" |
  Select-Object -ExpandProperty trip |
  Select-Object -ExpandProperty summary
