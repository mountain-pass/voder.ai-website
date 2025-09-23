# Implementation Plan

Following Gall's Law: "A complex system that works is invariably found to have evolved from a simple system that worked."

## NOW

**Fix email capture by implementing the simplest possible working solution**

1. **Create Netlify account and connect repository**
   - Sign up at netlify.com
   - Connect GitHub repository (mountain-pass/voder.ai-website)
   - Configure basic build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
     - Base directory: (leave empty)

2. **Deploy to Netlify temporary URL first**
   - Let Netlify auto-deploy to get a working `xyz.netlify.app` URL
   - Test that the site loads and functions correctly
   - Verify build process works without errors

3. **Enable email capture with minimal changes**
   - Add `data-netlify="true"` attribute to the form element in `src/app.ts`
   - Remove `event.preventDefault()` from form submission handler
   - Remove the "Simulate form submission" comment
   - Keep existing client-side validation and analytics tracking
   - Test email submission on the temporary Netlify URL

4. **Verify email capture works**
   - Submit test emails through the form
   - Confirm emails appear in Netlify dashboard
   - Test CSV export functionality

## NEXT

**Migrate deployment pipeline and domain (after email capture is proven working)**

1. **Update GitHub Actions for Netlify deployment**
   - Install Netlify CLI: Add `netlify-cli` to package.json devDependencies
   - Update `.github/workflows/deploy.yml`:
     - Replace Vercel CLI commands with Netlify CLI
     - Change `npx vercel --prod --yes --token ${{ secrets.VERCEL_TOKEN }}` to `npx netlify deploy --prod --dir=dist --auth=${{ secrets.NETLIFY_AUTH_TOKEN }}`
     - Update verification commands
   - Add `NETLIFY_AUTH_TOKEN` to GitHub secrets

2. **Test deployment pipeline**
   - Push changes and verify GitHub Actions deploys to Netlify successfully
   - Confirm all quality gates still work
   - Verify deployment URL capture and verification works

3. **Set up custom domain on Netlify**
   - Add `voder.ai` as custom domain in Netlify dashboard
   - Get Netlify nameservers from dashboard
   - **DO NOT change nameservers yet** - let Netlify provision SSL certificate

4. **Prepare for DNS cutover**
   - Verify HTTPS certificate is ready on Netlify
   - Test site accessibility at both old and new platforms
   - Coordinate nameserver change timing

**USER ACTION REQUIRED**: Change nameservers at domain registrar from current provider to Netlify nameservers (will be provided after Netlify setup)

## LATER

**Optimize and enhance (after migration is complete and stable)**

1. **Remove Vercel configuration**
   - Delete `vercel.json` file
   - Remove any Vercel-specific environment variables
   - Clean up any remaining Vercel references in documentation

2. **Optimize Netlify configuration**
   - Create `netlify.toml` for advanced configuration if needed
   - Set up redirect rules for SEO
   - Configure security headers
   - Optimize build performance settings

3. **Enhance email capture functionality**
   - Set up email notifications for new submissions
   - Configure webhook integration for automation
   - Implement email validation and spam protection
   - Create email campaign workflows

4. **Performance and monitoring improvements**
   - Set up Netlify Analytics (if needed beyond Microsoft Clarity)
   - Implement performance monitoring
   - Optimize build and deployment speed
   - Add deployment notifications and alerts