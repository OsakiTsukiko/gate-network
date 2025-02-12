export interface SBReqBody {
  label: string;
}

export function isSBReqBody(obj: any): boolean {
  return obj && obj.label && typeof obj.label == "string";
}
