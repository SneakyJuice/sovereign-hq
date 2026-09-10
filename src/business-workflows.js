// Illustrative workflows: source records and human review remain explicit.
export const businessWorkflows = {
  accounting: {
    title: 'Your books,\nwithout the paper chase.',
    description: 'Bring invoices, receipts and transaction records together so your bookkeeper spends less time hunting for documents and more time checking the numbers.',
    before: 'Receipts in inboxes. Transactions in exports. Missing paperwork at month-end.',
    after: 'An organized bookkeeping pack with source records and questions clearly marked.',
    app: 'YOUR BOOKKEEPING HANDOFF',
    steps: [
      ['Records gathered','Collect the supporting paperwork','Bring records from your agreed accounting tools and document folders into the same workflow.','MONTH-END INPUTS','Less hunting.\nA clearer starting point.','Invoices, receipts and transaction records collected for the period.','Records gathered'],
      ['Matches suggested','Connect documents to entries','Suggest receipt-to-transaction matches and flag potential duplicates for checking.','SUGGESTED MATCHES','The receipt meets\nthe right record.','Supporting documents linked to possible matching transactions, with uncertain matches flagged.','Matches prepared'],
      ['Gaps flagged','Know what still needs a check','List missing receipts, unmatched entries and questions for your bookkeeper.','REVIEW CHECKLIST','Find the gaps\nbefore the handoff.','Missing paperwork and unmatched records collected into a clear action list.','Questions organized'],
      ['Pack prepared','Give your bookkeeper a head start','Prepare the records and questions for review before anyone changes the books.','BOOKKEEPING PACK','Less gathering.\nMore time to get it right.','Linked source records, suggested matches and outstanding questions ready for your bookkeeper.','Ready for your review']
    ]
  },
  reporting: {
    title: 'Sales. Revenue.\nOne clearer picture.',
    description: 'Bring sales activity, invoiced revenue and payment updates into a readable report. See what is moving, what is still outstanding and where your team needs to follow up.',
    before: 'CRM exports. Accounting tabs. Spreadsheets that need rebuilding before every meeting.',
    after: 'A draft business update with linked sources, clear periods and missing figures flagged.',
    app: 'YOUR SALES & REVENUE UPDATE',
    steps: [
      ['Numbers gathered','Bring your sources together','Gather agreed sales and accounting figures for the same reporting period, with links to the source records.','BUSINESS INPUTS','Your numbers,\nin one place.','Sales activity, invoice totals and payment status gathered from your connected tools.','Sources gathered'],
      ['Measures separated','Keep the numbers meaningful','Show sales pipeline, invoiced revenue and payments received separately using your agreed definitions.','DRAFT REPORT','See the difference\nbetween sold and paid.','Open opportunities, invoiced work and received payments shown as separate measures.','Report prepared'],
      ['Changes highlighted','See what needs attention','Highlight changes from the previous period and flag incomplete or out-of-date records.','NEEDS ATTENTION','Less digging.\nBetter questions.','Which deals need a follow-up? Which invoices remain unpaid? Which figures need checking?','Questions flagged'],
      ['Summary ready','Start the meeting informed','Review the figures and source links before sharing the report with your team.','WEEKLY BUSINESS REVIEW','Less report-building.\nMore time to act.','A readable sales and revenue update, with source links and a focused follow-up list.','Ready for your review']
    ]
  },
  prospecting: {
    title: 'Find the right prospects.\nGive sales a head start.',
    description: 'Build a lead-generation workflow around the customers you want to reach. Research potential businesses, organize useful context and prepare a focused list for your team.',
    before: 'Scattered research. Duplicate leads. Time spent chasing businesses that are not a fit.',
    after: 'A researched prospect shortlist with reasons for fit and clear next steps.',
    app: 'YOUR LEAD RESEARCH DESK',
    steps: [
      ['Audience defined','Start with the right customer','Use your target industry, location and business needs to guide the research.','CUSTOMER PROFILE','Who would\nyou like to help?', 'Example: local service businesses that could benefit from your offer.','Criteria organized'],
      ['Prospects researched','Gather useful business context','Find potential businesses using your approved research sources and retain source links.','PROSPECT RESEARCH','A better starting point\nthan a blank list.','Relevant business information gathered, with missing or uncertain details marked.','Research prepared'],
      ['List checked','Remove repeat work','Compare candidates with existing CRM records and flag possible duplicates or poor fits.','SHORTLIST CHECK','Keep the useful leads.\nSpot the repeats.','Potential matches and reasons for fit prepared for your sales team to check.','Shortlist prepared'],
      ['Next steps drafted','Make the first conversation relevant','Prepare a suggested approach for each shortlisted business. Your team decides who to contact and how.','SALES HANDOFF','Less list-building.\nMore useful conversations.','A prospect shortlist, source links and suggested talking points ready to review.','Ready for your review']
    ]
  },
  crm: {
    title: 'Keep your CRM current.\nKeep sales moving.',
    description: 'Turn enquiries, meeting notes and customer updates into organized CRM records and follow-up tasks, so the next conversation starts with the full picture.',
    before: 'Notes in inboxes. Deals with no next step. The same contact entered twice.',
    after: 'Suggested record updates, duplicate checks and follow-up tasks in one review queue.',
    app: 'YOUR CRM ASSISTANT',
    steps: [
      ['Update captured','Keep the conversation context','Collect the enquiry or meeting notes from the sources your team agrees to connect.','CUSTOMER UPDATE','The conversation\ndoes not end in an inbox.','Example: a prospect asks for a revised proposal after a sales call.','Update gathered'],
      ['Record matched','Find the right customer','Match the update to a contact or deal and flag uncertain matches or possible duplicates.','CRM RECORD','The right details.\nThe right place.','A possible contact and deal match prepared for checking.','Match suggested'],
      ['Next action prepared','Give the follow-up an owner','Draft the note, suggested deal update and next task with an owner and due date.','FOLLOW-UP TASK','No more\n“Who is handling this?”','Prepare the revised proposal. Suggested owner and follow-up date included.','Task prepared'],
      ['Updates ready','Check before changing records','Review the proposed changes before applying them under your agreed CRM rules.','CRM REVIEW QUEUE','Less data entry.\nFewer missed follow-ups.','Contact notes, proposed deal changes and next actions organized for your team.','Ready for your review']
    ]
  }
};
