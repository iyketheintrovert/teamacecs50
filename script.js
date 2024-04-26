
async function connectUserWallet() {
    try {
        if (typeof window.ethereum !== 'undefined') {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        } else {
            alert('Please install or connect to your MetaMask to use this DApp.');
        }
    } catch (error) {
        alert('connection error pls try again');
    }
    handleBalance();
}

async function handleBalance() {
    const accounts = await window.web3.eth.getAccounts();
    const account = accounts[0];
    const balance = await window.web3.eth.getBalance(account);
    document.getElementById('balance').innerText = window.web3.utils.fromWei(balance, 'ether') + ' ETH';
}



async function sendFunds() {
    const recipient = document.getElementById('sendToAddress').value;
    const amount = document.getElementById('sendAmount').value;

    let sendcard =  document.getElementById('card-send');
    const sendNotification = document.getElementById('send-notification')

    let balanceNotification = document.getElementById('bal-notification');
    let cardBalance = document.getElementById('card-balance');
   
    const accounts = await window.web3.eth.getAccounts();
    const account = accounts[0];
    const balance = await window.web3.eth.getBalance(account);
    const currBalance = document.getElementById('balance').innerText = window.web3.utils.fromWei(balance, 'ether')

    if (!window.web3.utils.isAddress(recipient) || amount <= 0 || amount === "") {
        sendcard.style.display = "block";
        sendNotification.innerHTML = "invalid input please try again.";

        setTimeout(() => {
            sendcard.style.display = "none";
        }, 4000)
        return;
    }


    if(Number(currBalance) === 0) {
        cardBalance.style.display = "block";
        balanceNotification.innerHTML = "You have an insufficient balance";

        setTimeout(() => {
            cardBalance.style.display = "none";
        }, 4000)
        return
    }
    
    const amountWei = window.web3.utils.toWei(amount, 'ether');

    try {
        await window.web3.eth.sendTransaction({
            from: (await window.web3.eth.getAccounts())[0],
            to: recipient,
            value: amountWei
        });
        sendcard.style.display = "block";
        sendcard.style.backgroundColor = "green";
        sendNotification.innerHTML = "transaction successfully sent";

        handleBalance();

    } catch (error) {
        alert('Failed to send transaction: ' + error.message);
    }
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








let copyright = document.getElementById("copyright")

let date = new Date()
copyright.innerHTML = date.getFullYear()
