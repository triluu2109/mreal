type JsonPrimitive = string | number | boolean | null;
export type SerializedPrismaValue =
  | JsonPrimitive
  | SerializedPrismaValue[]
  | { [key: string]: SerializedPrismaValue };

type DecimalLike = {
  toNumber: () => number;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function isDecimalLike(value: unknown): value is DecimalLike {
  return (
    value !== null &&
    typeof value === "object" &&
    typeof (value as { toNumber?: unknown }).toNumber === "function" &&
    (value.constructor?.name === "Decimal" || value.constructor?.name === "Decimal2")
  );
}

export function serializePrisma<T>(value: T): SerializedPrismaValue {
  if (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value as SerializedPrismaValue;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (isDecimalLike(value)) {
    return value.toNumber();
  }

  if (Array.isArray(value)) {
    return value.map((item) => serializePrisma(item));
  }

  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, serializePrisma(item)])
    );
  }

  return null;
}
