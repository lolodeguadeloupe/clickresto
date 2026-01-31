# Feature Landscape

**Domain:** Affiliate-focused SaaS Platform for Restaurant Solution
**Researched:** 2026-01-31
**Confidence:** MEDIUM (verified through multiple web sources, cross-referenced with industry standards)

---

## Table Stakes

Features users expect. Missing = product feels incomplete.

### Landing Page & Demo Request

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Clear value proposition above fold | Industry standard for B2B SaaS | Low | Users decide in 3-5 seconds whether to stay |
| Demo request form (3-6 fields max) | Standard conversion path for B2B | Low | Name, email, company minimum. Reducing from 10 to 6 fields = 15.65% conversion lift |
| Trust indicators (logos, testimonials) | Reduces friction, builds credibility | Low | Essential for unknown brands |
| Mobile-responsive design | 40%+ traffic from mobile devices | Medium | Must work on all screen sizes |
| Thank you page with next steps | Sets expectations post-submission | Low | Can collect additional qualification data here |

### Affiliate Dashboard

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Real-time earnings visibility | Core transparency requirement - 25% higher retention when present | Medium | Shows approved, pending, rejected commissions |
| Referral link generation | Fundamental affiliate function | Low | Must be effortless to find/create |
| Click & conversion tracking | Basic performance metrics affiliates need | Medium | Real-time or near-real-time updates |
| Commission breakdown | Transparency builds trust | Low | Total earnings, lifetime earnings, payment status |
| Simple performance metrics | Affiliates need to optimize campaigns | Medium | Clicks, conversions, earnings per click (EPC) minimum |

### Lead CRM

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Visual pipeline/kanban view | Standard in 2026 - reduces cognitive load | Medium | Better than table view for understanding flow |
| Lead capture from demo form | Automatic entry from landing page | Low | Zero manual data entry |
| Lead status management | Track progression through sales funnel | Low | New > Contacted > Demo Scheduled > Closed Won/Lost |
| Activity timeline | See all interactions in one place | Medium | Emails, calls, notes chronologically |
| Basic lead assignment | Route demos to right person | Low | Manual assignment acceptable for v1 |
| Search & filtering | Find leads quickly | Low | By name, company, status, source |
| Notes/comments | Document conversations and context | Low | Essential for handoffs and follow-ups |

### Admin Back-Office

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| User management | Create/edit/disable affiliate accounts | Low | Basic CRUD operations |
| Lead overview dashboard | See all demo requests at a glance | Medium | Table view with filters sufficient |
| Affiliate overview dashboard | Monitor affiliate performance | Medium | Key metrics: active affiliates, conversions, pending payments |
| Commission approval workflow | Verify conversions before payout | Medium | Approve/reject with reason |
| Payment tracking | Record which affiliates have been paid | Low | Manual tracking acceptable for v1 |
| Settings management | Configure commission rates, terms | Low | Simple form-based configuration |
| Role-based access control | Admin vs. regular user permissions | Medium | Critical for security |

---

## Differentiators

Features that set product apart. Not expected, but valued.

### Affiliate Experience

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| One-click signup for affiliates | Reduces friction dramatically | Low | Pre-fill from email, minimal fields |
| Affiliate onboarding checklist | Increases active participation by 30-40% | Low | Step-by-step guide with progress bar |
| Marketing materials library | Empowers affiliates to promote effectively | Medium | Pre-made banners, email templates, scripts |
| Performance milestones/badges | Gamification increases engagement | Medium | Visual recognition for goals achieved |
| Custom referral codes | Memorable alternatives to random links | Low | "yourname" instead of "?ref=abc123xyz" |
| Email notifications for conversions | Immediate gratification increases motivation | Low | Real-time alerts when referral converts |

### Lead Management

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Lead source tracking | Know which affiliates drive quality leads | Low | Auto-tag from referral parameter |
| Lead scoring (basic) | Prioritize high-intent prospects | Medium | Company size + demo request = high score |
| Automated lead enrichment | Save time on research | High | Auto-populate company info from domain |
| Demo scheduling integration | Reduce back-and-forth emails | Medium | Calendly/Cal.com embed on thank you page |
| Email templates for follow-up | Faster, consistent communication | Low | 3-5 templates for common scenarios |
| Lead response time tracking | Measure speed to contact | Low | Timestamp first contact vs. submission |

### Admin Intelligence

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Affiliate leaderboard | Identify top performers | Low | Sortable table by conversions/revenue |
| Conversion funnel analytics | Understand where leads drop off | Medium | Landing page > Form > Demo > Closed |
| Commission payout reports | Export for accounting | Low | CSV/PDF download with date range |
| Fraud detection alerts | Prevent gaming the system | High | Flag suspicious patterns (self-referrals, rapid clicks) |
| Bulk commission approval | Process multiple payouts efficiently | Low | Checkbox + approve all |
| Affiliate tiering system | Reward top performers with higher rates | Medium | Bronze/Silver/Gold with auto-promotion |

### Payment & Trust

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Multiple payment methods | Accommodate global affiliates | Medium | PayPal, bank transfer minimum |
| Payment history for affiliates | Transparency builds confidence | Low | List of all payments received |
| Automated payment reminders | Reduces admin support requests | Low | Email on 1st of month for pending payouts |
| Public affiliate terms of service | Clarity prevents disputes | Low | Simple page explaining rules and rates |

---

## Anti-Features

Features to explicitly NOT build. Common mistakes in this domain.

### Over-Engineering for v1

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Multi-tier affiliate structures | Adds massive complexity without proven demand | Use flat commission structure first. Add tiers only when data shows need |
| Advanced fraud detection AI | Premature optimization - need data first | Manual review of suspicious activity. Flag obvious patterns (same IP, self-referrals) |
| Sophisticated lead scoring (20+ criteria) | Reduces usability, sales teams revert to gut instinct | Start with 5-7 core criteria: job title, company size, demo request (high-intent behavior) |
| Custom reporting builder | Development-heavy, low early value | Provide 5-10 fixed reports that cover 80% of needs. Export to CSV for custom analysis |
| Real-time chat/support widget | Support overhead before product-market fit | Use email support initially. Add chat when volume justifies it |
| Multi-language support | Complexity without validated need | English only for v1. Add languages when international demand proven |
| White-label/rebrand capabilities | Massive scope creep for unvalidated feature | Fixed branding. Consider only if multiple enterprise clients request it |

### Complexity Without Value

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Integration with 20+ payment providers | Each integration = ongoing maintenance burden | Start with PayPal + bank transfer. Add based on affiliate requests |
| Automated commission payouts | Requires compliance, fraud prevention, reserves | Manual payout approval maintains control and prevents fraud in early stages |
| Social media auto-posting for affiliates | Low ROI, platform API changes break features | Provide copy-paste templates affiliates can manually post |
| Advanced affiliate segmentation | Useful only at scale (1000+ affiliates) | Simple filters (active/inactive, tier) sufficient until proven otherwise |
| Custom affiliate dashboard layouts | Development time >> value for small user base | One well-designed layout for everyone |
| Blockchain/crypto payments | Niche demand, regulatory complexity | Traditional payment methods serve 95% of affiliates |

### Feature Bloat Red Flags

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Built-in email marketing platform | Competitors (Mailchimp, etc.) do this better | Export affiliate lists, use existing tools |
| Inventory/product management | Out of scope for affiliate platform | Affiliates promote one solution (restaurant platform), not a product catalog |
| Customer support ticketing system | Use existing tools, don't reinvent | Simple contact form. Graduate to Intercom/Zendesk if needed |
| Affiliate recruitment tools | Solve distribution before acquisition | Focus on managing existing affiliates well. Manual outreach for recruitment |
| Predictive analytics/forecasting | Requires robust historical data | Basic cohort analysis and A/B testing first. Add forecasting later when data quality supports it |

### UX Anti-Patterns

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| One-size-fits-all dashboard for all roles | Admins see different data than affiliates | Separate dashboards: Affiliate view vs. Admin view |
| Dashboards that show everything | Too many metrics = cognitive overload, reduced confidence | Prioritize 5-7 key metrics per role. Hide advanced stats in secondary views |
| Hidden pricing on landing page | Repulsive for prospects, signals lack of confidence | Show commission structure clearly (fixed amount per restaurant signup) |
| Forcing complex onboarding flows | Reduces activation, increases abandonment | Progressive disclosure: get affiliate live with basic setup, offer advanced options later |

---

## Feature Dependencies

Understanding what must be built in order:

```
Landing Page & Demo Form (foundational)
    |
    +-- Lead Capture in CRM (depends on form submission)
        |
        +-- Lead Source Tracking (requires referral parameter from affiliate links)
        |
        +-- Lead Assignment (requires CRM to exist)

Affiliate Signup
    |
    +-- Referral Link Generation (depends on affiliate account)
        |
        +-- Click Tracking (requires links to exist)
            |
            +-- Conversion Tracking (requires clicks to exist)
                |
                +-- Commission Calculation (requires conversions to be tracked)
                    |
                    +-- Commission Approval (requires calculations)
                        |
                        +-- Payment Tracking (requires approvals)

Admin Panel (can be built in parallel with above)
    |
    +-- User Management
    +-- Role-Based Access Control (affects all admin features)
    +-- Settings (commission rates needed before commissions can be calculated)
```

**Critical Path:** Landing Page > Lead CRM > Affiliate Links > Tracking > Commissions > Payments

**Parallel Track:** Admin panel can be built alongside core features, but needs RBAC early.

---

## MVP Recommendation

For MVP, prioritize:

### Phase 1: Prove the Funnel Works
1. **Landing page with demo request form** (validate demand)
2. **Basic CRM for lead management** (prove you can handle inbound)
3. **Admin panel for viewing leads** (manual processing to start)

### Phase 2: Add Affiliate Layer
4. **Affiliate signup & referral link generation** (enable distribution)
5. **Click & conversion tracking** (measure affiliate effectiveness)
6. **Affiliate dashboard with basic metrics** (show value to affiliates)

### Phase 3: Operationalize Payments
7. **Commission calculation & approval workflow** (verify before paying)
8. **Payment tracking** (record payouts)
9. **Affiliate payment history** (transparency)

### Defer to Post-MVP

**Features to defer:**
- **Lead scoring:** Manual qualification works fine initially. Add scoring when you have 100+ leads/month and patterns emerge.
- **Automated lead enrichment:** Nice-to-have. Manual research acceptable until volume demands automation.
- **Performance badges/gamification:** Only valuable with 20+ active affiliates. Early affiliates are motivated differently.
- **Fraud detection:** Manual review sufficient initially. Build automated detection only after seeing actual fraud patterns.
- **Multi-payment methods:** Start with one (PayPal or bank transfer). Add others based on affiliate requests.
- **Bulk operations:** Not needed until managing 50+ affiliates or 100+ leads/month.
- **Advanced reporting:** Fixed reports + CSV export covers 80% of needs early on.

**Rationale for deferral:**
- These features solve problems that emerge at scale, not day one
- Early effort better spent on core user flow and validation
- Can be built with better context once real usage patterns emerge
- AI coding tools make these features feel "easy to add" but they create maintenance burden

---

## Complexity Assessment

### Low Complexity (1-3 days each)
- Demo request form
- Affiliate signup form
- Referral link generation
- Basic dashboards (table views)
- Notes/comments
- User management CRUD
- Settings pages
- Email notifications

### Medium Complexity (3-7 days each)
- Lead pipeline/kanban view
- Click tracking infrastructure
- Conversion tracking
- Commission calculation logic
- Role-based access control
- Lead source attribution
- Performance metrics aggregation
- Payment tracking

### High Complexity (7-14 days each)
- Real-time analytics dashboard
- Automated lead enrichment
- Fraud detection system
- Multi-payment provider integration
- Advanced reporting/analytics
- Affiliate tiering with auto-promotion

---

## Feature Validation Checklist

Before building any feature, ask:

- [ ] Is this **table stakes** in this domain? (If no, can defer)
- [ ] Does this **solve a problem we've observed** or just "seems useful"? (Avoid hypothetical features)
- [ ] Can we **validate this with a manual process first**? (Prove value before automating)
- [ ] Will this work at **10 users, 100 users, or only at 1000+ users**? (Build for current scale)
- [ ] Does this **reduce friction** or add complexity? (Every feature has a cognitive cost)
- [ ] Can we **build 20% of this feature** to get 80% of the value? (Start minimal)

---

## Sources

### Affiliate Dashboard & Program Management
- [Affiliate Dashboard Examples for 2026](https://www.referralcandy.com/blog/affiliate-dashboard-examples)
- [5 Trending Features Your Affiliate Platform Needs in 2026](https://partnerize.com/resources/blog/5-trending-features-your-affiliate-platform-needs)
- [Best Referral Software in 2026](https://www.openloyalty.io/insider/best-referral-software)
- [Affiliate Program Management 2026](https://trackier.com/affiliate-program-management/)
- [How to Build a Great Affiliate Marketing Dashboard](https://databox.com/affiliate-marketing-dashboard)

### Commission & Payment Management
- [SaaS Affiliate Commission Rates](https://www.postaffiliatepro.com/blog/saas-affiliate-commission-rates/)
- [Affiliate Commission Guide for 2026](https://www.rewardful.com/articles/affiliate-commission-explained)
- [Best Ways to Make Commission Payments to Affiliates](https://tipalti.com/resources/learn/commission-payments/)
- [Top 5 Influencer Payout Platforms for 2026](https://www.lumanu.com/blog/top-5-payment-api-solutions-for-influencer-affiliate-platforms-the-complete-2026-guide)

### Lead Management & CRM
- [2026 Lead Management Playbook for B2B Sales](https://www.highspot.com/blog/lead-management/)
- [7 Best B2B CRM Software + Feature Comparison](https://blog.salesflare.com/best-b2b-crm)
- [CRM Lead Management Tools to Try in 2026](https://leadsbridge.com/blog/crm-lead-management/)
- [Top 10 CRM Future Trends for 2026](https://www.hyegro.com/blog/crm-future-trends)

### Demo Request Forms
- [11 Examples of Best SaaS Demo Pages](https://www.poweredbysearch.com/learn/best-saas-demo-pages/)
- [36 Best Demo Request Pages - B2B Examples](https://saaswebsites.com/page-design-tags/best-demo-request-pages-saas-inspiration/)
- [B2B SaaS: Making Book a Demo Form](https://metaforms.ai/blog/b2b-saas-demo-form)
- [Web Form Optimization Best Practices for B2B SaaS](https://tillerdigital.com/blog/web-form-optimization-best-practices-for-b2b-saas/)

### Admin Panels & SaaS Best Practices
- [Admin Dashboard Ultimate Guide 2026](https://www.weweb.io/blog/admin-dashboard-ultimate-guide-templates-examples)
- [B2B SaaS UX Design in 2026: Challenges & Patterns](https://www.onething.design/post/b2b-saas-ux-design)
- [10 Most Common Mistakes in SaaS You Can Avoid](https://userguiding.com/blog/saas-mistakes)

### MVP & Anti-Patterns
- [MVP Development Guide 2026](https://www.softermii.com/blog/for-startups/mvp-development-guide-process-costs-and-real-examples)
- [How to Build an MVP Efficiently by Prioritizing the Right Features](https://roboticsandautomationnews.com/2026/01/20/how-to-build-an-mvp-efficiently-by-prioritizing-the-right-features/98214/)
