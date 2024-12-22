import { useState } from 'react';
import { parseEther, Contract, BrowserProvider } from 'ethers';
import { abi as CONTRACT_ABI } from "./ABI";

const CONTRACT_ADDRESS = '0x0bcEE94829E7c7AA0712E063362356bD72107F20';
const MIN_RATE = parseEther('0.00069');

function App() {
  const [userAddress, setUserAddress] = useState('');
  const [minting, setMinting] = useState(false);
  const [tokenId, setTokenId] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setUserAddress(accounts[0]);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      alert('Please install MetaMask to use this application.');
    }
  };

  const mintNFT = async () => {
    if (!userAddress) {
      alert('Please connect your wallet first.');
      return;
    }

    try {
      setMinting(true);

      const provider = new BrowserProvider(window.ethereum);
      const signer = provider.getSigner();
      const nftContract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const transaction = await nftContract.safeMint({ value: MIN_RATE });
      await transaction.wait();

      const tokenIdCounter = await nftContract.tokenIdCounter();
      setTokenId(tokenIdCounter.sub(1).toString());

      alert('NFT Minted Successfully!');
    } catch (error) {
      console.error('Error minting NFT:', error);
      alert('Failed to mint NFT.');
    } finally {
      setMinting(false);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', margin: '20px' }}>
      <h1>Mint Your Unique NFT</h1>
      <button onClick={connectWallet} style={{ margin: '10px', padding: '10px 20px', cursor: 'pointer' }}>
        {userAddress ? `Connected: ${userAddress.substring(0, 6)}...` : 'Connect Wallet'}
      </button>
      <br />
      <button
        onClick={mintNFT}
        disabled={minting}
        style={{ margin: '10px', padding: '10px 20px', cursor: minting ? 'not-allowed' : 'pointer' }}
      >
        {minting ? 'Minting...' : 'Mint NFT'}
      </button>
      {tokenId && (
        <p>Your NFT Token ID: {tokenId}</p>
      )}
    </div>
  );
}

export default App;
