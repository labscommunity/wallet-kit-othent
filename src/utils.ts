import { type Tag } from "arweave/web/lib/transaction";

/**
 * Decode an array of tags
 *
 * @param tags An array of tags
 * @returns An array of decoded tags
 */
export function decodeTags(tags: Tag[]) {
  return tags.map((tag) => {
    try {
      const name = tag.get("name", { decode: true, string: true });
      const value = tag.get("value", { decode: true, string: true });
      return { name, value };
    } catch {
      return tag;
    }
  });
}
