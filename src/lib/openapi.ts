// Minimal OpenAPI 3.x types and helpers for the custom renderer.

export interface OApiInfo {
  title: string;
  version: string;
  description?: string;
  summary?: string;
}

export interface OApiServer {
  url: string;
  description?: string;
}

export interface OApiTag {
  name: string;
  description?: string;
}

export interface OApiParameter {
  name: string;
  in: "path" | "query" | "header" | "cookie";
  required?: boolean;
  description?: string;
  schema?: { type?: string; enum?: string[]; examples?: unknown[] };
}

export interface OApiMediaType {
  schema?: Record<string, unknown>;
  example?: unknown;
}

export interface OApiRequestBody {
  required?: boolean;
  description?: string;
  content?: Record<string, OApiMediaType>;
}

export interface OApiResponse {
  description?: string;
  content?: Record<string, OApiMediaType>;
}

export interface OApiOperation {
  operationId?: string;
  summary?: string;
  description?: string;
  tags?: string[];
  parameters?: (OApiParameter | { $ref: string })[];
  requestBody?: OApiRequestBody;
  responses?: Record<string, OApiResponse | { $ref: string }>;
  security?: Record<string, string[]>[];
}

export interface OApiPathItem {
  parameters?: (OApiParameter | { $ref: string })[];
  get?: OApiOperation;
  post?: OApiOperation;
  put?: OApiOperation;
  patch?: OApiOperation;
  delete?: OApiOperation;
}

export interface OApiSpec {
  openapi: string;
  info: OApiInfo;
  servers?: OApiServer[];
  tags?: OApiTag[];
  security?: Record<string, string[]>[];
  paths?: Record<string, OApiPathItem>;
  components?: {
    schemas?: Record<string, unknown>;
    responses?: Record<string, OApiResponse>;
    parameters?: Record<string, OApiParameter>;
    securitySchemes?: Record<string, unknown>;
  };
}

export interface ResolvedOperation {
  method: string;
  path: string;
  operationId: string;
  summary?: string;
  description?: string;
  tags: string[];
  parameters: OApiParameter[];
  requestBody?: OApiRequestBody;
  responses: { status: string; response: OApiResponse }[];
  hasAuth: boolean;
}

export const resolveRef = <T>(spec: OApiSpec, ref: string): T => {
  const parts = ref.replace("#/", "").split("/");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return parts.reduce((obj: any, key) => obj?.[key], spec) as T;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resolveObj = <T extends Record<string, any>>(spec: OApiSpec, obj: T | { $ref: string }): T => {
  if ("$ref" in obj) return resolveRef<T>(spec, (obj as { $ref: string }).$ref);
  return obj as T;
};

const HTTP_METHODS = ["get", "post", "put", "patch", "delete"] as const;

export const getOperationsByTag = (spec: OApiSpec): Map<string, ResolvedOperation[]> => {
  const map = new Map<string, ResolvedOperation[]>();

  for (const tag of spec.tags ?? []) {
    map.set(tag.name, []);
  }

  for (const [path, pathItem] of Object.entries(spec.paths ?? {})) {
    const pathParams = (pathItem.parameters ?? []).map((p) =>
      resolveObj<OApiParameter>(spec, p as OApiParameter | { $ref: string })
    );

    for (const method of HTTP_METHODS) {
      const op = pathItem[method];
      if (!op) continue;

      const opParams = (op.parameters ?? []).map((p) =>
        resolveObj<OApiParameter>(spec, p as OApiParameter | { $ref: string })
      );

      const responses = Object.entries(op.responses ?? {}).map(([status, resp]) => ({
        status,
        response: resolveObj<OApiResponse>(spec, resp as OApiResponse | { $ref: string }),
      }));

      // Inherits global security if op.security is undefined; explicit [] means public.
      const opSecurity = op.security;
      const hasAuth =
        opSecurity === undefined
          ? (spec.security?.length ?? 0) > 0
          : opSecurity.length > 0;

      const entry: ResolvedOperation = {
        method: method.toUpperCase(),
        path,
        operationId: op.operationId ?? `${method}-${path.replace(/\//g, "-")}`,
        summary: op.summary,
        description: op.description,
        tags: op.tags ?? ["Other"],
        parameters: [...pathParams, ...opParams],
        requestBody: op.requestBody,
        responses,
        hasAuth,
      };

      for (const tag of entry.tags) {
        const list = map.get(tag) ?? [];
        list.push(entry);
        map.set(tag, list);
      }
    }
  }

  return map;
};
