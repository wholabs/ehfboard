const STORAGE_PREFIX = "ehf-board";

export function projectStorageKey(projectId) {
  return `${STORAGE_PREFIX}:${projectId}`;
}

export function saveProjectToStorage(projectId, projectData) {
  const key = projectStorageKey(projectId);
  const payload = {
    ...projectData,
    updatedAt: Date.now(),
  };
  localStorage.setItem(key, JSON.stringify(payload));
}

export function loadProjectFromStorage(projectId) {
  const key = projectStorageKey(projectId);
  const raw = localStorage.getItem(key);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error("Failed to parse saved project", error);
    return null;
  }
}

export function exportProjectAsJson(projectData) {
  const blob = new Blob([JSON.stringify(projectData, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${projectData.projectId || "ehf-board-project"}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function parseImportedProject(rawJson) {
  const parsed = JSON.parse(rawJson);

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid JSON object");
  }

  const hasIntegratedShape =
    Array.isArray(parsed.flowNodes) ||
    Array.isArray(parsed.flowEdges) ||
    Array.isArray(parsed.erdNodes) ||
    Array.isArray(parsed.erdEdges);

  if (!hasIntegratedShape) {
    throw new Error(
      "Imported file must include flowNodes/flowEdges or erdNodes/erdEdges arrays",
    );
  }

  return parsed;
}
