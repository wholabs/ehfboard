import { Handle, Position } from "reactflow";
import { useState } from "react";

function ErdNode({ id, data, isConnectable }) {
  const [editingFieldIndex, setEditingFieldIndex] = useState(null);
  const [editingTableName, setEditingTableName] = useState(false);
  const [tempTableName, setTempTableName] = useState(data.tableName);
  const [tempField, setTempField] = useState(null);
  const [showFieldForm, setShowFieldForm] = useState(false);
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState("TEXT");
  const [width] = useState(data.width || 280);

  const fieldTypes = [
    "INTEGER",
    "TEXT",
    "BOOLEAN",
    "DECIMAL",
    "VARCHAR",
    "DATE",
    "DATETIME",
    "TIMESTAMP",
    "JSON",
  ];
  const keyTypes = ["", "PK", "FK", "UNQ"];

  const handleAddField = () => {
    data.onAddField?.(id, {
      name: newFieldName || "new_field",
      type: newFieldType,
      key: "",
    });
    setNewFieldName("");
    setNewFieldType("TEXT");
    setShowFieldForm(false);
  };

  const handleDeleteField = (fieldIndex) => {
    data.onDeleteField?.(id, fieldIndex);
  };

  const handleUpdateField = (fieldIndex) => {
    if (tempField) {
      data.onUpdateField?.(id, fieldIndex, tempField);
      setEditingFieldIndex(null);
      setTempField(null);
    }
  };

  return (
    <div
      className="overflow-hidden rounded-lg border-2 border-blue-500 shadow-lg bg-white relative dark:bg-slate-800 dark:border-blue-600"
      style={{ width: `${width}px` }}
    >
      {/* Header */}
      <div className="px-3 py-2 bg-blue-600 text-white font-bold text-sm flex items-center justify-between dark:bg-blue-700">
        <div
          onClick={() => setEditingTableName(true)}
          className="cursor-pointer hover:opacity-80"
        >
          {editingTableName ? (
            <input
              autoFocus
              className="bg-white/20 text-white px-2 py-1 rounded text-sm font-bold placeholder-white/50 outline-none"
              value={tempTableName}
              onChange={(e) => setTempTableName(e.target.value)}
              onBlur={() => {
                data.onTableNameChange?.(id, tempTableName);
                setEditingTableName(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  data.onTableNameChange?.(id, tempTableName);
                  setEditingTableName(false);
                }
              }}
            />
          ) : (
            `${data.tableName}`
          )}
        </div>
        <button
          onClick={() => data.onDuplicate?.(id)}
          className="text-xs bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded transition-colors ml-2"
        >
          Dup
        </button>
      </div>

      {/* Fields */}
      <div className="px-3 py-2">
        {data.fields?.length > 0 ? (
          data.fields.map((field, index) => (
            <div
              key={`${data.tableName}-${field.name}-${index}`}
              className="py-1.5 border-b border-gray-200 last:border-b-0 group hover:bg-blue-50 -mx-3 px-3 transition-colors flex items-center justify-between dark:border-slate-600 dark:hover:bg-slate-700"
            >
              {editingFieldIndex === index ? (
                <div className="w-full space-y-2 py-2">
                  <input
                    autoFocus
                    className="w-full border border-blue-300 rounded px-2 py-1 text-xs"
                    placeholder="Field name"
                    value={tempField?.name || ""}
                    onChange={(e) =>
                      setTempField({ ...tempField, name: e.target.value })
                    }
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      className="border border-blue-300 rounded px-2 py-1 text-xs"
                      value={tempField?.type || "TEXT"}
                      onChange={(e) =>
                        setTempField({ ...tempField, type: e.target.value })
                      }
                    >
                      {fieldTypes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <select
                      className="border border-blue-300 rounded px-2 py-1 text-xs"
                      value={tempField?.key || ""}
                      onChange={(e) =>
                        setTempField({ ...tempField, key: e.target.value })
                      }
                    >
                      {keyTypes.map((k) => (
                        <option key={k} value={k}>
                          {k || "-"}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateField(index)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded px-2 py-1 text-xs font-semibold"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingFieldIndex(null)}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded px-2 py-1 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1">
                    <span className="text-blue-700 font-semibold text-xs">
                      {field.key ? `[${field.key}]` : "  "}{" "}
                    </span>
                    <span className="text-gray-800 text-sm font-medium dark:text-slate-200">
                      {field.name}
                    </span>
                    <span className="text-gray-500 text-xs ml-1 dark:text-slate-400">
                      {field.type}
                    </span>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingFieldIndex(index);
                        setTempField(field);
                      }}
                      className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded px-1.5 py-0.5 text-xs font-bold"
                    >
                      E
                    </button>
                    <button
                      onClick={() => handleDeleteField(index)}
                      className="bg-red-100 hover:bg-red-200 text-red-700 rounded px-1.5 py-0.5 text-xs font-bold"
                    >
                      D
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
            <div className="text-center text-gray-400 text-xs py-3 dark:text-slate-500">
              No fields
            </div>
        )}

        {/* Add Field Form */}
        {showFieldForm && (
          <div className="mt-2 pt-2 border-t border-blue-300 space-y-2">
            <input
              autoFocus
              type="text"
              placeholder="Field name"
              className="w-full border border-blue-300 rounded px-2 py-1 text-xs"
              value={newFieldName}
              onChange={(e) => setNewFieldName(e.target.value)}
            />
            <select
              className="w-full border border-blue-300 rounded px-2 py-1 text-xs"
              value={newFieldType}
              onChange={(e) => setNewFieldType(e.target.value)}
            >
              {fieldTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                onClick={handleAddField}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded px-2 py-1 text-xs font-semibold"
              >
                Add
              </button>
              <button
                onClick={() => setShowFieldForm(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded px-2 py-1 text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Add Field Button */}
        {!showFieldForm && (
          <button
            onClick={() => setShowFieldForm(true)}
            className="mt-2 w-full bg-blue-50 hover:bg-blue-100 text-blue-700 rounded px-2 py-1 text-xs font-semibold border border-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-700 dark:hover:bg-blue-800/50"
          >
            + Add Field
          </button>
        )}
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default ErdNode;
