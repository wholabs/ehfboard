import { v4 as uuidv4 } from "uuid";
import dagre from "dagre";
const NODE_WIDTH = 280;
const NODE_HEIGHT = 200;

export async function parseDBML(text) {
  const { Parser: DBMLParser } = await import("@dbml/core");
  const parser = new DBMLParser();
  const db = parser.parse(text, "dbmlv2");
  const n = db.normalize();

  const tables = Object.values(n.tables).map((t) => {
    const fieldIds = t.fieldIds || [];
    const fields = fieldIds.map((fid) => {
      const f = n.fields[fid];
      const typeRaw = f.type?.type_name || f.type?.name || "TEXT";
      const key = f.pk ? "PK" : f.unique ? "UNQ" : "";
      return { name: f.name, type: typeRaw, key };
    });

    return { tableName: t.name, fields };
  });

  const relationships = Object.values(n.refs || {}).map((r) => {
    const eps = (r.endpointIds || []).map((eid) => n.endpoints[eid]);
    if (eps.length < 2) return null;
    return {
      sourceTable: eps[0].tableName,
      sourceField: eps[0].fieldNames?.[0] || "id",
      targetTable: eps[1].tableName,
      targetField: eps[1].fieldNames?.[0] || "id",
    };
  }).filter(Boolean);

  return { tables, relationships };
}

export function parseSQL(text) {
  const tables = [];
  const relationships = [];
  const tableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:`?\w+`?\.)?`?(\w+)`?\s*\(([\s\S]*?)\);/gi;
  let match;

  while ((match = tableRegex.exec(text)) !== null) {
    const tableName = match[1];
    const body = match[2];
    const fields = [];
    let currentPK = null;

    const lines = body.split("\n").map((l) => l.trim()).filter(Boolean);

    for (const line of lines) {
      if (/^--/.test(line) || /^\/\*/.test(line)) continue;

      const constraintMatch = line.match(/^\s*CONSTRAINT\s+\S+\s+PRIMARY\s+KEY\s*\(([^)]+)\)/i);
      if (constraintMatch) {
        currentPK = constraintMatch[1].replace(/`/g, "").trim().split(/\s*,\s*/);
        continue;
      }

      const pkMatch = line.match(/^\s*PRIMARY\s+KEY\s*\(([^)]+)\)/i);
      if (pkMatch) {
        currentPK = pkMatch[1].replace(/`/g, "").trim().split(/\s*,\s*/);
        continue;
      }

      const colMatch = line.match(/^\s*`?(\w+)`?\s+(\w+(?:\s*\([^)]*\))?)(.*)$/i);
      if (!colMatch) continue;
      if (/^(primary|key|constraint|index|unique|foreign|check)/i.test(colMatch[1])) continue;

      const colName = colMatch[1];
      const colType = colMatch[2].replace(/\s*\(.*?\)/, (m) => m).trim();
      const rest = (colMatch[3] || "").toUpperCase();

      const isPK = rest.includes("PRIMARY KEY") || (currentPK && currentPK.includes(colName));
      const isUnique = rest.includes("UNIQUE");
      const isFK = rest.includes("REFERENCES");

      let key = "";
      if (isPK) key = "PK";
      else if (isFK) key = "FK";
      else if (isUnique) key = "UNQ";

      fields.push({ name: colName, type: colType.toUpperCase(), key });

      if (isFK) {
        const refMatch = rest.match(/REFERENCES\s+`?(\w+)`?\s*\(`?(\w+)`?\)/i);
        if (refMatch) {
          relationships.push({
            sourceTable: tableName,
            sourceField: colName,
            targetTable: refMatch[1],
            targetField: refMatch[2],
          });
        }
      }
    }

    tables.push({ tableName, fields });
  }

  return { tables, relationships };
}

export function generateNodes(tables) {
  return tables.map((t, i) => ({
    id: uuidv4(),
    type: "erdNode",
    position: { x: 100, y: 100 + i * 50 },
    data: {
      tableName: t.tableName,
      fields: t.fields,
    },
  }));
}

export function generateEdges(relationships, nodeMap) {
  return relationships.map((r) => {
    const source = nodeMap[r.sourceTable];
    const target = nodeMap[r.targetTable];
    if (!source || !target) return null;
    return {
      id: uuidv4(),
      source: source.id,
      target: target.id,
      label: `${r.sourceTable}.${r.sourceField} -> ${r.targetTable}.${r.targetField}`,
      markerEnd: { type: "arrowclosed" },
    };
  }).filter(Boolean);
}

export function runDagreLayout(nodes, edges) {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "LR", nodesep: 80, ranksep: 120, marginx: 50, marginy: 50 });

  nodes.forEach((n) => g.setNode(n.id, { width: NODE_WIDTH, height: NODE_HEIGHT }));
  edges.forEach((e) => g.setEdge(e.source, e.target));

  dagre.layout(g);

  return nodes.map((n) => {
    const pos = g.node(n.id);
    return {
      ...n,
      position: {
        x: pos.x - NODE_WIDTH / 2,
        y: pos.y - NODE_HEIGHT / 2,
      },
    };
  });
}

export function validateGenerated(tables, relationships, existingNodes) {
  const errors = [];
  const existingNames = new Set(existingNodes.map((n) => n.data.tableName.toLowerCase()));
  const seenNames = new Set();

  for (const t of tables) {
    const lower = t.tableName.toLowerCase();
    if (existingNames.has(lower)) {
      errors.push(`Table "${t.tableName}" already exists on canvas`);
    }
    if (seenNames.has(lower)) {
      errors.push(`Duplicate table "${t.tableName}" in generated code`);
    }
    seenNames.add(lower);
  }

  const relSet = new Set();
  for (const r of relationships) {
    const key = `${r.sourceTable}.${r.sourceField}>${r.targetTable}.${r.targetField}`;
    const revKey = `${r.targetTable}.${r.targetField}>${r.sourceTable}.${r.sourceField}`;
    if (relSet.has(key) || relSet.has(revKey)) {
      errors.push(`Duplicate relationship: ${r.sourceTable}.${r.sourceField} -> ${r.targetTable}.${r.targetField}`);
    }
    relSet.add(key);
  }

  return errors;
}

export async function generateFromCode(code, format, existingNodes) {
  const { tables, relationships } = format === "sql" ? parseSQL(code) : await parseDBML(code);

  const validationErrors = validateGenerated(tables, relationships, existingNodes);
  if (validationErrors.length > 0) {
    return { errors: validationErrors, nodes: [], edges: [] };
  }

  const nodes = generateNodes(tables);
  const nodeMap = {};
  nodes.forEach((n) => { nodeMap[n.data.tableName] = n; });

  const edges = generateEdges(relationships, nodeMap);
  const laidOutNodes = runDagreLayout(nodes, edges);

  return { errors: [], nodes: laidOutNodes, edges };
}
