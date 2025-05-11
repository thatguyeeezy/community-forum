export function cn(...inputs: any[]): string {
  let res = ""
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i]
    if (input) {
      if (typeof input === "string" || typeof input === "number") {
        res += input + " "
      } else if (typeof input === "object") {
        if (Array.isArray(input)) {
          res += cn(...input) + " "
        } else {
          for (const k in input) {
            if (Object.prototype.hasOwnProperty.call(input, k) && input[k]) {
              res += k + " "
            }
          }
        }
      }
    }
  }
  return res.trim()
}

export function hasRnRPermission(role: string): boolean {
  return (
    ["WEBMASTER", "HEAD_ADMIN", "SENIOR_ADMIN", "SPECIAL_ADVISOR"].includes(role) ||
    role === "RNR_ADMINISTRATION" ||
    role === "RNR_STAFF" ||
    role === "RNR_MEMBER"
  )
}
