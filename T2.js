const provider = ethers.providers.getDefaultProvider();
const ethers = require('ethers');
const tokenAddress = "0x479DAa4379337532dB4883c18aba9C880A96a0Ce";
const amount = 1; 
const aavePoolAddress = "0x7a250d5ab5e590909e4de05562b122dd19c0a8c2";

//Metamask
const ethereumProvider = window.ethereum;
if (!ethereumProvider) {
  alert("Please install Metamask!");
  return;
}

ethereumProvider.request({ method: "eth_requestAccounts" })
  .then(accounts => {
    const signer = new ethers.providers.Web3Provider(ethereumProvider).getSigner(accounts[0]);

    
    const aavePoolAbi = [
        
            {
              "constant": true,
              "inputs": [],
              "name": "decimals",
              "outputs": [
                {
                  "internalType": "uint8",
                  "name": "",
                  "type": "uint8"
                }
              ],
              "payable": false,
              "stateMutability": "view",
              "type": "function"
            },
            {
              "constant": true,
              "inputs": [],
              "name": "reserves",
              "outputs": [
                {
                  "internalType": "mapping(address => ReserveData)",
                  "name": "",
                  "type": "mapping(address => ReserveData)"
                }
              ],
              "payable": false,
              "stateMutability": "view",
              "type": "function"
            },
          
    ];

  
    const aavePoolContract = new ethers.Contract(aavePoolAddress, aavePoolAbi, signer);


   
    aavePoolContract.isDepositApproved(tokenAddress, aavePoolAddress)
      .then(isApproved => {
        if (!isApproved) {
          
          const tokenContract = new ethers.Contract(tokenAddress, tokenContractAbi, signer);

         
          const approveTx = tokenContract.approve(aavePoolAddress, amount);
          approveTx.send()
            .then(() => {
           
              depositTokens(aavePoolContract, tokenAddress, amount);
            })
            .catch(error => {
              console.error("Error while approving token:", error);
            });
        } else {
          
          depositTokens(aavePoolContract, tokenAddress, amount);
        }
      })
      .catch(error => {
        console.error("Error while checking token approval:", error);
      });
  })
  .catch(error => {
    console.error("Error while connecting to Metamask:", error);
  });

//deposit
async function depositTokens(aavePoolContract, tokenAddress, amount) {
  try {
    const depositTx = await aavePoolContract.deposit(tokenAddress, amount);
    console.log("Transaction hash:", depositTx.hash);
    await depositTx.wait(); 
    console.log("Tokens successfully deposited to Aave!");
  } catch (error) {
    console.error("Error while depositing tokens:", error);
  }
}
