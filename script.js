
let transactionSuccessful = false;
let web3;

async function connectUserWallet() {
  let account;
  try {
      if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        if (accounts.length === 0) {
            throw new Error('No accounts found. Please connect to MetaMask.');
        }
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

    // let sendcard =  document.getElementById('card-send');
    const sendNotification = document.getElementById('send-notification')

//     let balanceNotification = document.getElementById('bal-notification');
//     let cardBalance = document.getElementById('card-balance');
   
    const accounts = await window.web3.eth.getAccounts();
    const account = accounts[0];
  
//     const balance = await window.web3.eth.getBalance(account);
//     const currBalance = document.getElementById('balance').innerText = window.web3.utils.fromWei(balance, 'ether')

    if (!web3.utils.isAddress(recipient) || amount <= 0 || amount === "") {
        // sendcard.style.display = "block";
        sendNotification.textContent = "invalid input please try again.";

        setTimeout(() => {
            sendNotification.textContent = "";
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

async function receiveFund() {
    const accounts = await web3.eth.getAccounts();
    const walletAddress = accounts[0];
    document.getElementById('yourAddress').textContent = walletAddress
}

async function viewToken() {
    try {
        if (typeof window.ethereum !== 'undefined') {
            window.web3 = new Web3(window.ethereum);
            const accounts = await window.web3.eth.getAccounts();

            if (accounts.length === 0) {
                alert('Please connect MetaMask to view your token balances.');
                return;
            }

            const walletAddress = accounts[0];

            const ERC20_ABI = [
                {
                    "constant": true,
                    "inputs": [{"name": "_owner", "type": "address"}],
                    "name": "balanceOf",
                    "outputs": [{"name": "balance", "type": "uint256"}],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                }
            ];
            
            const tokenContracts = [
                {
                    name: 'Ethereum',
                    address: '', 
                    isEthereum: true
                },
            ];

            const tokenBalances = [];

            for (const token of tokenContracts) {
                if (token.isEthereum) {
                    const balance = await web3.eth.getBalance(walletAddress);
                    tokenBalances.push({
                        name: token.name,
                        balance: web3.utils.fromWei(balance, 'ether')
                    });
                } else {
                    const contract = new web3.eth.Contract(ERC20_ABI, token.address);
                    const balance = await contract.methods.balanceOf(walletAddress).call();
                    tokenBalances.push({
                        name: token.name,
                        balance: web3.utils.fromWei(balance, 'ether')
                    });
                }
            }

            const balancesDiv = document.getElementById('tokensList');
            balancesDiv.innerHTML = ''; 
            let myToken = tokenBalances.forEach(token => {
                const tokenDiv = document.createElement('div');
                tokenDiv.innerHTML = `<strong>${token.name}:</strong> ${token.balance}`;
                balancesDiv.appendChild(tokenDiv);
               
            });

            setTimeout(()=> {
                balancesDiv.innerHTML = ""
            }, 5000)

        } else alert('MetaMask is not installed. Please install MetaMask to view your token balances.');
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to view token balances. Please try again or check your MetaMask settings.');
    }
}
         
function handleUserHistory() {
    const userHistory = document.getElementById('transaction-history')
    const recipient = document.getElementById('sendToAddress').value;
    const amount = document.getElementById('sendAmount').value;

    let userHistoryArray = []
    const transactionDate = new Date();

    if (transactionSuccessful || userHistoryArray.length !== 0) {
        userHistory.innerHTML = `you made transaction of ${amount} Eth to ${recipient} on ${transactionDate.getDate()}`
        userHistoryArray = userHistoryArray.push(userHistory)
        userHistoryArray = userHistory;

        setTimeout(() => {
            userHistory.innerHTML = ""
        }, 4000)

    } else {
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