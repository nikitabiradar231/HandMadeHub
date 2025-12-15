import { ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "./artistProfile";

export const getArtistContract = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return new ethers.Contract(
    CONTRACT_ADDRESS,
    CONTRACT_ABI,
    signer
  );
};
