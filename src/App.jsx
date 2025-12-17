import React, { useState, useEffect } from 'react';
import { Home, ShoppingBag, Bell, Users, User, Image, Wallet, LogOut, Plus, Search, X } from 'lucide-react';

const App = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [nfts, setNfts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const savedNFTs = localStorage.getItem('nfts');
    if (savedNFTs) {
      try {
        setNfts(JSON.parse(savedNFTs));
      } catch (e) {
        console.error('Error:', e);
      }
    }
    
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsConnected(true);
        setWalletAddress(userData.address || '');
        setCurrentPage('home');
      } catch (e) {
        console.error('Error:', e);
      }
    }
  }, []);

  const saveNFTs = (nftList) => {
    localStorage.setItem('nfts', JSON.stringify(nftList));
    setNfts(nftList);
  };

  const addNotification = (msg) => {
    setNotifications(prev => [{id: Date.now(), message: msg, time: 'Just now'}, ...prev]);
  };

  const connectMetaMask = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
        const userData = {address: accounts[0], name: 'Artist', joinDate: new Date().toISOString()};
        setUser(userData);
        setWalletAddress(accounts[0]);
        setIsConnected(true);
        localStorage.setItem('user', JSON.stringify(userData));
        addNotification('Welcome to HandMadeHub!');
        setCurrentPage('home');
      } catch (error) {
        alert('Failed to connect MetaMask');
      }
    } else {
      alert('MetaMask not installed');
    }
  };

  const handleSocialLogin = (platform) => {
    const userData = {email: `user@${platform}.com`, name: `${platform} User`, joinDate: new Date().toISOString()};
    setUser(userData);
    setIsConnected(true);
    localStorage.setItem('user', JSON.stringify(userData));
    addNotification('Welcome!');
    setCurrentPage('home');
  };

  const handleEmailLogin = (email, password) => {
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }
    const userData = {email: email, name: email.split('@')[0], joinDate: new Date().toISOString()};
    setUser(userData);
    setIsConnected(true);
    localStorage.setItem('user', JSON.stringify(userData));
    addNotification('Welcome!');
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setIsConnected(false);
    setWalletAddress('');
    setUser(null);
    localStorage.removeItem('user');
    setCurrentPage('login');
  };

  const handleBuyNFT = (nft) => {
    const owner = walletAddress || user?.email || 'unknown';
    if (nft.owner === owner) {
      alert('You already own this NFT');
      return;
    }
    const updated = nfts.map(n => n.id === nft.id ? {...n, owner, forSale: false} : n);
    saveNFTs(updated);
    addNotification(`Purchased ${nft.name}!`);
    alert(`Successfully purchased ${nft.name}!`);
  };

  const getFilteredNFTs = () => {
    let filtered = nfts.filter(n => n.forSale);
    if (selectedCategory !== 'All') filtered = filtered.filter(n => n.type === selectedCategory);
    if (searchQuery) filtered = filtered.filter(n => n.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return filtered;
  };

  const getUserOwnedNFTs = () => nfts.filter(n => n.owner === (walletAddress || user?.email));
  const getUserCreatedNFTs = () => nfts.filter(n => n.artist === user?.name);

  if (!isConnected) {
    return <LoginPage onMetaMask={connectMetaMask} onSocial={handleSocialLogin} onEmail={handleEmailLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex-1 flex flex-col">
        <MobileHeader walletAddress={walletAddress} />
        {currentPage === 'home' && <HomePage nfts={nfts} getUserOwnedNFTs={getUserOwnedNFTs} getUserCreatedNFTs={getUserCreatedNFTs} handleBuyNFT={handleBuyNFT} setCurrentPage={setCurrentPage} />}
        {currentPage === 'market' && <MarketPage getFilteredNFTs={getFilteredNFTs} handleBuyNFT={handleBuyNFT} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
        {currentPage === 'notifications' && <NotificationsPage notifications={notifications} />}
        {currentPage === 'community' && <CommunityPage />}
        {currentPage === 'profile' && <ProfilePage getUserOwnedNFTs={getUserOwnedNFTs} getUserCreatedNFTs={getUserCreatedNFTs} setCurrentPage={setCurrentPage} handleLogout={handleLogout} walletAddress={walletAddress} user={user} />}
        {currentPage === 'create-nft' && <CreateNFTPage nfts={nfts} saveNFTs={saveNFTs} user={user} walletAddress={walletAddress} addNotification={addNotification} setCurrentPage={setCurrentPage} />}
        {currentPage === 'my-collection' && <MyCollectionPage getUserOwnedNFTs={getUserOwnedNFTs} setCurrentPage={setCurrentPage} />}
        {currentPage === 'edit-profile' && <EditProfilePage user={user} setUser={setUser} addNotification={addNotification} setCurrentPage={setCurrentPage} />}
        {currentPage === 'settings' && <SettingsPage user={user} walletAddress={walletAddress} setNfts={setNfts} addNotification={addNotification} setCurrentPage={setCurrentPage} />}
        <NavBar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
    </div>
  );
};

const Sidebar = ({currentPage, setCurrentPage}) => (
  <div className="hidden md:flex flex-col w-64 bg-white border-r min-h-screen">
    <div className="p-6 border-b">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <Image className="text-white" size={24} />
        </div>
        <span className="text-xl font-bold">HandMadeHub</span>
      </div>
    </div>
    <nav className="p-4">
      {[
        {icon: Home, label: 'Home', page: 'home'},
        {icon: ShoppingBag, label: 'Market', page: 'market'},
        {icon: Bell, label: 'Notifications', page: 'notifications'},
        {icon: Users, label: 'Community', page: 'community'},
        {icon: User, label: 'Profile', page: 'profile'}
      ].map(({icon: Icon, label, page}) => (
        <button key={page} onClick={() => setCurrentPage(page)} className={currentPage === page ? 'w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 bg-purple-100 text-purple-600' : 'w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 text-gray-600 hover:bg-gray-100'}>
          <Icon size={20} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  </div>
);

const MobileHeader = ({walletAddress}) => (
  <div className="md:hidden bg-white border-b p-4 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
        <Image className="text-white" size={20} />
      </div>
      <span className="font-bold">HandMadeHub</span>
    </div>
    {walletAddress && <div className="text-xs bg-gray-100 px-3 py-1 rounded-full">{walletAddress.slice(0,6)}...{walletAddress.slice(-4)}</div>}
  </div>
);

const NavBar = ({currentPage, setCurrentPage}) => (
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-2 flex justify-around md:hidden z-50">
    {[
      {icon: Home, label: 'Home', page: 'home'},
      {icon: ShoppingBag, label: 'Market', page: 'market'},
      {icon: Bell, label: 'Notifications', page: 'notifications'},
      {icon: Users, label: 'Community', page: 'community'},
      {icon: User, label: 'Profile', page: 'profile'}
    ].map(({icon: Icon, label, page}) => (
      <button key={page} onClick={() => setCurrentPage(page)} className={currentPage === page ? 'flex flex-col items-center text-purple-600' : 'flex flex-col items-center text-gray-500'}>
        <Icon size={24} />
        <span className="text-xs mt-1">{label}</span>
      </button>
    ))}
  </div>
);

const LoginPage = ({onMetaMask, onSocial, onEmail}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
            <Image className="text-white" size={32} />
          </div>
          <h1 className="text-4xl font-bold">HandMadeHub</h1>
          <p className="text-gray-600 mt-2">Where Art meets Blockchain</p>
        </div>
        <button onClick={onMetaMask} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold mb-6 flex items-center justify-center gap-2">
          <Wallet size={20} />
          Connect Wallet
        </button>
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 text-sm">Or continue with</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>
        <div className="flex gap-3 mb-6">
          <button onClick={() => onSocial('google')} className="flex-1 bg-gray-900 text-white py-3 rounded-xl">G</button>
          <button onClick={() => onSocial('facebook')} className="flex-1 bg-gray-900 text-white py-3 rounded-xl">F</button>
          <button onClick={() => onSocial('github')} className="flex-1 bg-gray-900 text-white py-3 rounded-xl">GH</button>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-purple-500" placeholder="your@email.com" />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-purple-500" placeholder="••••••••" />
        </div>
        <button onClick={() => onEmail(email, password)} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold">Sign In</button>
      </div>
    </div>
  );
};

const HomePage = ({nfts, getUserOwnedNFTs, getUserCreatedNFTs, handleBuyNFT, setCurrentPage}) => {
  const owned = getUserOwnedNFTs();
  const created = getUserCreatedNFTs();
  
  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto pb-20 md:pb-0">
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-2">Welcome!</h1>
        <p className="text-gray-600 mb-8">Start Your NFT journey</p>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-blue-50 rounded-2xl p-6">
            <p className="text-gray-600 text-sm mb-1">NFTs Owned</p>
            <p className="text-4xl font-bold text-blue-600">{owned.length}</p>
          </div>
          <div className="bg-red-50 rounded-2xl p-6">
            <p className="text-gray-600 text-sm mb-1">Created</p>
            <p className="text-4xl font-bold text-red-600">{created.length}</p>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-4">Your Collection</h2>
        {owned.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center mb-8">
            <p className="text-gray-500 mb-4">No NFTs yet!</p>
            <button onClick={() => setCurrentPage('market')} className="bg-purple-600 text-white px-6 py-2 rounded-lg">Browse</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {owned.slice(0,3).map(nft => (
              <div key={nft.id} className="bg-white rounded-2xl p-4 shadow-sm">
                <img src={nft.image} alt={nft.name} className="w-full h-48 object-cover rounded-xl mb-3" />
                <h3 className="font-bold text-lg mb-1">{nft.name}</h3>
                <p className="text-gray-600 text-sm mb-2">by {nft.artist}</p>
                <p className="text-purple-600 font-bold">{nft.price} ETH</p>
              </div>
            ))}
          </div>
        )}
        <h2 className="text-2xl font-bold mb-4">Available NFTs</h2>
        {nfts.filter(n => n.forSale).length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <p className="text-gray-500">No NFTs available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {nfts.filter(n => n.forSale).slice(0,6).map(nft => (
              <div key={nft.id} className="bg-white rounded-2xl p-4 shadow-sm">
                <img src={nft.image} alt={nft.name} className="w-full h-48 object-cover rounded-xl mb-3" />
                <h3 className="font-bold text-lg mb-1">{nft.name}</h3>
                <p className="text-gray-600 text-sm mb-2">by {nft.artist}</p>
                <div className="flex justify-between items-center">
                  <p className="text-purple-600 font-bold">{nft.price} ETH</p>
                  <button onClick={() => handleBuyNFT(nft)} className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm">Buy</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const MarketPage = ({getFilteredNFTs, handleBuyNFT, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery}) => {
  const categories = ['All', 'Art', 'Painting', 'Drawing', 'WoodCraft', 'Photography'];
  const filtered = getFilteredNFTs();
  
  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto pb-20 md:pb-0">
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Marketplace</h1>
        <div className="mb-6 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search NFTs..." className="w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:border-purple-500" />
        </div>
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={selectedCategory === cat ? 'px-4 py-2 rounded-full whitespace-nowrap bg-purple-600 text-white' : 'px-4 py-2 rounded-full whitespace-nowrap bg-white text-gray-700'}>
              {cat}
            </button>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <ShoppingBag size={40} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No NFTs available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(nft => (
              <div key={nft.id} className="bg-white rounded-2xl p-4 shadow-sm">
                <img src={nft.image} alt={nft.name} className="w-full h-48 object-cover rounded-xl mb-3" />
                <h3 className="font-bold text-lg mb-1">{nft.name}</h3>
                <p className="text-gray-600 text-sm mb-2">by {nft.artist}</p>
                <div className="flex justify-between items-center">
                  <p className="text-purple-600 font-bold">{nft.price} ETH</p>
                  <button onClick={() => handleBuyNFT(nft)} className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm">Buy</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const NotificationsPage = ({notifications}) => (
  <div className="flex-1 bg-gray-50 overflow-y-auto pb-20 md:pb-0">
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>
      {notifications.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <Bell size={40} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map(n => (
            <div key={n.id} className="bg-white rounded-2xl p-4">
              <p className="font-medium">{n.message}</p>
              <p className="text-sm text-gray-500 mt-1">{n.time}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

const CommunityPage = () => (
  <div className="flex-1 bg-gray-50 overflow-y-auto pb-20 md:pb-0">
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Community</h1>
      <div className="bg-white rounded-2xl p-8 text-center">
        <Users size={40} className="text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Chat feature coming soon...</p>
      </div>
    </div>
  </div>
);

const ProfilePage = ({getUserOwnedNFTs, getUserCreatedNFTs, setCurrentPage, handleLogout, walletAddress}) => (
  <div className="flex-1 bg-gray-50 overflow-y-auto pb-20 md:pb-0">
    <div className="p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">User Profile</h1>
        <p className="text-gray-600">Artist & Collector</p>
        {walletAddress && <p className="text-xs text-gray-500 mt-2">{walletAddress}</p>}
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold text-purple-600">{getUserOwnedNFTs().length}</p>
          <p className="text-gray-600 text-sm mt-1">Owned</p>
        </div>
        <div className="bg-white rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold text-red-600">{getUserCreatedNFTs().length}</p>
          <p className="text-gray-600 text-sm mt-1">Created</p>
        </div>
        <div className="bg-white rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">0</p>
          <p className="text-gray-600 text-sm mt-1">Followers</p>
        </div>
      </div>
      <div className="space-y-3">
        <button onClick={() => setCurrentPage('create-nft')} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold flex items-center justify-between px-6">
          <span>Create NFT</span>
          <Plus size={20} />
        </button>
        <button onClick={() => setCurrentPage('my-collection')} className="w-full bg-white py-4 rounded-xl font-semibold flex items-center justify-between px-6">
          <span>My Collection</span>
          <span>›</span>
        </button>
        <button onClick={() => setCurrentPage('edit-profile')} className="w-full bg-white py-4 rounded-xl font-semibold flex items-center justify-between px-6">
          <span>Edit Profile</span>
          <span>›</span>
        </button>
        <button onClick={() => setCurrentPage('settings')} className="w-full bg-white py-4 rounded-xl font-semibold flex items-center justify-between px-6">
          <span>Settings</span>
          <span>›</span>
        </button>
        <button onClick={handleLogout} className="w-full bg-white text-red-600 py-4 rounded-xl font-semibold flex items-center justify-between px-6">
          <span>Logout</span>
          <LogOut size={20} />
        </button>
      </div>
    </div>
  </div>
);

const CreateNFTPage = ({nfts, saveNFTs, user, walletAddress, addNotification, setCurrentPage}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('');
  const [desc, setDesc] = useState('');
  const [img, setImg] = useState(null);
  const [prev, setPrev] = useState('');

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPrev(reader.result);
        setImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMint = () => {
    if (!name || !price || !type || !img) {
      alert('Please fill all fields');
      return;
    }
    const nft = {
      id: Date.now(),
      name,
      price,
      type,
      description: desc,
      image: img,
      artist: user?.name || 'Artist',
      owner: walletAddress || user?.email || 'unknown',
      createdAt: new Date().toISOString(),
      forSale: true
    };
    saveNFTs([...nfts, nft]);
    addNotification(`NFT ${name} minted!`);
    alert(`NFT ${name} created!`);
    setCurrentPage('profile');
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto pb-20 md:pb-0">
      <div className="p-6">
        <button onClick={() => setCurrentPage('profile')} className="mb-4 text-purple-600">‹ Back</button>
        <h1 className="text-3xl font-bold mb-6">Create NFT</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="nft-img" className="cursor-pointer block">
              {prev ? (
                <div className="relative border-2 rounded-2xl overflow-hidden">
                  <img src={prev} alt="Preview" className="w-full h-96 object-cover" />
                  <button onClick={(e) => {e.preventDefault(); e.stopPropagation(); setPrev(''); setImg(null);}} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full">
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-2xl p-12 text-center bg-white">
                  <Image size={32} className="text-gray-400 mx-auto mb-4" />
                  <p className="font-semibold">Upload artwork</p>
                  <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
            </label>
            <input id="nft-img" type="file" accept="image/*" onChange={handleImage} className="hidden" />
          </div>
          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-2">Name *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="NFT Name" className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-purple-500" />
            </div>
            <div>
              <label className="block font-semibold mb-2">Price (ETH) *</label>
              <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-purple-500" />
            </div>
            <div>
              <label className="block font-semibold mb-2">Type *</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-purple-500">
                <option value="">Select Type</option>
                <option value="Art">Art</option>
                <option value="Painting">Painting</option>
                <option value="Photography">Photography</option>
                <option value="WoodCraft">WoodCraft</option>
              </select>
            </div>
            <button onClick={handleMint} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold">Mint NFT</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MyCollectionPage = ({getUserOwnedNFTs, setCurrentPage}) => {
  const owned = getUserOwnedNFTs();
  
  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto pb-20 md:pb-0">
      <div className="p-6">
        <button onClick={() => setCurrentPage('profile')} className="mb-4 text-purple-600">‹ Back</button>
        <h1 className="text-3xl font-bold mb-6">My Collection</h1>
        {owned.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <p className="text-gray-500 mb-4">No NFTs yet</p>
            <button onClick={() => setCurrentPage('market')} className="bg-purple-600 text-white px-6 py-2 rounded-lg">Browse</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {owned.map(nft => (
              <div key={nft.id} className="bg-white rounded-2xl p-4 shadow-sm">
                <img src={nft.image} alt={nft.name} className="w-full h-48 object-cover rounded-xl mb-3" />
                <h3 className="font-bold text-lg mb-1">{nft.name}</h3>
                <p className="text-gray-600 text-sm mb-2">by {nft.artist}</p>
                <p className="text-purple-600 font-bold">{nft.price} ETH</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const EditProfilePage = ({user, setUser, addNotification, setCurrentPage}) => {
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState('');

  const handleSave = () => {
    const updated = {...user, name, bio};
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
    addNotification('Profile updated!');
    alert('Profile updated!');
    setCurrentPage('profile');
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto pb-20 md:pb-0">
      <div className="p-6">
        <button onClick={() => setCurrentPage('profile')} className="mb-4 text-purple-600">‹ Back</button>
        <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
        <div className="bg-white rounded-2xl p-6 max-w-2xl space-y-4">
          <div>
            <label className="block font-semibold mb-2">Display Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-purple-500" />
          </div>
          <div>
            <label className="block font-semibold mb-2">Bio</label>
            <textarea rows="4" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself..." className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-purple-500 resize-none" />
          </div>
          <button onClick={handleSave} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold">Save Profile</button>
        </div>
      </div>
    </div>
  );
};

const SettingsPage = ({user, walletAddress, setNfts, addNotification, setCurrentPage}) => {
  const [notifs, setNotifs] = useState(true);

  const handleClear = () => {
    if (confirm('Clear all data? This cannot be undone.')) {
      localStorage.removeItem('nfts');
      setNfts([]);
      addNotification('Data cleared');
      alert('All data cleared!');
    }
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto pb-20 md:pb-0">
      <div className="p-6">
        <button onClick={() => setCurrentPage('profile')} className="mb-4 text-purple-600">‹ Back</button>
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        <div className="space-y-4 max-w-2xl">
          <div className="bg-white rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Notifications</h2>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive updates</p>
              </div>
              <button onClick={() => setNotifs(!notifs)} className="w-14 h-8 rounded-full bg-purple-600">
                <div className="w-6 h-6 bg-white rounded-full" style={{transform: notifs ? 'translateX(28px)' : 'translateX(4px)'}} />
              </button>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Account</h2>
            {walletAddress && <p className="text-sm mb-2"><span className="text-gray-500">Wallet:</span> {walletAddress}</p>}
            {user?.email && <p className="text-sm mb-2"><span className="text-gray-500">Email:</span> {user.email}</p>}
            <p className="text-sm"><span className="text-gray-500">Member since:</span> {new Date(user?.joinDate).toLocaleDateString()}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border-2 border-red-200">
            <h2 className="text-xl font-bold text-red-600 mb-4">Danger Zone</h2>
            <button onClick={handleClear} className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold">Clear All Data</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;