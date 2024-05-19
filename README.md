
# TeamAceCS50

Project Stake and CS50x Final Project (A Simple Wallet DApp)

## About

A simple Wallet DApp(HTML, CSS, JS) that connects users to the blockchain using metamask API, display their account balance and an interface that enables the users to send fund to another wallet address.

This project was made as a Hackathon project for CS50. Specifically made by teamacecs50 with the following members:

- Ikenna Enyidede: [GitHub](https://github.com/iyketheintrovert). [LinkedIn](https://www.linkedin.com/in/enyidede-ikenna)
- Mercy Bassey: [GitHub](https://github.com/mercybassey/), [LinkedIn](https://www.linkedin.com/in/mercy-bassey-a18682192/)
- Imbufe Anthony: [GitHub](https://github.com/TonnieRex). [LinkedIn](https://www.linkedin.com/in/anthony-imbufe)
- [name]: [GitHub](GitHub link here). [LinkedIn](LinkedIn link here)

## FEATURES

1. **Dynamic Wallet Connection Status**:
   - The UI will update to display "Wallet Connected" once the you have successfully connected to your walllet.

2. **Comprehensive Validation System**:
   - Validates your inputs across forms, ensuring no fields are left empty.
   - Performs checks to ensure you have sufficient balance for transactions, preventing errors due to insufficient funds.

3. **Dynamic Token Display**:
   - The token section is dynamic and responsive, automatically fetching and displaying all tokens associated with your wallet.
   - Supports multiple tokens, so that all your tokens like ETH, etc., are displayed.

4. **Real-Time Transaction History**:
   - The History section operates with live data, querying and displaying your transaction history.
   - Integrates tightly with fund transfer actions; updates transaction history in real time following successful send or receive operations.
   - Auto-refreshes and displays history for a temporary duration (4 seconds) when accessed.

# HOW TO USE THE DAPP APPLICATION

## Prerequisites

To be able to use the DApp, you should have the following:

- A MetaMask wallet account.
- Ensure that MetaMask is installed as an extension in your browser.
- Some Ether in your MetaMask wallet for transaction purposes.

## Getting Started

Follow these steps to interact with the ACE Wallet DApp:

### Step 1: Connect Your Wallet

1. Open the ACE Wallet DApp in your browser.
2. Click on the "Connect to MetaMask" button at the top of the page.
3. A MetaMask popup will appear asking you to connect your wallet. Confirm the connection by clicking "Connect".
4. Once connected, the button should change to indicate that the wallet is connected.

*screenshot*

### Step 2: View Your Balance

- After connecting your wallet, your current balance in ETH will automatically be displayed in the "Account Balance" section.

*screenshot*

### Step 3: Sending Ether

1. Navigate to the "Send Funds" section.
2. Enter the recipient's Ethereum address in the "Send to Address" field.
3. Enter the amount of ETH you wish to send in the "Amount in ETH" field.
4. Click the "Send" button to initiate the transaction.
5. You will receive a notification in the app once the transaction is successful.

*screenshot*

### Step 4: Receiving Ether

1. Go to the "Receive Ether" section to find your wallet address displayed.
2. Share this address with someone from whom you want to receive Ether.

*screenshot*

### Step 5: Viewing Tokens and Transaction History

- To view your tokens, click on the "Your Tokens" title in the tokens section. All tokens currently held in the wallet will be displayed.
- To check your transaction history, click on the "Transaction History" title in the history section. Your past transactions will be displayed temporarily for 4 seconds.

*screenshot*

### Step 6: Additional Features

- The DApp will handle real-time data fetching for both tokens and transaction history, making sure all information is up-to-date.

## Notes

- Ensure you are connected to the correct network (e.g., Ethereum Mainnet) through your MetaMask settings.
- Transactions require gas fees, which will be deducted from your balance. More on gas fees [here](https://www.fool.com/terms/c/crypto-gas-fees/).

By following these steps, you can effectively manage your digital assets using the ACE Wallet DApp.