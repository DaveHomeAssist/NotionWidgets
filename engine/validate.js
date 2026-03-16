/**
 * Graph Schema Validator — validates dataset.json against the canonical contract.
 * Returns { valid: boolean, errors: string[], warnings: string[] }
 *
 * Supported schema versions: [1]
 */
const SUPPORTED_VERSIONS = [1];

export function validateDataset(data) {
  const errors = [];
  const warnings = [];

  // --- Top-level shape ---
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Dataset must be a JSON object.'], warnings };
  }

  // --- Schema version ---
  if (data.version == null) {
    warnings.push('Dataset has no "version" field — assuming version 1. Add "version": 1 to suppress this warning.');
  } else if (!SUPPORTED_VERSIONS.includes(data.version)) {
    errors.push(`Unsupported schema version ${data.version}. Supported: ${SUPPORTED_VERSIONS.join(', ')}.`);
    return { valid: false, errors, warnings };
  }

  if (!Array.isArray(data.nodes)) errors.push('Missing or invalid "nodes" array.');
  if (!Array.isArray(data.edges)) errors.push('Missing or invalid "edges" array.');
  if (errors.length) return { valid: false, errors, warnings };

  // --- Meta (optional but encouraged) ---
  if (!data.meta?.id) warnings.push('Dataset has no meta.id — consider adding one for map selection.');

  // --- Nodes ---
  const nodeIds = new Set();
  data.nodes.forEach((n, i) => {
    const prefix = `nodes[${i}]`;
    if (!n.id || typeof n.id !== 'string') { errors.push(`${prefix}: missing or invalid "id".`); return; }
    if (nodeIds.has(n.id)) errors.push(`${prefix}: duplicate id "${n.id}".`);
    nodeIds.add(n.id);
    if (!n.label || typeof n.label !== 'string') errors.push(`${prefix} (${n.id}): missing or invalid "label".`);
    if (!n.type  || typeof n.type  !== 'string') warnings.push(`${prefix} (${n.id}): missing "type".`);
    if (!n.layer || typeof n.layer !== 'string') warnings.push(`${prefix} (${n.id}): missing "layer".`);
    if (n.meta && typeof n.meta !== 'object') errors.push(`${prefix} (${n.id}): "meta" must be an object if present.`);
  });

  // --- Edges ---
  const edgeKeys = new Set();
  data.edges.forEach((e, i) => {
    const prefix = `edges[${i}]`;
    if (!e.from || typeof e.from !== 'string') { errors.push(`${prefix}: missing or invalid "from".`); return; }
    if (!e.to   || typeof e.to   !== 'string') { errors.push(`${prefix}: missing or invalid "to".`); return; }
    if (!nodeIds.has(e.from)) errors.push(`${prefix}: "from" references unknown node "${e.from}".`);
    if (!nodeIds.has(e.to))   errors.push(`${prefix}: "to" references unknown node "${e.to}".`);
    if (e.from === e.to) warnings.push(`${prefix}: self-loop on "${e.from}".`);
    const key = `${e.from}→${e.to}`;
    if (edgeKeys.has(key)) warnings.push(`${prefix}: duplicate edge ${key}.`);
    edgeKeys.add(key);
    if (!e.type || typeof e.type !== 'string') warnings.push(`${prefix}: missing "type".`);
  });

  // --- Orphan check ---
  const connectedIds = new Set();
  data.edges.forEach(e => { connectedIds.add(e.from); connectedIds.add(e.to); });
  nodeIds.forEach(id => {
    if (!connectedIds.has(id)) warnings.push(`Node "${id}" has no edges (orphan).`);
  });

  return { valid: errors.length === 0, errors, warnings };
}
