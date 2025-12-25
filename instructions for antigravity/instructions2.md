# instructions2.md — AWS fact-finding for Terraform (Antigravity)

## Goal
Collect the **exact AWS account + login details** needed so we can tell the user *precisely* how to authenticate locally (AWS CLI) and run:

- `terraform init`
- `terraform plan`
- `terraform apply`

**Important:** This is **read-only reconnaissance**. Do **not** create/modify resources unless explicitly asked.

---

## 0) Quick repo sanity check (Terraform vars)
In the repo, confirm `infra/aws/terraform/terraform.tfvars` has:

- `aws_region` (e.g. `us-east-1`)
- `github_repo` must be **OWNER/REPO** (NOT a full URL)

✅ Correct example:
```hcl
github_repo = "HooplaHoorah/ghost-engine-kernel"
```

❌ Incorrect:
```hcl
github_repo = "https://github.com/HooplaHoorah/ghost-engine-kernel"
```

Report whether it’s fixed.

---

## 1) Identify the AWS login type (this determines all next steps)
We need to know if the user is using:

### A) IAM Identity Center / SSO (most common for org accounts)
Typical signs:
- You log in via an “AWS access portal”
- You pick an account + role/permission set
- URL often looks like: `https://d-xxxxxxxxxx.awsapps.com/start`

### B) IAM User (classic)
Typical signs:
- You sign in with an **IAM username** (not just email)
- You’re in **IAM → Users** and see your user directly

**Task:** Determine which one they are using.

---

## 2) Collect these facts (copy/paste values)
### Always collect (both A and B)
1) **AWS Account ID** you are currently in  
   - In console top-right, click the account/role menu.  
   - Record: `Account ID` (12-digit) and `Role/Identity` name shown.

2) **Region** currently selected in console (top-right region picker)  
   - Record exact region code (e.g. `us-east-1`, `us-west-2`).

3) Confirm whether **CloudShell** is available/enabled  
   - Look for the terminal icon in the console header.  
   - If available, open it (don’t run destructive commands) and report:
     - Whether it opens successfully
     - Default region shown (often displayed in the prompt)

---

## 3A) If using IAM Identity Center / SSO (Path A)
We need the values required for `aws configure sso`.

### Find and report:
1) **SSO Start URL (AWS access portal URL)**
   - In AWS console, search: **“IAM Identity Center”**
   - Open it → look for **Settings** or **Dashboard**
   - Record the **AWS access portal URL / Start URL**
   - (Example format: `https://d-xxxxxxxxxx.awsapps.com/start`)

2) **SSO Region (Identity Center region)**
   - In IAM Identity Center page, it will show the **Region** it’s configured in.
   - Record the exact region code.

3) **Account ID(s) and Permission Set / Role name**
   - In the access portal, you select an **account** and then a **permission set** (role).
   - Record:
     - Account ID / Account name
     - Permission set name (role name you assume)

4) Whether the user has access to **Admin-like** permissions or limited
   - If you can open IAM, VPC, ECS, ECR without “AccessDenied”, that’s a good sign.
   - Report any obvious permission errors encountered.

**Deliverable:** Provide the SSO Start URL, SSO Region, Account ID, Role/Permission set name.

---

## 3B) If using IAM User (Path B)
We need to know whether CLI access keys exist and whether MFA is enforced for API calls.

### Find and report:
1) **IAM Username**
   - Go to **IAM → Users**
   - Click the currently logged-in user (if visible)
   - Record the **User name**

2) **MFA device ARN (Serial number)**
   - IAM → Users → (user) → **Security credentials**
   - Look for **Assigned MFA device**
   - Record the MFA device **ARN / serial number**
   - (This is needed if they must call `sts get-session-token`)

3) **Access keys status**
   - On the same Security credentials page:
     - Do access keys already exist?
     - Are they Active/Inactive?
   - Report **whether an access key exists** (do not paste the secret).
   - If none exist, report whether the console allows creating one.

4) Any explicit policy requiring MFA for API calls
   - If the org enforces MFA for API usage, AWS CLI calls can fail unless using session tokens.
   - We’ll confirm later by running `aws sts get-caller-identity` locally, but note any IAM policy hints if visible.

**Deliverable:** IAM username, MFA device ARN, access key existence, and account ID.

---

## 4) Terraform readiness checks in AWS (read-only)
We’re about to create: VPC, subnets, NAT, ALB, ECS, ECR, IAM/OIDC.

Check (without changing anything):
- In **ECR**: do repos already exist named for orchestrator/worker?
- In **ECS**: any existing clusters/services with similar names?
- In **VPC**: any existing VPCs with the intended CIDR (`10.0.0.0/16`) that might conflict?

Just report “none found” or list names if found.

---

## 5) Report back in this exact template
Paste this filled out:

### AWS login type
- SSO/Identity Center OR IAM User:

### Account + region
- Account ID:
- Console identity/role name shown:
- Console region selected:
- CloudShell available (Y/N):

### If SSO (only if applicable)
- SSO Start URL:
- SSO Region:
- Permission set / role name:
- Any permission errors noticed:

### If IAM User (only if applicable)
- IAM username:
- MFA device ARN (serial):
- Access keys exist? (Y/N), active?:
- Can create access key? (Y/N):

### Existing resources (conflicts)
- ECR repos present:
- ECS clusters/services present:
- VPCs present that could conflict:

---

## Why we need this
Once we know **SSO vs IAM User**, we can give exact next commands for the user’s machine:
- installing AWS CLI / Terraform
- authenticating (SSO login vs access keys vs session token with MFA)
- running Terraform successfully
- wiring GitHub Actions OIDC role output into the repo secret `AWS_ROLE_ARN`
