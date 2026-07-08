import type { StudioSaveStatus } from "../types/common";

export interface StudioDraftState {
  markdown: string;
  saveStatus: StudioSaveStatus;
}

export function createDraftState(
  markdown = "",
  saveStatus: StudioSaveStatus = "idle",
): StudioDraftState {
  return { markdown, saveStatus };
}

export function updateDraftMarkdown(
  draftState: StudioDraftState,
  markdown: string,
): StudioDraftState {
  return { ...draftState, markdown, saveStatus: "idle" };
}

export function setDraftSaveStatus(
  draftState: StudioDraftState,
  saveStatus: StudioSaveStatus,
): StudioDraftState {
  return { ...draftState, saveStatus };
}

export function markDraftSaved(draftState: StudioDraftState): StudioDraftState {
  return { ...draftState, saveStatus: "saved" };
}
