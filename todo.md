TODO:
  Have visible UI preferably on the title of the html so when looking at the tabs bar you can tell which is the parent and which is the child or both
  when you close the parent tab the parent's child tab to closed with it
  if the parent's tab is closed and reopened with either history or with the reopen recently cloased tab funtion it should restore the child tabs together
  fix the error of when you click the auto corect hyperlink it will not open another tab but will reload the tab
  it will only open child tabs if the hyperlinks want to open those hyperlink or if the user specificaly opens them themselves if not it will do as what the hyperlinks would normally do which likely is to reload the page to its new hyperlink
  there would be a task section in the browser that can b collapesd or opened, and in that section that is on the right side of the browser will be a colume that displayes the tasks the user is on
  every task that the user is one is like a seperate browser as it cannot see the other task's tabs
  they can drag a tab that they want to move from one task to another by draging it into the tasks section and hoering above the task they want to drop it into by releasing it

the trail can be considered breadcrumb to others

closed breadcrumb example
  > {emoji} {Title_of_website}

Partial breadcrumb example
  ∨  {emoji} {Title_of_website}
    > {emoji} {Title_of_website}
    ∨  {emoji} {Title_of_website}
      ∨  {emoji} {Title_of_website}
          {emoji} {Title_of_website}
      > {emoji} {Title_of_website}
    ∨  {emoji} {Title_of_website}
      ∨  {emoji} {Title_of_website}
          {emoji} {Title_of_website}
    {emoji} {Title_of_website}

open breadcrumb example
  ∨  {emoji} {Title_of_website}
    ∨  {emoji} {Title_of_website}
        {emoji} {Title_of_website}
    ∨  {emoji} {Title_of_website}
      ∨  {emoji} {Title_of_website}
          {emoji} {Title_of_website}
      ∨  {emoji} {Title_of_website}
          {emoji} {Title_of_website}
    ∨  {emoji} {Title_of_website}
      ∨  {emoji} {Title_of_website}
          {emoji} {Title_of_website}
    {emoji} {Title_of_website}

---

Done (October 31, 2025):
  - Added left-side parent navigation arrow on title rows (non-root), hover-visible, acts like breadcrumbs.
  - Tree items are clickable; children are collapsible into their respective parent.
  - Closing a parent hides its children; children that have been moved/reparented are not affected by closing the original parent.
  - Breadcrumb-style affordance aligns with the examples above for both horizontal and vertical layouts.

Notes:
  - Zen Browser (Firefox-based) is supported via the Firefox temporary add-on flow. See README for steps and the Zen repo: https://github.com/zen-browser/desktop