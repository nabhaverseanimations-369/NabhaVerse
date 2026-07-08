import type { CharacterDocumentType } from "@/features/character/types/character.types";

export interface CharacterWorkspaceSection {
  id: CharacterDocumentType;
  label: string;
  description: string;
}

export const characterWorkspaceSections: readonly CharacterWorkspaceSection[] = [
  { id: "overview", label: "Overview", description: "Character dashboard and summary" },
  { id: "character-bible", label: "Character Bible", description: "Lore, motivations, and canon" },
  {
    id: "design-specifications",
    label: "Design Specifications",
    description: "Visual direction, proportions, and style notes",
  },
  {
    id: "ai-specifications",
    label: "AI Specifications",
    description: "Prompt strategy and generation constraints",
  },
  { id: "model-sheet", label: "Model Sheet", description: "Turnarounds and model standards" },
  {
    id: "expression-sheet",
    label: "Expression Sheet",
    description: "Facial expression references and emotional range",
  },
  { id: "pose-sheet", label: "Pose Sheet", description: "Pose language and silhouettes" },
  { id: "outfit-sheet", label: "Outfit Sheet", description: "Costume variants and rules" },
  { id: "lighting-sheet", label: "Lighting Sheet", description: "Lighting behavior and mood" },
  {
    id: "material-sheet",
    label: "Material Sheet",
    description: "Material response and rendering references",
  },
  {
    id: "environment-sheet",
    label: "Environment Sheet",
    description: "Character-environment interaction guidance",
  },
  {
    id: "animation-sheet",
    label: "Animation Sheet",
    description: "Motion language and animation constraints",
  },
  { id: "voice-sheet", label: "Voice Sheet", description: "Voice tone and speech profile" },
  { id: "sound-sheet", label: "Sound Sheet", description: "Audio motifs and sound palette" },
  {
    id: "ai-consistency-sheet",
    label: "AI Consistency Sheet",
    description: "Cross-shot consistency checklist",
  },
  {
    id: "relationships",
    label: "Relationships",
    description: "Character relationship mapping",
  },
  { id: "assets", label: "Assets", description: "Linked visual and reference assets" },
  {
    id: "documents",
    label: "Documents",
    description: "Supporting internal documents",
  },
  {
    id: "version-history",
    label: "Version History",
    description: "Milestones and revision snapshots",
  },
  { id: "comments", label: "Comments", description: "Review thread and feedback" },
  { id: "activity", label: "Activity", description: "Recent changes and events" },
] as const;

export const characterSectionIds = new Set(characterWorkspaceSections.map((section) => section.id));

export function isCharacterSection(value: string): value is CharacterDocumentType {
  return characterSectionIds.has(value as CharacterDocumentType);
}

export function getCharacterSection(id: CharacterDocumentType): CharacterWorkspaceSection {
  const section = characterWorkspaceSections.find((item) => item.id === id);
  if (!section) {
    throw new Error(`Unknown character section: ${id}`);
  }
  return section;
}
