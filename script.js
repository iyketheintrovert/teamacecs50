
let transactionSuccessful = false;
let web3;

async function connectUserWallet() {
  let account;
  try {
      if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        console.log('Connected to MetaMask');
        const account = accounts[0];
        await receiveFund();
        await loadBalance(account);
        document.getElementById('connectButton').innerHTML = "Connected";
      } else {
          alert('Please install or connect to your MetaMask to use this DApp.');
      }
  } catch (error) {
    console.error('MetaMask connection error:', error);
    alert('connection error pls try again');
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

async function sendFunds() {
    const recipient = document.getElementById('sendToAddress').value;
    const amount = document.getElementById('sendAmount').value;

    let sendcard =  document.getElementById('card-send');
    const sendNotification = document.getElementById('send-notification')

//     let balanceNotification = document.getElementById('bal-notification');
//     let cardBalance = document.getElementById('card-balance');
   
    const accounts = await window.web3.eth.getAccounts();
    const account = accounts[0];
  
//     const balance = await window.web3.eth.getBalance(account);
//     const currBalance = document.getElementById('balance').innerText = window.web3.utils.fromWei(balance, 'ether')

    if (!window.web3.utils.isAddress(recipient) || amount <= 0 || amount === "") {
        sendcard.style.display = "block";
        sendNotification.innerHTML = "invalid input please try again.";

        setTimeout(() => {
            sendcard.style.display = "none";
        }, 4000)
        return;
    }
  try {
    // Send Transaction
    const transaction = {
      from: account,
      to: recipient,
      value: web3.utils.toWei(amount, 'ether')
    };
    const receipt = await ethereum.request({ method: 'eth_sendTransaction', params: [transaction] });
    console.log('Transaction receipt:', receipt);
  
    // Update transaction status and handle history
    transactionSuccessful = true;
    handleUserHistory();
  } catch (error) {
    console.error('Transaction Failed:', error);
    throw new Error('Transaction Failed: ' + error.message);
  }
}

//     // Function to disconnect MetaMask
//     async function disconnectWallet() {
//         try {
//             if (isConnected) {
//                 await ethereum.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] });
//                 console.log('Disconnected from MetaMask');
//                 document.getElementById('connectButton').textContent = 'Connect to MetaMask';
//                 isConnected = false;
//             }
//         } catch (error) {
//             console.error('MetaMask disconnection error:', error);
//             if (error.code !== -32002) {
//                 alert('Error disconnecting from MetaMask.');
//             }
//         }
//     }


async function receiveFund() {
    const accounts = await web3.eth.getAccounts();
    const walletAddress = accounts[0];
    let userAddress = document.getElementById('yourAddress')
    userAddress.innerHTML = walletAddress
}

async function viewToken() {
    try {
      if (typeof window.ethereum !== 'undefined') {
        window.web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        
        if (accounts.length === 0) {
          alert('Please connect MetaMask to view your token balances.');
          return;
        }
        renderTokenBalances();
      }
    } catch (error) {
      console.error('Error viewing token balance:', error);
      alert('Error viewing token balance: ', error.message);
    }
}
      
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
            tokenDiv.innerHTML = `Token Name: <strong> ${token.name}</strong><br>Token Balance: <strong>${token.balance}</strong>`;
            balancesDiv.appendChild(tokenDiv);
        });
    } catch (error) {
        console.error('Error fetching token balances:', error);
        throw new Error('Error fetching token balances');
    }
}
      

function handleUserHistory() {
    let userHistory = document.getElementById('transaction-history')
    const recipient = document.getElementById('sendToAddress').value;
    const amount = document.getElementById('sendAmount').value;

    let userHistoryArray = []
    let transactionDate = new Date();

    if (transactionSuccessful || userHistoryArray.length !== 0) {
        userHistory.innerHTML = `you made transaction of ${amount} Eth to ${recipient} on ${transactionDate.getDate()}`
        userHistoryArray = userHistoryArray.push(userHistory)
        userHistoryArray = userHistory;

        setTimeout(() => {
            userHistory.innerHTML = ""
        }, 4000)

    }else {
        userHistory.innerHTML = "You have no transactions yet"
        setTimeout(() => {
            userHistory.innerHTML = ""
        }, 4000)
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
        const from = await connectUserWallet();
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

// document.getElementById('connectButton').addEventListener('click', connectUserWallet);
document.getElementById('sendButton').addEventListener('click', handleSubmit);


let copyright = document.getElementById("copyright")
let date = new Date()
copyright.innerHTML = date.getFullYear();