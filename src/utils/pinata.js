import axios from "axios";

const PINATA_API_KEY = "3f96a2141a5649ddd0ca";
const PINATA_SECRET_KEY = "ab3d8fec0ba8984bf700b894db65a82cfcff03b6085812a76fe827a5f02ee6abY";

export const uploadImageToIPFS = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_KEY,
      },
    }
  );

  return `ipfs://${res.data.IpfsHash}`;
};

export const uploadMetadataToIPFS = async (imageUrl, name, description) => {
  const metadata = {
    name,
    description,
    image: imageUrl,
  };

  const res = await axios.post(
    "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    metadata,
    {
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_KEY,
      },
    }
  );

  return `ipfs://${res.data.IpfsHash}`;
};
