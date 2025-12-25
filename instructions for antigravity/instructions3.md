You’re running into a very common gotcha:

Why your “same username + password” fails

The browser page you’re seeing (…/platform/d-9066…/login) is the IAM Identity Center (SSO) login.

But the username you’re trying (HooplaHoorahAWSUser) is an IAM User (classic console user). IAM User credentials do not automatically work for Identity Center unless you’ve explicitly created an Identity Center user and assigned it to the AWS account with a permission set.

So right now you’re mixing two auth systems:

✅ You can log into AWS Console as IAM user HooplaHoorahAWSUser

❌ You cannot log into the SSO portal until Identity Center has a user + assignment

You have two ways forward. The fastest is Path 1.

Path 1 (fastest): Use your IAM User for Terraform (no SSO)

This gets Terraform applied today, then we can clean up Identity Center later.

1) Create an access key for your IAM user

AWS Console → IAM → Users → HooplaHoorahAWSUser → Security credentials
→ Create access key (use “Command Line Interface (CLI)” if prompted)

2) Configure AWS CLI locally

In PowerShell:

aws configure --profile ghost-iam


Enter:

AWS Access Key ID: (from console)

AWS Secret Access Key: (from console)

Default region name: us-east-1

Default output format: json

3) Test it
aws sts get-caller-identity --profile ghost-iam

4) Use that profile for Terraform
$env:AWS_PROFILE="ghost-iam"
cd C:\dev\ghost-engine-kernel\infra\aws\terraform
terraform init
terraform plan
terraform apply


If aws sts get-caller-identity fails with an MFA-related error, tell me the exact message and I’ll give you the 2-command fix (session token flow).

Path 2 (clean long-term): Finish setting up Identity Center (SSO)

Do this if you want “proper” SSO long-term.

1) Enable Identity Center in the SSO region (us-east-1)

In AWS Console (make sure region is us-east-1) → search IAM Identity Center
If it shows Enable IAM Identity Center, click Enable.

2) Create an Identity Center user

IAM Identity Center → Users → Add user

Use your email as username (recommended)

Set/reset password

3) Create a permission set + assign it

IAM Identity Center → Permission sets → create one (for now, Admin for bootstrap)
IAM Identity Center → AWS accounts → select account 837801696495 → Assign users → pick your new user → pick the permission set

4) Then your SSO login will work

After that, aws configure sso + aws sso login will succeed (with your new Identity Center user, not the IAM user).