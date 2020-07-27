param(
    [string]$bucketName,
    [string]$stackName,
    [string]$stage
)

$endpoint = (aws cloudformation describe-stacks --stack-name $stackName --query "Stacks[0].Outputs[?OutputKey=='ServiceEndpoint'].OutputValue" --output text) | Out-String

$endpoint = "'" + $endpoint.TrimEnd() + "'"

$path = "../BH.SPA/src/environments/environment." + $stage + ".ts"

Write-Host "API Endpoint: $endpoint"

Set-Content -Path $path -Value "export const environment = {`n  production: false,  `n  apiUrl: $endpoint `n};"

cd ../BH.SPA
npm install
ng build --configuration=$stage
aws s3 cp dist s3://$bucketName/ --recursive
cd ../BH