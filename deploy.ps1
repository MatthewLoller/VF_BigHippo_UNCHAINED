param(
    [string]$bucketName,
    [string]$stackName,
    [string]$stage
)

Write-Output "Getting API endpoint created by CloudFormation"

$endpoint = (aws cloudformation describe-stacks --stack-name $stackName --query "Stacks[0].Outputs[?OutputKey=='ServiceEndpoint'].OutputValue" --output text) | Out-String

$endpoint = "'" + $endpoint.TrimEnd() + "'"

Write-Output "Endpoint is " + $endpoint

$path = "../BH.SPA/src/environments/environment." + $stage + ".ts"

Set-Content -Path $path -Value "export const environment = {`n  production: false,  `n  apiUrl: $endpoint `n};"

Write-Output "Running ng build"

Set-Location ../BH.SPA
npm install
ng build --configuration=$stage

Write-Output "Deploying files to S3"

aws s3 cp dist s3://$bucketName/ --recursive
Set-Location ../BH