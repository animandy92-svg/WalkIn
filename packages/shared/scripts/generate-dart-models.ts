import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

type Schema = Record<string, any>;

const currentDir = dirname(fileURLToPath(import.meta.url));
const schemaPath = resolve(currentDir, '../schema/walkin.schema.json');
const outputPath = resolve(currentDir, '../../../apps/mobile/lib/core/api_models.dart');
const document = JSON.parse(readFileSync(schemaPath, 'utf8')) as { definitions: Record<string, Schema> };

const enums = new Map<string, string[]>();
const classes = new Map<string, Schema>();

const topLevel = new Set(Object.keys(document.definitions));

function resolveRef(ref: string): Schema {
  if (!ref.startsWith('#/')) throw new Error(`Unsupported ref: ${ref}`);
  let node: any = document;
  for (const part of ref.slice(2).split('/')) {
    node = node[part.replace(/~1/g, '/').replace(/~0/g, '~')];
    if (node === undefined) throw new Error(`Unresolved ref: ${ref}`);
  }
  return node as Schema;
}

function unwrap(schema: Schema): { schema: Schema; nullable: boolean } {
  let current = schema;
  let nullable = false;

  if (typeof current?.$ref === 'string' && /^#\/definitions\/[^/]+$/.test(current.$ref)) {
    return { schema: current, nullable };
  }

  while (current?.$ref || current?.anyOf) {
    if (current.$ref) {
      current = resolveRef(current.$ref);
      continue;
    }
    const options = current.anyOf as Schema[];
    const nonNull = options.filter((option) => option.type !== 'null');
    if (nonNull.length !== 1) break;
    if (options.some((option) => option.type === 'null')) nullable = true;
    current = nonNull[0];
  }

  if (Array.isArray(current?.type)) {
    const types = current.type as string[];
    if (types.includes('null')) nullable = true;
    const concrete = types.filter((type) => type !== 'null');
    current = { ...current, type: concrete.length === 1 ? concrete[0] : concrete };
  }

  return { schema: current, nullable };
}

interface TypeInfo {
  type: string;
  baseType: string;
  nullable: boolean;
  kind: 'primitive' | 'enum' | 'class' | 'list';
  item?: TypeInfo;
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function typeInfo(schema: Schema, nameHint: string, owner: string, optional: boolean): TypeInfo {
  const { schema: raw, nullable: schemaNullable } = unwrap(schema);
  const nullable = schemaNullable || optional;

  if (typeof raw.$ref === 'string') {
    const name = raw.$ref.slice('#/definitions/'.length);
    if (!topLevel.has(name)) throw new Error(`Unknown top-level ref: ${raw.$ref}`);
    return {
      type: nullable ? `${name}?` : name,
      baseType: name,
      nullable,
      kind: 'class',
    };
  }

  if (raw.enum && raw.type === 'string') {
    const name = `${owner}${capitalize(nameHint)}`;
    enums.set(name, raw.enum as string[]);
    return {
      type: nullable ? `${name}?` : name,
      baseType: name,
      nullable,
      kind: 'enum',
    };
  }

  switch (raw.type) {
    case 'string':
      return primitive('String', nullable);
    case 'integer':
      return primitive('int', nullable);
    case 'number':
      return primitive('num', nullable);
    case 'boolean':
      return primitive('bool', nullable);
    case 'array': {
      const item = typeInfo(raw.items ?? {}, `${nameHint}Item`, owner, false);
      const baseType = `List<${item.type}>`;
      return { type: nullable ? `${baseType}?` : baseType, baseType, nullable, kind: 'list', item };
    }
    case 'object': {
      const name = `${owner}${capitalize(nameHint)}`;
      classes.set(name, raw);
      return {
        type: nullable ? `${name}?` : name,
        baseType: name,
        nullable,
        kind: 'class',
      };
    }
    default:
      return primitive('dynamic', nullable);
  }
}

function primitive(baseType: string, nullable: boolean): TypeInfo {
  return { type: nullable ? `${baseType}?` : baseType, baseType, nullable, kind: 'primitive' };
}

function fromJsonExpression(key: string, info: TypeInfo): string {
  const raw = `json['${key}']`;
  switch (info.kind) {
    case 'primitive':
      return `${raw} as ${info.type}`;
    case 'enum':
      return info.nullable
        ? `${raw} == null ? null : ${info.baseType}.fromJson(${raw} as String)`
        : `${info.baseType}.fromJson(${raw} as String)`;
    case 'class':
      return info.nullable
        ? `${raw} == null ? null : ${info.baseType}.fromJson(${raw} as Map<String, dynamic>)`
        : `${info.baseType}.fromJson(${raw} as Map<String, dynamic>)`;
    case 'list': {
      const itemExpr = info.item!.kind === 'primitive'
        ? `e as ${info.item!.type}`
        : info.item!.kind === 'enum'
          ? `${info.item!.baseType}.fromJson(e as String)`
          : `${info.item!.baseType}.fromJson(e as Map<String, dynamic>)`;
      const map = `(${raw} as List<dynamic>${info.nullable ? '?' : ''})?.map((e) => ${itemExpr}).toList()`;
      return info.nullable ? map : `(${raw} as List<dynamic>).map((e) => ${itemExpr}).toList()`;
    }
  }
}

function toJsonExpression(name: string, info: TypeInfo): string {
  switch (info.kind) {
    case 'primitive':
      return name;
    case 'enum':
      return `${name}${info.nullable ? '?' : ''}.value`;
    case 'class':
      return `${name}${info.nullable ? '?' : ''}.toJson()`;
    case 'list': {
      const item = info.item!;
      const convert = item.kind === 'primitive'
        ? 'e'
        : item.kind === 'enum'
          ? 'e.value'
          : 'e.toJson()';
      return `${name}${info.nullable ? '?' : ''}.map((e) => ${convert}).toList()`;
    }
  }
}

function renderClass(name: string, schema: Schema): string {
  const properties = (schema.properties ?? {}) as Record<string, Schema>;
  const required = new Set<string>((schema.required ?? []) as string[]);
  const fields: TypeInfo[] = Object.entries(properties).map(([key, value]) =>
    typeInfo(value, key, name, !required.has(key)));

  const lines: string[] = [];
  lines.push(`class ${name} {`);
  for (const [index, [key]] of Object.entries(properties).entries()) {
    const info = fields[index];
    lines.push(`  final ${info.type} ${key};`);
  }
  lines.push('');
  lines.push(`  ${name}({`);
  for (const [index, [key]] of Object.entries(properties).entries()) {
    const info = fields[index];
    lines.push(`    ${info.nullable ? '' : 'required '}this.${key},`);
  }
  lines.push('  });');
  lines.push('');
  lines.push(`  factory ${name}.fromJson(Map<String, dynamic> json) {`);
  lines.push(`    return ${name}(`);
  for (const [index, [key]] of Object.entries(properties).entries()) {
    lines.push(`      ${key}: ${fromJsonExpression(key, fields[index])},`);
  }
  lines.push('    );');
  lines.push('  }');
  lines.push('');
  lines.push('  Map<String, dynamic> toJson() => {');
  for (const [index, [key]] of Object.entries(properties).entries()) {
    lines.push(`    '${key}': ${toJsonExpression(key, fields[index])},`);
  }
  lines.push('  };');
  lines.push('}');
  return lines.join('\n');
}

function renderEnum(name: string, values: string[]): string {
  const members = values.map((value) => `  ${value}('${value}')`).join(',\n');
  return [
    `enum ${name} {`,
    members + ';',
    '',
    '  final String value;',
    `  const ${name}(this.value);`,
    '',
    `  static ${name} fromJson(String value) =>`,
    `      ${name}.values.firstWhere((item) => item.value == value);`,
    '}',
  ].join('\n');
}

for (const [name, schema] of Object.entries(document.definitions)) {
  classes.set(name, schema);
}

// Rendering a class can register nested inline objects and enums, which in
// turn can register deeper objects. Render every newly discovered class until
// no unprocessed classes remain.
const rendered = new Set<string>();
while (true) {
  const pending = [...classes.entries()].filter(([name]) => !rendered.has(name));
  if (pending.length === 0) break;
  for (const [name, schema] of pending) {
    renderClass(name, schema);
    rendered.add(name);
  }
}

const header = [
  '// GENERATED FILE — do not edit by hand.',
  '// Run `npm run schema:generate` from the repository root.',
  '// ignore_for_file: unnecessary_cast, prefer_const_constructors, constant_identifier_names',
  '',
].join('\n');

// Rendering classes also discovers enums nested inside inline object schemas.
const classSource = [...classes.entries()].map(([name, schema]) => renderClass(name, schema)).join('\n\n');
const enumSource = [...enums.entries()].map(([name, values]) => renderEnum(name, values)).join('\n\n');

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${header}\n${enumSource}\n\n${classSource}\n`, 'utf8');
console.log(`Wrote ${outputPath}`);
