import React, { useState, useCallback } from 'react';
import { Home, ShoppingBag, ImagePlus, User, LogOut, Wallet, Github, Users } from 'lucide-react';

// LoginPage Component
function LoginPage({ email, setEmail, password, setPassword, handleLogin, handleSocialLogin, handleWalletConnect }) {
  const [account, setAccount] = useState(null);
  
  
  // Connect Wallet Function with MetaMask
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }
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
    }
  };

  return (
    <div className="w-screen min-h-screen bg-white from-purple-50 to-white flex flex-col justify-center items-center p-8" style={{background: 'linear-gradient(to bottom right, rgb(147, 51, 234), rgb(236, 72, 153), rgb(251, 146, 60))'}}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" style={{background: 'linear-gradient(to bottom right, rgb(147, 51, 234), rgb(236, 72, 153))'}}>
            <ImagePlus className="text-white" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">HandMadeHub</h1>
          <p className="text-gray-600">Where Art meets Blockchain</p>
        </div>

        {/* Wallet Connect Section */}
        <div className="mb-4">
          {account ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
              <p className="text-green-600 font-semibold text-sm">
                Connected: {account.slice(0, 6)}...{account.slice(-4)}
              </p>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="w-full text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all flex items-center justify-center"
              style={{background: 'linear-gradient(to right, rgb(79, 70, 229), rgb(147, 51, 234))'}}
            >
              <Wallet size={20} className="mr-2" />
              Connect Wallet
            </button>
          )}
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <button
            onClick={() => handleSocialLogin('google')}
            className="flex items-center justify-center py-3 border-2 border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all"
            aria-label="Login with Google"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </button>
          <button
            onClick={() => handleSocialLogin('facebook')}
            className="flex items-center justify-center py-3 border-2 border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all"
            aria-label="Login with Facebook"
          >
            <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>
          <button
            onClick={() => handleSocialLogin('github')}
            className="flex items-center justify-center py-3 border-2 border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all"
            aria-label="Login with GitHub"
          >
            <Github size={20} className="text-gray-700" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="email-input" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              id="email-input"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-900"
            />
          </div>
          
          <div>
            <label htmlFor="password-input" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              id="password-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-900"
            />
          </div>
          
          <button
            onClick={handleLogin}
            className="w-full text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
            style={{background: 'linear-gradient(to right, rgb(147, 51, 234), rgb(236, 72, 153))'}}
          >
            Sign In
          </button>
          
          <div className="text-center">
            <button className="text-sm text-purple-600 hover:underline">
              Don't have an account? Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// DashboardPage Component
function DashboardPage({ userNFTs, setCurrentPage }) {
  return (
    <div className="fixed top-0 left-0 w-full min-h-screen bg-white p-6 pb-20 overflow-x-hidden">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">Welcome!</h1>
        <p className="text-gray-600">Start Your NFT journey with Blockchian</p>
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

   <div
  className="rounded-2xl p-6 text-gray-800 shadow-sm"
  style={{
    background: 'linear-gradient(to right, rgb(254, 240, 138), rgb(253, 164, 175))'
  }}
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
function MarketplacePage({ marketplaceNFTs, selectedNFT, setSelectedNFT, userNFTs, setUserNFTs }) {
  const handlePurchase = useCallback((nft) => {
    if (!userNFTs.find(n => n.id === nft.id)) {
      setUserNFTs([...userNFTs, { ...nft, isCreated: false }]);
      alert(`Successfully purchased ${nft.name}!`);
      setSelectedNFT(null);
    } else {
      alert('You already own this NFT!');
    }
  }, [userNFTs, setUserNFTs, setSelectedNFT]);

  return (
    <div className="fixed top-0 left-0 w-full min-h-screen bg-white p-6 pb-20 overflow-x-hidden">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Marketplace</h1>
        <input
          type="text"
          placeholder="Search NFTs..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-gray-900"
        />
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['All', 'Art', 'Painting', 'Drawing', 'HomeUse', 'WoodCraft', 'Photography', 'Home Decor', 'Jewelry', 'Fashion', 'Collectibles', 'Sports'].map(category => (
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
                      handlePurchase(nft);
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
              onClick={() => handlePurchase(selectedNFT)}
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
function CreatePage({
  createForm,
  setCreateForm,
  userNFTs,
  setUserNFTs,
  marketplaceNFTs,
  setMarketplaceNFTs,
  setCurrentPage,
  email,
}) {
  const categories = [
    'Art', 'Painting', 'Drawing', 'HomeUse', 'WoodCraft',
    'Photography', 'Home Decor', 'Jewelry', 'Fashion',
    'Collectibles', 'Sports'
  ];

  const handleCreateNFT = () => {
    if (createForm.name && createForm.price && createForm.type) {
      const newNFT = {
        id: Date.now(),
        name: createForm.name,
        description: createForm.description,
        price: createForm.price,
        image: createForm.image,
        creator: email,
        isCreated: true,
        type: createForm.type,
      };
      setUserNFTs([...userNFTs, newNFT]);
      setMarketplaceNFTs([...marketplaceNFTs, newNFT]);
      setCreateForm({ name: '', description: '', price: '', image: null, type: '' });
      alert('NFT created successfully!');
      setCurrentPage('dashboard');
    } else {
      alert('Please fill in all required fields (Name, Price, and Type).');
    }
  };

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
          {/* Image Upload Section */}
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

          {/* NFT Form Section */}
          <div className="col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="nft-name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Name
                </label>
                <input
                  id="nft-name"
                  type="text"
                  placeholder="NFT Name"
                  value={createForm.name}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-gray-900"
                />
              </div>

              <div>
                <label
                  htmlFor="nft-price"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Price (ETH)
                </label>
                <input
                  id="nft-price"
                  type="text"
                  placeholder="0.00"
                  value={createForm.price}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, price: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-gray-900"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="nft-description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                id="nft-description"
                placeholder="Describe your NFT..."
                value={createForm.description}
                onChange={(e) =>
                  setCreateForm({ ...createForm, description: e.target.value })
                }
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none text-gray-900"
              />
            </div>

            <div className="w-full sm:w-1/2">
              <label
                htmlFor="nft-type"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Type
              </label>
              <select
                id="nft-type"
                value={createForm.type || ''}
                onChange={(e) =>
                  setCreateForm({ ...createForm, type: e.target.value })
                }
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
                className="w-full text-white py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all"
                style={{
                  background:
                    'linear-gradient(to right, rgb(147, 51, 234), rgb(236, 72, 153))',
                }}
              >
                Create & Mint NFT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// 🧑‍🎨 Community / Artists Page
function CommunityPage() {
  return (
    <div className="fixed top-0 left-0 w-full min-h-screen bg-white p-6 pb-20 overflow-x-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">Artists</h1>
      </div>

      {/* Search + Filter Section */}
<div className="flex flex-col md:flex-row items-center gap-2 mb-6">
  <input
    type="text"
    placeholder="Search artists..."
    className="w-full md:w-1/3 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 outline-none text-gray-900"
  />
  <select
    className="w-full md:w-1/4 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 outline-none bg-white text-gray-900"
  >
          <option value="">Filter by Category</option>
          <option value="Art">Art</option>
          <option value="Painting">Painting</option>
          <option value="Music">HomeUse</option>
          <option value="Gaming">WoodCraft</option>
          <option value="Photography">Photography</option>
          <option value="Jewelry">Jewelry</option>
          <option value="Fashion">Fashion</option>
          <option value="Collectibles">Collectibles</option>
          <option value="Sports">Sports</option>
        </select>
      </div>

      {/* Artists Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
        {/* Artist cards will go here later */}
      </div>

      {/* Empty State */}
      <div className="text-center text-gray-500 mt-20">
        No artists found. Add artists to display here.
      </div>
    </div>
  );
}

// ProfilePage Component
function ProfilePage({ email, userNFTs, setIsLoggedIn, setCurrentPage, setEmail, setPassword }) {
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('login');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="fixed top-0 left-0 w-full min-h-screen bg-white p-6 pb-20 overflow-x-hidden">
     <div
  className="rounded-2xl p-6 mb-6 text-gray-800 shadow-sm"
  style={{
    background: 'linear-gradient(to bottom right, #ede9fe, #fce7f3)'
  }}
>
  <div className="flex items-center mb-4">
    <div className="w-20 h-20 rounded-full border-4 border-white mr-4 bg-white flex items-center justify-center shadow-sm">
      <User className="text-purple-600" size={40} />
    </div>
    <div>
      <h2 className="text-2xl font-bold text-gray-800">{email || 'User'}</h2>
      <p className="text-sm text-gray-600">NFT Creator</p>
    </div>
  </div>
  <div className="bg-white/60 rounded-lg p-3 border border-white/40">
    <p className="text-xs text-gray-700 mb-1">Wallet Address</p>
    <p className="font-mono text-sm text-gray-800">Connect Wallet</p>
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
        <button className="w-full bg-white rounded-xl shadow-md p-4 flex items-center justify-between hover:shadow-lg transition-shadow">
          <span className="font-medium text-gray-800">Help & Support</span>
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

      {/* Home Button */}
      <button
        onClick={() => setCurrentPage('dashboard')}
        className={`flex flex-col items-center ${
          currentPage === 'dashboard' ? 'text-purple-600' : 'text-gray-400'
        }`}
        aria-label="Home"
      >
        <Home size={24} />
        <span className="text-xs mt-1">Home</span>
      </button>

      {/* Marketplace Button */}
      <button
        onClick={() => setCurrentPage('marketplace')}
        className={`flex flex-col items-center ${
          currentPage === 'marketplace' ? 'text-purple-600' : 'text-gray-400'
        }`}
        aria-label="Marketplace"
      >
        <ShoppingBag size={24} />
        <span className="text-xs mt-1">Market</span>
      </button>

      {/* Create Button */}
      <button
        onClick={() => setCurrentPage('create')}
        className={`flex flex-col items-center ${
          currentPage === 'create' ? 'text-purple-600' : 'text-gray-400'
        }`}
        aria-label="Create NFT"
      >
        <ImagePlus size={24} />
        <span className="text-xs mt-1">Create</span>
      </button>

      {/* community button */}
      <button
        onClick={() => setCurrentPage("community")}
        className={`flex flex-col items-center ${
          currentPage === "community" ? "text-purple-600" : "text-gray-400"
        }`}
        aria-label="Community"
      >
        <Users size={24} />
        <span className="text-xs mt-1">Community</span>
      </button>

      {/* Profile Button */}
      <button
        onClick={() => setCurrentPage('profile')}
        className={`flex flex-col items-center ${
          currentPage === 'profile' ? 'text-purple-600' : 'text-gray-400'
        }`}
        aria-label="Profile"
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [createForm, setCreateForm] = useState({ name: '', description: '', price: '', image: null, type: '' });
  const [userNFTs, setUserNFTs] = useState([]);
  const [marketplaceNFTs, setMarketplaceNFTs] = useState([]);


  const handleLogin = () => {
    if (email && password) {
      setIsLoggedIn(true);
      setCurrentPage('dashboard');
    } else {
      alert('Please enter email and password');
    }
  };

  const handleSocialLogin = (provider) => {
    setEmail(`user@${provider}.com`);
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const handleWalletConnect = (address) => {
    setEmail(address || 'wallet.user@crypto.com');
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };


  return (
    <div className="w-screen min-h-screen bg-gray-50 flex flex-col">
      {!isLoggedIn ? (
        <LoginPage 
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleLogin={handleLogin}
          handleSocialLogin={handleSocialLogin}
          handleWalletConnect={handleWalletConnect}
        />
      ) : (
        <div className="max-w-7xl mx-auto">

          {currentPage === 'dashboard' && (
            <DashboardPage 
              userNFTs={userNFTs} 
              setCurrentPage={setCurrentPage} 
            />
          )}

          {currentPage === 'marketplace' && (
            <MarketplacePage 
              marketplaceNFTs={marketplaceNFTs} 
              selectedNFT={selectedNFT} 
              setSelectedNFT={setSelectedNFT}
              userNFTs={userNFTs}
              setUserNFTs={setUserNFTs}
            />
          )}

          {currentPage === 'create' && (
            <CreatePage 
              createForm={createForm} 
              setCreateForm={setCreateForm} 
              userNFTs={userNFTs} 
              setUserNFTs={setUserNFTs} 
              marketplaceNFTs={marketplaceNFTs} 
              setMarketplaceNFTs={setMarketplaceNFTs} 
              setCurrentPage={setCurrentPage} 
              email={email} 
            />
          )}

          {currentPage === "community" && (
            <CommunityPage setCurrentPage={setCurrentPage} />
          )}

          {currentPage === 'profile' && (
            <ProfilePage 
              email={email}
              userNFTs={userNFTs} 
              setIsLoggedIn={setIsLoggedIn} 
              setCurrentPage={setCurrentPage} 
              setEmail={setEmail} 
              setPassword={setPassword}
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