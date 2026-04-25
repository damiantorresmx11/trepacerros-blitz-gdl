const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT;
const PINATA_PIN_FILE_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS";
const PINATA_PIN_JSON_URL = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

export interface PinResult {
  cid: string;
  ipfsUri: string;
  gatewayUrl: string;
}

interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

function assertJwt(): string {
  if (!PINATA_JWT || PINATA_JWT.trim() === "") {
    throw new Error(
      "Pinata JWT missing: set NEXT_PUBLIC_PINATA_JWT in .env.local"
    );
  }
  return PINATA_JWT;
}

function buildResult(cid: string): PinResult {
  const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY ?? "";
  return {
    cid,
    ipfsUri: `ipfs://${cid}`,
    gatewayUrl: `${gateway}${cid}`,
  };
}

export async function uploadFileToPinata(
  file: File,
  name?: string
): Promise<PinResult> {
  const jwt = assertJwt();

  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "pinataMetadata",
    JSON.stringify({ name: name ?? file.name })
  );

  const res = await fetch(PINATA_PIN_FILE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Pinata upload failed: " + (await res.text()));
  }

  const json = (await res.json()) as PinataResponse;
  return buildResult(json.IpfsHash);
}

export async function uploadJSONToPinata(
  data: unknown,
  name?: string
): Promise<PinResult> {
  const jwt = assertJwt();

  const body = {
    pinataContent: data,
    pinataMetadata: { name: name ?? "rastros-metadata.json" },
  };

  const res = await fetch(PINATA_PIN_JSON_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("Pinata upload failed: " + (await res.text()));
  }

  const json = (await res.json()) as PinataResponse;
  return buildResult(json.IpfsHash);
}
