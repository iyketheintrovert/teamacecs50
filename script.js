// The first line ensures page loads first

document.addEventListener('DOMContentLoaded', function() {
    let web3;
    let isConnected = false; // Track connection state

    // Function to connect to MetaMask
    async function connectWallet() {
        try {
            if (!isConnected) {
                if (window.ethereum) {
                    web3 = new Web3(window.ethereum);
                    // Request account access
                    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
                    console.log('Connected to MetaMask');
                    const account = accounts[0];
                    await loadBalance(account);
                    document.getElementById('connectButton').textContent = 'Disconnect';
                    isConnected = true; // Update connection state
                    return account; // Return the selected account
                } else {
                    alert('MetaMask is not installed. Please install MetaMask to connect.');
                }
            }
        } catch (error) {
            console.error('MetaMask connection error:', error);
            if (error.code !== -32002) {
                alert('Error connecting to MetaMask. Please make sure MetaMask is installed and unlocked.');
            }
        }
    }

    // Function to disconnect MetaMask
    async function disconnectWallet() {
        try {
            if (isConnected) {
                await ethereum.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] });
                console.log('Disconnected from MetaMask');
                document.getElementById('connectButton').textContent = 'Connect to MetaMask';
                isConnected = false;
            }
        } catch (error) {
            console.error('MetaMask disconnection error:', error);
            if (error.code !== -32002) {
                alert('Error disconnecting from MetaMask.');
            }
        }
    }


    // Function to load user's account balance and show wallet address
    async function loadBalance(account) {
        try {
            const balance = await ethereum.request({ method: 'eth_getBalance', params: [account, 'latest'] });
            const formattedBalance = web3.utils.fromWei(balance, 'ether');
            document.getElementById('balance').textContent = 'Balance: ' + formattedBalance + ' ETH';
            document.getElementById('yourAddress').textContent = account;
        } catch (error) {
            console.error('Error fetching balance:', error);
            throw new Error('Error fetching balance');
        }
    }

    // Function to render token balances
    async function renderTokenBalances() {
        try {
            // Dummy token data
            const dummyTokens = [
                { name: 'Token1', balance: '100' },
                { name: 'Token2', balance: '200' }
                // Add more dummy tokens as needed
            ];

            const balancesDiv = document.getElementById('tokensList');
            balancesDiv.innerHTML = ''; 
            dummyTokens.forEach(token => {
                const tokenDiv = document.createElement('div');
                tokenDiv.innerHTML = `<strong>${token.name}:</strong> ${token.balance}`;
                balancesDiv.appendChild(tokenDiv);
            });
        } catch (error) {
            console.error('Error fetching token balances:', error);
            throw new Error('Error fetching token balances');
        }
    }

    // Call renderTokenBalances
    renderTokenBalances().catch(error => {
        console.error('Error rendering token balances:', error);
        alert('Error rendering token balances: ' + error.message);
    });

    // Initialize web3
    async function initWeb3() {
        try {
            // Modern dapp browsers...
            if (window.ethereum) {
                web3 = new Web3(ethereum);
                await ethereum.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] });
                console.log('MetaMask provider connected');
                await connectWallet();
            } else {
                console.error('No Ethereum provider detected');
                alert('No Ethereum provider detected. Please install MetaMask to connect.');
            }
        } catch (error) {
            console.error('Web3 initialization error:', error);
            alert('Web3 initialization error: ' + error.message);
        }
    }

    // Event listener for connect/disconnect button
    document.getElementById('connectButton').addEventListener('click', function() {
        if (!isConnected) {
            connectWallet();
        } else {
            disconnectWallet();
        }

        // if (document.getElementById('connectButton').textContent === 'Connect to MetaMask') {
        //     connectWallet();
        // } else {
        //     disconnectWallet();
        // }
    });

    // Initialize web3
    initWeb3().catch(error => {
        console.error('Web3 initialization error:', error);
        alert('Web3 initialization error: ' + error.message);
    });

    // Render token balances
    renderTokenBalances().catch(error => {
        console.error('Error rendering token balances:', error);
        alert('Error rendering token balances: ' + error.message);
    });

    async function sendTransaction(from, to, amount) {
        try {
            const transaction = {
                from: from,
                to: to,
                value: web3.utils.toWei(amount, 'ether')
            };
            const receipt = await ethereum.request({ method: 'eth_sendTransaction', params: [transaction] });
            console.log('Transaction receipt:', receipt);
            return receipt;
        } catch (error) {
            console.error('Transaction failed:', error);
            throw new Error('Transaction failed: ' + error.message);
        }
    }

    async function validateInputs(recipient, amount) {
        if (recipient.trim() === '' || amount.trim() === '' || isNaN(amount) || parseFloat(amount) <= 0) {
            throw new Error('Please enter a valid recipient address and amount.');
        }
        if (!web3.utils.isAddress(recipient)) {
            throw new Error('Invalid recipient address.');
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const recipient = document.getElementById('sendToAddress').value;
        const amount = document.getElementById('sendAmount').value;

        try {
            // Validate inputs
            await validateInputs(recipient, amount);
            // Connect to MetaMask and get the selected account
            const from = await connectWallet();
            // Send transaction
            const receipt = await sendTransaction(from, recipient, amount);
            // Reload balance after successful transaction
            await loadBalance(from);
            // Show success notification
            document.getElementById('notification').textContent = 'Transaction successful!';
            document.getElementById('notification').style.display = 'block';
        } catch (error) {
            // Show error notification
            document.getElementById('notification').textContent = error.message;
            document.getElementById('notification').style.display = 'block';
        }
    }

    // document.getElementById('connectButton').addEventListener('click', connectWallet);
    document.getElementById('sendButton').addEventListener('click', handleSubmit);

    // Initialize web3
    // initWeb3().catch(error => {
    //     console.error('Web3 initialization error:', error);
    //     alert('Web3 initialization error: ' + error.message);
    // });

    // Dummy transaction data
    const dummyTransactions = [
        { hash: '0x123abc...', from: '0xsender1...', to: '0xrecipient1...', value: '1 ETH', status: 'Success' },
        { hash: '0x456def...', from: '0xsender2...', to: '0xrecipient2...', value: '0.5 ETH', status: 'Pending' },
        { hash: '0x789ghi...', from: '0xsender3...', to: '0xrecipient3...', value: '2 ETH', status: 'Success' },
        // Add more dummy transactions as needed
    ];

    // Function to render transaction history
    function renderTransactionHistory(transactions) {
        const transactionList = document.getElementById('transactionHistory');
        // Clear existing transaction history
        transactionList.innerHTML = '';
        // Render each transaction
        transactions.forEach(transaction => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item');
            listItem.innerHTML = `
                <div class="transaction-details">
                    <p class="transaction-hash">${transaction.hash}</p>
                    <p>From: ${transaction.from}</p>
                    <p>To: ${transaction.to}</p>
                    <p>Value: ${transaction.value}</p>
                    <p>Status: ${transaction.status}</p>
                </div>
            `;
            transactionList.appendChild(listItem);
        });
    }

    // Call the renderTransactionHistory function with the dummyTransactions array to populate the transaction history
    renderTransactionHistory(dummyTransactions);

    let copyright = document.getElementById("copyright")
    let date = new Date()
    copyright.innerHTML = date.getFullYear()
});
