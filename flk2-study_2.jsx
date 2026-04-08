import { useState, useEffect, useRef } from "react";

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,500;1,8..60,300;1,8..60,400&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html,body{background:#f5f5f7;}
  ::-webkit-scrollbar{width:5px;}
  ::-webkit-scrollbar-track{background:transparent;}
  ::-webkit-scrollbar-thumb{background:#d0d0d5;border-radius:3px;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
  @keyframes spin{to{transform:rotate(360deg);}}
  .fu{animation:fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both;}
  .s1{animation-delay:0.04s;}.s2{animation-delay:0.1s;}.s3{animation-delay:0.16s;}
  .s4{animation-delay:0.22s;}.s5{animation-delay:0.28s;}.s6{animation-delay:0.34s;}
  button:focus{outline:none;} select:focus{outline:none;}
`;

// ─── FLK2 SUBJECTS ────────────────────────────────────────────────────────────
const FLK2_SUBJECTS = [
  { id:"trusts",   title:"Equity & Trusts",         desc:"Express trusts, resulting and constructive trusts, charitable trusts, breach and remedies.", icon:"⚖️", color:"#0071e3", topics:6, live:true  },
  { id:"criminal", title:"Criminal Law & Practice", desc:"Mens rea, actus reus, offences against the person, property offences, defences.",            icon:"🔒", color:"#ff3b30", topics:8, live:false },
  { id:"property", title:"Property Law & Practice", desc:"Freehold, leasehold, co-ownership, registration, adverse possession.",                        icon:"🏠", color:"#34c759", topics:7, live:false },
  { id:"business", title:"Business Law & Practice", desc:"Company law, partnership, insolvency, employment, commercial contracts.",                      icon:"💼", color:"#ff9500", topics:8, live:false },
  { id:"dispute",  title:"Dispute Resolution",      desc:"Civil litigation, pre-action protocols, costs, enforcement, appeals.",                         icon:"📋", color:"#5856d6", topics:5, live:false },
  { id:"wills",    title:"Wills & Probate",          desc:"Intestacy, validity of wills, administration of estates, inheritance tax.",                    icon:"📜", color:"#af52de", topics:5, live:false },
];

// ─── APPLICATION FRAMEWORKS ───────────────────────────────────────────────────
const FRAMEWORKS = {
  certainties:{
    title:"How to Apply: The Three Certainties",
    intro:"Every time you see facts suggesting someone is trying to create a trust, run this checklist in sequence. If any certainty fails, stop, state the consequence, and do not proceed as if a trust exists.",
    steps:[
      {
        n:"1", label:"Identify the alleged trust",
        instruction:"Before applying any test, identify: Who is the alleged settlor? What property is involved? Who is the alleged trustee? Who are the alleged beneficiaries? Write these down mentally before proceeding.",
        tip:"In an exam scenario, the word 'trust' will rarely appear — look for someone transferring property with words expressing what should happen to it.",
      },
      {
        n:"2", label:"Certainty of Intention — is there an obligation?",
        instruction:`Ask: do the words (or conduct) impose a legally binding obligation, or merely express a hope?\n\n→ If the words are imperative ("shall hold on trust for", "must apply for", "is to be used for") → intention present. Move to step 3.\n→ If the words are precatory ("I wish", "I hope", "I desire", "in full confidence", "I request") → prima facie no intention. Check the surrounding context (Comiskey v Bowring-Hanbury). If still precatory → NO TRUST. Transferee takes the property absolutely.`,
        tip:"Read the exact words used. Courts construe the language objectively. One precatory word does not automatically doom the trust if the rest of the document is clearly obligatory — but it is a warning flag.",
        caseRef:"Re Adams and Kensington Vestry (1884) — 'full confidence' = precatory, no trust. Comiskey (1905) — same words but surrounding context imposed obligation = trust.",
      },
      {
        n:"3", label:"Certainty of Subject Matter — is the property identifiable?",
        instruction:`Two sub-questions:\n\n(a) Is the trust PROPERTY identifiable?\n→ Physical goods (wine, gold, furniture): have they been physically segregated or earmarked? If no → subject matter uncertain → NO TRUST (Re London Wine Co).\n→ Identical intangible assets (shares): fungible, so segregation not required (Hunter v Moss). Ask: are they truly identical?\n\n(b) Is the BENEFICIAL INTEREST defined with precision?\n→ "The bulk", "a reasonable part", "most of" → uncertain → NO TRUST (Sprange v Barnard).\n→ A defined fraction ("half", "one third") or specific sum ("£10,000") → certain.`,
        tip:"The most commonly tested failure here is a gift of an unallocated portion of a physical bulk. Always ask whether the specific items can be pointed to.",
        caseRef:"Re London Wine Co (1986) — unallocated wine in communal warehouse: no trust. Hunter v Moss (1994) — 50 out of 950 identical shares: valid.",
      },
      {
        n:"4", label:"Certainty of Objects — who are the beneficiaries?",
        instruction:`First ask: is this a FIXED trust or a DISCRETIONARY trust?\n\nFIXED TRUST (each beneficiary gets a defined share):\n→ Apply the complete list test: can every single beneficiary be identified?\n→ If one person cannot be found → TRUST FAILS (IRC v Broadway Cottages).\n\nDISCRETIONARY TRUST (trustees choose among a class):\n→ Apply the 'is or is not' test: can it be said of any given person whether they are or are not within the class?\n→ Conceptual certainty required — is the class defined by a clear criterion?\n→ Evidential uncertainty (hard to prove facts about specific people) does NOT defeat the trust (Re Baden No 2).\n→ If the class is conceptually meaningless (e.g. "anyone I liked") → TRUST FAILS.`,
        tip:"The most common exam error is applying the complete list test to a discretionary trust. Always identify the type first.",
        caseRef:"McPhail v Doulton (1971) — 'is or is not' test for discretionary trusts. Re Baden (No 2) (1973) — conceptual certainty sufficient.",
      },
      {
        n:"5", label:"State the consequence",
        instruction:`Once you have identified which certainty (if any) fails:\n\n→ Intention fails → no trust created; transferee takes the property absolutely and beneficially.\n→ Subject matter fails → purported trust is void; property remains with transferor or trustee absolutely.\n→ Objects fails → trust property is held on resulting trust for the settlor (or their estate).\n→ All three satisfied → valid express trust; proceed to consider formalities and constitution.`,
        tip:"Never skip stating the consequence. The examiner awards marks for the result, not just the analysis.",
        caseRef:"Re Vandervell's Trusts (No 2) (1974) — failed objects → resulting trust for settlor's estate.",
      },
    ],
    workedExample:{
      facts:`Harriet writes to her sister Bea: "I am transferring £50,000 to you and I hope very much that you will see to it that my children are looked after in the way I would have wished." Harriet transfers £50,000 to Bea. Harriet dies. Bea claims the money absolutely. Harriet's children claim it is held on trust for them.`,
      walkthrough:[
        {step:"Step 1 — Identify", text:"Alleged settlor: Harriet. Property: £50,000. Alleged trustee: Bea. Alleged beneficiaries: Harriet's children."},
        {step:"Step 2 — Intention", text:"The critical words are 'I hope very much that you will see to it'. 'I hope' is a classic precatory expression. Applying Re Adams, this expresses a moral aspiration, not a legal obligation. No certainty of intention."},
        {step:"Consequence", text:"Because certainty of intention is absent, no trust is created. Bea takes the £50,000 absolutely and beneficially. Harriet's children have no enforceable claim. (Note: if the words had been 'you shall hold £50,000 on trust for my children', certainty of intention would be present and steps 3–4 would follow.)"},
      ],
    },
  },
  formalities:{
    title:"How to Apply: Formalities — s.53 LPA 1925",
    intro:"Formalities questions ask whether a trust transaction is valid given the writing requirements of s.53 LPA 1925. The key discipline is identifying which sub-section applies before testing compliance.",
    steps:[
      {
        n:"1", label:"Identify the type of transaction",
        instruction:`Ask: what kind of transaction is this?\n\n→ Is someone DECLARING a trust over land? → s.53(1)(b) applies.\n→ Is someone DISPOSING OF a subsisting equitable interest (e.g. directing trustees to hold for new beneficiaries, assigning their equitable interest to someone else)? → s.53(1)(c) applies.\n→ Is a resulting or constructive trust arising by operation of law? → s.53(2) applies — no writing required.`,
        tip:"The most common error is applying s.53(1)(c) to a situation that is really a declaration of a new trust (which engages (b), not (c)). The difference is whether a subsisting equitable interest already exists and is being moved.",
      },
      {
        n:"2a", label:"If s.53(1)(b): Is there written evidence?",
        instruction:`For a trust of land to be enforceable:\n→ There must be written evidence of the declaration, signed by the person able to declare the trust.\n→ NOTE: the declaration itself can be oral. The statute only requires EVIDENCE in writing — not that the trust was created in writing.\n→ If no written evidence → the trust exists but is unenforceable (not void).\n→ Exception: if the absence of writing is being used to perpetrate a fraud → constructive trust imposed to prevent reliance on the statute (Rochefoucauld v Boustead).`,
        tip:"'Manifested and proved' in s.53(1)(b) means the oral declaration can exist — but you need written evidence to enforce it in court.",
        caseRef:"Rochefoucauld v Boustead (1897) — constructive trust imposed to prevent fraudulent reliance on s.53(1)(b).",
      },
      {
        n:"2b", label:"If s.53(1)(c): Is the disposition in writing?",
        instruction:`For a disposition of a subsisting equitable interest:\n→ The disposition ITSELF must be in writing, signed by the disponor or their authorised agent.\n→ If oral → disposition is VOID (not merely unenforceable).\n→ Key question: is this actually a 'disposition'?\n   - Oral direction to trustees to hold on new trusts → YES, disposition (Grey v IRC).\n   - Transfer of both legal and equitable title together → NO, no separate disposition (Vandervell v IRC).\n   - Creation of a bare sub-trust where the head beneficiary retains control → possibly YES (Neville v Wilson).`,
        tip:"Grey v IRC vs Vandervell v IRC is the central contrast. In Grey, only the beneficial interest moved. In Vandervell, everything moved together. That is the whole distinction.",
        caseRef:"Grey v IRC (1960) — oral direction = disposition, must be written. Vandervell v IRC (1967) — full transfer = no separate disposition.",
      },
      {
        n:"3", label:"Consider s.53(2) — can a resulting or constructive trust save it?",
        instruction:`Even if s.53(1) has not been complied with:\n→ Ask whether a resulting or constructive trust can arise on the facts by operation of law.\n→ If yes → s.53(2) exempts it from the writing requirements entirely.\n→ This is particularly relevant where: a trust of land was declared orally and relied upon (constructive trust to prevent fraud); or a transaction fails for want of writing but unjust enrichment would result.`,
        tip:"Always consider s.53(2) as a potential safety net. It is an easy mark in an exam answer if the facts support a resulting or constructive trust.",
      },
    ],
    workedExample:{
      facts:`Tom holds 1,000 shares in Acme Ltd as bare trustee for Ursula. Ursula orally tells Tom: "Hold those shares for my nephew Victor from now on." No written document is produced. Is the direction effective?`,
      walkthrough:[
        {step:"Step 1 — Identify", text:"Ursula has a subsisting equitable interest in the shares. She is directing the trustee to hold that interest for a new beneficiary (Victor). This is a disposition of a subsisting equitable interest → s.53(1)(c)."},
        {step:"Step 2 — Is it in writing?", text:"The direction was oral. s.53(1)(c) requires the disposition to be in writing. It is not. The disposition is void (Grey v IRC directly on point)."},
        {step:"Step 3 — s.53(2)?", text:"Is there any basis for a resulting or constructive trust? On these facts, no. Victor has given nothing, there is no common intention, and no fraud is being perpetrated. s.53(2) does not assist."},
        {step:"Consequence", text:"The oral direction is void. Tom continues to hold the shares on bare trust for Ursula. Victor acquires no interest."},
      ],
    },
  },
  constitution:{
    title:"How to Apply: Constitution of Trusts",
    intro:"Constitution questions ask whether a trust has been properly constituted — that is, whether the trust property has been effectively vested in the trustees. If not, identify whether any exception applies.",
    steps:[
      {
        n:"1", label:"Identify the method of constitution attempted",
        instruction:`Ask: how was the trust being constituted?\n\n→ Transfer of legal title to trustees: has legal title actually vested? (Company shares: registered? Land: registered at HMLR? Chattels: delivered?)\n→ Self-declaration: has the settlor clearly declared themselves trustee of identifiable property? (Requires certainty of intention — see Three Certainties.)\n→ Statutory/court vesting: less common, but note it exists.`,
        tip:"Most exam problems involve an attempted transfer that did not complete. Identify exactly which step was missing.",
      },
      {
        n:"2", label:"Has the transfer been completed?",
        instruction:`If transfer to trustees was attempted:\n→ Has the settlor done EVERYTHING required of THEM to effect the transfer?\n→ If yes, and only third-party acts remain (company registration, HMLR registration) → trust IS constituted under Re Rose.\n→ If the settlor still had acts to perform (e.g. had not signed the transfer form) → trust NOT yet constituted.\n→ If the transfer failed and no declaration of trust was made → EQUITY WILL NOT ASSIST A VOLUNTEER (Milroy v Lord). The intended beneficiary cannot enforce the trust.`,
        tip:"Re Rose asks: what did the donor still need to do themselves? If the answer is nothing, the trust is constituted. If the donor still had steps to take, it is not.",
        caseRef:"Re Rose (1952) — share transfer form signed and delivered: constituted even before company registered the transfer.",
      },
      {
        n:"3", label:"Does any exception apply?",
        instruction:`If the trust is not constituted, check three exceptions:\n\n→ RE ROSE / PENNINGTON: Has the donor done everything in their own power? → constituted.\n→ STRONG V BIRD: (a) Continuing intention to give/release at time of death? (b) Donee appointed executor/administrator? If both → gift perfected.\n→ DONATIO MORTIS CAUSA: (a) Gift made in contemplation of death? (b) Conditional on death? (c) Delivery of the subject matter or means of dominion? If all three → valid DMC even without deed.`,
        tip:"Run through all three exceptions systematically. Strong v Bird catches debt releases and gifts equally.",
        caseRef:"Strong v Bird (1874). Sen v Headley (1991) — land capable of DMC.",
      },
      {
        n:"4", label:"State the consequence",
        instruction:`→ Constituted → beneficiary can enforce.\n→ Not constituted, no exception → equity will not assist a volunteer; intended beneficiary has no claim.\n→ Imperfect gift perfected by exception → gift takes effect as if properly completed.\n→ Note: if the trust IS constituted, proceed to consider whether certainties and formalities are satisfied.`,
        tip:"Do not forget to state whether the beneficiary can enforce. This is the point of the whole analysis.",
      },
    ],
    workedExample:{
      facts:`Gwen owns 500 shares in a private company. She signs a stock transfer form in favour of her nephew Harry and hands it to him at a family dinner, saying "these are yours." Harry never sends the form to the company for registration. Gwen dies two weeks later. Gwen's executor claims the shares form part of her estate.`,
      walkthrough:[
        {step:"Step 1 — Method", text:"Gwen attempted to transfer legal title to Harry directly (not to trustees). Harry would hold as outright owner, not trustee."},
        {step:"Step 2 — Completed?", text:"Gwen signed and delivered the transfer form. She had done everything in her own power. The only remaining step — registration by the company — required action by the company registrar, not by Gwen."},
        {step:"Re Rose", text:"Applying Re Rose (1952): Gwen had done everything required of her. The beneficial interest passed to Harry at the moment of delivery of the transfer form. The trust (or gift) was constituted at that point."},
        {step:"Consequence", text:"The shares do not form part of Gwen's estate. Harry is entitled to be registered as the holder and can compel the executor to procure registration. The executor's claim fails."},
      ],
    },
  },
  resulting:{
    title:"How to Apply: Resulting Trusts",
    intro:"Resulting trust questions typically involve either a failed express trust or a voluntary transfer/contribution to purchase price. Identify the category first, then apply the correct analysis.",
    steps:[
      {
        n:"1", label:"Identify the category",
        instruction:`Ask: why might a resulting trust arise?\n\n→ Category A — AUTOMATIC: An express trust has been declared but has failed wholly or in part; or money was transferred for a specific purpose that has failed (Quistclose).\n→ Category B — PRESUMED: A voluntary transfer of property into another's name, or a contribution to the purchase price of property placed in another's name, without evidence of donative intent.\n→ If neither — no resulting trust.`,
        tip:"The category determines your analysis. Automatic resulting trusts arise by operation of law regardless of intention. Presumed resulting trusts arise from a default rule that can be rebutted.",
      },
      {
        n:"2a", label:"If Automatic — did the express trust fail?",
        instruction:`→ Identify which certainty failed, or which event caused the trust to fail.\n→ Ask: is there any part of the beneficial interest that has not been effectively disposed of?\n→ If yes → that undisposed-of interest results back to the settlor (or their estate) automatically.\n\nQUISTCLOSE VARIANT:\n→ Was money transferred for a specific identified purpose?\n→ Was it kept in a separate account or otherwise clearly designated?\n→ Has the purpose failed or become impossible?\n→ If all yes → money held on resulting trust for the transferor; does not form part of the transferee's general estate.`,
        tip:"In Quistclose problems, the key is identifying the specific purpose and confirming it has failed. If the money is mixed into a general account without any specific purpose, Quistclose does not apply.",
        caseRef:"Barclays Bank v Quistclose (1970) — loan for specific purpose; purpose failed; resulting trust for lender.",
      },
      {
        n:"2b", label:"If Presumed — is the presumption established?",
        instruction:`→ Has A paid for property placed in B's name, or voluntarily transferred property to B, with no explanation?\n→ If yes → presumption of resulting trust arises in A's favour.\n\nNow ask: is the presumption REBUTTED?\n→ Evidence of actual donative intent (A intended a gift) → no resulting trust.\n→ Presumption of advancement: was this a father-to-child or husband-to-wife transfer? → presume gift; resulting trust rebutted unless contrary evidence.\n→ Stack v Dowden context (domestic co-habitation, joint names): go to common intention constructive trust analysis instead — resulting trust approach inappropriate.`,
        tip:"In domestic property disputes (couple buying a home together), Stack v Dowden has displaced the resulting trust analysis. Do not apply the presumed resulting trust to joint-names home ownership cases.",
        caseRef:"Stack v Dowden (2007) — resulting trust approach inappropriate in domestic context.",
      },
      {
        n:"3", label:"State who holds on resulting trust and for whom",
        instruction:`→ Automatic: trustee or recipient holds on resulting trust for the settlor or their estate.\n→ Presumed: the legal owner holds on resulting trust for the person who paid.\n→ Quistclose: the borrower holds on resulting trust for the lender.\n→ Always state: who is the resulting trustee? What property is held? For whose benefit?`,
        tip:"A resulting trust is a proprietary remedy. In an insolvency, a resulting trust beneficiary ranks ahead of general creditors — this makes it commercially critical.",
      },
    ],
    workedExample:{
      facts:`Petra lends £80,000 to her company, Nova Ltd, specifically to pay a rent arrears liability that has become due. The money is paid into a designated client account at Nova's bank. Before the rent is paid, Nova goes into administration. The administrator claims the £80,000 forms part of the general assets available to creditors.`,
      walkthrough:[
        {step:"Step 1 — Category", text:"This is a potential Quistclose (automatic resulting) trust: money transferred for a specific identified purpose."},
        {step:"Step 2 — Elements", text:"(1) Was there a specific purpose? Yes — payment of the rent arrears. (2) Was the money kept separate? Yes — designated client account. (3) Has the purpose failed? Yes — administration commenced before payment."},
        {step:"Apply Quistclose", text:"Applying Barclays Bank v Quistclose (1970): the £80,000 was held on primary trust to pay the rent; on failure of that purpose, it is held on resulting trust for Petra. It never formed part of Nova's general assets."},
        {step:"Consequence", text:"The administrator cannot treat the £80,000 as available to general creditors. Petra is entitled to recover it in full ahead of all unsecured claims."},
      ],
    },
  },
  constructive:{
    title:"How to Apply: Constructive Trusts",
    intro:"Constructive trust questions in the SQE fall into two broad categories: domestic property disputes (common intention) and fiduciary/third-party liability (institutional). Identify the category immediately — the analysis is entirely different.",
    steps:[
      {
        n:"1", label:"Identify the category",
        instruction:`→ DOMESTIC PROPERTY (family home, cohabiting couple): Apply common intention constructive trust (CICT) analysis.\n→ FIDUCIARY PROFIT / BREACH OF DUTY: Apply institutional constructive trust analysis (Keech v Sandford; Boardman v Phipps).\n→ THIRD PARTY INVOLVEMENT: Dishonest assistance (Royal Brunei) or knowing receipt.\n\nNever mix these categories — they have different tests and different consequences.`,
        tip:"The first question in any constructive trust problem is always: which category of constructive trust is at issue? State this explicitly.",
      },
      {
        n:"2a", label:"CICT — is title in joint names or sole name?",
        instruction:`JOINT NAMES:\n→ Starting point: equal beneficial shares (Stack v Dowden).\n→ Can this be displaced? Look at the whole course of dealing: financial contributions, mortgage payments, maintenance, domestic arrangements, whether finances were kept separate.\n→ If displaced → what is the fair quantification? (Jones v Kernott — court may impute if cannot infer.)\n\nSOLE NAME:\n→ Claimant must first ESTABLISH entitlement. Two routes:\n   (a) Express common intention: an actual agreement that claimant would have a share, plus any detrimental reliance.\n   (b) Inferred common intention: direct financial contributions to purchase price or mortgage repayments (Lloyds Bank v Rosset).\n→ Once established → QUANTIFY the share by reference to the whole course of dealing.`,
        tip:"In sole name cases, the hardest part is establishing the trust at all. In joint names cases, the presumption does the work — the issue is usually quantification.",
        caseRef:"Stack v Dowden (2007). Jones v Kernott (2011). Lloyds Bank v Rosset (1991).",
      },
      {
        n:"2b", label:"Institutional — fiduciary profit",
        instruction:`→ Was the defendant in a fiduciary position (trustee, solicitor to a trust, director, agent)?\n→ Did they make a profit using information, opportunity, or property connected to their fiduciary role?\n→ If yes → they hold that profit on constructive trust for the principal regardless of good faith (Keech v Sandford; Boardman v Phipps).\n→ EXCEPTION: fully informed consent of all principals authorises the profit — but the consent must be complete and knowing.\n→ A generous allowance for skill and effort may be awarded even where the trust is imposed (Boardman v Phipps).`,
        tip:"The rule is strict and prophylactic. It is not a penalty for wrongdoing — it is a structural rule that removes the conflict of interest entirely. Good faith is irrelevant.",
        caseRef:"Keech v Sandford (1726). Boardman v Phipps (1967).",
      },
      {
        n:"2c", label:"Dishonest assistance",
        instruction:`→ Was there a breach of fiduciary duty (e.g. trustee misapplied trust money)?\n→ Did the defendant ASSIST that breach?\n→ Was the defendant DISHONEST in so doing?\n   - Dishonesty is objective: would an honest person in the defendant's position have done what they did? (Royal Brunei Airlines v Tan).\n   - The defendant's own belief that they were acting honestly is not conclusive.\n→ If all three → defendant is personally liable as a constructive trustee for the loss caused.`,
        tip:"Note that dishonest assistance gives a PERSONAL remedy (compensation for loss), not a proprietary remedy over specific assets. Contrast with knowing receipt, where the asset itself is claimed.",
        caseRef:"Royal Brunei Airlines v Tan (1995) — objective dishonesty test.",
      },
      {
        n:"3", label:"State the consequence precisely",
        instruction:`→ CICT: claimant has a beneficial share of the property in the stated proportion. They may register this against the title or claim on sale proceeds.\n→ Fiduciary profit: defendant holds the specific profit on constructive trust — the principal can claim the asset or its traceable proceeds.\n→ Dishonest assistance: defendant is personally liable to compensate for the loss caused by the breach. Not a claim over a specific asset.`,
        tip:"The distinction between a proprietary remedy (claim over an asset) and a personal remedy (claim for compensation) matters enormously in insolvency. A proprietary claim ranks ahead of general creditors.",
      },
    ],
    workedExample:{
      facts:`Anya and Ben buy a house together in joint names for £400,000. Anya contributes £100,000 to the deposit; Ben contributes £60,000. They take out a joint mortgage for the remainder. Throughout their relationship, Anya pays all mortgage instalments from her own salary. Ben earns well but keeps separate finances and pays only household bills. They separate after 8 years. Ben claims an equal 50% share.`,
      walkthrough:[
        {step:"Step 1 — Category", text:"Domestic property, joint names → common intention constructive trust. Apply Stack v Dowden."},
        {step:"Step 2 — Starting point", text:"Joint names → strong presumption of equal beneficial shares (Stack v Dowden). Ben's claim is prima facie good."},
        {step:"Step 3 — Can presumption be displaced?", text:"Look at the whole course of dealing: Anya contributed significantly more to the deposit (£100k vs £60k). Anya paid all mortgage instalments. Ben maintained entirely separate finances throughout. These factors, taken together, indicate that the parties did not intend to share equally."},
        {step:"Quantification", text:"The court infers (or if necessary imputes) a fair quantification reflecting their actual contributions and arrangements. On these facts, Anya's share is likely to be substantially greater than 50% — perhaps 65–70%, though the court would assess all circumstances."},
        {step:"Consequence", text:"Ben's claim to a 50% share fails. The presumption of equality is displaced by the evidence of unequal contributions and separate finances. The property is divided in proportions reflecting the parties' true common intention."},
      ],
    },
  },
  breach:{
    title:"How to Apply: Breach of Trust & Remedies",
    intro:"Breach of trust questions require you to identify the breach, establish liability, consider available defences, and identify the appropriate remedy. Follow this sequence — examiners award marks at each stage.",
    steps:[
      {
        n:"1", label:"Identify the breach",
        instruction:`Ask: what has the trustee done (or failed to do) that is inconsistent with their obligations?\n\nCommon categories:\n→ Unauthorised investment (outside the terms of the trust or s.3 Trustee Act 2000).\n→ Misapplication of trust funds (paying the wrong beneficiary, releasing funds too early).\n→ Conflict of interest (self-dealing, purchasing trust property, making unauthorised profit).\n→ Delegation without authority (under ss.11–23 Trustee Act 2000).\n→ Failure to act (passive trustee allowing active breach — Bahin v Hughes).`,
        tip:"State the specific obligation breached before moving to liability. Do not jump to remedies without first identifying the wrong.",
      },
      {
        n:"2", label:"Establish personal liability — equitable compensation",
        instruction:`→ All trustees are jointly and severally liable for any loss caused by a breach (Bahin v Hughes — a passive trustee cannot hide behind inactivity).\n→ The measure is EQUITABLE COMPENSATION: restore the trust fund to the position it would have been in absent the breach.\n→ CAUSATION IS REQUIRED: the loss must have been caused by the breach (Target Holdings v Redferns; AIB Group v Mark Redler).\n→ Ask: would the loss have occurred even if the trustees had acted properly? If yes → compensation is limited to the additional loss the breach caused, not the entire fund.`,
        tip:"The Target Holdings / AIB v Redler causation requirement is the most important development in this area. Do not assume the full value of the fund is recoverable — assess what loss the breach actually caused.",
        caseRef:"Target Holdings v Redferns (1996). AIB Group v Mark Redler (2014).",
      },
      {
        n:"3", label:"Check the defences",
        instruction:`Work through all four:\n\n→ s.61 TRUSTEE ACT 1925: Did the trustee act (a) honestly AND (b) reasonably? Should they fairly be excused? Both honesty and reasonableness required. Courts rarely excuse professional trustees.\n→ CONSENT: Did the beneficiary give fully informed, free consent to the breach? (Re Pauling's Settlement — consent must be truly informed and voluntary.)\n→ LIMITATION: Has 6 years passed since the breach? (s.21(3) Limitation Act 1980). Exception: fraud or fraudulent breach — no limitation period (s.21(1)).\n→ EXEMPTION CLAUSE: Does the trust deed contain an exemption clause? Valid except for the trustee's own dishonesty (Armitage v Nurse).`,
        tip:"Always address all four defences. A defence that reduces or eliminates liability is worth as many marks as establishing the liability in the first place.",
        caseRef:"Armitage v Nurse (1998) — exemption valid except for dishonesty. Re Pauling's (1964) — consent must be fully informed.",
      },
      {
        n:"4", label:"Consider proprietary remedy — equitable tracing",
        instruction:`Where trust money has been misappropriated, a PROPRIETARY REMEDY may be available (and is especially valuable in insolvency).\n\nTwo stages:\n\nSTAGE A — TRACING (identifying the asset):\n→ Is there a prior fiduciary relationship? (Required for equitable tracing.)\n→ Has the money been mixed with the trustee's own funds?\n   - Apply Re Hallett: wrongdoer presumed to spend OWN money first → trust money remains in the account.\n   - Apply Re Oatway: if trustee first INVESTED from the mixed fund (profitably), beneficiary may claim the investment rather than the depleted balance.\n→ Has the money been invested and generated profits? → Foskett v McKeown: beneficiary takes a proportionate share of the investment proceeds.\n\nSTAGE B — REMEDY:\n→ Charge over the fund / proportionate share of an asset.\n→ Fails against a bona fide purchaser for value without notice of the trust.`,
        tip:"Draw out the bank account transactions in sequence. Identify what was paid in, what was drawn out, and whether any drawings were invested. Then apply Re Hallett and Re Oatway to each movement.",
        caseRef:"Re Hallett's Estate (1880). Re Oatway (1903). Foskett v McKeown (2001).",
      },
    ],
    workedExample:{
      facts:`Tom and Sally are trustees of the Williams Family Trust. In breach of the trust deed, Tom unilaterally withdraws £30,000 from the trust account and pays it into his personal bank account, which already contains £10,000 of his own money. He then uses £15,000 from the mixed account to buy shares in Apex Ltd, which double in value to £30,000. He then spends the remaining £25,000 on a holiday. Sally took no steps to prevent or remedy this despite knowing about it.`,
      walkthrough:[
        {step:"Step 1 — Breach", text:"Tom misapplied trust funds — an unauthorised withdrawal in breach of the trust deed and his fiduciary duty. Sally failed to act on knowledge of the breach (passive breach — Bahin v Hughes)."},
        {step:"Step 2 — Personal liability", text:"Both Tom and Sally are jointly and severally liable. The trust fund should be restored by £30,000. Causation: Tom's breach directly caused the full £30,000 loss."},
        {step:"Step 3 — Defences", text:"s.61: Tom acted dishonestly — no relief. Sally arguably acted unreasonably (she knew and did nothing) — s.61 unlikely to assist. No consent, no limitation issue (breach recent), and no exemption clause on facts."},
        {step:"Step 4 — Tracing (Apex shares)", text:"Mixed account: £10,000 (Tom's) + £30,000 (trust) = £40,000. Re Hallett: Tom is presumed to have spent his own money first. The £15,000 drawn to buy Apex shares is therefore trust money. The shares (now worth £30,000) are trust property. Apply Re Oatway: beneficiaries may claim the shares in preference to the depleted account balance."},
        {step:"Consequence", text:"The beneficiaries can: (a) claim £30,000 equitable compensation personally against both Tom and Sally; and/or (b) assert a proprietary claim over the Apex shares (now £30,000) as traceable trust property. The proprietary claim is preferable if Tom is insolvent, as it ranks ahead of general creditors."},
      ],
    },
  },
};

// ─── STATIC FALLBACK QUESTIONS ────────────────────────────────────────────────
const STATIC_Q = {
  certainties:[
    {type:"mcq",scenario:"Alice writes to her brother Ben, asking him to hold her house 'in the hope and expectation' that he will allow their elderly mother to live there for the rest of her mother's life. Ben transfers the house into his own name. Two years later, he informs their mother she must leave. The mother claims the house is held on trust for her benefit.",question:"Which of the following best describes the legal position?",options:[{label:"A",text:"A valid trust was created because Alice clearly intended her mother to benefit."},{label:"B",text:"No trust was created because 'hope and expectation' are precatory words that impose no legal obligation."},{label:"C",text:"A valid trust was created because the subject matter (the house) and the object (the mother) are both identifiable."},{label:"D",text:"No trust was created because the trust was not evidenced in writing under s.53(1)(b) LPA 1925."}],correct:"B",explanation:"'Hope and expectation' are classic precatory words. Applying Re Adams and Kensington Vestry (1884), such words express a moral aspiration but impose no binding legal obligation. Without certainty of intention, no trust is created. Ben takes the house absolutely. Option A is wrong because identifiable parties cannot supply missing intention. Option D confuses formality with intention."},
    {type:"fillblank",sentence:"For a fixed trust, every beneficiary must be identifiable under the ___ test.",options:[{label:"A",text:"is or is not"},{label:"B",text:"complete list"},{label:"C",text:"reasonable certainty"},{label:"D",text:"conceptual certainty"}],correct:"B",explanation:"The complete list test (IRC v Broadway Cottages Trust (1955)) applies to fixed trusts: every beneficiary must be ascertainable. The 'is or is not' test applies to discretionary trusts under McPhail v Doulton (1971)."},
    {type:"oddoneout",instruction:"Which of the following does NOT demonstrate certainty of intention to create a trust?",category:"Words or acts showing binding intention to hold property for another",items:[{label:"A",text:"'I direct my trustee to hold the proceeds for my children'"},{label:"B",text:"'You shall apply this fund for the benefit of my employees'"},{label:"C",text:"'I hope you will see to it that my grandchildren are looked after'"},{label:"D",text:"'I declare myself trustee of these shares for my niece'"}],correct:"C",explanation:"Option C uses 'I hope', a precatory expression that creates no binding obligation (Re Adams and Kensington Vestry). Options A, B and D all use imperative language that imposes a clear legal obligation."},
    {type:"matching",instruction:"Match each case to its correct legal principle.",items:[{id:"1",label:"Re London Wine Co (1986)"},{id:"2",label:"Hunter v Moss (1994)"},{id:"3",label:"McPhail v Doulton (1971)"}],descriptions:[{id:"A",text:"The 'is or is not' test governs discretionary trusts."},{id:"B",text:"Identical fungible shares do not require physical segregation."},{id:"C",text:"Unallocated physical goods in a communal bulk cannot be the subject of a trust."}],correctPairs:{"1":"C","2":"B","3":"A"},explanation:"Re London Wine: physical segregation required for tangible goods. Hunter v Moss: fungible intangibles (shares) are different. McPhail v Doulton: the 'is or is not' test for discretionary trusts, overruling Broadway Cottages in this context."},
  ],
  formalities:[
    {type:"mcq",scenario:"Derek holds shares in Greenfield Ltd on bare trust for himself. He orally instructs his trustees to hold the shares henceforth on trust for his daughter Emma. No written document is produced. Emma seeks to enforce the arrangement.",question:"Which of the following best describes the legal position?",options:[{label:"A",text:"The oral direction is valid because it is a declaration of a new trust, not a disposition."},{label:"B",text:"The oral direction is void under s.53(1)(c) LPA 1925 as a disposition of a subsisting equitable interest."},{label:"C",text:"The oral direction is unenforceable but not void, because s.53(1)(b) only requires evidence in writing."},{label:"D",text:"The oral direction is valid because s.53(2) exempts transactions between family members."}],correct:"B",explanation:"Derek holds the subsisting equitable interest and is directing the trustees to hold it for Emma. This is directly analogous to Grey v IRC (1960): an oral direction to trustees to hold on new trusts is a disposition of a subsisting equitable interest within s.53(1)(c) and must be in writing. Without writing it is void, not merely unenforceable. Option C incorrectly applies s.53(1)(b). s.53(2) applies only to resulting and constructive trusts."},
    {type:"fillblank",sentence:"Under s.53(1)(b) LPA 1925, a trust of land must be ___ in writing — not necessarily created in writing.",options:[{label:"A",text:"constituted"},{label:"B",text:"manifested and proved"},{label:"C",text:"formally executed"},{label:"D",text:"registered"}],correct:"B",explanation:"Section 53(1)(b) uses the phrase 'manifested and proved' — meaning only evidence of the trust must be in writing. The declaration itself may be oral, unlike s.53(1)(c) which requires the disposition itself to be in writing."},
    {type:"oddoneout",instruction:"Which of the following transactions does NOT require writing under s.53(1) LPA 1925?",category:"Transactions requiring writing under s.53(1)",items:[{label:"A",text:"An oral declaration of trust over freehold land"},{label:"B",text:"An oral direction to trustees to hold shares on trust for a new beneficiary"},{label:"C",text:"A resulting trust arising from contribution to purchase price"},{label:"D",text:"An oral assignment of a beneficiary's interest under a settlement"}],correct:"C",explanation:"A resulting trust arises by operation of law and is expressly exempted from the writing requirements by s.53(2) LPA 1925. Options A, B and D all engage s.53(1) writing requirements — (b) for land trusts, (c) for dispositions of equitable interests."},
    {type:"matching",instruction:"Match each case to its correct ratio.",items:[{id:"1",label:"Grey v IRC (1960)"},{id:"2",label:"Vandervell v IRC (1967)"},{id:"3",label:"Rochefoucauld v Boustead (1897)"}],descriptions:[{id:"A",text:"s.53(1) cannot be used as an instrument of fraud; constructive trust imposed."},{id:"B",text:"Transfer of both legal and equitable title together does not require writing."},{id:"C",text:"Oral direction to trustees to hold for new beneficiaries is a disposition requiring writing."}],correctPairs:{"1":"C","2":"B","3":"A"},explanation:"Grey: oral direction = disposition → must be written. Vandervell: full transfer of legal + equitable = no separate disposition. Rochefoucauld: equity prevents the statute being used to perpetrate fraud."},
  ],
  constitution:[
    {type:"mcq",scenario:"Helen signs a stock transfer form transferring 200 shares in a private company to her daughter Isabel and hands her the form. Isabel does not send the form to the company for registration. Helen dies three days later. Helen's executor argues the shares remain in the estate.",question:"Which of the following best describes the legal position?",options:[{label:"A",text:"The shares remain in the estate because legal title never transferred to Isabel."},{label:"B",text:"The gift was perfected when Helen signed and delivered the form, applying the Re Rose principle."},{label:"C",text:"The gift was perfected under the Strong v Bird exception."},{label:"D",text:"The gift fails because it was not completed before Helen's death."}],correct:"B",explanation:"Applying Re Rose (1952): Helen had done everything in her own power to effect the transfer — she signed and delivered the form. The remaining step (company registration) was in the hands of a third party, not Helen. The beneficial interest passed to Isabel on delivery. The shares do not form part of Helen's estate. Strong v Bird (Option C) applies to executors — not relevant here."},
    {type:"fillblank",sentence:"The principle in Milroy v Lord (1862) establishes that equity will not ___ an imperfect gift.",options:[{label:"A",text:"recognise"},{label:"B",text:"perfect"},{label:"C",text:"rescind"},{label:"D",text:"validate"}],correct:"B",explanation:"Milroy v Lord establishes that 'equity will not perfect an imperfect gift' — a failed gift is not rescued by treating it as a declaration of trust, nor will equity compel completion of the transfer. The donor must either complete the transfer or clearly declare themselves trustee."},
    {type:"oddoneout",instruction:"Which of the following does NOT constitute a valid method of constituting a trust?",category:"Valid methods of constituting an express trust",items:[{label:"A",text:"Transfer of legal title to the trustees"},{label:"B",text:"Self-declaration by the settlor as trustee"},{label:"C",text:"Oral promise to transfer property to trustees in the future"},{label:"D",text:"Statutory vesting by court order"}],correct:"C",explanation:"An oral promise to transfer property in the future does not constitute a trust — it is a promise by a volunteer that equity will not enforce (Milroy v Lord). Options A, B and D are all recognised methods of complete constitution."},
    {type:"matching",instruction:"Match each doctrine to its correct requirements.",items:[{id:"1",label:"Re Rose principle"},{id:"2",label:"Strong v Bird"},{id:"3",label:"Donatio mortis causa"}],descriptions:[{id:"A",text:"Contemplation of death + conditional on death + delivery of subject matter or means of dominion."},{id:"B",text:"Donor must have done everything in their power; further acts required only of third parties."},{id:"C",text:"Continuing intention to give + donee appointed as executor."}],correctPairs:{"1":"B","2":"C","3":"A"},explanation:"Re Rose: constitution occurs when the donor has done all acts required of them. Strong v Bird: perfects an imperfect gift through executor appointment. DMC: requires all three elements — contemplation, condition, and delivery."},
  ],
  resulting:[
    {type:"mcq",scenario:"Sunrise Ltd borrows £150,000 from its investor, Quantum Partners, on the express condition that the money is used solely to pay a specific outstanding tax liability. The money is paid into a segregated account. Before the tax is paid, Sunrise Ltd enters administration. The administrator seeks to treat the £150,000 as part of the general assets.",question:"Which of the following best describes the legal position?",options:[{label:"A",text:"The money forms part of the general assets because it was paid to Sunrise Ltd unconditionally."},{label:"B",text:"Quantum Partners holds a charge over the money as security for repayment of the loan."},{label:"C",text:"The money is held on a Quistclose resulting trust for Quantum Partners and does not form part of the general estate."},{label:"D",text:"The money is held on trust for the tax authority as the intended payee."}],correct:"C",explanation:"Applying Barclays Bank v Quistclose Investments (1970): the money was lent for a specific identified purpose (paying the tax liability), kept in a designated separate account, and the purpose has failed (administration before payment). A Quistclose resulting trust arises for Quantum Partners. The money never formed part of Sunrise's general estate and is not available to general creditors."},
    {type:"fillblank",sentence:"The presumption of resulting trust arising from a voluntary transfer of property to another person is rebuttable by evidence of ___ intent.",options:[{label:"A",text:"charitable"},{label:"B",text:"donative"},{label:"C",text:"constructive"},{label:"D",text:"fiduciary"}],correct:"B",explanation:"The presumption of resulting trust — that B holds on trust for A when A pays for property in B's name — is rebutted by evidence of donative (gift-giving) intent: that A genuinely intended to give the property to B outright. The presumption of advancement in certain relationships (father-child, husband-wife) is a specific form of this."},
    {type:"oddoneout",instruction:"Which of the following will NOT give rise to a resulting trust?",category:"Circumstances that give rise to a resulting trust",items:[{label:"A",text:"An express trust that fails for uncertainty of objects"},{label:"B",text:"Money lent for a specific purpose that subsequently fails"},{label:"C",text:"A voluntary transfer of shares into a friend's name with clear evidence of donative intent"},{label:"D",text:"Payment of the full purchase price for a property placed in another's name without explanation"}],correct:"C",explanation:"Where there is clear evidence of donative intent — A genuinely intended to give the shares to the friend — the presumption of resulting trust is rebutted and no resulting trust arises. Options A, B and D all give rise to resulting trusts: A (automatic), B (Quistclose), D (presumed from contribution to purchase price)."},
    {type:"matching",instruction:"Match each scenario to the correct type of resulting trust.",items:[{id:"1",label:"Express trust declared but objects are uncertain"},{id:"2",label:"Father pays for house placed in adult son's name, no explanation"},{id:"3",label:"Company receives money specifically to pay a debt; goes insolvent before payment"}],descriptions:[{id:"A",text:"Quistclose resulting trust — money results back to transferor"},{id:"B",text:"Automatic resulting trust — undisposed beneficial interest returns to settlor"},{id:"C",text:"Presumed resulting trust — subject to presumption of advancement"}],correctPairs:{"1":"B","2":"C","3":"A"},explanation:"Uncertain objects → automatic resulting trust for settlor. Father to son → presumed resulting trust, but presumption of advancement may rebut it. Quistclose fact pattern → automatic resulting trust for lender on failure of purpose."},
  ],
  constructive:[
    {type:"mcq",scenario:"Nick and Olivia purchase a house in joint names. Nick contributes £120,000 to the deposit; Olivia contributes £40,000. They take out a joint mortgage. Nick pays all mortgage instalments from his own account. Olivia pays household expenses but keeps entirely separate finances. They separate after 10 years. The property is worth £600,000 with £200,000 outstanding on the mortgage.",question:"Which of the following best describes how the net equity should be divided?",options:[{label:"A",text:"Equally — joint names creates an irrebuttable presumption of equal shares."},{label:"B",text:"In proportion to their initial cash contributions to the deposit only."},{label:"C",text:"By reference to the whole course of dealing; Nick's significantly greater contributions displace the presumption of equality."},{label:"D",text:"Nick takes the whole property because he paid all mortgage instalments."}],correct:"C",explanation:"Stack v Dowden (2007): joint names creates a strong presumption of equal shares, but this is rebuttable by evidence of different common intention drawn from the whole course of dealing. Nick's significantly greater deposit contribution and sole mortgage payments, combined with Olivia's entirely separate finances, displace the equal shares presumption. The court will quantify Nick's larger share by reference to all the circumstances (Jones v Kernott)."},
    {type:"fillblank",sentence:"In Keech v Sandford (1726), the trustee who renewed a lease for personal benefit was required to hold it on constructive trust because a fiduciary must not ___ from their position.",options:[{label:"A",text:"resign"},{label:"B",text:"profit"},{label:"C",text:"delegate"},{label:"D",text:"disclose"}],correct:"B",explanation:"Keech v Sandford establishes the strict no-profit rule: a fiduciary must not profit from their position without the fully informed consent of all principals. The trustee held the renewed lease on constructive trust for the infant beneficiary, regardless of the fact that the infant could not himself have obtained the renewal."},
    {type:"oddoneout",instruction:"Which of the following does NOT give rise to an institutional constructive trust?",category:"Circumstances giving rise to institutional constructive trusts",items:[{label:"A",text:"A trustee who renews a lease held on trust in their own name"},{label:"B",text:"A solicitor to a trust who uses confidential information to profit personally"},{label:"C",text:"A beneficiary who agrees in writing to release their equitable interest"},{label:"D",text:"A company director who diverts a corporate opportunity to themselves"}],correct:"C",explanation:"A beneficiary releasing their equitable interest in writing is a straightforward transaction governed by s.53(1)(c) — it does not give rise to a constructive trust. Options A (Keech v Sandford), B (Boardman v Phipps) and D (fiduciary/director) all involve unauthorised profit from a fiduciary position, giving rise to a constructive trust."},
    {type:"matching",instruction:"Match each case to the principle it establishes.",items:[{id:"1",label:"Lloyds Bank v Rosset (1991)"},{id:"2",label:"Royal Brunei Airlines v Tan (1995)"},{id:"3",label:"Jones v Kernott (2011)"}],descriptions:[{id:"A",text:"Dishonest assistance requires objective dishonesty assessed against the standard of an honest person."},{id:"B",text:"Common intention can change; courts may impute a fair share on quantification."},{id:"C",text:"Inferred common intention in sole name cases requires at minimum direct financial contribution."}],correctPairs:{"1":"C","2":"A","3":"B"},explanation:"Rosset: sets the high threshold for inferred common intention (direct financial contribution). Royal Brunei: establishes objective test for dishonesty in dishonest assistance. Jones v Kernott: changing common intention and the distinction between inference and imputation."},
  ],
  breach:[
    {type:"mcq",scenario:"Paula and Roger are co-trustees of the Henderson Trust. Roger, without Paula's knowledge, withdraws £40,000 from the trust account and uses it to buy shares in a company that subsequently becomes worthless. Paula discovers this six months later but takes no action for a further two years, during which the trust suffers no additional loss. The beneficiaries now wish to sue both trustees.",question:"Which of the following best describes the liability of Paula and Roger?",options:[{label:"A",text:"Only Roger is liable as he personally committed the breach."},{label:"B",text:"Both Roger and Paula are jointly and severally liable — Paula's inaction after discovering the breach is itself a breach."},{label:"C",text:"Paula is not liable because she did not know of the breach when it was committed."},{label:"D",text:"Roger is liable for the full loss; Paula is liable only for losses caused after she became aware."}],correct:"B",explanation:"Bahin v Hughes (1886): all trustees are jointly and severally liable; a passive trustee cannot hide behind inactivity. Paula's failure to take action after discovering Roger's breach is itself a breach of her duty to act. The beneficiaries may sue either or both for the full £40,000. Option A is wrong — Paula's passivity is actionable. Option D is not the correct analysis; joint and several liability applies."},
    {type:"fillblank",sentence:"In Armitage v Nurse (1998), the Court of Appeal held that a trustee exemption clause is effective to exclude liability for gross negligence, but cannot exclude liability for the trustee's own ___.",options:[{label:"A",text:"mistakes"},{label:"B",text:"negligence"},{label:"C",text:"dishonesty"},{label:"D",text:"delegation"}],correct:"C",explanation:"Armitage v Nurse establishes that the 'irreducible core' of a trustee's obligation — that which cannot be contracted out of — is the duty not to act dishonestly. Exemption clauses may exclude liability for negligence and even gross negligence, but liability for actual fraud or dishonesty cannot be excluded."},
    {type:"oddoneout",instruction:"Which of the following is NOT a valid defence to an action for breach of trust?",category:"Recognised defences to breach of trust claims",items:[{label:"A",text:"The trustee acted honestly and reasonably and ought fairly to be excused (s.61 Trustee Act 1925)"},{label:"B",text:"The beneficiary gave fully informed consent to the breach"},{label:"C",text:"The trustee was acting on the instructions of the settlor when the trust was first created"},{label:"D",text:"Six years have elapsed since the breach and the trustee did not act fraudulently"}],correct:"C",explanation:"Acting on the settlor's original instructions when the trust was created is not a recognised defence to a subsequent breach of trust — once the trust is constituted, trustees are bound by its terms and their fiduciary duties, not by the settlor's continuing wishes. Options A (s.61 TA 1925), B (consent) and D (limitation under s.21(3) LA 1980) are all valid defences."},
    {type:"matching",instruction:"Match each tracing case to its correct rule.",items:[{id:"1",label:"Re Hallett's Estate (1880)"},{id:"2",label:"Re Oatway (1903)"},{id:"3",label:"Foskett v McKeown (2001)"}],descriptions:[{id:"A",text:"Beneficiaries entitled to a proportionate share of proceeds, including profits generated by the traced asset."},{id:"B",text:"Where the trustee invested from a mixed fund and then dissipated the remainder, beneficiaries may claim the investment."},{id:"C",text:"Where trust money is mixed with the trustee's own funds, the trustee is presumed to have spent their own money first."}],correctPairs:{"1":"C","2":"B","3":"A"},explanation:"Re Hallett: the wrongdoer spends own money first — protecting the trust fund's balance. Re Oatway: prevents Re Hallett being used against beneficiaries when the trustee invested first. Foskett: beneficiaries trace into proceeds and take a proportionate share of profits."},
  ],
};

// ─── CASE STORIES ─────────────────────────────────────────────────────────────
const CASES = {
  "Knight v Knight (1840)":{citation:"(1840) 3 Beav 148",story:`In 1840 the estate of Andrew Knight came before the Master of the Rolls following a dispute about whether certain words in his will created a binding trust. Lord Langdale MR used the occasion to set out — for the first time in clear analytical terms — the three conditions that every valid express trust must satisfy: certainty of intention, of subject matter, and of objects. He held that all three must be simultaneously present.\n\nThe significance of Knight v Knight is foundational. It gave equity a coherent analytical framework that remains the starting point for every trust problem today.`,ratio:"Established the three certainties as the necessary conditions for every valid express trust.",principle:"Three Certainties — the analytical gateway for all trust problems."},
  "Re Adams and Kensington Vestry (1884)":{citation:"(1884) 27 ChD 394",story:`William Adams left his personal estate to his wife "in full confidence that she will do what is right as to the disposal thereof between my children." When his widow died without making special provision for the children, they argued a trust had been created obliging her to hold for their benefit.\n\nThe Court of Appeal rejected this argument sharply. Cotton LJ drew a bright line between words imposing a legal obligation and words expressing a moral expectation. "In full confidence" fell into the second category — it was precatory. The widow had taken absolutely.\n\nThe case is the archetype of the precatory words problem. If every expression of confidence created a trust, testators would lose the ability to make outright gifts to people they trusted. The distinction between obligation and aspiration is essential to preserving private autonomy.`,ratio:"'In full confidence' is precatory — expresses hope, not obligation. No trust was created.",principle:"Certainty of Intention — precatory words insufficient."},
  "Comiskey v Bowring-Hanbury (1905)":{citation:"[1905] AC 84",story:`The testator left his residuary estate to his wife "absolutely in full confidence that she will make such use of it as I should have made myself and that at her death she will devise it to such one or more of my nieces as she may think fit." A dispute arose between the widow's next-of-kin and the nieces.\n\nThe House of Lords upheld a valid trust, despite the same "in full confidence" language that had been precatory in Re Adams. The key was the rest of the clause: the testator had specified exactly who was to receive at the widow's death and had clearly contemplated an obligation to leave it to the nieces. Read as a whole, the will imposed a binding obligation.\n\nComiskey shows that no single formula word is conclusive. The document must be construed as a whole in context.`,ratio:"Read in context as a whole, the language imposed a binding obligation on the wife to leave the estate to the nieces.",principle:"Certainty of Intention — contextual construction may establish obligation despite precatory phrasing."},
  "Paul v Constance (1977)":{citation:"[1977] 1 WLR 527",story:`Dennis Constance had separated from his wife and was living with Mrs Paul. He received £950 in accident compensation. They opened a bank account in his name alone — because, as he explained, he was embarrassed about having a joint account without being married. Over the years he repeatedly said to Mrs Paul: "The money is as much yours as mine." When he died intestate, his legal wife claimed the entire balance.\n\nThe Court of Appeal upheld Mrs Paul's claim. Scarman LJ held that repeated informal assurances — in the context of their domestic relationship — were sufficient to constitute a declaration of trust. The word "trust" is not required; an expression of intent to hold for another as a matter of legal obligation suffices, however informally expressed.`,ratio:"Informal words of assurance sufficient to constitute a declaration of trust over personalty in an appropriate domestic context.",principle:"Certainty of Intention — laypersons need not use the word 'trust'."},
  "Re London Wine Co (Shippers) Ltd (1986)":{citation:"[1986] PCC 121",story:`Customers of the London Wine Company purchased specific cases of wine stored in communal warehouses. The wine was never physically separated — the cases belonging to any individual customer were not set aside or marked. All the wine sat in a commingled stock.\n\nWhen the company went into receivership, customers claimed beneficial ownership of their wine as trust beneficiaries. Oliver J rejected this. A trust cannot attach to specific property where that property has not been identified. The specific bottles belonging to each customer simply could not be pointed to. The subject matter of the trust — those particular cases — was never certain, and without certainty of subject matter there is no trust. The wine went to the general creditors.`,ratio:"Physical property must be separately identifiable before a trust can attach to it.",principle:"Certainty of Subject Matter — physical segregation required for tangible goods."},
  "Hunter v Moss (1994)":{citation:"[1994] 1 WLR 452",story:`David Moss owned 950 shares in Hunter Furniture Group. He had orally promised Colin Hunter, his managing director, 50 of those shares as part of his remuneration. The relationship broke down and Moss denied the arrangement. Hunter sued, but Moss argued no trust could arise because the 50 shares had never been physically identified or separated from the 950.\n\nThe Court of Appeal drew a critical distinction. Unlike physical wine bottles, shares in the same company of the same class are entirely fungible — legally and commercially identical. There is no meaningful difference between share number 1 and share number 50. Accordingly, a declaration of trust over 50 of 950 identical shares does not fail for uncertainty of subject matter: any 50 shares from the holding would satisfy the obligation.`,ratio:"A trust of 50 shares out of 950 identical shares is valid: identical shares are fungible and do not require physical segregation.",principle:"Certainty of Subject Matter — fungible intangibles distinguished from physical commodities."},
  "IRC v Broadway Cottages Trust (1955)":{citation:"[1955] Ch 20",story:`A settlor purported to create a trust for "all the residents of Broadway" — a village in the Cotswolds. When the Inland Revenue assessed the trust for tax, the question arose: was it valid? Could a court compile a complete list of every single beneficiary?\n\nThe Court of Appeal held the trust failed. Jenkins LJ articulated the complete list test for fixed trusts: every beneficiary must be ascertainable, because each is entitled to a defined share. If a single person cannot be found, the shares cannot be calculated. "All residents of Broadway" could never be exhaustively enumerated. The trust therefore failed entirely. This test was later overruled for discretionary trusts by McPhail v Doulton but remains the governing standard for fixed trusts.`,ratio:"Fixed trusts require a complete list of every beneficiary. If even one cannot be identified, the trust fails.",principle:"Certainty of Objects — complete list test for fixed trusts."},
  "McPhail v Doulton (1971)":{citation:"[1971] AC 424",story:`Bertram Baden retired from Matthew Hall & Co and wished to provide for the people who had worked for him. He executed a deed giving trustees absolute discretion to apply income for the benefit of "officers and employees or ex-officers or ex-employees of the company or any of their relatives or dependants." No individual was guaranteed anything.\n\nThe Revenue challenged the trust. The Court of Appeal applied the Broadway Cottages complete list test and held it void: a complete list of "relatives and dependants" of all employees of a large company could never be compiled.\n\nThe House of Lords reversed this in a landmark judgment. Lord Wilberforce held that a discretionary trustee does not need a complete list — they merely need to be able to assess whether any given individual is within or outside the class. The test becomes: can it be said with certainty, of any given person, whether they are or are not in the class? The case was remitted to apply this new test.`,ratio:"For discretionary trusts, the 'is or is not' test applies: can it be said of any given person whether they are or are not within the class?",principle:"Certainty of Objects — 'is or is not' test for discretionary trusts, overruling Broadway Cottages."},
  "Re Baden's Deed Trusts (No 2) (1973)":{citation:"[1973] Ch 9",story:`The same trust as McPhail v Doulton, remitted to the Chancery Division to apply the new 'is or is not' test. Was "relatives and dependants of employees" sufficiently certain? Three Court of Appeal judges each upheld the trust but gave different reasons. Sachs LJ held conceptual certainty was the only requirement. Megaw LJ held the trust valid because there was a substantial class about whom one could say with certainty they were relatives. Stamp LJ took a narrower view, requiring "relative" to mean "next of kin."\n\nThe case confirms the critical distinction: conceptual uncertainty (the criterion is meaningless) defeats the trust; evidential uncertainty (difficulty proving facts about particular persons) does not.`,ratio:"Conceptual certainty required; evidential uncertainty (difficulty proving facts about specific persons) does not defeat a discretionary trust.",principle:"Certainty of Objects — conceptual vs evidential uncertainty."},
  "Rochefoucauld v Boustead (1897)":{citation:"[1897] 1 Ch 196",story:`The Comtesse de la Rochefoucauld had mortgaged her coffee plantations in Ceylon. Boustead agreed to purchase the estates from the mortgagee on an express oral understanding that he would hold them on trust for the Comtesse, subject to repayment of his outlay. Boustead took legal title, then denied the trust and claimed the estates as his own, pointing to the predecessor of s.53(1)(b): no written evidence existed.\n\nThe Court of Appeal refused to allow Boustead to shelter behind the statute. The principle — foundational in equity — is that a person who has induced a transfer of property on the basis of an oral trust cannot then use a statutory formality requirement to deny the trust and keep the property. Equity imposes a constructive trust in these circumstances: not because the oral trust is directly enforceable, but because to allow the statute to be used as an instrument of fraud would be unconscionable.`,ratio:"A constructive trust is imposed to prevent s.53(1)(b) being used as an instrument of fraud.",principle:"Formalities — fraud exception prevents reliance on s.53(1)(b) to deny an oral trust."},
  "Grey v IRC (1960)":{citation:"[1960] AC 1",story:`Hunter Grey had transferred shares to trustees to hold on bare trust for himself. To make gifts to his grandchildren, he gave the trustees an oral direction to hold the shares on new trusts for the six grandchildren. The trustees later executed a formal deed confirming this. The Revenue assessed stamp duty on the deed.\n\nThe question was: when was the taxable disposition made? The House of Lords held that the oral direction was itself an attempted disposition of Grey's beneficial interest — precisely what s.53(1)(c) was designed to capture. Because it was oral, it was void. The operative act was therefore the deed, on which duty was properly charged. The decision confirmed that an oral direction to trustees to hold on new trusts for new beneficiaries is a disposition requiring writing.`,ratio:"An oral direction to trustees to hold on new trusts is a disposition of the equitable interest within s.53(1)(c) and must be in writing.",principle:"Formalities — s.53(1)(c); oral directions to trustees are dispositions."},
  "Vandervell v IRC (1967)":{citation:"[1967] 2 AC 291",story:`Tony Vandervell was the founder of Vandervell Products and wished to fund a Chair of Pharmacology at the Royal College of Surgeons. He directed his trustees — who held shares in his company on bare trust for him — to transfer those shares outright to the Royal College: both legal and equitable title, everything, absolutely.\n\nThe Revenue argued the beneficial interest required separate writing under s.53(1)(c). The House of Lords disagreed. Where both legal and equitable title are transferred together — the entire interest in property passes — there is no separate "disposition of a subsisting equitable interest." The equitable interest passes with the legal title as a matter of course. No separate writing is required. The contrast with Grey v IRC is decisive: in Grey, only the beneficial interest moved; in Vandervell, everything moved together.`,ratio:"A transfer of both legal and equitable title together is not a 'disposition' within s.53(1)(c). No writing required.",principle:"Formalities — s.53(1)(c) does not apply where legal and equitable title transfer together."},
  "Milroy v Lord (1862)":{citation:"(1862) 4 De GF & J 264",story:`Samuel Medley wanted to give 50 shares in the Bank of Louisiana to his niece Eleanor. He executed a voluntary deed purporting to transfer the shares to Thomas Lord to hold on trust for Eleanor, and gave Lord a power of attorney to transfer. However, the shares were never actually transferred into Lord's name on the register. Lord held only the certificates.\n\nWhen Medley died, Eleanor's representatives argued the arrangement should be treated as a declaration of trust. Turner LJ rejected this and articulated the principle for which the case is famous: equity will not perfect an imperfect gift. A failed gift is not rescued by treating it as a declaration of trust. There must be a clear completed transfer or a clear declaration — a half-completed gift is neither. The shares remained in Medley's estate.`,ratio:"Equity will not assist a volunteer. An imperfect gift cannot be saved by treating it as a declaration of trust.",principle:"Constitution — the foundational rule against perfecting imperfect gifts."},
  "Re Rose (1952)":{citation:"[1952] Ch 499",story:`Eric Rose signed stock transfer forms on 30 March 1943, transferring shares to his wife and a charitable trustee, and handed them to the transferees. Under the company's articles, a transfer only took legal effect when the directors approved it and the transferee was registered — which happened on 30 June 1943.\n\nFor estate duty purposes: when did the transfer take place? The Court of Appeal held the transfer was effective from 30 March — when Rose had done everything in his own power. He had signed and delivered the forms. The fact that company directors still needed to act was irrelevant: that step was entirely in third-party hands, not Rose's. The beneficial interest passed on 30 March, even though legal title vested later.`,ratio:"A gift or trust is constituted when the donor has done everything in their own power to effect the transfer.",principle:"Constitution — Re Rose principle; trust constituted when settlor has completed all acts required of them."},
  "Strong v Bird (1874)":{citation:"(1874) LR 18 Eq 315",story:`Bird borrowed £1,100 from his stepmother Mrs Strong. It was agreed the loan would be repaid by deducting £100 per quarter from Bird's rent. Two deductions were made. Mrs Strong then told Bird she forgave the entire remaining debt of £900. She continued to take full rent but the debt was never formally released by deed. When Mrs Strong died, she appointed Bird as her executor. Her other next-of-kin claimed the £900 debt formed part of the estate.\n\nJessel MR held in Bird's favour. Where a donor had a continuing intention to give (or release) right up to their death, and the donee is appointed executor, the vesting of the estate's assets in the executor — including the very obligation represented by the debt — extinguishes the obligation. The imperfect release was perfected by the appointment.`,ratio:"An imperfect gift is perfected where the donor had a continuing intention to give and the donee is appointed executor.",principle:"Constitution — Strong v Bird exception; continuing intent plus executor appointment."},
  "Barclays Bank Ltd v Quistclose Investments Ltd (1970)":{citation:"[1970] AC 567",story:`Rolls Razor Ltd had declared a dividend but lacked funds to pay it. Quistclose lent £209,719 specifically to pay the dividend, paid into a special account at Barclays separate from Rolls Razor's general trading account. Before the dividend was paid, Rolls Razor went into liquidation. Barclays, which had a general set-off right, claimed the money.\n\nThe House of Lords, in a judgment by Lord Wilberforce, held in favour of Quistclose. Money lent for a specific identified purpose and kept in a designated account is held on a primary trust to apply it for that purpose. On failure of the purpose — here, liquidation before payment — a secondary resulting trust arises for the lender. The money never became part of Rolls Razor's general estate. Quistclose recovered its full £209,719 ahead of all general creditors.`,ratio:"Money lent for a specific purpose is held on Quistclose trust: primary trust for the purpose; on failure, resulting trust for the lender.",principle:"Resulting Trusts — Quistclose; money for specific purpose does not merge into borrower's assets."},
  "Tinsley v Milligan (1994)":{citation:"[1994] 1 AC 340",story:`Stella Tinsley and Kathleen Milligan jointly purchased a house but deliberately placed legal title in Tinsley's name alone so Milligan could fraudulently claim housing benefits as a person with no property. Both participated in the fraud. When the relationship broke down, Tinsley sought possession, arguing she was the sole legal owner. Milligan counterclaimed, asserting a resulting trust based on her contributions to the purchase price.\n\nTinsley argued Milligan was barred by illegality — she would need to plead her own fraud to establish the trust. The House of Lords, by a majority, held that Milligan did not need to plead the illegality — she could assert her contribution to the purchase price directly. As she did not need to rely on the illegality to establish the trust, it was enforceable. (Note: the illegality rules have since been reformed by Patel v Mirza (2016).)`,ratio:"A resulting trust arising from contribution to purchase price is enforceable even where the arrangement involved illegality, if the claimant need not rely on the illegality to establish the trust.",principle:"Resulting Trusts — presumed resulting trust from purchase price; illegality."},
  "Stack v Dowden (2007)":{citation:"[2007] UKHL 17",story:`Barry Stack and Dehra Dowden were together for 27 years and had four children. They bought their home in joint names in 1983. Ms Dowden had contributed significantly more to the purchase price and to mortgage payments — she was the higher earner and had maintained entirely separate finances throughout. When the relationship broke down, Stack claimed a 50% share.\n\nThe House of Lords held, 4–1, that Dowden was entitled to 65%. Lady Hale confirmed that joint names creates a strong presumption of equal beneficial shares — but it is rebuttable. The whole course of dealing is the relevant canvas: their separate finances, unequal contributions, and lack of financial interdependence together showed the parties did not intend equal shares. Stack v Dowden fundamentally changed the law of co-ownership and confirmed that the resulting trust analysis is inappropriate in the domestic context.`,ratio:"Joint names creates a strong presumption of equal beneficial shares, rebuttable by the whole course of dealing between the parties.",principle:"Constructive Trusts — CICT; joint names presumption and how to displace it."},
  "Jones v Kernott (2011)":{citation:"[2011] UKSC 53",story:`Patricia Jones and Leonard Kernott bought a house in joint names in 1985, contributing equally. They separated in 1993. Kernott left, cashed in a joint insurance policy, used his share to buy his own house, and made no further contributions to the family home. Jones stayed, paid everything, and maintained the family. Fourteen years later, Kernott claimed half the property, worth substantially more.\n\nThe Supreme Court held that common intention had changed after Kernott's departure. From 1993, the evidence supported an inference that each would take the home they occupied. Where a changed common intention can be inferred from conduct, the court gives effect to it. Where it cannot be inferred, the court may impute what is fair. Jones received approximately 90% of the property. The case confirmed that beneficial shares in family homes are not fixed at the date of purchase.`,ratio:"Common intention between co-owners can change over time. Courts may infer or, failing that, impute a fair division.",principle:"Constructive Trusts — changing common intention; inference vs imputation."},
  "Lloyds Bank plc v Rosset (1991)":{citation:"[1991] 1 AC 107",story:`Vincent Rosset purchased a derelict farmhouse using money from a Swiss family trust that insisted the property be in his name alone. His wife Linda supervised extensive renovation works over several months, including physical labour alongside the builders. She never made any direct financial contribution to the purchase price or mortgage. Without Linda's knowledge, Vincent charged the property to Lloyds Bank. When he defaulted, the bank sought possession. Linda claimed a beneficial interest under a constructive trust that preceded and took priority over the bank's charge.\n\nThe House of Lords rejected her claim. Lord Bridge held that a CICT in the sole-name context requires either an express agreement that she would have a share (supported by any detrimental reliance), or inferred common intention drawn from conduct. On inferred intention, Lord Bridge doubted that anything short of a direct financial contribution to the purchase price or mortgage repayments would ordinarily be sufficient. Supervising building works was insufficient.`,ratio:"CICT requires express common intention + detrimental reliance, or inferred common intention. Inferred intention requires at minimum direct financial contribution in sole-name cases.",principle:"Constructive Trusts — CICT; threshold for inferred common intention."},
  "Keech v Sandford (1726)":{citation:"(1726) Sel Cas Ch 61",story:`A trustee held a lease of the profits of Romford Market on trust for an infant beneficiary. When the lease approached expiry, the trustee applied to the landlord for renewal on behalf of the infant. The landlord refused — the infant could not give creditworthy covenants. But the landlord was willing to renew for the trustee personally. The trustee took the renewal in his own name, reasoning that since the infant could never have had the lease, no harm had been done.\n\nLord King LC rejected this reasoning categorically. The trustee must hold the renewed lease on constructive trust for the infant. The rule is not about harm or loss — it is structural: a trustee must never be placed in a position where personal interest and duty conflict. If trustees could keep benefits their trust could not obtain, they would be tempted to manufacture such circumstances. The rule is therefore strict and independent of good faith.`,ratio:"A trustee who takes personal advantage of an opportunity arising from their position holds that advantage on constructive trust for the beneficiaries, regardless of good faith.",principle:"Constructive Trusts — strict no-profit rule for fiduciaries."},
  "Boardman v Phipps (1967)":{citation:"[1967] 2 AC 46",story:`Tom Boardman was solicitor to the Phipps family settlement, which held a minority shareholding in a textile company. Believing the company was mismanaged, Boardman used information gathered in his capacity as solicitor — detailed knowledge of the company's affairs obtained through attending shareholder meetings as the trust's representative — to negotiate the purchase of a controlling interest for himself personally. He kept the trustees informed and the venture was successful: both the trust's shares and Boardman's personal shares increased in value substantially.\n\nThe House of Lords held, 3–2, that Boardman held his profits on constructive trust for the beneficiaries. He had obtained both his detailed knowledge and his negotiating position from his role as solicitor to the trust. The information itself was "trust property" in the relevant sense. The strict rule in equity requires the fully informed consent of all principals — and here that consent had not been obtained. Boardman was awarded a generous allowance for his skill and effort — but the profit had to be disgorged.`,ratio:"A fiduciary who profits using information or opportunity obtained from their fiduciary role holds that profit on constructive trust, even if they acted honestly and the principal also benefited.",principle:"Constructive Trusts — fiduciary profit; no-profit rule and fully informed consent."},
  "Royal Brunei Airlines v Tan (1995)":{citation:"[1995] 2 AC 378",story:`Royal Brunei appointed Borneo Leisure Travel as agent to sell tickets, with an obligation to pay proceeds into a designated account. Borneo Leisure instead paid the money into its general account and used it for its own purposes — a clear breach of trust. Philip Tan was Borneo Leisure's managing director and majority shareholder and personally directed these payments. When Borneo Leisure became insolvent, Royal Brunei turned to Tan personally.\n\nLord Nicholls, in a seminal Privy Council judgment, swept away the previous confusion. The dishonesty of the trustee is irrelevant — what matters is the dishonesty of the defendant accessory. Dishonesty is assessed objectively: would an honest person in the defendant's position have acted as Tan did? The defendant's subjective belief that they were acting honestly is not conclusive. Tan was personally liable.`,ratio:"Dishonest assistance requires objective dishonesty on the part of the assistant, assessed against the standard of an honest person. The trustee's own dishonesty is irrelevant.",principle:"Constructive Trusts — dishonest assistance; objective dishonesty test."},
  "Target Holdings Ltd v Redferns (1996)":{citation:"[1996] AC 421",story:`Target Holdings lent money to a borrower secured on Birmingham property. Solicitors Redferns acted for both parties and were instructed to release the mortgage advance only once conveyancing was complete. In breach of instructions, Redferns released the funds early, before security documents were in place. The money passed through several transactions as part of a fraud by the borrower. The property later fell in value and Target sued Redferns for the full loan amount, arguing that because the solicitors had committed a breach of trust, they were automatically liable for the entire loss.\n\nThe House of Lords rejected this absolutist approach. Lord Browne-Wilkinson held that causation is relevant even in equity: the court must assess whether the loss would have occurred even without the breach. If the lender would have made the same loan and suffered the same loss even had the solicitors acted properly, the breach does not cause the full loss.`,ratio:"Equitable compensation for breach of trust requires a causal link between the breach and the loss suffered.",principle:"Breach of Trust — equitable compensation; causation required."},
  "Armitage v Nurse (1998)":{citation:"[1998] Ch 241",story:`Paula Armitage challenged the administration of a family settlement, claiming the trustees had been grossly negligent in managing a farming estate and causing substantial losses. The trust deed contained a very wide exemption clause purporting to exclude all trustee liability except for "actual fraud."\n\nArmitage argued such a clause should be ineffective, particularly for gross negligence. The Court of Appeal (Millett LJ giving the leading judgment) upheld the clause. Exemption clauses in trust deeds are effective to exclude liability even for gross negligence. The "irreducible core" of a trustee's obligation — the one thing that cannot be contracted away — is the duty not to act dishonestly. Short of that, parties are free to agree the terms of the trusteeship. The clause excluding everything except actual fraud was therefore valid.`,ratio:"Exemption clauses valid even for gross negligence. The irreducible core that cannot be excluded is the trustee's own dishonesty.",principle:"Breach of Trust — exemption clauses; the irreducible core of honesty."},
  "Re Hallett's Estate (1880)":{citation:"(1880) 13 ChD 696",story:`Henry Hallett was a London solicitor who held client bonds on trust and mixed client proceeds with his own money in a personal bank account. He then withdrew money from the account on various occasions for his own purposes. When he died insolvent, his clients sought to trace their money and assert a proprietary claim ahead of general creditors.\n\nJessel MR held the clients could trace into the mixed account and assert a charge. The critical rule: where a trustee has mixed trust money with their own and then withdrawn, the trustee is presumed to have spent their own money first. A wrongdoer cannot claim they drew on trust money when doing so would benefit themselves. The trust beneficiaries therefore claim the remaining balance up to the amount of the trust fund. The rule operates as a fiction to protect beneficiaries — but it has limits corrected by Re Oatway.`,ratio:"Where trust money is mixed with the trustee's own funds and withdrawals made, the trustee is presumed to have spent their own money first.",principle:"Breach of Trust — equitable tracing; Re Hallett's rule."},
  "Re Oatway (1903)":{citation:"[1903] 2 Ch 356",story:`Trustee Oatway mixed trust money with his own in a bank account and then drew money from the account to purchase shares — which turned out to be profitable. He later dissipated the remainder of the account on himself. The trust beneficiaries sought to claim the shares. The trustee's estate argued that under Re Hallett, the trustee had spent his own money first — meaning the investment came from his own money, and the trust money was what had been subsequently spent.\n\nJoyce J rejected this. The Re Hallett presumption exists to protect beneficiaries, not to benefit the wrongdoer or their estate. Where the trustee first invested from the mixed account and then dissipated the rest, the beneficiaries are entitled to claim the investment — the profitable shares — rather than being left with nothing but the depleted account. Re Hallett cannot be deployed against the interests it was designed to protect.`,ratio:"Where a trustee invests from a mixed fund and then dissipates the remainder, the beneficiaries may claim the investment rather than the depleted account balance.",principle:"Breach of Trust — equitable tracing; Re Oatway prevents Re Hallett being turned against beneficiaries."},
  "Foskett v McKeown (2001)":{citation:"[2001] 1 AC 102",story:`Timothy Murphy misappropriated over £200,000 from a property development trust fund managed for a group of purchasers including Mr Foskett. Murphy used £20,440 of the trust money to pay some of the premiums on his own life insurance policy (the rest came from his own resources). Murphy subsequently committed suicide and the policy paid out approximately £1,000,000 to his children.\n\nFoskett and the other beneficiaries sought to trace their money into the insurance proceeds and claim a proportionate share. Murphy's children argued the trust beneficiaries could claim only the return of their premium payments with interest — not a share of the windfall payout.\n\nThe House of Lords held that the beneficiaries were entitled to trace into the proceeds and take a proportionate share. Because their money had funded a portion of the premiums, they had a proportionate beneficial interest in the policy, which followed through into the proceeds. The beneficiaries received approximately 40% of the £1,000,000 payout.`,ratio:"A beneficiary who traces trust money into an asset is entitled to a proportionate beneficial interest in that asset, including any profit generated.",principle:"Breach of Trust — equitable tracing; proportionate share of proceeds including profits."},
  "Oppenheim v Tobacco Securities Trust (1951)":{citation:"[1951] AC 297",story:`The Tobacco Securities Trust was established to provide for the education of children of employees and former employees of the British-American Tobacco Company and its subsidiaries — potentially over 110,000 people. The trust's promoters argued that a class of 110,000 was plainly a "section of the public."\n\nThe House of Lords held otherwise. Lord Simonds articulated the personal nexus test: a class defined by a relationship to a particular employer is defined by a private characteristic — their employment — not by any quality marking them out as a section of the public at large. The number of people in the class is entirely irrelevant. Whether the class has 10 or 10 million members, if they are united only by employment with a private entity, they are a private class. The trust failed as charitable.`,ratio:"A class defined by a personal characteristic such as employment by a particular company is not a 'section of the public' regardless of size.",principle:"Charitable Trusts — public benefit; personal nexus test."},
  "Re Coulthurst (1951)":{citation:"[1951] Ch 661",story:`Sir Coutts Coulthurst left a fund to Coutts & Co bank for "widows and orphaned children of deceased officers and ex-officers of Coutts & Co who shall be in needy circumstances." The question was whether this was a valid charitable trust for relief of poverty.\n\nThe Court of Appeal upheld the trust. Evershed MR defined poverty in the charitable sense: it does not require absolute destitution — it covers persons who "have to 'go short' in the ordinary acceptance of that term, due regard being had to their status in life." Needy circumstances in a relative sense suffices. The case also demonstrates the poverty exception: even though beneficiaries were linked to a particular employer, a trust for the poor of a particular organisation may still be charitable.`,ratio:"'Poverty' in the charitable sense means going short in ordinary life. Needy circumstances relative to one's station is sufficient.",principle:"Charitable Trusts — relief of poverty; meaning of poverty and the employer-poverty exception."},
  "Re Rymer (1895)":{citation:"[1895] 1 Ch 19",story:`A testator left £5,000 to "the rector for the time being of St Thomas' Seminary for the education of priests in the diocese of Westminster." When the testator died, St Thomas' Seminary had already been amalgamated into another institution. The question was whether the gift could be redirected cy-pres to another seminary.\n\nThe Court of Appeal held the gift failed. For cy-pres to apply at initial failure — where the institution no longer exists when the gift takes effect — the court must find a general charitable intent: the donor must have been motivated by a general desire to benefit charity, using the named institution merely as a vehicle. If the donor intended only to benefit that specific institution, there is no general charitable intent. On the facts, the testator had specified a particular seminary by name with no evidence of wider intent. The gift fell back into residue.`,ratio:"Cy-pres at initial failure requires general charitable intent. A specific gift to a named institution that has ceased to exist fails without cy-pres redirection.",principle:"Charitable Trusts — cy-pres; initial failure and general charitable intent."},
};

// ─── TOPIC DATA ───────────────────────────────────────────────────────────────
const TOPICS = [
  {
    id:"certainties",title:"The Three Certainties",subtitle:"The foundational gateway for every express trust",tag:"Express Trusts",color:"#0071e3",
    overview:`No trust takes effect unless three certainties are simultaneously present: certainty of intention, of subject matter, and of objects. Lord Langdale MR articulated the tripartite test in Knight v Knight (1840), and it remains the analytical starting point for every trust problem. Each certainty serves a different function and failure of any one prevents the trust from arising, though the legal consequences differ depending on which certainty is absent.`,
    rules:[
      {heading:"Certainty of Intention",icon:"🎯",keyRule:`Intention to impose a legally binding obligation is required. Precatory words — 'I wish', 'I hope', 'in full confidence' — are generally insufficient unless the surrounding language imposes a clear obligation.`,body:`The court assesses intention objectively. The question is whether the language imposes a legal obligation on the trustee or merely expresses a moral aspiration. Re Adams (1884) is the paradigm failure: 'in full confidence' expressed only hope. Comiskey (1905) shows the same phrase may suffice where surrounding words make the obligation unmistakeable. Paul v Constance (1977) demonstrates that informal domestic assurances can be sufficient even without legal vocabulary.`,caseKeys:["Knight v Knight (1840)","Re Adams and Kensington Vestry (1884)","Comiskey v Bowring-Hanbury (1905)","Paul v Constance (1977)"],links:[{label:"Lecture — Certainty of Intention",url:"https://www.youtube.com/results?search_query=certainty+of+intention+trusts+law+lecture"}]},
      {heading:"Certainty of Subject Matter",icon:"📦",keyRule:`Both the trust property and the beneficial interests must be identifiable with precision. Physical property requires segregation. Fungible intangibles (identical shares) are an exception.`,body:`Re London Wine Co (1986): physical goods in a commingled bulk cannot be the subject of a trust — the specific items must be separated. Hunter v Moss (1994): identical shares are fungible and do not require physical segregation. Re Goldcorp (1995): the Hunter v Moss exception does not extend to physical commodities. As to the beneficial interest itself, vague terms such as 'the bulk' or 'a reasonable amount' will defeat the trust.`,caseKeys:["Re London Wine Co (Shippers) Ltd (1986)","Hunter v Moss (1994)"],links:[{label:"Lecture — Certainty of Subject Matter",url:"https://www.youtube.com/results?search_query=certainty+subject+matter+trusts+law+lecture"}]},
      {heading:"Certainty of Objects",icon:"👥",keyRule:`Fixed trust: complete list test (every beneficiary identifiable). Discretionary trust: 'is or is not' test (can it be said of any given person whether they are or are not in the class?).`,body:`Fixed trusts require a complete list of beneficiaries: if even one cannot be identified, the trust fails (IRC v Broadway Cottages (1955)). Discretionary trusts are governed by the more flexible 'is or is not' test (McPhail v Doulton (1971)). Re Baden (No 2) (1973) confirmed that only conceptual uncertainty defeats the trust; evidential uncertainty (difficulty proving facts about particular persons) does not.`,caseKeys:["IRC v Broadway Cottages Trust (1955)","McPhail v Doulton (1971)","Re Baden's Deed Trusts (No 2) (1973)"],links:[{label:"Lecture — Certainty of Objects",url:"https://www.youtube.com/results?search_query=certainty+of+objects+mcphail+doulton+trusts+lecture"}]},
    ],
    examTips:["Always identify which certainty is at issue before applying the test — conflating the tests for intention and objects is a common error.","Address all three certainties systematically even if one obviously fails. Examiners reward structure.","For discretionary trusts, cite McPhail v Doulton explicitly and state the 'is or is not' test.","Hunter v Moss is narrow — do not extend it to physical assets. Re Goldcorp is the counterpoint."],
    frameworkKey:"certainties",
    staticQ:STATIC_Q.certainties,
  },
  {
    id:"formalities",title:"Formalities",subtitle:"Writing requirements under s.53 LPA 1925",tag:"Express Trusts",color:"#5856d6",
    overview:`Section 53 of the Law of Property Act 1925 imposes writing requirements for transactions involving equitable interests. Section 53(1)(b) requires trusts of land to be evidenced in writing. Section 53(1)(c) requires dispositions of subsisting equitable interests to be in writing. Section 53(2) exempts resulting and constructive trusts entirely.`,
    rules:[
      {heading:"s.53(1)(b) — Trusts of Land",icon:"🏠",keyRule:`A declaration of trust of land must be manifested and proved in writing. Only evidence in writing is required — the declaration itself may be oral. The statute cannot be used as a tool of fraud.`,body:`The word 'manifested and proved' is significant: the declaration can be oral, but must be supported by written evidence before it can be enforced. Where a person relies on the statute to deny a trust they have accepted, equity intervenes: Rochefoucauld v Boustead (1897) established that a constructive trust will be imposed to prevent the statute being used as an instrument of fraud.`,caseKeys:["Rochefoucauld v Boustead (1897)"],links:[{label:"s.53 LPA 1925",url:"https://www.legislation.gov.uk/ukpga/Geo5/15-16/20/section/53"},{label:"Lecture — Formalities",url:"https://www.youtube.com/results?search_query=s53+LPA+1925+trusts+formalities+lecture"}]},
      {heading:"s.53(1)(c) — Disposition of Equitable Interest",icon:"📋",keyRule:`A disposition of a subsisting equitable interest must itself be in writing — not merely evidenced in writing. Non-compliance renders the disposition void. Transfer of both legal and equitable title together does not engage s.53(1)(c).`,body:`An oral direction to trustees to hold on new trusts for new beneficiaries is a disposition and must comply (Grey v IRC (1960)). But where legal and equitable title transfer together, there is no separate 'disposition' — it passes with the legal title without the need for separate writing (Vandervell v IRC (1967)). The distinction between these two cases is the most frequently examined point in the formalities topic.`,caseKeys:["Grey v IRC (1960)","Vandervell v IRC (1967)"],links:[{label:"Lecture — s.53(1)(c)",url:"https://www.youtube.com/results?search_query=grey+v+irc+vandervell+s53+LPA+lecture"}]},
    ],
    examTips:["Distinguish s.53(1)(b) (evidenced in writing) from s.53(1)(c) (must be in writing).","The Grey / Vandervell distinction is a classic examination question.","Always address s.53(2): if a resulting or constructive trust analysis is available, it sidesteps both requirements.","Identify first: creation of a trust of land (b) or disposition of existing equitable interest (c)?"],
    frameworkKey:"formalities",
    staticQ:STATIC_Q.formalities,
  },
  {
    id:"constitution",title:"Constitution of Trusts",subtitle:"Equity will not assist a volunteer",tag:"Express Trusts",color:"#34c759",
    overview:`A trust is enforceable only once completely constituted — once the trust property has been effectively vested in the trustees or the settlor has declared themselves trustee. Milroy v Lord (1862) established the prohibition on saving imperfect gifts by treating them as declarations of trust. Exceptions include Re Rose (settlor has done everything in their power) and Strong v Bird (perfection by executor appointment).`,
    rules:[
      {heading:"The Rule and Three Methods",icon:"🏛️",keyRule:`Constitution achieved by transfer of legal title to trustees, self-declaration, or statutory vesting. Equity will not perfect an imperfect gift nor treat a failed transfer as a declaration of trust.`,body:`Milroy v Lord established that there is no halfway house: a failed gift is not rescued by calling it a declaration of trust. The settlor must either completely transfer legal title to the trustees, or completely declare themselves trustee. If neither is done effectively, the intended beneficiary has no enforceable rights.`,caseKeys:["Milroy v Lord (1862)"],links:[{label:"Lecture — Constitution of Trusts",url:"https://www.youtube.com/results?search_query=constitution+of+trusts+milroy+v+lord+lecture"}]},
      {heading:"Re Rose / Strong v Bird Exceptions",icon:"🌹",keyRule:`Re Rose: constituted when settlor has done everything in their own power. Strong v Bird: perfected if donor had continuing intent and donee is appointed executor.`,body:`Re Rose (1952): the beneficial interest passes once the settlor has completed all acts required of them — even if legal title has not yet formally vested in the hands of a third party registrar. Strong v Bird (1874): where the donor had a continuing intention to give and the donee is subsequently appointed executor, the imperfect gift is perfected by the vesting of the estate's assets.`,caseKeys:["Re Rose (1952)","Strong v Bird (1874)"],links:[{label:"Lecture — Constitution exceptions",url:"https://www.youtube.com/results?search_query=strong+v+bird+re+rose+constitution+trust+lecture"}]},
    ],
    examTips:["Identify which method of constitution was attempted and why it failed before considering exceptions.","Re Rose is only available where the settlor has done everything on their part.","Strong v Bird requires continuing intention — if the donor demanded repayment, the intention was not continuing.","In any constitution problem, consider all three exceptions: Re Rose, Strong v Bird, and DMC."],
    frameworkKey:"constitution",
    staticQ:STATIC_Q.constitution,
  },
  {
    id:"resulting",title:"Resulting Trusts",subtitle:"Property returning to the beneficial ownership of the transferor",tag:"Implied Trusts",color:"#ff9500",
    overview:`A resulting trust arises by operation of law, returning beneficial ownership to the transferor. It does not depend on intention — it arises automatically from the facts. Two categories exist: automatic resulting trusts (where an express trust fails or a Quistclose purpose fails) and presumed resulting trusts (from voluntary transfers or contributions to purchase price).`,
    rules:[
      {heading:"Automatic Resulting Trust",icon:"🔁",keyRule:`Arises automatically where an express trust fails wholly or in part. Also arises under a Quistclose arrangement when money transferred for a specific purpose fails.`,body:`The Quistclose trust (Barclays Bank v Quistclose (1970)) is the most commercially significant application: money lent for a specific purpose and kept separate is held on trust throughout. If the purpose fails, a resulting trust arises for the lender, taking priority over general creditors in insolvency. The key elements are: specific purpose, separate account or designation, and failure of purpose.`,caseKeys:["Barclays Bank Ltd v Quistclose Investments Ltd (1970)"],links:[{label:"Lecture — Resulting Trusts",url:"https://www.youtube.com/results?search_query=resulting+trusts+law+lecture+automatic+presumed"}]},
      {heading:"Presumed Resulting Trust",icon:"🤔",keyRule:`Arises where A pays for property placed in B's name without donative intent. Presumption of resulting trust for A, rebuttable by evidence of gift or advancement.`,body:`Equity presumes no one gives something for nothing. Where A pays for property in B's name without explanation, B is presumed to hold on resulting trust for A. Rebutted by evidence of donative intent, or by the presumption of advancement (father-to-child; husband-to-wife). Stack v Dowden confirmed that in the domestic co-habitation context, the resulting trust analysis is largely inappropriate.`,caseKeys:["Tinsley v Milligan (1994)","Stack v Dowden (2007)"],links:[{label:"Stack v Dowden — BAILII",url:"https://www.bailii.org/uk/cases/UKHL/2007/17.html"}]},
    ],
    examTips:["Never conflate automatic and presumed resulting trusts.","In Quistclose problems: identify specific purpose, separate account, failure of purpose. All three required.","In domestic property joint-names cases, go to Stack v Dowden — not resulting trust.","Note s.199 Equality Act 2010 abolishes husband-to-wife presumption of advancement but has not been brought into force."],
    frameworkKey:"resulting",
    staticQ:STATIC_Q.resulting,
  },
  {
    id:"constructive",title:"Constructive Trusts",subtitle:"Trusts imposed by equity regardless of intention",tag:"Implied Trusts",color:"#30b0c7",
    overview:`A constructive trust is imposed by operation of law in response to defined categories of unconscionable conduct. English law takes an institutional approach — the constructive trust arises automatically on proof of the relevant facts. The most significant categories are the common intention constructive trust (domestic property), institutional constructive trusts (fiduciary breach), dishonest assistance, and knowing receipt.`,
    rules:[
      {heading:"Common Intention Constructive Trust",icon:"🏡",keyRule:`Common intention (express or inferred) + detrimental reliance = CICT. In joint names cases, strong presumption of equal beneficial shares, displaced by whole course of dealing.`,body:`Lloyds Bank v Rosset (1991): two categories — express common intention (actual agreement) + any detrimental reliance, or inferred common intention from direct financial contributions. Stack v Dowden (2007): joint names creates presumption of equality, rebuttable by whole course of dealing. Jones v Kernott (2011): common intention can change; courts may impute a fair result at the quantification stage.`,caseKeys:["Lloyds Bank plc v Rosset (1991)","Stack v Dowden (2007)","Jones v Kernott (2011)"],links:[{label:"Jones v Kernott — UKSC",url:"https://www.bailii.org/uk/cases/UKSC/2011/53.html"},{label:"Lecture — CICT",url:"https://www.youtube.com/results?search_query=common+intention+constructive+trust+stack+dowden+lecture"}]},
      {heading:"Institutional Constructive Trusts",icon:"⚙️",keyRule:`Fiduciary profit → constructive trust (Keech; Boardman). Dishonest assistance → personal liability, objective dishonesty (Royal Brunei). Knowing receipt → constructive trust where unconscionable.`,body:`Keech v Sandford (1726): the strict no-profit rule; a trustee who takes personal advantage of an opportunity from their position holds it on constructive trust. Boardman v Phipps extends this to solicitors. Royal Brunei Airlines v Tan (1995): dishonest assistance imposes personal liability using an objective standard of dishonesty. The test is what an honest person in the defendant's position would have done.`,caseKeys:["Keech v Sandford (1726)","Boardman v Phipps (1967)","Royal Brunei Airlines v Tan (1995)"],links:[{label:"Lecture — Institutional CT",url:"https://www.youtube.com/results?search_query=institutional+constructive+trust+fiduciary+lecture"}]},
    ],
    examTips:["In CICT problems: state whether title is joint or sole at the outset. Different starting points apply.","Distinguish inferred common intention (from conduct) from imputed intention (court's fairness view). Imputation only at quantification.","For dishonest assistance: state Royal Brunei v Tan objective test. Do not confuse with knowing receipt.","Boardman v Phipps: fully informed consent of all beneficiaries could have authorised the profit."],
    frameworkKey:"constructive",
    staticQ:STATIC_Q.constructive,
  },
  {
    id:"breach",title:"Breach of Trust & Remedies",subtitle:"Personal liability, defences, and proprietary tracing",tag:"Remedies",color:"#ff3b30",
    overview:`A trustee commits a breach of trust by acting inconsistently with the trust instrument or their fiduciary and statutory duties. Consequences are both personal (equitable compensation) and potentially proprietary (tracing and following trust assets). Causation is required for personal liability. Proprietary remedies — available through equitable tracing — rank ahead of general creditors in insolvency.`,
    rules:[
      {heading:"Personal Liability and Equitable Compensation",icon:"💰",keyRule:`Trustees jointly and severally liable. Equitable compensation restores the trust fund. Causation required (Target Holdings; AIB v Redler). Exemption clauses valid except for dishonesty (Armitage v Nurse).`,body:`Target Holdings v Redferns (1996) and AIB Group v Mark Redler (2014) confirmed equitable compensation requires a causal connection between the breach and the loss. The measure is restoration of the trust fund to its counterfactual position. Armitage v Nurse (1998) confirms that exemption clauses are effective even for gross negligence but cannot protect a trustee against their own dishonesty — the irreducible core.`,caseKeys:["Target Holdings Ltd v Redferns (1996)","Armitage v Nurse (1998)"],links:[{label:"AIB v Redler — UKSC",url:"https://www.bailii.org/uk/cases/UKSC/2014/58.html"},{label:"Lecture — Breach of Trust",url:"https://www.youtube.com/results?search_query=breach+of+trust+equitable+compensation+lecture"}]},
      {heading:"Equitable Tracing",icon:"🔍",keyRule:`Re Hallett: wrongdoer spent own money first. Re Oatway: beneficiary may claim profitable investments from mixed fund. Foskett: proportionate share of proceeds. Fails against BFP for value without notice.`,body:`Equitable tracing requires a prior fiduciary relationship. Re Hallett's Estate (1880): the wrongdoer is presumed to have spent their own funds first, protecting the trust's share of any mixed account. Re Oatway (1903): prevents Re Hallett being used against beneficiaries — where the trustee invested first then dissipated the rest, beneficiaries claim the investment. Foskett v McKeown (2001): beneficiaries can trace into insurance proceeds and claim a proportionate share including profits.`,caseKeys:["Re Hallett's Estate (1880)","Re Oatway (1903)","Foskett v McKeown (2001)"],links:[{label:"Lecture — Tracing in Equity",url:"https://www.youtube.com/results?search_query=equitable+tracing+re+hallett+foskett+lecture"}]},
    ],
    examTips:["Distinguish tracing (identifying property) from the remedy (constructive trust or charge). Tracing is a process, not a right.","In tracing problems, work through bank account transactions step by step. Apply Re Hallett; then ask whether Re Oatway modifies the result.","For defences, check s.61 TA 1925 carefully — both honesty AND reasonableness required. Professional trustees rarely relieved.","AIB v Mark Redler narrows recovery — compensation is limited to loss caused by the breach, not the full fund."],
    frameworkKey:"breach",
    staticQ:STATIC_Q.breach,
  },
];

// ─── SHARED UI ────────────────────────────────────────────────────────────────
function Btn({label,onClick,variant="primary",color="#1d1d1f",disabled=false}){
  return(
    <button onClick={onClick} disabled={disabled} style={{padding:"11px 26px",background:disabled?"#e8e8ed":variant==="primary"?color:"transparent",color:disabled?"#aaa":variant==="primary"?"#fff":color,border:variant==="primary"?"none":`1.5px solid ${color}40`,borderRadius:10,fontSize:13,cursor:disabled?"default":"pointer",fontFamily:"system-ui",fontWeight:600,transition:"all 0.18s"}}>
      {label}
    </button>
  );
}

function CaseCard({caseKey,color}){
  const [open,setOpen]=useState(false);
  const c=CASES[caseKey];
  if(!c)return null;
  return(
    <div onClick={()=>setOpen(!open)} style={{background:open?"#fff":"#fafafa",border:`1px solid ${open?color+"30":"#ebebef"}`,borderRadius:12,padding:"14px 18px",marginBottom:8,cursor:"pointer",transition:"all 0.2s"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
        <div><div style={{fontSize:13,fontWeight:600,color:"#1d1d1f",fontFamily:"system-ui"}}>{caseKey}</div><div style={{fontSize:11,color:"#86868b",fontFamily:"system-ui",marginTop:2}}>{c.citation}</div></div>
        <span style={{fontSize:11,color:"#86868b",flexShrink:0}}>{open?"▲ hide":"▼ story"}</span>
      </div>
      {open&&(
        <div style={{marginTop:12,paddingTop:12,borderTop:"1px solid #f0f0f5"}}>
          <div style={{fontSize:10,fontWeight:700,color:"#86868b",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8,fontFamily:"system-ui"}}>The Story</div>
          {c.story.split("\n\n").map((p,i)=><p key={i} style={{fontSize:13,color:"#3a3a3c",lineHeight:1.85,fontFamily:"'Source Serif 4',Georgia,serif",marginBottom:10}}>{p}</p>)}
          <div style={{background:color+"0d",borderLeft:`3px solid ${color}`,padding:"10px 14px",borderRadius:"0 8px 8px 0",marginTop:10}}>
            <div style={{fontSize:10,fontWeight:700,color:color,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4,fontFamily:"system-ui"}}>Ratio</div>
            <p style={{fontSize:12,color:"#1d1d1f",lineHeight:1.7,fontFamily:"'Source Serif 4',Georgia,serif"}}>{c.ratio}</p>
          </div>
          <div style={{marginTop:6,fontSize:11,color:color,fontFamily:"system-ui",fontWeight:500}}>{c.principle}</div>
        </div>
      )}
    </div>
  );
}

// ─── APPLICATION FRAMEWORK COMPONENT ─────────────────────────────────────────
function AppFramework({frameworkKey,color,onDone}){
  const fw=FRAMEWORKS[frameworkKey];
  const [step,setStep]=useState(0); // 0=intro, 1..n=steps, n+1=worked example
  const totalSteps=fw.steps.length;
  const showWorked=step===totalSteps+1;
  const showIntro=step===0;
  const showStep=!showIntro&&!showWorked;
  const currentStep=showStep?fw.steps[step-1]:null;

  return(
    <div style={{maxWidth:720}}>
      {/* Header */}
      <div className="fu" style={{background:"white",borderRadius:16,padding:"20px 26px",marginBottom:14,boxShadow:"0 1px 8px rgba(0,0,0,0.06)"}}>
        <div style={{fontSize:10,fontWeight:700,color:color,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:4,fontFamily:"system-ui"}}>Application Method</div>
        <div style={{fontSize:19,fontWeight:400,fontFamily:"'Playfair Display',serif",color:"#1d1d1f",marginBottom:6}}>{fw.title}</div>
        {/* Progress bar */}
        <div style={{display:"flex",gap:4,marginTop:8}}>
          {["Intro",...fw.steps.map(s=>s.n),"Example"].map((lbl,i)=>(
            <div key={i} onClick={()=>setStep(i)} style={{flex:1,height:4,borderRadius:2,background:step>=i?color:"#e8e8ed",cursor:"pointer",transition:"all 0.2s"}}/>
          ))}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
          <span style={{fontSize:10,color:"#86868b",fontFamily:"system-ui"}}>{showIntro?"Introduction":showWorked?"Worked Example":`Step ${step} of ${totalSteps}`}</span>
          <span style={{fontSize:10,color:"#86868b",fontFamily:"system-ui"}}>{showWorked?"Worked example →":"click bar to jump"}</span>
        </div>
      </div>

      {/* Intro */}
      {showIntro&&(
        <div key="intro" className="fu" style={{background:"white",borderRadius:16,padding:"26px 30px",boxShadow:"0 1px 8px rgba(0,0,0,0.06)"}}>
          <div style={{fontSize:28,marginBottom:12}}>🗺️</div>
          <h3 style={{fontSize:18,fontWeight:400,fontFamily:"'Playfair Display',serif",color:"#1d1d1f",marginBottom:12}}>Before you answer any question on this topic</h3>
          <p style={{fontSize:14,color:"#3a3a3c",lineHeight:1.85,fontFamily:"'Source Serif 4',Georgia,serif",marginBottom:16}}>{fw.intro}</p>
          <div style={{background:color+"0d",borderLeft:`4px solid ${color}`,padding:"14px 18px",borderRadius:"0 10px 10px 0",marginBottom:20}}>
            <p style={{fontSize:13,color:"#1d1d1f",lineHeight:1.75,fontFamily:"'Source Serif 4',Georgia,serif"}}>This framework gives you a step-by-step method for applying the law to facts. Read each step carefully, then work through the worked example at the end — that is how you should approach any exam scenario on this topic.</p>
          </div>
          <Btn label="Start Step 1 →" onClick={()=>setStep(1)} color={color}/>
        </div>
      )}

      {/* Step */}
      {showStep&&currentStep&&(
        <div key={step} className="fu" style={{background:"white",borderRadius:16,padding:"26px 30px",boxShadow:"0 1px 8px rgba(0,0,0,0.06)"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:color+"10",padding:"6px 14px",borderRadius:20,marginBottom:14}}>
            <span style={{width:22,height:22,borderRadius:"50%",background:color,color:"white",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,fontFamily:"system-ui"}}>{currentStep.n}</span>
            <span style={{fontSize:12,fontWeight:600,color:color,fontFamily:"system-ui"}}>{currentStep.label}</span>
          </div>
          <div style={{marginBottom:16}}>
            {currentStep.instruction.split("\n\n").map((block,i)=>(
              <div key={i} style={{marginBottom:10}}>
                {block.split("\n").map((line,j)=>(
                  <p key={j} style={{fontSize:13,color:line.startsWith("→")||line.startsWith("(")?"#3a3a3c":"#1d1d1f",lineHeight:1.85,fontFamily:"'Source Serif 4',Georgia,serif",paddingLeft:line.startsWith("→")?"8px":line.startsWith("   ")||line.startsWith("(")?"16px":"0",marginBottom:line.startsWith("→")||line.startsWith("   ")?4:0,fontWeight:line.startsWith("FIXED")||line.startsWith("DISCRETIONARY")||line.startsWith("JOINT")||line.startsWith("SOLE")||line.startsWith("STAGE")||line.startsWith("QUISTCLOSE")?600:400}}>{line}</p>
                ))}
              </div>
            ))}
          </div>
          {currentStep.tip&&(
            <div style={{background:"#fff8e6",border:"1px solid #ffd090",borderRadius:10,padding:"12px 16px",marginBottom:14}}>
              <div style={{fontSize:10,fontWeight:700,color:"#a06000",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4,fontFamily:"system-ui"}}>⚡ Exam Tip</div>
              <p style={{fontSize:12,color:"#3a3a3c",lineHeight:1.7,fontFamily:"'Source Serif 4',Georgia,serif"}}>{currentStep.tip}</p>
            </div>
          )}
          {currentStep.caseRef&&(
            <div style={{background:"#f5f5f7",borderRadius:8,padding:"10px 14px",marginBottom:16}}>
              <div style={{fontSize:10,fontWeight:700,color:"#86868b",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:3,fontFamily:"system-ui"}}>Key Authority</div>
              <p style={{fontSize:12,color:"#444",fontFamily:"system-ui",fontStyle:"italic"}}>{currentStep.caseRef}</p>
            </div>
          )}
          <div style={{display:"flex",gap:10}}>
            {step<totalSteps
              ? <Btn label={`Step ${step+1} →`} onClick={()=>setStep(step+1)} color={color}/>
              : <Btn label="See Worked Example →" onClick={()=>setStep(totalSteps+1)} color={color}/>}
            {step>1&&<Btn label="← Back" onClick={()=>setStep(step-1)} variant="outline" color="#86868b"/>}
          </div>
        </div>
      )}

      {/* Worked example */}
      {showWorked&&(
        <div key="worked" className="fu" style={{background:"white",borderRadius:16,padding:"26px 30px",boxShadow:"0 1px 8px rgba(0,0,0,0.06)"}}>
          <div style={{fontSize:10,fontWeight:700,color:color,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:10,fontFamily:"system-ui"}}>Worked Example</div>
          <div style={{background:"#f5f5f7",borderRadius:10,padding:"16px 20px",marginBottom:18}}>
            <div style={{fontSize:10,fontWeight:700,color:"#86868b",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8,fontFamily:"system-ui"}}>Facts</div>
            <p style={{fontSize:14,color:"#3a3a3c",lineHeight:1.85,fontFamily:"'Source Serif 4',Georgia,serif"}}>{fw.workedExample.facts}</p>
          </div>
          <div style={{fontSize:10,fontWeight:700,color:"#86868b",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:12,fontFamily:"system-ui"}}>Applying the Framework</div>
          {fw.workedExample.walkthrough.map((w,i)=>(
            <div key={i} style={{display:"flex",gap:12,marginBottom:14}}>
              <div style={{minWidth:90,fontSize:11,fontWeight:700,color:color,fontFamily:"system-ui",paddingTop:2,flexShrink:0}}>{w.step}</div>
              <p style={{fontSize:13,color:"#3a3a3c",lineHeight:1.8,fontFamily:"'Source Serif 4',Georgia,serif"}}>{w.text}</p>
            </div>
          ))}
          <div style={{marginTop:20,display:"flex",gap:10}}>
            <Btn label="Now Practice Questions →" onClick={onDone} color="#1d1d1f"/>
            <Btn label="← Review Steps" onClick={()=>setStep(totalSteps)} variant="outline" color="#86868b"/>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── LEARN PHASE ──────────────────────────────────────────────────────────────
function LearnPhase({topic,onComplete}){
  const [ruleIdx,setRuleIdx]=useState(0);
  const rule=topic.rules[ruleIdx];
  return(
    <div style={{maxWidth:720}}>
      <div className="fu" style={{background:"white",borderRadius:16,padding:"24px 28px",marginBottom:14,boxShadow:"0 1px 8px rgba(0,0,0,0.06)"}}>
        <span style={{display:"inline-block",background:topic.color+"15",color:topic.color,padding:"3px 12px",borderRadius:20,fontSize:11,fontWeight:700,marginBottom:10,fontFamily:"system-ui"}}>{topic.tag}</span>
        <h1 style={{fontSize:24,fontWeight:400,color:"#1d1d1f",fontFamily:"'Playfair Display',Georgia,serif",marginBottom:4}}>{topic.title}</h1>
        <p style={{fontSize:13,color:"#86868b",marginBottom:12,fontFamily:"system-ui"}}>{topic.subtitle}</p>
        <p style={{fontSize:14,color:"#3a3a3c",lineHeight:1.85,fontFamily:"'Source Serif 4',Georgia,serif"}}>{topic.overview}</p>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
        {topic.rules.map((r,i)=>(
          <button key={i} onClick={()=>setRuleIdx(i)} style={{padding:"7px 14px",borderRadius:20,border:`1.5px solid ${ruleIdx===i?topic.color:"#e0e0e5"}`,background:ruleIdx===i?topic.color+"10":"white",color:ruleIdx===i?topic.color:"#6e6e73",fontSize:12,cursor:"pointer",fontWeight:ruleIdx===i?600:400,transition:"all 0.18s",fontFamily:"system-ui"}}>
            {r.icon} {r.heading}
          </button>
        ))}
      </div>
      <div key={ruleIdx} className="fu" style={{background:"white",borderRadius:16,padding:"24px 28px",boxShadow:"0 1px 8px rgba(0,0,0,0.06)",marginBottom:12}}>
        <h2 style={{fontSize:18,fontWeight:400,color:"#1d1d1f",fontFamily:"'Playfair Display',Georgia,serif",marginBottom:12}}>{rule.icon} {rule.heading}</h2>
        <div style={{background:topic.color+"0d",borderLeft:`4px solid ${topic.color}`,borderRadius:"0 8px 8px 0",padding:"12px 16px",marginBottom:14}}>
          <div style={{fontSize:10,fontWeight:700,color:topic.color,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4,fontFamily:"system-ui"}}>Key Rule</div>
          <p style={{fontSize:13,color:"#1d1d1f",lineHeight:1.75,fontFamily:"'Source Serif 4',Georgia,serif"}}>{rule.keyRule}</p>
        </div>
        {rule.body.split("\n\n").map((p,i)=><p key={i} style={{fontSize:14,color:"#3a3a3c",lineHeight:1.85,fontFamily:"'Source Serif 4',Georgia,serif",marginBottom:12}}>{p}</p>)}
        <div style={{marginTop:16}}>
          <div style={{fontSize:10,fontWeight:700,color:"#86868b",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10,fontFamily:"system-ui"}}>Cases — click to read the full story</div>
          {rule.caseKeys.map((k,i)=><CaseCard key={i} caseKey={k} color={topic.color}/>)}
        </div>
        {rule.links&&rule.links.length>0&&(
          <div style={{marginTop:14}}>
            <div style={{fontSize:10,fontWeight:700,color:"#86868b",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8,fontFamily:"system-ui"}}>Resources</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {rule.links.map((l,i)=>(
                <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:5,padding:"6px 14px",background:l.label.includes("Lecture")?"#fff0f0":"#f0f4ff",border:`1px solid ${l.label.includes("Lecture")?"#ffd0d0":"#d0e0ff"}`,borderRadius:20,fontSize:11,color:l.label.includes("Lecture")?"#cc0000":"#0071e3",fontFamily:"system-ui",textDecoration:"none"}}>
                  {l.label.includes("Lecture")?"▶":"↗"} {l.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
      <div style={{display:"flex",gap:10}}>
        {ruleIdx<topic.rules.length-1
          ? <Btn label={`Next Rule →`} onClick={()=>setRuleIdx(ruleIdx+1)} color={topic.color}/>
          : <Btn label="I'm ready — Apply →" onClick={onComplete} color="#1d1d1f"/>}
        {ruleIdx>0&&<Btn label="← Back" onClick={()=>setRuleIdx(ruleIdx-1)} variant="outline" color="#86868b"/>}
      </div>
    </div>
  );
}

// ─── APPLY QUESTION ───────────────────────────────────────────────────────────
function ApplyQuestion({topic,qIdx,onComplete}){
  const q=topic.staticQ[qIdx];
  const [answer,setAnswer]=useState(null);
  const [pairs,setPairs]=useState({});
  const [submitted,setSubmitted]=useState(false);
  const [isCorrect,setIsCorrect]=useState(false);

  const handleSubmit=()=>{
    let ok=false;
    if(q.type==="matching") ok=Object.keys(q.correctPairs).every(k=>pairs[k]===q.correctPairs[k]);
    else ok=answer===q.correct;
    setIsCorrect(ok);setSubmitted(true);
  };

  const canSubmit=q.type==="matching"?Object.keys(pairs).length===(q.items?.length||0):!!answer;
  const ac=topic.color;
  const typeLabels={mcq:"Multiple Choice",fillblank:"Fill in the Blank",oddoneout:"Odd One Out",matching:"Match the Description"};

  return(
    <div style={{maxWidth:720}}>
      <div className="fu" style={{background:"white",borderRadius:16,padding:"18px 24px",marginBottom:14,boxShadow:"0 1px 8px rgba(0,0,0,0.06)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontSize:10,fontWeight:700,color:ac,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:3,fontFamily:"system-ui"}}>{typeLabels[q.type]}</div>
          <div style={{fontSize:17,fontWeight:400,fontFamily:"'Playfair Display',serif",color:"#1d1d1f"}}>{topic.title}</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:12,color:"#86868b",fontFamily:"system-ui",marginBottom:6}}>Question {qIdx+1} of 4</div>
          <div style={{display:"flex",gap:4,justifyContent:"flex-end"}}>
            {[0,1,2,3].map(i=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:i<qIdx?"#34c759":i===qIdx?ac:"#e8e8ed",transition:"all 0.3s"}}/>)}
          </div>
        </div>
      </div>

      <div className="fu" style={{background:"white",borderRadius:16,padding:"24px 28px",boxShadow:"0 1px 8px rgba(0,0,0,0.06)"}}>
        {q.scenario&&(
          <div style={{background:"#f5f5f7",borderRadius:10,padding:"16px 18px",marginBottom:16}}>
            <div style={{fontSize:10,fontWeight:700,color:"#86868b",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8,fontFamily:"system-ui"}}>Scenario</div>
            <p style={{fontSize:14,color:"#3a3a3c",lineHeight:1.85,fontFamily:"'Source Serif 4',Georgia,serif"}}>{q.scenario}</p>
          </div>
        )}
        <p style={{fontSize:14,color:"#1d1d1f",fontFamily:"'Source Serif 4',Georgia,serif",marginBottom:18,lineHeight:1.7,fontStyle:"italic"}}>
          {q.question||q.sentence?.replace("___","______")||q.instruction}
        </p>

        {["mcq","fillblank","oddoneout"].includes(q.type)&&q.options?.map(opt=>{
          const sel=answer===opt.label,right=submitted&&opt.label===q.correct,wrong=submitted&&sel&&!right;
          return(
            <button key={opt.label} onClick={()=>!submitted&&setAnswer(opt.label)}
              style={{display:"flex",alignItems:"flex-start",gap:12,width:"100%",textAlign:"left",padding:"12px 16px",marginBottom:8,borderRadius:10,border:`1.5px solid ${right?"#34c759":wrong?"#ff3b30":sel?ac:"#e0e0e5"}`,background:right?"#f0fff4":wrong?"#fff0f0":sel?ac+"0d":"white",cursor:submitted?"default":"pointer",transition:"all 0.18s",fontFamily:"system-ui"}}>
              <span style={{minWidth:22,height:22,borderRadius:"50%",background:right?"#34c759":wrong?"#ff3b30":sel?ac:"#f0f0f5",color:(right||wrong||sel)?"white":"#86868b",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0}}>{opt.label}</span>
              <span style={{fontSize:13,color:"#1d1d1f",lineHeight:1.65}}>{opt.text}</span>
            </button>
          );
        })}

        {q.type==="matching"&&q.items&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <div>
              <div style={{fontSize:10,fontWeight:700,color:"#86868b",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8,fontFamily:"system-ui"}}>Cases / Rules</div>
              {q.items.map(it=><div key={it.id} style={{padding:"10px 14px",background:"#f5f5f7",borderRadius:8,marginBottom:8,fontSize:12,color:"#1d1d1f",fontFamily:"system-ui",lineHeight:1.4}}><span style={{fontWeight:700,color:ac,marginRight:6}}>{it.id}.</span>{it.label}</div>)}
            </div>
            <div>
              <div style={{fontSize:10,fontWeight:700,color:"#86868b",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8,fontFamily:"system-ui"}}>Match to each</div>
              {q.items.map(it=>{
                const sel=pairs[it.id],corr=submitted?q.correctPairs[it.id]:null,ok=submitted&&sel===corr,bad=submitted&&sel!==corr;
                return(
                  <select key={it.id} disabled={submitted} value={sel||""} onChange={e=>setPairs(p=>({...p,[it.id]:e.target.value}))}
                    style={{display:"block",width:"100%",padding:"10px 12px",marginBottom:8,borderRadius:8,border:`1.5px solid ${ok?"#34c759":bad?"#ff3b30":"#e0e0e5"}`,background:ok?"#f0fff4":bad?"#fff0f0":"white",fontSize:12,color:"#1d1d1f",fontFamily:"system-ui"}}>
                    <option value="">— select —</option>
                    {q.descriptions.map(d=><option key={d.id} value={d.id}>{d.id}: {d.text.slice(0,44)}{d.text.length>44?"…":""}</option>)}
                  </select>
                );
              })}
            </div>
          </div>
        )}

        {submitted&&(
          <div style={{marginTop:16,padding:"14px 18px",background:isCorrect?"#f0fff4":"#fff8f0",border:`1px solid ${isCorrect?"#c0f0c0":"#ffd0a0"}`,borderRadius:10}}>
            <div style={{fontSize:13,fontWeight:600,color:isCorrect?"#1a7a2a":"#b05000",fontFamily:"system-ui",marginBottom:5}}>{isCorrect?"✓ Correct":"✗ Not quite"}</div>
            <p style={{fontSize:13,color:"#3a3a3c",lineHeight:1.7,fontFamily:"'Source Serif 4',Georgia,serif"}}>{q.explanation}</p>
          </div>
        )}

        <div style={{marginTop:20,display:"flex",gap:10}}>
          {!submitted
            ? <Btn label="Submit Answer" onClick={handleSubmit} color="#1d1d1f" disabled={!canSubmit}/>
            : <Btn label={qIdx<3?"Next Question →":"Go to Review →"} onClick={()=>onComplete(isCorrect)} color={ac}/>}
        </div>
      </div>
    </div>
  );
}

// ─── REVIEW PHASE ─────────────────────────────────────────────────────────────
function ReviewPhase({topic,score,onNext,isLast}){
  const [exp,setExp]=useState(null);
  return(
    <div style={{maxWidth:720}}>
      <div className="fu" style={{background:"white",borderRadius:16,padding:"20px 26px",marginBottom:14,boxShadow:"0 1px 8px rgba(0,0,0,0.06)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <h2 style={{fontSize:20,fontWeight:400,fontFamily:"'Playfair Display',serif",color:"#1d1d1f",marginBottom:4}}>Review — {topic.title}</h2>
          <p style={{fontSize:12,color:"#86868b",fontFamily:"system-ui"}}>{score===4?"Full marks. Consolidate.":score>=2?"Revisit where your reasoning diverged.":"Re-read carefully before your next session."}</p>
        </div>
        <div style={{textAlign:"center",padding:"10px 16px",background:score>=3?"#f0fff4":score>=2?"#fff8e6":"#fff0f0",borderRadius:12,border:`1px solid ${score>=3?"#c0f0c0":score>=2?"#ffd090":"#ffc0c0"}`}}>
          <div style={{fontSize:26,fontWeight:300,color:score>=3?"#1a7a2a":score>=2?"#a06000":"#cc0000",fontFamily:"'Playfair Display',serif"}}>{score}<span style={{fontSize:14}}>/4</span></div>
          <div style={{fontSize:10,color:"#86868b",fontFamily:"system-ui",marginTop:1}}>correct</div>
        </div>
      </div>

      {topic.rules.map((rule,i)=>(
        <div key={i} className="fu" onClick={()=>setExp(exp===i?null:i)} style={{background:"white",borderRadius:14,padding:"14px 20px",marginBottom:10,boxShadow:"0 1px 6px rgba(0,0,0,0.05)",cursor:"pointer",transition:"all 0.2s"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontSize:13,fontWeight:600,color:"#1d1d1f",fontFamily:"system-ui"}}>{rule.icon} {rule.heading}</div>
            <span style={{fontSize:11,color:"#86868b",fontFamily:"system-ui"}}>{exp===i?"▲":"▼"}</span>
          </div>
          {exp===i&&(
            <div style={{marginTop:12,paddingTop:12,borderTop:"1px solid #f5f5f7"}}>
              <div style={{background:topic.color+"0d",borderLeft:`3px solid ${topic.color}`,padding:"10px 14px",borderRadius:"0 8px 8px 0",marginBottom:12}}>
                <p style={{fontSize:13,color:"#1d1d1f",lineHeight:1.75,fontFamily:"'Source Serif 4',Georgia,serif"}}>{rule.keyRule}</p>
              </div>
              {rule.body.split("\n\n").map((p,j)=><p key={j} style={{fontSize:13,color:"#3a3a3c",lineHeight:1.85,fontFamily:"'Source Serif 4',Georgia,serif",marginBottom:10}}>{p}</p>)}
              <div style={{marginTop:10}}>
                {rule.caseKeys.map((k,j)=><CaseCard key={j} caseKey={k} color={topic.color}/>)}
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="fu" style={{background:"white",borderRadius:14,padding:"20px 24px",marginBottom:20,boxShadow:"0 1px 6px rgba(0,0,0,0.05)"}}>
        <div style={{fontSize:10,fontWeight:700,color:"#ff9500",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:12,fontFamily:"system-ui"}}>✦ Exam Technique</div>
        {topic.examTips.map((tip,i)=>(
          <div key={i} style={{display:"flex",gap:12,marginBottom:12}}>
            <div style={{minWidth:22,height:22,borderRadius:"50%",background:"#fff8e6",color:"#ff9500",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0,fontFamily:"system-ui"}}>{i+1}</div>
            <p style={{fontSize:13,color:"#3a3a3c",lineHeight:1.75,fontFamily:"'Source Serif 4',Georgia,serif"}}>{tip}</p>
          </div>
        ))}
      </div>

      <Btn label={isLast?"Complete Session →":"Next Topic →"} onClick={onNext} color="#1d1d1f"/>
    </div>
  );
}

// ─── STUDY MODULE ─────────────────────────────────────────────────────────────
function StudyModule({onBack}){
  const [tIdx,setTIdx]=useState(0);
  const [phase,setPhase]=useState("learn"); // learn | framework | apply | review
  const [qIdx,setQIdx]=useState(0);
  const [tScore,setTScore]=useState(0);
  const [scores,setScores]=useState(new Array(TOPICS.length).fill(null));
  const [done,setDone]=useState(false);
  const topic=TOPICS[tIdx];

  const goTopic=(i,p="learn")=>{setTIdx(i);setPhase(p);setQIdx(0);setTScore(0);};

  const handleApplyComplete=(ok)=>{
    const ns=tScore+(ok?1:0);
    setTScore(ns);
    if(qIdx<3){setQIdx(qIdx+1);}
    else{const sc=[...scores];sc[tIdx]=ns;setScores(sc);setPhase("review");}
  };

  const handleNext=()=>{
    if(tIdx<TOPICS.length-1) goTopic(tIdx+1);
    else setDone(true);
  };

  if(done){
    const total=scores.reduce((a,s)=>a+(s||0),0);
    return(
      <div style={{minHeight:"100vh",background:"#f5f5f7",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
        <style>{G}</style>
        <div style={{background:"white",borderRadius:20,padding:"38px 42px",maxWidth:500,textAlign:"center",boxShadow:"0 4px 32px rgba(0,0,0,0.08)"}}>
          <div style={{fontSize:44,marginBottom:8}}>⚖️</div>
          <h2 style={{fontSize:26,fontWeight:400,fontFamily:"'Playfair Display',serif",color:"#1d1d1f",marginBottom:4}}>Session Complete</h2>
          <div style={{fontSize:44,fontWeight:300,color:"#0071e3",fontFamily:"'Playfair Display',serif",margin:"14px 0 4px"}}>{total}<span style={{fontSize:20,color:"#86868b"}}>/{TOPICS.length*4}</span></div>
          <p style={{fontSize:13,color:"#86868b",marginBottom:22,fontFamily:"system-ui"}}>{total>=TOPICS.length*3?"Strong session.":total>=TOPICS.length*2?"Good — revisit weaker areas.":"Focus on the topics where you struggled."}</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center",marginBottom:24}}>
            {TOPICS.map((t,i)=>{const s=scores[i];const c=s===null?null:s>=3?"#34c759":s>=2?"#ff9500":"#ff3b30";return(
              <div key={i} style={{padding:"5px 14px",background:c?c+"15":"#f0f0f5",border:`1px solid ${c?c+"40":"#e0e0e5"}`,borderRadius:20,fontSize:11,color:c||"#86868b",fontFamily:"system-ui"}}>{t.title}{s!==null?` ${s}/4`:""}</div>
            );})}
          </div>
          <div style={{display:"flex",gap:10,justifyContent:"center"}}>
            <Btn label="Return to FLK2" onClick={onBack} variant="outline" color="#0071e3"/>
            <Btn label="Restart" onClick={()=>{setTIdx(0);setPhase("learn");setQIdx(0);setTScore(0);setScores(new Array(TOPICS.length).fill(null));setDone(false);}} color="#1d1d1f"/>
          </div>
        </div>
      </div>
    );
  }

  const PHASES=["learn","framework","apply","review"];
  const PHASE_LABELS={learn:"Learn",framework:"Apply",apply:"Apply",review:"Review"};
  const phaseDisplay=phase==="framework"?"apply":phase;

  return(
    <div style={{minHeight:"100vh",background:"#f5f5f7"}}>
      <style>{G}</style>
      <div style={{background:"rgba(255,255,255,0.92)",backdropFilter:"blur(20px)",borderBottom:"1px solid #e0e0e5",padding:"0 22px",height:50,display:"flex",alignItems:"center",gap:16,position:"sticky",top:0,zIndex:100}}>
        <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",color:"#0071e3",fontSize:12,fontFamily:"system-ui",fontWeight:600,padding:"4px 0"}}>← FLK2</button>
        <span style={{color:"#e0e0e5"}}>|</span>
        <span style={{fontSize:13,color:"#1d1d1f",fontFamily:"'Playfair Display',serif"}}>Equity & Trusts</span>
        <div style={{display:"flex",gap:22,marginLeft:"auto"}}>
          {["learn","apply","review"].map((p)=>{
            const active=phaseDisplay===p;
            const past=PHASES.indexOf(phaseDisplay)>PHASES.indexOf(p==="apply"?"framework":p);
            return(
              <button key={p} onClick={()=>{
                if(p==="learn") setPhase("learn");
                else if(p==="apply"&&(phase==="apply"||phase==="framework")) return;
                else if(p==="apply") {setPhase("framework");setQIdx(0);setTScore(0);}
                else if(p==="review"&&phase==="review") return;
              }} style={{background:"none",border:"none",borderBottom:`2px solid ${active?topic.color:"transparent"}`,fontSize:12,fontFamily:"system-ui",fontWeight:active?600:400,color:active?topic.color:"#86868b",cursor:"pointer",padding:"4px 0",transition:"all 0.2s",textTransform:"capitalize"}}>
                {p.charAt(0).toUpperCase()+p.slice(1)}
              </button>
            );
          })}
        </div>
        <div style={{display:"flex",gap:5,marginLeft:16}}>
          {scores.map((s,i)=><div key={i} title={TOPICS[i].title} style={{width:7,height:7,borderRadius:"50%",background:s===null?(i===tIdx?topic.color+"60":"#e8e8ed"):s>=3?"#34c759":s>=2?"#ff9500":"#ff3b30",transition:"all 0.3s"}}/>)}
        </div>
      </div>

      <div style={{background:"white",borderBottom:"1px solid #e0e0e5",padding:"0 22px",display:"flex",gap:2,overflowX:"auto"}}>
        {TOPICS.map((t,i)=>(
          <button key={i} onClick={()=>goTopic(i)} style={{padding:"9px 12px",background:"none",border:"none",borderBottom:`2px solid ${i===tIdx?t.color:"transparent"}`,fontSize:11,color:i===tIdx?t.color:"#86868b",cursor:"pointer",whiteSpace:"nowrap",fontFamily:"system-ui",fontWeight:i===tIdx?600:400,transition:"all 0.2s",display:"flex",alignItems:"center",gap:5}}>
            {scores[i]!==null&&<span style={{color:scores[i]>=3?"#34c759":"#ff9500",fontSize:10}}>{scores[i]>=3?"✓":"○"}</span>}
            {t.title}
          </button>
        ))}
      </div>

      {/* Apply phase indicator */}
      {(phase==="framework"||phase==="apply")&&(
        <div style={{background:"white",borderBottom:"1px solid #f0f0f5",padding:"10px 22px",display:"flex",gap:12,alignItems:"center"}}>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            <div style={{width:20,height:20,borderRadius:"50%",background:phase==="framework"?topic.color:topic.color+"40",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontSize:10,color:"white",fontWeight:700}}>1</span>
            </div>
            <span style={{fontSize:11,fontFamily:"system-ui",color:phase==="framework"?topic.color:"#86868b",fontWeight:phase==="framework"?600:400}}>Application Method</span>
          </div>
          <div style={{width:24,height:1,background:"#e0e0e5"}}/>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            <div style={{width:20,height:20,borderRadius:"50%",background:phase==="apply"?topic.color:"#e8e8ed",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontSize:10,color:phase==="apply"?"white":"#86868b",fontWeight:700}}>2</span>
            </div>
            <span style={{fontSize:11,fontFamily:"system-ui",color:phase==="apply"?topic.color:"#86868b",fontWeight:phase==="apply"?600:400}}>Practice Questions ({qIdx}/4)</span>
          </div>
        </div>
      )}

      <div style={{maxWidth:800,margin:"0 auto",padding:"24px 18px"}}>
        {phase==="learn"&&<LearnPhase key={tIdx} topic={topic} onComplete={()=>setPhase("framework")}/>}
        {phase==="framework"&&<AppFramework key={tIdx+"fw"} frameworkKey={topic.frameworkKey} color={topic.color} onDone={()=>setPhase("apply")}/>}
        {phase==="apply"&&<ApplyQuestion key={`${tIdx}-${qIdx}`} topic={topic} qIdx={qIdx} onComplete={handleApplyComplete}/>}
        {phase==="review"&&<ReviewPhase key={tIdx+"r"} topic={topic} score={tScore} onNext={handleNext} isLast={tIdx===TOPICS.length-1}/>}
      </div>
    </div>
  );
}

// ─── HUB ─────────────────────────────────────────────────────────────────────
function HubPage({onSelect}){
  return(
    <div style={{minHeight:"100vh",background:"#f5f5f7"}}>
      <style>{G}</style>
      <div style={{background:"#fff",borderBottom:"1px solid #e0e0e5",padding:"44px 0 36px"}}>
        <div style={{maxWidth:880,margin:"0 auto",padding:"0 28px"}}>
          <div className="fu" style={{fontSize:11,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:"#0071e3",marginBottom:10,fontFamily:"system-ui"}}>SQE1 · FLK2</div>
          <h1 className="fu s1" style={{fontSize:38,fontWeight:400,color:"#1d1d1f",fontFamily:"'Playfair Display',Georgia,serif",lineHeight:1.2,marginBottom:10}}>Foundations of Legal Knowledge 2</h1>
          <p className="fu s2" style={{fontSize:15,color:"#6e6e73",lineHeight:1.65,maxWidth:540,fontFamily:"system-ui"}}>Six subject areas. Each module follows the same three-phase cycle: learn the doctrine, apply it to problems using a structured method, then review and consolidate.</p>
          <div className="fu s3" style={{display:"flex",gap:24,marginTop:22,flexWrap:"wrap"}}>
            {[["Learn","Rules, cases and their stories"],["Apply","Step-by-step application method + practice questions"],["Review","Doctrine recap + exam technique"]].map(([v,l],i)=>(
              <div key={i} style={{display:"flex",flexDirection:"column",gap:2}}>
                <span style={{fontSize:13,fontWeight:600,color:"#1d1d1f",fontFamily:"system-ui"}}>{v}</span>
                <span style={{fontSize:11,color:"#86868b",fontFamily:"system-ui"}}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{maxWidth:880,margin:"0 auto",padding:"32px 28px"}}>
        <div className="fu s2" style={{fontSize:10,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:"#86868b",marginBottom:18,fontFamily:"system-ui"}}>Subjects</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(255px,1fr))",gap:14}}>
          {FLK2_SUBJECTS.map((s,i)=>(
            <div key={s.id} className={`fu s${i+1}`} onClick={s.live?()=>onSelect(s.id):undefined}
              style={{background:"white",borderRadius:16,padding:"22px",boxShadow:"0 1px 6px rgba(0,0,0,0.06)",cursor:s.live?"pointer":"default",transition:"all 0.2s",position:"relative",overflow:"hidden"}}
              onMouseEnter={e=>{if(s.live){e.currentTarget.style.boxShadow="0 8px 28px rgba(0,0,0,0.10)";e.currentTarget.style.transform="translateY(-2px)";}}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 1px 6px rgba(0,0,0,0.06)";e.currentTarget.style.transform="none";}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:s.live?s.color:"#e0e0e5",borderRadius:"16px 16px 0 0"}}/>
              <div style={{fontSize:26,marginBottom:10,marginTop:4}}>{s.icon}</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5}}>
                <h3 style={{fontSize:14,fontWeight:600,color:s.live?"#1d1d1f":"#86868b",lineHeight:1.3,fontFamily:"system-ui"}}>{s.title}</h3>
                <span style={{fontSize:10,background:s.live?s.color+"15":"#f0f0f5",color:s.live?s.color:"#aeaeb2",padding:"3px 8px",borderRadius:20,fontWeight:600,flexShrink:0,marginLeft:8,fontFamily:"system-ui"}}>{s.live?"Live":"Soon"}</span>
              </div>
              <p style={{fontSize:12,color:s.live?"#6e6e73":"#aeaeb2",lineHeight:1.6,marginBottom:12,fontFamily:"system-ui"}}>{s.desc}</p>
              <div style={{display:"flex",gap:12,alignItems:"center"}}>
                <span style={{fontSize:11,color:"#aeaeb2",fontFamily:"system-ui"}}>{s.topics} topics</span>
                {s.live&&<span style={{fontSize:11,color:s.color,fontWeight:600,fontFamily:"system-ui"}}>Start →</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App(){
  const [view,setView]=useState("hub");
  const [subject,setSubject]=useState(null);
  if(view==="hub") return <HubPage onSelect={(id)=>{setSubject(id);setView("study");}}/>;
  if(view==="study"&&subject==="trusts") return <StudyModule onBack={()=>{setView("hub");setSubject(null);}}/>;
  return <HubPage onSelect={(id)=>{setSubject(id);setView("study");}}/>;
}
