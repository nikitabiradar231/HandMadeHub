import React, { useState, useCallback, useEffect } from 'react';
import { Home, ShoppingBag, ImagePlus, User, LogOut, Wallet, Users, RefreshCw } from 'lucide-react';

// Contract ABIs (simplified for key functions)
const ARTIST_PROFILE_ABI = [
  "function registerArtist(string name, string bio, string uri) external",
  "function profiles(address) view returns (address wallet, string name, string bio, string uri, bool exists, bool verified)",
  "function isArtist(address) view returns (bool)",
  "function isVerified(address) view returns (bool)"
];

const ART_NFT_ABI = [
  "function mintArt(string tokenURI) external returns (uint256)",
  "function artistOf(uint256) view returns (address)",
  "function ownerOf(uint256) view returns (address)",
  "function tokenURI(uint256) view returns (string)",
  "event ArtMinted(address indexed artist, uint256 tokenId, string tokenURI)"
];

const MARKETPLACE_ABI = [
  "function mintNFT() external",
  "function listNFT(uint256 tokenId, uint256 price) external",
  "function buyNFT(uint256 tokenId) external payable",
  "function cancelListing(uint256 tokenId) external",
  "function marketItems(uint256) view returns (uint256 tokenId, address seller, uint256 price, bool isListed)",
  "function tokenCounter() view returns (uint256)",
  "event NFTMinted(uint256 tokenId, address owner)",
  "event NFTListed(uint256 tokenId, uint256 price, address seller)",
  "event NFTSold(uint256 tokenId, address buyer, uint256 price)"
];

// Sepolia Testnet Configuration
const SEPOLIA_CHAIN_ID = '0xaa36a7'; // 11155111 in hex
const SEPOLIA_CONFIG = {
  chainId: SEPOLIA_CHAIN_ID,
  chainName: 'Sepolia Testnet',
  nativeCurrency: {
    name: 'Sepolia ETH',
    symbol: 'SepoliaETH',
    decimals: 18
  },
  rpcUrls: ['https://sepolia.infura.io/v3/', 'https://rpc.sepolia.org'],
  blockExplorerUrls: ['https://sepolia.etherscan.io']
};

// Contract addresses (replace with your deployed addresses)
const CONTRACT_ADDRESSES = {
artistV: "0x7EF2e0048f5bAeDe046f6BF797943daF4ED8CB47",
  artNFT: "0x358AA13c52544ECCEF6B0ADD0f801012ADAD5eE3",
  marketplace: "0xDA0bab807633f07f013f94DD0E6A4F96F8742B53" 
};

// LoginPage Component
function LoginPage({ handleWalletConnect }) {
  const [account, setAccount] = useState(null);
  const [connecting, setConnecting] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask! Visit https://metamask.io');
      return;
    }
    
    setConnecting(true);
    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      const address = accounts[0];
      setAccount(address);
      handleWalletConnect(address);
      console.log('Connected wallet:', address);
    } catch (err) {
      console.error('Wallet connection error:', err);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="w-screen min-h-screen bg-white flex flex-col justify-center items-center p-8" style={{background: 'linear-gradient(to bottom right, rgb(147, 51, 234), rgb(236, 72, 153), rgb(251, 146, 60))'}}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" style={{background: 'linear-gradient(to bottom right, rgb(147, 51, 234), rgb(236, 72, 153))'}}>
            <ImagePlus className="text-white" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">HandMadeHub</h1>
          <p className="text-gray-600">Where Art meets Blockchain</p>
        </div>

        <div className="mb-6">
          {account ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-green-600 font-semibold text-sm mb-2">
                ✓ Connected
              </p>
              <p className="text-green-700 font-mono text-xs">
                {account.slice(0, 6)}...{account.slice(-4)}
              </p>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              disabled={connecting}
              className="w-full text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all flex items-center justify-center disabled:opacity-50"
              style={{background: 'linear-gradient(to right, rgb(79, 70, 229), rgb(147, 51, 234))'}}
            >
              {connecting ? (
                <>
                  <RefreshCw size={20} className="mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet size={20} className="mr-2" />
                  Connect Wallet to Continue
                </>
              )}
            </button>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          <p className="font-semibold mb-2">📌 Setup Instructions:</p>
          <ol className="list-decimal list-inside space-y-1 text-xs">
            <li>Install MetaMask extension</li>
            <li>Connect your wallet</li>
            <li>Make sure you're on the correct network</li>
            <li>Update contract addresses in the code</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

// DashboardPage Component
function DashboardPage({ userNFTs, setCurrentPage, account, loadUserNFTs }) {
  return (
    <div className="fixed top-0 left-0 w-full min-h-screen bg-white p-6 pb-20 overflow-x-hidden">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Welcome!</h1>
          <p className="text-gray-600">Start Your NFT journey with Blockchain</p>
          <p className="text-xs text-gray-400 font-mono mt-1">
            {account?.slice(0, 6)}...{account?.slice(-4)}
          </p>
        </div>
        <button
          onClick={loadUserNFTs}
          className="p-2 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors"
          aria-label="Refresh"
        >
          <RefreshCw size={20} className="text-purple-600" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-2xl p-4 bg-blue-50">
          <p className="text-sm text-gray-600 mb-1">NFTs Owned</p>
          <p className="text-3xl font-bold text-blue-700">{userNFTs.length}</p>
        </div>

        <div className="rounded-2xl p-4 bg-rose-50">
          <p className="text-sm text-gray-600 mb-1">Created</p>
          <p className="text-3xl font-bold text-rose-600">
            {userNFTs.filter(nft => nft.isCreated).length}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Your Collection</h2>
        {userNFTs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ImagePlus className="mx-auto mb-4 text-gray-300" size={64} />
            <p>No NFTs yet. Start by creating or purchasing one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {userNFTs.map(nft => (
              <div key={nft.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                  {nft.image ? (
                    <img src={nft.image} alt={nft.name} className="w-full h-full object-cover" />
                  ) : (
                    <ImagePlus className="text-gray-400" size={48} />
                  )}
                </div>
                <div className="p-3">
                  <p className="font-semibold text-sm text-gray-800 truncate">{nft.name}</p>
                  <p className="text-xs text-purple-400 font-medium">{nft.price} ETH</p>
                  {nft.tokenId && (
                    <p className="text-xs text-gray-400">Token #{nft.tokenId}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        className="rounded-2xl p-6 text-gray-800 shadow-sm"
        style={{background: 'linear-gradient(to right, rgb(254, 240, 138), rgb(253, 164, 175))'}}
      >
        <h3 className="text-lg font-semibold mb-2">Start Creating!</h3>
        <p className="text-sm text-gray-700 mb-4">
          Turn your art into NFTs and reach collectors worldwide
        </p>
        <button
          onClick={() => setCurrentPage('create')}
          className="bg-white text-rose-600 px-4 py-2 rounded-lg font-semibold text-sm hover:shadow-md transition-all"
        >
          Create NFT
        </button>
      </div>
    </div>
  );
}

// MarketplacePage Component
function MarketplacePage({ marketplaceNFTs, selectedNFT, setSelectedNFT, handlePurchaseNFT, loadMarketplace }) {
  return (
    <div className="fixed top-0 left-0 w-full min-h-screen bg-white p-6 pb-20 overflow-x-hidden">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Marketplace</h1>
        <button
          onClick={loadMarketplace}
          className="p-2 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors"
          aria-label="Refresh marketplace"
        >
          <RefreshCw size={20} className="text-purple-600" />
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search NFTs..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-gray-900"
        />
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['All', 'Art', 'Painting', 'Drawing', 'HomeUse', 'WoodCraft', 'Photography', 'Home Decor', 'Jewelry', 'Fashion'].map(category => (
          <button
            key={category}
            className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium whitespace-nowrap hover:bg-purple-200 transition-colors"
          >
            {category}
          </button>
        ))}
      </div>

      {marketplaceNFTs.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <ShoppingBag className="mx-auto mb-4 text-gray-300" size={64} />
          <p>No NFTs available in marketplace</p>
          <p className="text-sm mt-2">Check back later or create your own!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {marketplaceNFTs.map(nft => (
            <div
              key={nft.id}
              onClick={() => setSelectedNFT(nft)}
              className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
            >
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                {nft.image ? (
                  <img src={nft.image} alt={nft.name} className="w-full h-full object-cover" />
                ) : (
                  <ImagePlus className="text-gray-400" size={48} />
                )}
              </div>
              <div className="p-4">
                <p className="font-semibold text-gray-800 mb-1">{nft.name}</p>
                <p className="text-xs text-gray-600 mb-2">by {nft.creator || 'Unknown'}</p>
                <div className="flex justify-between items-center">
                  <p className="text-purple-600 font-bold">{nft.price} ETH</p>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePurchaseNFT(nft);
                    }}
                    className="text-white px-3 py-1 rounded-lg text-xs font-semibold"
                    style={{background: 'linear-gradient(to right, rgb(147, 51, 234), rgb(236, 72, 153))'}}
                  >
                    Buy
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedNFT && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedNFT(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="w-full h-64 bg-gray-200 rounded-xl mb-4 flex items-center justify-center">
              {selectedNFT.image ? (
                <img src={selectedNFT.image} alt={selectedNFT.name} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <ImagePlus className="text-gray-400" size={64} />
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedNFT.name}</h3>
            <p className="text-gray-600 mb-1">Created by {selectedNFT.creator || 'Unknown'}</p>
            <p className="text-sm text-gray-500 mb-2">{selectedNFT.description || 'No description available'}</p>
            <p className="text-2xl font-bold text-purple-600 mb-4">{selectedNFT.price} ETH</p>
            <button 
              onClick={() => handlePurchaseNFT(selectedNFT)}
              className="w-full text-white py-3 rounded-lg font-semibold"
              style={{background: 'linear-gradient(to right, rgb(147, 51, 234), rgb(236, 72, 153))'}}
            >
              Purchase NFT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// CreatePage Component
function CreatePage({ createForm, setCreateForm, handleCreateNFT, setCurrentPage, account, creating }) {
  const categories = [
    'Art', 'Painting', 'Drawing', 'HomeUse', 'WoodCraft',
    'Photography', 'Home Decor', 'Jewelry', 'Fashion',
    'Collectibles', 'Sports'
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCreateForm({ ...createForm, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full min-h-screen bg-white p-6 pb-20 overflow-x-hidden">
      <h1 className="text-3xl font-bold text-gray-800 mb-10 text-center">
        Create NFT
      </h1>

      <div className="bg-white rounded-2xl shadow-lg p-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
          <div className="col-span-1">
            <label htmlFor="image-upload">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-purple-500 transition-colors w-full h-full flex flex-col justify-center">
                {createForm.image ? (
                  <img
                    src={createForm.image}
                    alt="Preview"
                    className="w-full max-h-[400px] object-cover rounded-lg"
                  />
                ) : (
                  <>
                    <ImagePlus className="mx-auto mb-3 text-gray-400" size={64} />
                    <p className="text-gray-600 font-medium text-lg">
                      Upload your artwork
                    </p>
                    <p className="text-sm text-gray-400">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </>
                )}
              </div>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="nft-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  id="nft-name"
                  type="text"
                  placeholder="NFT Name"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-gray-900"
                />
              </div>

              <div>
                <label htmlFor="nft-price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price (ETH)
                </label>
                <input
                  id="nft-price"
                  type="text"
                  placeholder="0.00"
                  value={createForm.price}
                  onChange={(e) => setCreateForm({ ...createForm, price: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-gray-900"
                />
              </div>
            </div>

            <div>
              <label htmlFor="nft-description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="nft-description"
                placeholder="Describe your NFT..."
                value={createForm.description}
                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none text-gray-900"
              />
            </div>

            <div className="w-full sm:w-1/2">
              <label htmlFor="nft-type" className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                id="nft-type"
                value={createForm.type || ''}
                onChange={(e) => setCreateForm({ ...createForm, type: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white text-gray-900"
              >
                <option value="">Select Type</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-6">
              <button
                onClick={handleCreateNFT}
                disabled={creating}
                className="w-full text-white py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center"
                style={{background: 'linear-gradient(to right, rgb(147, 51, 234), rgb(236, 72, 153))'}}
              >
                {creating ? (
                  <>
                    <RefreshCw size={20} className="mr-2 animate-spin" />
                    Minting NFT...
                  </>
                ) : (
                  'Create & Mint NFT'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// CommunityPage Component
function CommunityPage() {
  return (
    <div className="fixed top-0 left-0 w-full min-h-screen bg-white p-6 pb-20 overflow-x-hidden">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">Artists</h1>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-2 mb-6">
        <input
          type="text"
          placeholder="Search artists..."
          className="w-full md:w-1/3 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 outline-none text-gray-900"
        />
        <select className="w-full md:w-1/4 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 outline-none bg-white text-gray-900">
          <option value="">Filter by Category</option>
          <option value="Art">Art</option>
          <option value="Painting">Painting</option>
          <option value="HomeUse">HomeUse</option>
          <option value="WoodCraft">WoodCraft</option>
          <option value="Photography">Photography</option>
        </select>
      </div>

      <div className="text-center text-gray-500 mt-20">
        <Users className="mx-auto mb-4 text-gray-300" size={64} />
        <p>Artist profiles will appear here once registered on-chain</p>
      </div>
    </div>
  );
}

// ProfilePage Component
function ProfilePage({ account, userNFTs, handleLogout }) {
  return (
    <div className="fixed top-0 left-0 w-full min-h-screen bg-white p-6 pb-20 overflow-x-hidden">
      <div
        className="rounded-2xl p-6 mb-6 text-gray-800 shadow-sm"
        style={{background: 'linear-gradient(to bottom right, #ede9fe, #fce7f3)'}}
      >
        <div className="flex items-center mb-4">
          <div className="w-20 h-20 rounded-full border-4 border-white mr-4 bg-white flex items-center justify-center shadow-sm">
            <User className="text-purple-600" size={40} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Artist</h2>
            <p className="text-sm text-gray-600">NFT Creator</p>
          </div>
        </div>
        <div className="bg-white/60 rounded-lg p-3 border border-white/40">
          <p className="text-xs text-gray-700 mb-1">Wallet Address</p>
          <p className="font-mono text-sm text-gray-800">
            {account ? `${account.slice(0, 10)}...${account.slice(-8)}` : 'Not connected'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Statistics</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-purple-600">{userNFTs.length}</p>
            <p className="text-xs text-gray-600">Owned</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-pink-600">{userNFTs.filter(nft => nft.isCreated).length}</p>
            <p className="text-xs text-gray-600">Created</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-600">0</p>
            <p className="text-xs text-gray-600">ETH Volume</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button className="w-full bg-white rounded-xl shadow-md p-4 flex items-center justify-between hover:shadow-lg transition-shadow">
          <span className="font-medium text-gray-800">Edit Profile</span>
          <span className="text-gray-400">›</span>
        </button>
        <button className="w-full bg-white rounded-xl shadow-md p-4 flex items-center justify-between hover:shadow-lg transition-shadow">
          <span className="font-medium text-gray-800">Settings</span>
          <span className="text-gray-400">›</span>
        </button>
        <button
          onClick={handleLogout}
          className="w-full bg-red-50 rounded-xl shadow-md p-4 flex items-center justify-center text-red-600 font-medium hover:bg-red-100 transition-colors"
        >
          <LogOut size={20} className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
}

// BottomNav Component
function BottomNav({ currentPage, setCurrentPage }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-around items-center">
      <button
        onClick={() => setCurrentPage('dashboard')}
        className={`flex flex-col items-center ${currentPage === 'dashboard' ? 'text-purple-600' : 'text-gray-400'}`}
      >
        <Home size={24} />
        <span className="text-xs mt-1">Home</span>
      </button>

      <button
        onClick={() => setCurrentPage('marketplace')}
        className={`flex flex-col items-center ${currentPage === 'marketplace' ? 'text-purple-600' : 'text-gray-400'}`}
      >
        <ShoppingBag size={24} />
        <span className="text-xs mt-1">Market</span>
      </button>

      <button
        onClick={() => setCurrentPage('create')}
        className={`flex flex-col items-center ${currentPage === 'create' ? 'text-purple-600' : 'text-gray-400'}`}
      >
        <ImagePlus size={24} />
        <span className="text-xs mt-1">Create</span>
      </button>

      <button
        onClick={() => setCurrentPage("community")}
        className={`flex flex-col items-center ${currentPage === "community" ? "text-purple-600" : "text-gray-400"}`}
      >
        <Users size={24} />
        <span className="text-xs mt-1">Community</span>
      </button>

      <button
        onClick={() => setCurrentPage('profile')}
        className={`flex flex-col items-center ${currentPage === 'profile' ? 'text-purple-600' : 'text-gray-400'}`}
      >
        <User size={24} />
        <span className="text-xs mt-1">Profile</span>
      </button>
    </div>
  );
}

// Main App Component
export default function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [createForm, setCreateForm] = useState({ name: '', description: '', price: '', image: null, type: '' });
  const [userNFTs, setUserNFTs] = useState([]);
  const [marketplaceNFTs, setMarketplaceNFTs] = useState([]);
  const [creating, setCreating] = useState(false);

  // Initialize ethers when wallet connects
  const handleWalletConnect = async (address) => {
    setAccount(address);
    setIsLoggedIn(true);
    setCurrentPage('dashboard');

    // Setup provider (using ethers v6 compatible approach)
    if (window.ethereum) {
      const ethersProvider = {
        request: (args) => window.ethereum.request(args),
        on: (event, handler) => window.ethereum.on(event, handler),
        removeListener: (event, handler) => window.ethereum.removeListener(event, handler)
      };
      setProvider(ethersProvider);
      
      // Load initial data
      await loadUserNFTs(address);
      await loadMarketplace();
    }
  };

  // Load user's NFTs from blockchain
  const loadUserNFTs = async (userAddress = account) => {
    if (!userAddress || !window.ethereum) return;
    
    try {
      // In a real implementation, you would:
      // 1. Query the marketplace contract for tokens owned by user
      // 2. Get token metadata from IPFS/API
      // 3. Format and display
      
      console.log('Loading NFTs for:', userAddress);
      // Placeholder - replace with actual contract calls
    } catch (error) {
      console.error('Error loading user NFTs:', error);
    }
  };

  // Load marketplace NFTs
  const loadMarketplace = async () => {
    if (!window.ethereum) return;
    
    try {
      // In a real implementation, you would:
      // 1. Query marketplace contract for all listed NFTs
      // 2. Get metadata for each
      // 3. Display in marketplace
      
      console.log('Loading marketplace...');
      // Placeholder - replace with actual contract calls
    } catch (error) {
      console.error('Error loading marketplace:', error);
    }
  };

  // Create and mint NFT
  const handleCreateNFT = async () => {
    if (!createForm.name || !createForm.price || !createForm.type) {
      alert('Please fill in all required fields (Name, Price, and Type).');
      return;
    }

    if (!window.ethereum || !account) {
      alert('Please connect your wallet first!');
      return;
    }

    setCreating(true);

    try {
      // Step 1: Upload metadata to IPFS (you'll need to implement this)
      const metadata = {
        name: createForm.name,
        description: createForm.description,
        image: createForm.image, // In production, upload image to IPFS first
        attributes: [
          { trait_type: 'Type', value: createForm.type },
          { trait_type: 'Price', value: createForm.price }
        ]
      };

      // Step 2: Get IPFS URI (placeholder - implement IPFS upload)
      const tokenURI = `ipfs://placeholder/${Date.now()}`;
      
      // Step 3: Request account
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      // Step 4: Mint NFT (you'll need to implement contract interaction)
      // Using eth_sendTransaction as a placeholder
      const transactionParameters = {
        from: accounts[0],
        to: CONTRACT_ADDRESSES.marketplace, // Your contract address
        data: '0x' // You'll need to encode the mint function call here
      };

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      console.log('Transaction hash:', txHash);

      // Add to local state
      const newNFT = {
        id: Date.now(),
        name: createForm.name,
        description: createForm.description,
        price: createForm.price,
        image: createForm.image,
        creator: account,
        isCreated: true,
        type: createForm.type,
        tokenURI: tokenURI
      };

      setUserNFTs([...userNFTs, newNFT]);
      setMarketplaceNFTs([...marketplaceNFTs, newNFT]);
      setCreateForm({ name: '', description: '', price: '', image: null, type: '' });
      
      alert('NFT minted successfully! Transaction: ' + txHash);
      setCurrentPage('dashboard');

    } catch (error) {
      console.error('Error creating NFT:', error);
      alert('Failed to mint NFT: ' + (error.message || 'Unknown error'));
    } finally {
      setCreating(false);
    }
  };

  // Purchase NFT from marketplace
  const handlePurchaseNFT = async (nft) => {
    if (!window.ethereum || !account) {
      alert('Please connect your wallet first!');
      return;
    }

    if (userNFTs.find(n => n.id === nft.id)) {
      alert('You already own this NFT!');
      return;
    }

    try {
      // Convert price to Wei (1 ETH = 10^18 Wei)
      const priceInWei = BigInt(parseFloat(nft.price) * 1e18).toString(16);

      // Request transaction
      const transactionParameters = {
        from: account,
        to: CONTRACT_ADDRESSES.marketplace,
        value: '0x' + priceInWei,
        data: '0x' // Encode buyNFT function call here
      };

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      console.log('Purchase transaction:', txHash);

      // Update local state
      setUserNFTs([...userNFTs, { ...nft, isCreated: false }]);
      alert(`Successfully purchased ${nft.name}! Transaction: ${txHash}`);
      setSelectedNFT(null);

    } catch (error) {
      console.error('Error purchasing NFT:', error);
      alert('Failed to purchase NFT: ' + (error.message || 'Unknown error'));
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('login');
    setAccount(null);
    setProvider(null);
    setUserNFTs([]);
    setMarketplaceNFTs([]);
  };

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          handleLogout();
        } else {
          setAccount(accounts[0]);
          loadUserNFTs(accounts[0]);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  return (
    <div className="w-screen min-h-screen bg-gray-50 flex flex-col">
      {!isLoggedIn ? (
        <LoginPage handleWalletConnect={handleWalletConnect} />
      ) : (
        <div className="max-w-7xl mx-auto w-full">
          {currentPage === 'dashboard' && (
            <DashboardPage 
              userNFTs={userNFTs}
              setCurrentPage={setCurrentPage}
              account={account}
              loadUserNFTs={loadUserNFTs}
            />
          )}

          {currentPage === 'marketplace' && (
            <MarketplacePage 
              marketplaceNFTs={marketplaceNFTs}
              selectedNFT={selectedNFT}
              setSelectedNFT={setSelectedNFT}
              handlePurchaseNFT={handlePurchaseNFT}
              loadMarketplace={loadMarketplace}
            />
          )}

          {currentPage === 'create' && (
            <CreatePage 
              createForm={createForm}
              setCreateForm={setCreateForm}
              handleCreateNFT={handleCreateNFT}
              setCurrentPage={setCurrentPage}
              account={account}
              creating={creating}
            />
          )}

          {currentPage === "community" && (
            <CommunityPage />
          )}

          {currentPage === 'profile' && (
            <ProfilePage 
              account={account}
              userNFTs={userNFTs}
              handleLogout={handleLogout}
            />
          )}

          <BottomNav 
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}