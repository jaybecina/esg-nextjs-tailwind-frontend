export enum FORM_STATUS {
  in_progress = "in-progress",
  submitted = "submitted",
  error = "error",
  check_again = "check-again",
  completed = "completed"
}

export const FormStatusReference = {
  "in-progress": [
    "submitted"
  ],
  "submitted": [
    "completed",
    "error"
  ],
  "error": [
    "check-again"
  ],
  "check-again": [
    "completed",
    "error"
  ],
  "completed": []
}

export function getNextState(currentState: FORM_STATUS, isSubmission: boolean, allApproved: boolean): string {
  if (!isSubmission) return currentState;

  const nextOption = FormStatusReference[currentState];

  if (nextOption.length === 0) return currentState;
  if (nextOption.length === 1) return nextOption[0];

  if (allApproved) return nextOption.find(opt => opt.includes(FORM_STATUS.completed))
  return nextOption.find(opt => opt.includes(FORM_STATUS.error))
}

/**
 * Testing for next state, just for reference,
 * should just testing the edge case only
 */
// console.log(
//   getNextState(FORM_STATUS.in_progress, false, false),
//   getNextState(FORM_STATUS.in_progress, false, true),
//   getNextState(FORM_STATUS.in_progress, true, false),
//   getNextState(FORM_STATUS.in_progress, true, true),
//   getNextState(FORM_STATUS.submitted, false, false),
//   getNextState(FORM_STATUS.submitted, false, true),
//   getNextState(FORM_STATUS.submitted, true, false),
//   getNextState(FORM_STATUS.submitted, true, true),
//   getNextState(FORM_STATUS.error, false, false),
//   getNextState(FORM_STATUS.error, false, true),
//   getNextState(FORM_STATUS.error, true, false),
//   getNextState(FORM_STATUS.error, true, true),
//   getNextState(FORM_STATUS.check_again, false, false),
//   getNextState(FORM_STATUS.check_again, false, true),
//   getNextState(FORM_STATUS.check_again, true, false),
//   getNextState(FORM_STATUS.check_again, true, true),
//   getNextState(FORM_STATUS.completed, false, false),
//   getNextState(FORM_STATUS.completed, false, true),
//   getNextState(FORM_STATUS.completed, true, false),
//   getNextState(FORM_STATUS.completed, true, true),
// );