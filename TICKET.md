# PLATFORM-2964: Refactor canary release traffic splitter

**Status:** In Progress · **Priority:** Medium
**Sprint:** Sprint 29 · **Story Points:** 5
**Reporter:** Vikram Patel (Infra Lead) · **Assignee:** You (Intern)
**Due:** End of sprint (Friday)
**Labels:** `backend`, `javascript`, `deployment`, `canary`
**Task Type:** Code Maintenance

---

## Description

The canary traffic splitter works but has quality issues from the last review. Refactor marked items without changing external behavior.

## Acceptance Criteria

- [ ] Magic numbers/percentages extracted to named constants
- [ ] Error rate calculation simplified
- [ ] Redundant metric tracking removed
- [ ] All unit tests still pass
