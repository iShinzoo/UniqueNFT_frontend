import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import UniqueNFT from './ABI.json'; // Ensure this path is correct

const App = () => {
    const [account, setAccount] = useState('');
    const [contract, setContract] = useState(null);
    const contractAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with your deployed contract address

    useEffect(() => {
        const init = async () => {
            if (window.ethereum) {
                try {
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const signer = provider.getSigner();
                    setContract(new ethers.Contract(contractAddress, UniqueNFT.abi, signer));
                } catch (error) {
                    console.error("Error initializing provider:", error);
                }
            } else {
                alert("Please install MetaMask!");
            }
        };
        init();
    }, []);

    const connectWallet = async () => {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setAccount(accounts[0]);
        } else {
            alert("Please install MetaMask!");
        }
    };

    const mintNFT = async () => {
        if (!contract) return;
        
        try {
            const tx = await contract.safeMint({ value: ethers.utils.parseEther("0.00069") });
            await tx.wait();
            alert('NFT Minted!');
        } catch (error) {
            console.error("Error minting NFT:", error);
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Mint Your Unique NFT</h1>
            <button onClick={connectWallet}>
                {account ? `Connected: ${account}` : 'Connect Wallet'}
            </button>
            <br />
            <button onClick={mintNFT} disabled={!account}>
                Mint NFT
            </button>
        </div>
    );
};

export default App;
