const IPFS_PREFIX = "ipfs://";

function getGateway(): string {
  return process.env.NEXT_PUBLIC_PINATA_GATEWAY ?? "https://gateway.pinata.cloud/ipfs/";
}

/**
 * Convert an IPFS URI ("ipfs://Qm...") to a gateway URL.
 * If the input is already an https URL, it is returned unchanged.
 */
export function ipfsToGateway(uri: string): string {
  if (!uri) return uri;
  if (uri.startsWith("https://") || uri.startsWith("http://")) {
    return uri;
  }
  if (uri.startsWith(IPFS_PREFIX)) {
    return `${getGateway()}${uri.slice(IPFS_PREFIX.length)}`;
  }
  // Assume bare CID
  return `${getGateway()}${uri}`;
}

/**
 * Fetch JSON content from IPFS via the configured gateway.
 * Accepts either a bare CID, an `ipfs://` URI, or a full https URL.
 */
export async function fetchFromIPFS<T = unknown>(cidOrUri: string): Promise<T> {
  const url = ipfsToGateway(cidOrUri);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch from IPFS (${url}): ${res.status} ${res.statusText}`
    );
  }
  return (await res.json()) as T;
}
